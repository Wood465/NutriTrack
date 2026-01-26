import { NextResponse } from "next/server";
import postgres from "postgres";

// Povezava na PostgreSQL bazo
// POSTGRES_URL pride iz .env datoteke
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * GET /api/admin/users
 *
 * Namen:
 * - Vrne seznam vseh uporabnikov za admin panel
 *
 * Vrača:
 * - Polja: id, ime, priimek, email, role
 * - Podatki so urejeni po ID-ju (ASC)
 */
export async function GET() {
  try {
    // Poizvedba v bazo: pridobi vse uporabnike
    const users = await sql`
      SELECT id, ime, priimek, email, role
      FROM users
      ORDER BY id ASC
    `;

    // Uspešen odgovor z JSON seznamom uporabnikov
    return NextResponse.json(users);
  } catch (err) {
    // Izpis napake v server log
    console.error("GET /api/admin/users error:", err);

    // Error odgovor clientu
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}
