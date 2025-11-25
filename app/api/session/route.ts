import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie");
  if (!cookie) return NextResponse.json({ user: null });

  const sessionCookie = cookie
    .split(";")
    .find((c) => c.trim().startsWith("session="));

  if (!sessionCookie) return NextResponse.json({ user: null });

  const token = sessionCookie.split("=")[1];

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_key");
    return NextResponse.json({ user: data });
  } catch {
    return NextResponse.json({ user: null });
  }
}
