import { loginWithAuthApi } from "../auth-api.server";
import { appendTokenCookies } from "../auth-cookies.server";
import type { Route } from "./+types/api.auth.login";

function errorResponse(status: number, error: string) {
  return Response.json({ ok: false, error }, { status });
}

export function loader() {
  return new Response(null, { status: 405 });
}

export async function action({ request }: Route.ActionArgs) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return errorResponse(400, "Тело запроса должно быть JSON");
  }

  const { login, password } = body;
  if (typeof login !== "string" || !login.trim() || typeof password !== "string" || !password.trim()) {
    return errorResponse(400, "Введите логин и пароль");
  }

  const result = await loginWithAuthApi(login.trim(), password);

  if (result.type === "invalid") {
    return errorResponse(401, result.error);
  }
  if (result.type === "unavailable") {
    return errorResponse(502, "Сервис авторизации недоступен");
  }

  const headers = new Headers();
  appendTokenCookies(headers, result.tokens);
  return Response.json({ ok: true }, { headers });
}
