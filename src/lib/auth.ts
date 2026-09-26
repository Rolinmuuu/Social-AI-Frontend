// The signed-in user's id, read from the token in localStorage. The backend's JWT carries it
// in the user_id claim; the demo build's tokens are "demo.<user_id>". The signature is not
// checked here: the value only decides how the UI labels things, never what it may do.
export function userIdFromToken(token: string | null): string | null {
  if (!token) return null;
  if (token.startsWith("demo.")) return token.slice("demo.".length) || null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=")));
    return typeof claims.user_id === "string" ? claims.user_id : null;
  } catch {
    return null;
  }
}
