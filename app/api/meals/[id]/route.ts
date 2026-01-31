import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import postgres from 'postgres';

/**
 * API: DELETE /api/meals/[id]
 *
 * Namen endpointa:
 * - Izbrise tocno en obrok (meal) po ID-ju.
 *
 * Varnost:
 * - Uporabnik mora biti prijavljen (cookie "session" z JWT).
 * - Uporabnik lahko brise samo svoje obroke:
 *   - najprej preverimo, ali obrok obstaja
 *   - potem preverimo, ali meal.user_id == user.id
 *
 * Kako deluje:
 * 1) Preberemo ID obroka iz route parametra.
 * 2) Preverimo session token (JWT).
 * 3) Iz JWT dobimo user.id.
 * 4) Iz baze preberemo user_id obroka, da preverimo lastnistvo.
 * 5) Ce je obrok od uporabnika -> izvedemo DELETE.
 */

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1) ID obroka dobimo iz URL parametra (/api/meals/:id)
  const { id } = await params;

  // 2) Preverimo prijavo (JWT v cookie-ju "session")
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  // 3) Preverimo JWT in preberemo user podatke
  let user: any;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Neveljavna seja.' }, { status: 401 });
  }

  /**
   * 4) Preverimo, ali obrok obstaja in komu pripada
   * - preberemo samo user_id, ker je to dovolj za permission check
   */
  const [meal] = await sql`
    SELECT user_id
    FROM meals
    WHERE id = ${id}
  `;

  if (!meal) {
    return NextResponse.json({ error: 'Obrok ne obstaja.' }, { status: 404 });
  }

  // Ce obrok ni od prijavljenega uporabnika, brisanje ni dovoljeno
  if (meal.user_id !== user.id) {
    return NextResponse.json(
      { error: 'Nimate dovoljenja za brisanje.' },
      { status: 403 }
    );
  }

  // 5) Izbris obroka iz baze
  await sql`
    DELETE FROM meals
    WHERE id = ${id}
  `;

  // 6) Uspeh
  return NextResponse.json({ ok: true });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Niste prijavljeni." },
      { status: 401 }
    );
  }

  let user: any;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json(
      { error: "Neveljavna seja." },
      { status: 401 }
    );
  }

  const body = await req.json();

  const naziv = typeof body.naziv === "string" ? body.naziv.trim() : "";
  const kalorije = Number(body.kalorije);
  const beljakovine = Number(body.beljakovine);
  const ogljikovi_hidrati = Number(body.ogljikovi_hidrati);
  const mascobe = Number(body.mascobe);

  const invalidFields: string[] = [];
  if (!naziv) invalidFields.push("naziv");
  if (!Number.isFinite(kalorije) || kalorije < 0) invalidFields.push("kalorije");
  if (!Number.isFinite(beljakovine) || beljakovine < 0)
    invalidFields.push("beljakovine");
  if (!Number.isFinite(ogljikovi_hidrati) || ogljikovi_hidrati < 0)
    invalidFields.push("ogljikovi_hidrati");
  if (!Number.isFinite(mascobe) || mascobe < 0) invalidFields.push("mascobe");

  if (invalidFields.length > 0) {
    return NextResponse.json(
      { error: "Invalid input", fields: invalidFields },
      { status: 400 }
    );
  }

  const [meal] = await sql`
    SELECT user_id
    FROM meals
    WHERE id = ${id}
  `;

  if (!meal) {
    return NextResponse.json(
      { error: "Obrok ne obstaja." },
      { status: 404 }
    );
  }

  if (meal.user_id !== user.id) {
    return NextResponse.json(
      { error: "Nimate dovoljenja za urejanje." },
      { status: 403 }
    );
  }

  const result = await sql`
    UPDATE meals
    SET
      naziv = ${naziv},
      kalorije = ${kalorije},
      beljakovine = ${beljakovine},
      ogljikovi_hidrati = ${ogljikovi_hidrati},
      mascobe = ${mascobe}
    WHERE id = ${id}
    RETURNING
      id,
      naziv,
      kalorije,
      beljakovine,
      ogljikovi_hidrati,
      mascobe,
      cas
  `;

  return NextResponse.json(result[0]);
}
