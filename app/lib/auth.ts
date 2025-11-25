import jwt from "jsonwebtoken";

export function getUserFromCookie(cookieHeader: string | undefined) {
  if (!cookieHeader) return null;

  const cookie = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("session="));

  if (!cookie) return null;

  const token = cookie.split("=")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "dev_secret_key");
  } catch {
    return null;
  }
}
