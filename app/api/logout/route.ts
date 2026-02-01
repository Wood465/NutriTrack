import { NextResponse } from 'next/server';

/**
 * API: POST /api/logout
 *
 * Namen endpointa:
 * - Odjavi trenutno prijavljenega uporabnika.
 *
 * Kako deluje:
 * - Odstrani (izprazni) cookie "session", ki vsebuje JWT.
 * - Cookie nastavimo z datumom v preteklosti, zato takoj poteče.
 * - Frontend po klicu tega endpointa uporabnika preusmeri na /login.
 *
 * Varnost:
 * - Cookie je httpOnly, zato do njega nima dostopa JavaScript v brskalniku.
 */

export async function POST() {
  // Pripravimo JSON response
  const res = NextResponse.json({ success: true });

  // Odstranimo session cookie (takoj potece)
  res.cookies.set('session', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  return res;
}
