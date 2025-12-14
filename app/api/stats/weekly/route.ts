import { NextResponse } from 'next/server';
import postgres from 'postgres';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return NextResponse.json({}, { status: 401 });

  const user: any = jwt.verify(token, process.env.JWT_SECRET!);

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

  const today = rows.at(-1) || { calories: 0, protein: 0, meals: 0 };

  const totalCalories = rows.reduce((s, r) => s + Number(r.calories), 0);

  return NextResponse.json({
    today: {
      calories: Number(today.calories),
      protein: Number(today.protein),
      meals: Number(today.meals),
    },
    week: {
      totalCalories,
      avgCalories: Math.round(totalCalories / rows.length || 0),
      avgProtein: Math.round(
        rows.reduce((s, r) => s + Number(r.protein), 0) / rows.length || 0
      ),
      days: rows.length,
    },
    chart: rows.map(r => ({
      date: r.day,
      calories: Number(r.calories),
    })),
  });
}
