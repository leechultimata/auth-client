import type { AuthTokens } from "./auth-api.server";

// createCookie из react-router кодирует значение в base64, поэтому Set-Cookie собираем сами.
function tokenCookie(name: string, token: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

// Сроки жизни токенов в сервисе авторизации: 15 минут и 30 дней.
export function appendTokenCookies(headers: Headers, tokens: AuthTokens) {
  headers.append("Set-Cookie", tokenCookie("accessToken", tokens.accessToken, 15 * 60));
  headers.append("Set-Cookie", tokenCookie("refreshToken", tokens.refreshToken, 30 * 24 * 60 * 60));
}

export function clearTokenCookies(headers: Headers) {
  headers.append("Set-Cookie", "accessToken=; Path=/; Max-Age=0");
  headers.append("Set-Cookie", "refreshToken=; Path=/; Max-Age=0");
}

export function getCookie(request: Request, name: string) {
  const cookies = request.headers.get("Cookie")?.split("; ") ?? [];
  const value = cookies.find((cookie) => cookie.startsWith(`${name}=`))?.slice(name.length + 1);
  return value ? decodeURIComponent(value) : null;
}
