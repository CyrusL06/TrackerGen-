// This would help to get Auth User


export function createAuthHelpers({ workos, cookieName, cookiePassword }) {
    //Reads sealed session cookie
  async function getAuthenticatedUser(req) {
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
