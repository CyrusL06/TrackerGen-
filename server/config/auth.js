// This would help to get Auth User

/** Creates request authentication helpers bound to the configured WorkOS or explicit offline trust mode. */
export function createAuthHelpers({
  authMode,
  workos,
  cookieName,
  cookiePassword,
  offlineUser,
}) {
  /** Resolves identity from the trusted session source without exposing invalid-session details. */
  async function getAuthenticatedUser(req) {
    if (authMode === "offline") {
      return offlineUser;
    }

    const sealedSession = req.cookies[cookieName];
    if (!sealedSession) return null;

    try {
      const session = workos.userManagement.loadSealedSession({
        sessionData: sealedSession,
        cookiePassword,
      });

      const authResult = await session.authenticate();
      if (!authResult.authenticated) return null;

      return authResult.user;
    } catch {
      return null;
    }
  }

  return { getAuthenticatedUser };
}
