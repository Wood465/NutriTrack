import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * GET /api/session
 *
 * Namen:
 * - preveri, ali je uporabnik prijavljen
 * - iz session cookie-ja prebere JWT
 * - vrne podatke o uporabniku ali null
 *
 * Vrača:
 * {
 *   user: object | null
 * }
 */
export async function GET() {
  // Preberemo cookie-je
  const cookieStore = await cookies();

  // Iz cookie-ja dobimo JWT token
  const token = cookieStore.get("session")?.value;

  // Če ni tokena, uporabnik ni prijavljen
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    // Preverimo JWT in iz njega dobimo podatke o uporabniku
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret_key"
    );

    // Uporabnik je prijavljen
    return NextResponse.json({ user });
  } catch {
    // Token ni veljaven (npr. potekel)
    return NextResponse.json({ user: null });
  }
}
