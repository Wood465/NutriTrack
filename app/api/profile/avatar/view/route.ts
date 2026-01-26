import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import postgres from "postgres";

// Povezava na PostgreSQL bazo
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * GET /api/avatar
 *
 * Namen:
 * - vrne avatar prijavljenega uporabnika
 *
 * Pravila:
 * - uporabnik mora biti prijavljen (session cookie)
 * - avatar se prebere iz baze
 */
export async function GET() {
  try {
    // Preberemo cookie-je
    const cookieStore = await cookies();

    // Iz cookie-ja dobimo JWT token
    const token = cookieStore.get("session")?.value;

    // Če ni tokena, uporabnik ni prijavljen
    if (!token) {
      return new NextResponse(null, { status: 401 });
    }

    // Preverimo JWT in iz njega dobimo podatke o uporabniku
    const user: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Iz baze preberemo avatar za tega uporabnika
    const [row] = await sql`
      SELECT avatar
      FROM users
      WHERE id = ${user.id}
    `;

    // Če avatar ne obstaja
    if (!row?.avatar) {
      return new NextResponse(null, { status: 404 });
    }

    // Vrnemo sliko (avatar) kot response
    return new NextResponse(row.avatar, {
      headers: {
        "Content-Type": "image/jpeg", // ali image/png, odvisno kaj shraniš
        "Cache-Control": "no-store",   // ne shranjuj v cache
      },
    });
  } catch (err) {
    // Napaka na strežniku
    console.error("Avatar fetch error:", err);
    return new NextResponse(null, { status: 500 });
  }
}
