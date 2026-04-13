import dotenv from "dotenv";
import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import { WorkOS } from "@workos-inc/node";
import { fileURLToPath } from "url";

// Recreates __dirname in ES module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env.local");

dotenv.config({ path: envPath });

const app = express();
const port = process.env.PORT || 3200;

const COOKIE_NAME = "wos-session";
// This is the frontend URL in dev or your deployed frontend later
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const IS_PROD = process.env.NODE_ENV === "production";

// Path to built frontend files if you later serve the React app from Express
const DIST_DIR = path.resolve(__dirname, "../client/dist");
const indexHtml = path.join(DIST_DIR, "index.html");

const placeholderValues = new Set([
  "sk_test_your_key",
  "client_your_id",
  "replace_with_a_long_random_secret_32_plus_chars",
]);

function requireEnv(name) {
  const value = process.env[name];

  if (!value || placeholderValues.has(value)) {
    throw new Error(
      `Missing real ${name}. Update ${envPath} with the value from your WorkOS dashboard.`,
    );
  }

  return value;
}

const WORKOS_API_KEY = requireEnv("WORKOS_API_KEY");
const WORKOS_CLIENT_ID = requireEnv("WORKOS_CLIENT_ID");
const WORKOS_COOKIE_PASSWORD = requireEnv("WORKOS_COOKIE_PASSWORD");
const WORKOS_REDIRECT_URI = requireEnv("WORKOS_REDIRECT_URI");
const CSRF_SECRET = process.env.CSRF_SECRET || WORKOS_COOKIE_PASSWORD;

if (WORKOS_COOKIE_PASSWORD.length < 32) {
  throw new Error(
    `WORKOS_COOKIE_PASSWORD must be at least 32 characters. Update ${envPath} with a longer random value.`,
  );
}

const workos = new WorkOS(WORKOS_API_KEY, {
  clientId: WORKOS_CLIENT_ID,
});

// CORS setup
// 1. Allow the frontend domain to call this API
// 2. credentials: true is required for cookies to be sent
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);

// Read cookies and request bodies from the browser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CSRF setup
// Cross-Site Request Forgery means another site tricks the browser into
// sending requests with your logged-in cookies.
const { generateCsrfToken } = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  getSessionIdentifier: (req) => req.cookies[COOKIE_NAME] ?? "anonymous",
});

const sessionCookieOptions = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? "none" : "lax",
  path: "/",
};

function setSessionCookie(res, sealedSession) {
  res.cookie(COOKIE_NAME, sealedSession, sessionCookieOptions);
}

// Removes the session cookie from the browser
function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, sessionCookieOptions);
}

// Encode where the user should go after login.
// We store it in WorkOS state so it survives the redirect round trip.
function encodeState(returnTo = "/dashboard") {
  return Buffer.from(JSON.stringify({ returnTo })).toString("base64url");
}

// Read the returnTo value back from WorkOS state.
function decodeState(state) {
  if (typeof state !== "string" || !state) {
    return { returnTo: "/dashboard" };
  }

  try {
    return JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
  } catch {
    return { returnTo: "/dashboard" };
  }
}

// Only allow internal app paths like /dashboard.
// This prevents open redirect issues.
function safeReturnTo(returnTo) {
  if (typeof returnTo !== "string") {
    return "/dashboard";
  }

  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/dashboard";
  }

  return returnTo;
}

