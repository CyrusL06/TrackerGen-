// Simple in-memory sliding-window rate limiter for API endpoints.
// For multi-instance production deployments, replace this with Redis-backed state.

const requestCounts = new Map();

/** Builds a process-local limiter over shared buckets without asserting authentication. */
export function createRateLimiter({ windowMs = 60 * 1000, maxRequests = 60 } = {}) {
  // Periodically discards expired, process-owned request timestamps.
  setInterval(() => {
    const now = Date.now();
    for (const [key, entries] of requestCounts) {
      const recent = entries.filter(
        // Retains only timestamps that still count toward this limiter's active window.
        (timestamp) => timestamp > now - windowMs,
      );
      if (recent.length === 0) {
        requestCounts.delete(key);
      } else {
        requestCounts.set(key, recent);
      }
    }
  }, 5 * 60 * 1000).unref();

  // Uses req.user only when upstream middleware populated it; current routes generally fall back to network identity.
  return function rateLimitMiddleware(req, res, next) {
    const identifier = req.user?.id || req.ip || "unknown";
    const now = Date.now();
    const recent = (requestCounts.get(identifier) ?? []).filter(
      // Excludes expired attempts so a client is limited only within the configured window.
      (timestamp) => timestamp > now - windowMs,
    );

    if (recent.length >= maxRequests) {
      return res.status(429).json({
        message: "Too many requests. Please wait before trying again.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    recent.push(now);
    requestCounts.set(identifier, recent);
    return next();
  };
}
