import { NextResponse } from "next/server";
import postgres from "postgres";

// Povezava na PostgreSQL bazo
// POSTGRES_URL pride iz .env datoteke
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * POST /api/admin/users/[id]/role
 *
 * Namen:
 * - Posodobi vlogo uporabnika (admin ali user)
 *
 * Pričakuje:
 * - URL parameter: id (ID uporabnika)
 * - Body (JSON): { role: "admin" | "user" }
 */
export async function POST(request: Request, context: any) {
  // ID uporabnika dobimo iz URL parametra
  const { id } = context.params;

  // Preberemo body iz requesta
  const body = await request.json();

  // Nova vloga uporabnika
  const role = body.role;

  try {
    // Posodobimo vlogo v bazi
    await sql`
      UPDATE users
      SET role = ${role}
      WHERE id = ${id}
    `;

    // Če je uspešno, vrnemo OK odgovor
    return NextResponse.json({ success: true });
  } catch (err) {
    // Če pride do napake, jo izpišemo v konzolo
    console.error("UPDATE ROLE ERROR:", err);

    // In vrnemo error response
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
