import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

/**
 * API: GET /api/session
 *
 * Namen endpointa:
 * - Vrne trenutno prijavljenega uporabnika na podlagi cookie-ja "session".
 * - Uporablja se na skoraj vseh straneh (Navbar, Profile, Admin, …),
 *   da frontend ve:
 *   - ali je uporabnik prijavljen
 *   - kdo je uporabnik (ime, email, role, id, ...)
 *
 * Kako deluje:
 * 1) Preberemo cookie "session".
 * 2) Ce cookie ne obstaja -> uporabnik NI prijavljen (user: null).
 * 3) Ce cookie obstaja -> preverimo JWT.
 * 4) Ce je JWT veljaven -> vrnemo user podatke iz tokena.
 * 5) Ce JWT NI veljaven -> obravnavamo kot neprijavljenega uporabnika.
 */

export async function GET() {
  // Preberemo cookie-je iz zahteve
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  // Ce ni session cookie-ja, uporabnik ni prijavljen
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    // Preverimo JWT in dobimo podatke o uporabniku
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev_secret_key'
    );

    // Vrnemo uporabnika frontend-u
    return NextResponse.json({ user });
  } catch {
    // Ce je token neveljaven ali potekel, vrnemo user: null
    return NextResponse.json({ user: null });
  }
}
