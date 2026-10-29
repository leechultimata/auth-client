const AUTH_API_URL = process.env.AUTH_API_URL ?? "http://localhost:3032";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResult =
  | { type: "success"; tokens: AuthTokens }
  | { type: "invalid"; error: string }
  | { type: "unavailable" };

export async function loginWithAuthApi(login: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    const body = await response.json().catch(() => ({}));

    if ([400, 401, 403].includes(response.status)) {
      return { type: "invalid", error: body.error ?? "Неверный логин или пароль" };
    }
    if (response.ok && typeof body.accessToken === "string" && typeof body.refreshToken === "string") {
      return { type: "success", tokens: { accessToken: body.accessToken, refreshToken: body.refreshToken } };
    }
  } catch {
    // сервис недоступен
  }
  return { type: "unavailable" };
}
