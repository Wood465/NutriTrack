import { NextResponse } from 'next/server';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * API: POST /api/change-password
 *
 * Namen endpointa:
 * - Prijavljenemu uporabniku omogoca spremembo gesla.
 *
 * Kako deluje:
 * 1) Preberemo { oldPassword, newPassword } iz body-ja.
 * 2) Iz cookie-ja "session" preberemo JWT in ga preverimo (jwt.verify).
 * 3) Po userId poiscemo uporabnika v bazi.
 * 4) Preverimo staro geslo z bcrypt.compare.
 * 5) Ce je staro geslo pravilno -> novo geslo hashiramo in shranimo v bazo.
 * 6) Vrne { success: true } ali napako.
 *
 * Opomba:
 * - Gesla nikoli ne shranjujemo v cisti obliki, vedno samo bcrypt hash.
 */

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export async function POST(request: Request) {
  try {
    // 1) Preberemo podatke iz request body-ja
    const { oldPassword, newPassword } = await request.json();

    /**
     * 2) Preberemo cookie header in iz njega poiscemo "session" cookie
     * - Ker je cookie httpOnly, ga frontend ne more prebrati, server pa ga lahko.
     */
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionCookie = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('session='));

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Token je vrednost za "session="
    const token = sessionCookie.split('=')[1];

    // 3) Preverimo JWT in dobimo podatke o uporabniku (id)
    let sessionData: any;
    try {
      sessionData = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = sessionData.id;

    // 4) Iz baze dobimo uporabnika
    const users = await sql`
      SELECT id, password_hash
      FROM users
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    // 5) Preverimo, ali se staro geslo ujema z hashom v bazi
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      return NextResponse.json(
        { error: 'Staro geslo je napačno' },
        { status: 400 }
      );
    }

    // 6) Novo geslo hashiramo in ga shranimo v bazo
    const newHash = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE users
      SET password_hash = ${newHash}
      WHERE id = ${userId}
    `;

    // 7) Uspeh
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json({ error: 'Napaka na strežniku' }, { status: 500 });
  }
}
