import { createCookieSessionStorage } from "react-router";

type SessionData = {
  username: string;
};

const DEV_SESSION_SECRET = "dev-session-secret";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }

  console.warn("SESSION_SECRET is not set, using an insecure development secret");
  return DEV_SESSION_SECRET;
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      secrets: [getSessionSecret()],
    },
  });
