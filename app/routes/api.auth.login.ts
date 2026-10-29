import { commitSession, getSession } from "../sessions.server";
import type { Route } from "./+types/api.auth.login";

function badRequest(error: string) {
  return Response.json({ ok: false, error }, { status: 400 });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export function loader() {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Тело запроса должно быть JSON");
  }

  const { username, password } = (body ?? {}) as Record<string, unknown>;
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    return badRequest("Введите логин и пароль");
  }

  // TODO: заменить заглушку реальной проверкой учётных данных.
  const session = await getSession(request.headers.get("Cookie"));
  session.set("username", username.trim());

  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
}
