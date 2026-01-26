import { NextResponse } from "next/server";
import postgres from "postgres";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Povezava na PostgreSQL bazo
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Skrivni ključ za preverjanje JWT tokena
// V produkciji mora biti nastavljen v .env
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

/**
 * POST /api/change-password
 *
 * Namen:
 * - uporabnik spremeni svoje geslo
 *
 * Pričakuje (body):
 * {
 *   oldPassword: string,
 *   newPassword: string
 * }
 *
 * Avtentikacija:
 * - uporabnik mora imeti veljaven "session" cookie (JWT)
 */
export async function POST(request: Request) {
  try {
    // Preberemo staro in novo geslo iz body-ja
    const { oldPassword, newPassword } = await request.json();

    // Preberemo cookie header iz requesta
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Iz cookie headerja poiščemo "session" cookie
    const sessionCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("session="));

    // Če session cookie ne obstaja, uporabnik ni prijavljen
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Iz session cookie dobimo JWT token
    const token = sessionCookie.split("=")[1];
    let sessionData: any;

    // Preverimo, ali je token veljaven
    try {
      sessionData = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // ID uporabnika dobimo iz JWT tokena
    const userId = sessionData.id;

    // Poiščemo uporabnika v bazi
    const users = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    // Če uporabnik ne obstaja
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Preverimo, ali se staro geslo ujema s hashom v bazi
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      return NextResponse.json(
        { error: "Staro geslo je napačno" },
        { status: 400 }
      );
    }

    // Ustvarimo hash novega gesla
    const newHash = await bcrypt.hash(newPassword, 10);

    // Posodobimo geslo v bazi
    await sql`
      UPDATE users
      SET password_hash = ${newHash}
      WHERE id = ${userId}
    `;

    // Uspešen odgovor
    return NextResponse.json({ success: true });
  } catch (err) {
    // Napaka na strežniku
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Napaka na strežniku" },
      { status: 500 }
    );
  }
}
