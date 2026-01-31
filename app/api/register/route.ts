import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import bcrypt from 'bcrypt';

/**
 * API: POST /api/register
 *
 * Namen endpointa:
 * - Ustvari novega uporabnika v bazi.
 * - Preveri osnovne pogoje (manjkajoci podatki, obstoječ email).
 * - Geslo varno shrani kot hash (bcrypt).
 * - Novemu uporabniku dodeli privzeto vlogo "user".
 */

export async function POST(request: Request) {
  try {
    const sql = getSql();
    /**
     * 1) Preberemo podatke iz body-ja
     * - ime, priimek, email, password pridejo iz registracijskega obrazca
     */
    const { ime, priimek, email, password } = await request.json();

    // 2) Osnovna validacija: vsi podatki morajo obstajati
    if (!ime || !priimek || !email || !password) {
      return NextResponse.json(
        { error: 'Manjkajo podatki' },
        { status: 400 }
      );
    }

    /**
     * 3) Preverimo, ali uporabnik z istim emailom že obstaja
     * - email mora biti unikatna vrednost
     */
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email že obstaja' },
        { status: 400 }
      );
    }

    /**
     * 4) Hashiranje gesla
     * - bcrypt.hash z "salt rounds = 10"
     * - v bazo se NIKOLI ne shrani geslo v čisti obliki
     */
    const hashedPassword = await bcrypt.hash(password, 10);

    /**
     * 5) Vstavljanje novega uporabnika v bazo
     * - role = 'user' je privzeta vloga
     */
    await sql`
      INSERT INTO users (ime, priimek, email, password_hash, role)
      VALUES (${ime}, ${priimek}, ${email}, ${hashedPassword}, 'user')
    `;

    // 6) Uspešen odgovor
    return NextResponse.json({ success: true });
  } catch (err) {
    // Napaka na serverju (DB, bcrypt, parsing, ...)
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Napaka pri registraciji' },
      { status: 500 }
    );
  }
}
