import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("profile", "routes/profile.tsx"),
  route("api/auth/login", "routes/api.auth.login.ts"),
  route("api/auth/logout", "routes/api.auth.logout.ts"),
] satisfies RouteConfig;
