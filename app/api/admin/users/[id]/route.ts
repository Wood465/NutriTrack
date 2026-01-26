import { NextResponse } from "next/server";
import postgres from "postgres";

// Povezava na PostgreSQL bazo
// URL baze pride iz okoljske spremenljivke POSTGRES_URL
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * POST /api/admin/users/[id]
 *
 * Namen:
 * - Izbriše uporabnika iz baze po ID-ju
 *
 * Pričakuje:
 * - URL parameter: id (ID uporabnika)
 * - Body: NI POTREBEN
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ID uporabnika dobimo iz URL parametra
  // await je NUJEN, ker je params Promise (Next.js app router)
  const { id } = await context.params; // ← pomembno

  // Debug izpis (lahko kasneje odstraniš)
  console.log("DEBUG DELETE id =", id);

  // Če ID manjka, vrnemo napako
  if (!id) {
    return NextResponse.json(
      { error: "Missing user ID" },
      { status: 400 }
    );
  }

  try {
    // Izbrišemo uporabnika iz baze
    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `;

    // Uspešen odgovor
    return NextResponse.json({ success: true });
  } catch (err) {
    // Izpis napake v server log
    console.error("DELETE user error:", err);

    // Error odgovor clientu
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
