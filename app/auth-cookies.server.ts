import type { AuthTokens } from "./auth-api.server";

// createCookie из react-router кодирует значение в base64, поэтому Set-Cookie собираем сами.
function tokenCookie(name: string, token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

export function appendTokenCookies(headers: Headers, tokens: AuthTokens) {
  headers.append("Set-Cookie", tokenCookie("accessToken", tokens.accessToken));
  headers.append("Set-Cookie", tokenCookie("refreshToken", tokens.refreshToken));
}
