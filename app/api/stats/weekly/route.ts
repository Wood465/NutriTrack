import { NextResponse } from 'next/server';
import postgres from 'postgres';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

/**
 * API: GET /api/stats/weekly
 *
 * Namen endpointa:
 * - Vrne statistiko za prijavljenega uporabnika za zadnjih 7 dni:
 *   1) today: podatki za zadnji dan v bazi (kalorije, beljakovine, stevilo obrokov)
 *   2) week: skupne in povprecne vrednosti v obdobju
 *   3) chart: seznam { date, calories } za risanje grafa
 *
 * Avtentikacija:
 * - uporabnik je prijavljen, ce ima cookie "session"
 * - cookie vsebuje JWT, iz katerega dobimo user.id
 */

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  // 1) Preberemo JWT iz cookie-ja "session"
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  // Ce ni tokena, uporabnik ni prijavljen -> 401 Unauthorized
  if (!token) return NextResponse.json({}, { status: 401 });

  // 2) Preverimo JWT in dobimo podatke o uporabniku (najpomembnejse: user.id)
  const user: any = jwt.verify(token, process.env.JWT_SECRET!);

  /**
   * 3) Query: agregiramo obroke po dnevih za zadnjih 7 dni
   * - DATE(cas) -> dan (YYYY-MM-DD)
   * - SUM(kalorije) -> skupne kalorije za tisti dan
   * - SUM(beljakovine) -> skupne beljakovine za tisti dan
   * - COUNT(*) -> koliko obrokov je bilo tisti dan
   */
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

  /**
   * 4) "today" vzamemo kot zadnji dan v rezultatu (ker je ORDER BY day)
   * - ce ni nobenega vnosa, uporabimo 0 vrednosti
   */
  const today = rows.at(-1) || { calories: 0, protein: 0, meals: 0 };

  // 5) Skupne kalorije v obdobju
  const totalCalories = rows.reduce((sum, r) => sum + Number(r.calories), 0);

  /**
   * 6) Tedenske povprecne vrednosti
   * - rows.length = stevilo dni, ko je uporabnik dejansko kaj zabelezil
   * - (ne delimo z 7, ampak z aktivnimi dnevi, da je povprecje bolj realno)
   */
  const daysCount = rows.length;

  const totalProtein = rows.reduce((sum, r) => sum + Number(r.protein), 0);

  const avgCalories = Math.round(totalCalories / daysCount || 0);
  const avgProtein = Math.round(totalProtein / daysCount || 0);

  /**
   * 7) Odgovor:
   * - today: dnevne vrednosti
   * - week: totals + averages + days
   * - chart: podatki za graf
   */
  return NextResponse.json({
    today: {
      calories: Number(today.calories),
      protein: Number(today.protein),
      meals: Number(today.meals),
    },
    week: {
      totalCalories,
      avgCalories,
      avgProtein,
      days: daysCount,
    },
    chart: rows.map((r) => ({
      date: r.day,
      calories: Number(r.calories),
    })),
  });
}