// Shared helper so login, signup, and social login all build the same
// correct WorkOS authorization URL.
function buildAuthorizationUrl({
  provider = "authkit",
  screenHint,
  returnTo = "/dashboard",
}) {
  return workos.userManagement.getAuthorizationUrl({
    provider,
    clientId: WORKOS_CLIENT_ID,
    redirectUri: WORKOS_REDIRECT_URI,
    screenHint,
    state: encodeState(returnTo),
  });
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// LOGIN
// Gets the hosted login page from WorkOS
app.get("/auth/login", (req, res) => {
    //Builds a WORKos auth URL and redirect user to it. 
    // https://workos.com/docs/reference/authkit/authentication/get-authorization-url
  const authorizationUrl = buildAuthorizationUrl({
    screenHint: "sign-in",
    returnTo: req.query.returnTo || "/dashboard",
  });

  res.redirect(authorizationUrl);
});

// SIGNUP
// Sends the user to the hosted sign-up screen
app.get("/auth/signup", (req, res) => {
     //Builds a WORKos auth URL and redirect user to it. 
  const authorizationUrl = buildAuthorizationUrl({
    screenHint: "sign-up",
    returnTo: "/onboarding/goal",
  });

  res.redirect(authorizationUrl);
});

// SOCIAL LOGIN
// Converts a route like /auth/login/google into the exact provider name
// WorkOS expects.
app.get("/auth/login/:provider", (req, res) => {
  const providerMap = {
    google: "GoogleOAuth",
    github: "GitHubOAuth",
  };

  const provider = providerMap[req.params.provider];

  if (!provider) {
    return res.status(400).json({ message: "Unsupported provider" });
  }

  const authorizationUrl = buildAuthorizationUrl({
    provider,
    returnTo: req.query.returnTo || "/dashboard",
  });

  return res.redirect(authorizationUrl);
});

// CALLBACK ROUTE
// WorkOS sends the browser here after login/signup.
    // The query string includes a temporary "code".
app.get("/auth/callback", async (req, res) => {

//When callback it attaches a temporary code in URL 
  const code = typeof req.query.code === "string" ? req.query.code : ""; //prevents crashing

  const state = decodeState(req.query.state);

  // No code means login cannot continue
  if (!code) {
    return res.status(400).json({ message: "Missing authorization code" });
  }

  try {
    // Exchange the temporary code for a real session. HEART OF The CallBack
    // sealSession: true means WorkOS gives us a sealed session string.
    const { sealedSession } = await workos.userManagement.authenticateWithCode({
      clientId: WORKOS_CLIENT_ID,
      code,
      session: {
        sealSession: true,
        cookiePassword: WORKOS_COOKIE_PASSWORD,
      },
    });

    // Save the session into a secure cookie
    //Ensures every request include that cookie.
    setSessionCookie(res, sealedSession);

    // Send the user back to the frontend
    return res.redirect(`${FRONTEND_ORIGIN}${safeReturnTo(state.returnTo)}`);
  } catch (error) {
    console.error("WorkOS callback error:", error);
    return res.redirect(`${FRONTEND_ORIGIN}/login`);
  }
});

// "WHO AM I?" ROUTE
// The frontend calls this to find out if the current browser is authenticated.
app.get("/api/auth/me", async (req, res) => {
  const sealedSession = req.cookies[COOKIE_NAME];

  // No cookie means no logged-in session
  if (!sealedSession) {
    return res.json({ authenticated: false, user: null });
  }

  try {
    // Turn the sealed cookie value back into a WorkOS session object
    const session = workos.userManagement.loadSealedSession({
      sessionData: sealedSession,
      cookiePassword: WORKOS_COOKIE_PASSWORD,
    });

    // Ask WorkOS if the session is valid
    const authResult = await session.authenticate();

    // If invalid, clear the cookie so the browser stops sending a bad session
    if (!authResult.authenticated) {
      clearSessionCookie(res);
    }

    return res.json({
      authenticated: authResult.authenticated,
      user: authResult.authenticated ? authResult.user : null,
    });
  } catch {
    // If anything goes wrong, clear the cookie and treat the user as logged out
    clearSessionCookie(res);
    return res.json({ authenticated: false, user: null });
  }
});

// CSRF TOKEN ROUTE
// The frontend can call this before protected POST actions later.
app.get("/api/auth/csrf-token", (req, res) => {
  const csrfToken = generateCsrfToken(req, res);
  res.json({ csrfToken });
});

// LOGOUT ROUTE
// POST is used because logout changes state.
app.post("/api/auth/logout", async (req, res) => {
  const sealedSession = req.cookies[COOKIE_NAME];

  // No session: just make sure the cookie is gone
  if (!sealedSession) {
    clearSessionCookie(res);
    return res.json({ ok: true });
  }

  try {
    // Load the current sealed session
    const session = workos.userManagement.loadSealedSession({
      sessionData: sealedSession,
      cookiePassword: WORKOS_COOKIE_PASSWORD,
    });

    // Ask WorkOS for the correct logout URL
    const logoutUrl = await session.getLogoutUrl();

    // Remove the local session cookie
    clearSessionCookie(res);

    return res.json({ ok: true, logoutUrl });
  } catch {
    clearSessionCookie(res);
    return res.json({ ok: true });
  }
});

// Keep this API 404 route near the bottom.
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Optional static frontend serving if client/dist exists
if (fs.existsSync(indexHtml)) {
  app.use(express.static(DIST_DIR));

  // Send the React app for non-API routes
  app.get("/{*path}", (req, res) => {
    res.sendFile(indexHtml);
  });
} else {
  console.log("client/dist not found, run the frontend with vite in dev");
}

// Start the server
app.listen(port, () => {
  console.log(`API server running at ${port}`);
});
