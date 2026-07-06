const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function getBackendOrigin(env) {
  const rawOrigin = env.API_ORIGIN || env.BACKEND_ORIGIN || env.VITE_API_BASE_URL;

  if (!rawOrigin) {
    throw new Error("Missing API_ORIGIN Cloudflare Pages environment variable");
  }

  const url = new URL(rawOrigin);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("API_ORIGIN must be an http(s) URL");
  }

  return url.origin;
}

function buildProxyHeaders(request) {
  const headers = new Headers(request.headers);
  const incomingUrl = new URL(request.url);

  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header);
  }

  headers.delete("host");
  headers.set("x-forwarded-host", incomingUrl.host);
  headers.set("x-forwarded-proto", incomingUrl.protocol.replace(":", ""));

  return headers;
}

export async function proxyToBackend({ request, env }) {
  let backendOrigin;

  try {
    backendOrigin = getBackendOrigin(env);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }

  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(`${incomingUrl.pathname}${incomingUrl.search}`, backendOrigin);
  const init = {
    method: request.method,
    headers: buildProxyHeaders(request),
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  const upstreamResponse = await fetch(upstreamUrl, init);
  const responseHeaders = new Headers(upstreamResponse.headers);

  for (const header of HOP_BY_HOP_HEADERS) {
    responseHeaders.delete(header);
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}
