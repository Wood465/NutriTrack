import { NextResponse } from "next/server";
import postgres from "postgres";
import bcrypt from "bcrypt";

// Povezava na PostgreSQL bazo
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * POST /api/register
 *
 * Namen:
 * - registracija novega uporabnika
 *
 * Pričakuje (body):
 * {
 *   ime: string,
 *   priimek: string,
 *   email: string,
 *   password: string
 * }
 *
 * Opombe:
 * - email mora biti unikaten
 * - geslo se shrani kot hash
 * - nova vloga uporabnika je vedno "user"
 */
export async function POST(request: Request) {
  try {
    // Preberemo podatke iz body-ja
    const { ime, priimek, email, password } = await request.json();

    // Preverimo, ali so vsi podatki prisotni
    if (!ime || !priimek || !email || !password) {
      return NextResponse.json(
        { error: "Manjkajo podatki" },
        { status: 400 }
      );
    }

    // Preverimo, ali uporabnik z istim emailom že obstaja
    const existingUser = await sql`
      SELECT *
      FROM users
      WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email že obstaja" },
        { status: 400 }
      );
    }

    // Zakodiramo geslo (bcrypt hash)
    const hashed = await bcrypt.hash(password, 10);

    // Ustvarimo novega uporabnika
    // role je privzeto "user"
    await sql`
      INSERT INTO users (ime, priimek, email, password_hash, role)
      VALUES (${ime}, ${priimek}, ${email}, ${hashed}, 'user')
    `;

    // Registracija uspešna
    return NextResponse.json({ success: true });
  } catch (err) {
    // Napaka na strežniku
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Napaka pri registraciji" },
      { status: 500 }
    );
  }
}
