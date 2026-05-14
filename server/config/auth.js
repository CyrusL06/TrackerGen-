// This would help to get Auth User

export function createAuthHelpers({
  authMode,
  workos,
  cookieName,
  cookiePassword,
  offlineUser,
}) {
  // Reads the current user from either WorkOS or the local offline mode.
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
