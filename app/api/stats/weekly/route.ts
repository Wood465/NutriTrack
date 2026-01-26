import { NextResponse } from "next/server";
import postgres from "postgres";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Povezava na PostgreSQL bazo
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * GET /api/stats
 *
 * Namen:
 * - vrne statistiko obrokov za prijavljenega uporabnika
 * - zajema zadnjih 7 dni
 *
 * Vrača:
 * - današnje kalorije, beljakovine in št. obrokov
 * - tedensko povprečje in seštevek
 * - podatke za graf (kalorije po dnevih)
 */
export async function GET() {
  // Preberemo cookie-je
  const cookieStore = await cookies();

  // Iz cookie-ja dobimo JWT token
  const token = cookieStore.get("session")?.value;

  // Če uporabnik ni prijavljen
  if (!token) {
    return NextResponse.json({}, { status: 401 });
  }

  // Preverimo JWT in dobimo podatke o uporabniku
  const user: any = jwt.verify(token, process.env.JWT_SECRET!);

  // Poizvedba: statistika obrokov za zadnjih 7 dni
  const rows = await sql`
    SELECT
      DATE(cas) as day,
      SUM(kalorije) as calories,
      SUM(beljakovine) as protein,
      COUNT(*) as meals
    FROM meals
    WHERE user_id = ${user.id}
      AND cas >= NOW() - INTERVAL '7 days'
    GROUP BY day
    ORDER BY day
  `;

  // Današnji podatki (zadnji dan v seznamu)
  // Če danes ni obrokov, nastavimo 0
  const today = rows.at(-1) || { calories: 0, protein: 0, meals: 0 };

  // Skupne kalorije in beljakovine za teden
  const totalCalories = rows.reduce(
    (sum, r) => sum + Number(r.calories),
    0
  );
  const totalProtein = rows.reduce(
    (sum, r) => sum + Number(r.protein),
    0
  );

  // Končni odgovor
  return NextResponse.json({
    today: {
      calories: Number(today.calories),
      protein: Number(today.protein),
      meals: Number(today.meals),
    },
    week: {
      totalCalories,
      avgCalories: Math.round(totalCalories / 7),
      avgProtein: Math.round(totalProtein / 7),
      days: rows.length,
    },
    chart: rows.map((r) => ({
      date: r.day,
      calories: Number(r.calories),
    })),
  });
}
