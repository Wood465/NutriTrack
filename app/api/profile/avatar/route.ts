import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getSql } from '@/app/lib/db';

/**
 * API: POST /api/profile/avatar
 *
 * Namen endpointa:
 * - Omogoca prijavljenemu uporabniku nalaganje (upload) profilne slike (avatar).
 * - Slika se shrani v bazo v stolpec "avatar" kot binarni podatek (Buffer).
 *
 * Varnost / pravila:
 * - Uporabnik mora biti prijavljen (cookie "session" z JWT).
 * - Sprejmemo samo datoteko iz FormData pod imenom "avatar".
 * - Velikost omejimo na max 2MB, da ne obremenjujemo baze in serverja.
 *
 * Kako deluje:
 * 1) Preverimo session cookie in validiramo JWT -> dobimo user.id.
 * 2) Iz requesta preberemo formData in dobimo File ("avatar").
 * 3) Preverimo, ali obstaja in ali ni prevelik.
 * 4) File pretvorimo v Buffer in ga shranimo v bazo.
 * 5) Vrnemo success ali error.
 */

export async function POST(request: Request) {
  try {
    const sql = getSql();
    // 1) Preberemo session cookie in preverimo, ali je uporabnik prijavljen
    // (v Next 16 je cookies() async)
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2) JWT validacija: iz tokena dobimo uporabnika (najpomembneje: user.id)
    const user: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3) Preberemo multipart/form-data in dobimo datoteko "avatar"
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 4) Omejitev velikosti datoteke (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // 5) Pretvorimo datoteko v Buffer, ki ga lahko shranimo v DB
    const buffer = Buffer.from(await file.arrayBuffer());

    // 6) Posodobimo avatar za trenutnega uporabnika
    await sql`
      UPDATE users
      SET avatar = ${buffer}
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    // Ce karkoli odpove (JWT, formData, DB...), vrnemo 500
    console.error('Avatar upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
