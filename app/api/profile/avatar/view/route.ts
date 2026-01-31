import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import postgres from 'postgres';

/**
 * API: GET /api/profile/avatar/view
 *
 * Namen endpointa:
 * - Vrne profilno sliko (avatar) trenutno prijavljenega uporabnika.
 * - Slika se bere iz baze in se vrne kot binarni response (image/*).
 *
 * Varnost:
 * - Dostop ima samo prijavljen uporabnik (JWT v cookie-ju "session").
 *
 * Kako deluje:
 * 1) Preberemo session cookie in preverimo JWT.
 * 2) Iz JWT dobimo user.id.
 * 3) Iz baze preberemo avatar (binary/BYTEA).
 * 4) Ce avatar obstaja -> ga vrnemo kot image response.
 * 5) Ce avatar ne obstaja -> 404.
 */

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // 1) Preverimo, ali je uporabnik prijavljen
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
      return new NextResponse(null, { status: 401 });
    }

    // 2) Preverimo JWT in dobimo ID uporabnika
    const user: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3) Preberemo avatar iz baze
    const [row] = await sql`
      SELECT avatar
      FROM users
      WHERE id = ${user.id}
    `;

    // 4) Ce uporabnik nima shranjenega avatarja
    if (!row?.avatar) {
      return new NextResponse(null, { status: 404 });
    }

    /**
     * 5) Vrnemo binarni response
     * - Content-Type je image/jpeg (ali image/png, odvisno od vira)
     * - Cache-Control: no-store, da se slika ne cachira
     */
    return new NextResponse(row.avatar, {
      headers: {
        'Content-Type': 'image/jpeg', // ali image/png
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    // Napaka pri JWT, bazi ali response-u
    console.error('Avatar fetch error:', err);
    return new NextResponse(null, { status: 500 });
  }
}
