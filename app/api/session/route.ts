import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret_key"
    );
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
