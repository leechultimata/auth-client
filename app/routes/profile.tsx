import { data, redirect } from "react-router";
import { isAuthorized, refreshTokens } from "../auth-api.server";
import { appendTokenCookies, getCookie } from "../auth-cookies.server";
import type { Route } from "./+types/profile";

export async function loader({ request }: Route.LoaderArgs) {
  const accessToken = getCookie(request, "accessToken");
  if (accessToken && (await isAuthorized(accessToken))) {
    return null;
  }

  const refreshToken = getCookie(request, "refreshToken");
  const tokens = refreshToken ? await refreshTokens(refreshToken) : null;
  if (!tokens) {
    throw redirect("/login");
  }

  const headers = new Headers();
  appendTokenCookies(headers, tokens);
  return data(null, { headers });
}

export default function Profile() {
  return (
    <>
      <div>Личный кабинет</div>
      <form method="post" action="/api/auth/logout">
        <button type="submit">Выйти</button>
      </form>
    </>
  );
}
