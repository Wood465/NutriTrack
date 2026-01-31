import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * API: POST /api/login
 *
 * Namen endpointa:
 * - Prijavi uporabnika z email + geslo.
 * - Preveri, ali uporabnik obstaja in ali je geslo pravilno (bcrypt).
 * - Ustvari JWT token (vkljucno z vlogo/role) in ga shrani v httpOnly cookie "session".
 *
 * Kako deluje:
 * 1) Iz request body preberemo email in password.
 * 2) V bazi poiscemo uporabnika po emailu.
 * 3) Preverimo geslo z bcrypt.compare (primerjava z hashom).
 * 4) Ce je pravilno -> ustvarimo JWT z osnovnimi podatki + role.
 * 5) JWT vrnemo kot httpOnly cookie (session), da ga JS ne more prebrati.
 */

// JWT secret je kljuc za podpis tokena (v produkciji mora biti v ENV)
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export async function POST(request: Request) {
  try {
    const sql = getSql();
    // 1) Preberemo prijavne podatke iz body-ja
    const { email, password } = await request.json();

    /**
     * 2) Najdemo uporabnika v bazi
     * - izberemo tudi role, ker jo kasneje vstavimo v JWT
     * - password_hash je potreben za preverjanje gesla
     */
    const users = await sql`
      SELECT id, ime, priimek, email, password_hash, role
      FROM users
      WHERE email = ${email}
    `;

    // Ce uporabnika ni, vrnemo napako
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Uporabnik ne obstaja' },
        { status: 400 }
      );
    }

    const user = users[0];

    /**
     * 3) Preverimo geslo
     * - bcrypt.compare primerja plain password z hashom iz baze
     */
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ error: 'Napačno geslo' }, { status: 400 });
    }

    /**
     * 4) Ustvarimo JWT token
     * - v token shranimo osnovne podatke, ki jih frontend rabi (ime, email, role, id)
     * - expiresIn: 7d pomeni, da bo token veljal 7 dni
     */
    const token = jwt.sign(
      {
        id: user.id,
        ime: user.ime,
        priimek: user.priimek,
        email: user.email,
        role: user.role, // vloga uporabnika (npr. admin/user)
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    /**
     * 5) Vrnemo response in nastavimo cookie "session"
     * - httpOnly: JS v brskalniku ne more prebrati tokena (bolj varno)
     * - secure: cookie se pošlje samo preko HTTPS (v production)
     * - maxAge: cookie velja 7 dni (ujemanje z expiresIn)
     */
    const response = NextResponse.json({ success: true });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    // Ce pride do napake (DB, parsing, jwt...), vrnemo 500
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Napaka na strežniku' }, { status: 500 });
  }
}
