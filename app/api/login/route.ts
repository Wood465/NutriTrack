import { NextResponse } from "next/server";
import postgres from "postgres";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Povezava na PostgreSQL bazo
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Skrivni ključ za podpis JWT tokena
// V produkciji mora biti nastavljen v .env
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

/**
 * POST /api/login
 *
 * Namen:
 * - prijava uporabnika z emailom in geslom
 * - preveri geslo
 * - ustvari JWT (vključno z vlogo)
 * - shrani JWT v httpOnly cookie ("session")
 *
 * Pričakuje (body):
 * {
 *   email: string,
 *   password: string
 * }
 */
export async function POST(request: Request) {
  try {
    // Preberemo email in geslo iz body-ja
    const { email, password } = await request.json();

    // 1. Poiščemo uporabnika v bazi (tudi njegovo vlogo)
    const users = await sql`
      SELECT id, ime, priimek, email, password_hash, role 
      FROM users 
      WHERE email = ${email}
    `;

    // Če uporabnik ne obstaja
    if (users.length === 0) {
      return NextResponse.json(
        { error: "Uporabnik ne obstaja" },
        { status: 400 }
      );
    }

    const user = users[0];

    // 2. Preverimo, ali se geslo ujema s hashom v bazi
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json(
        { error: "Napačno geslo" },
        { status: 400 }
      );
    }

    // 3. Ustvarimo JWT token (vključuje tudi vlogo uporabnika)
    const token = jwt.sign(
      {
        id: user.id,
        ime: user.ime,
        priimek: user.priimek,
        email: user.email,
        role: user.role, // pomembno za admin / user dostop
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Ustvarimo odgovor in nastavimo session cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set("session", token, {
      httpOnly: true, // JS na frontendu ne more brati cookieja
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dni
    });

    // Prijava uspešna
    return response;
  } catch (err) {
    // Napaka na strežniku
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Napaka na strežniku" },
      { status: 500 }
    );
  }
}
