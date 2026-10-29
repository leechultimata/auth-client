import { redirect } from "react-router";
import { logoutWithAuthApi } from "../auth-api.server";
import { clearTokenCookies, getCookie } from "../auth-cookies.server";
import type { Route } from "./+types/api.auth.logout";

export async function action({ request }: Route.ActionArgs) {
  const refreshToken = getCookie(request, "refreshToken");
  if (refreshToken) {
    await logoutWithAuthApi(refreshToken);
  }

  const headers = new Headers();
  clearTokenCookies(headers);
  return redirect("/login", { headers });
}
