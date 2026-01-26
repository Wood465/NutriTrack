import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import postgres from "postgres";

// Povezava na bazo
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * Prebere uporabnika iz "session" cookie-ja (JWT).
 * - Če cookie manjka → 401 (niste prijavljeni)
 * - Če je token neveljaven → 401 (neveljavna seja)
 *
 * Vrne:
 * - { user } če je vse ok
 * - { error: NextResponse } če je napaka (da lahko takoj returnaš)
 */
async function getUserFromSession() {
  // Dobimo cookie store (Next.js server)
  const cookieStore = await cookies();

  // Preberemo vrednost cookie "session"
  const token = cookieStore.get("session")?.value;

  // Če ni tokena, user ni prijavljen
  if (!token) {
    return {
      error: NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 }),
    };
  }

  // Preverimo JWT token in iz njega dobimo user podatke
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return { user };
  } catch {
    return {
      error: NextResponse.json({ error: "Neveljavna seja." }, { status: 401 }),
    };
  }
}

/**
 * GET /api/meals/[id]
 * Namen:
 * - vrne en obrok po ID-ju
 * Pravilo:
 * - obrok lahko vidi samo lastnik (meal.user_id mora biti enak session user id)
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ID obroka dobimo iz URL parametra
  const { id } = await params;

  // Preverimo prijavo
  const session = await getUserFromSession();
  if ("error" in session) return session.error;

  // Dobimo obrok iz baze
  const [meal] = await sql`
    SELECT id, user_id, naziv, kalorije, beljakovine, ogljikovi_hidrati, mascobe, cas
    FROM meals
    WHERE id = ${id}
  `;

  // Če obrok ne obstaja
  if (!meal) {
    return NextResponse.json({ error: "Obrok ne obstaja." }, { status: 404 });
  }

  // Varnost: obrok lahko gleda samo tisti user, ki ga je ustvaril
  if (String(meal.user_id) !== String((session.user as any).id)) {
    return NextResponse.json(
      { error: "Nimate dovoljenja za ogled." },
      { status: 403 }
    );
  }

  // Vrni obrok
  return NextResponse.json(meal);
}

/**
 * PUT /api/meals/[id]
 * Namen:
 * - posodobi obrok po ID-ju
 * Pravilo:
 * - obrok lahko ureja samo lastnik
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ID obroka dobimo iz URL parametra
  const { id } = await params;

  // Preverimo prijavo
  const session = await getUserFromSession();
  if ("error" in session) return session.error;

  // Preberemo nove podatke iz body-ja
  const body = await req.json();

  // Najprej preverimo, kdo je lastnik obroka
  const [meal] = await sql`
    SELECT user_id
    FROM meals
    WHERE id = ${id}
  `;

  // Če obrok ne obstaja
  if (!meal) {
    return NextResponse.json({ error: "Obrok ne obstaja." }, { status: 404 });
  }

  // Varnost: ureja lahko samo lastnik
  if (String(meal.user_id) !== String((session.user as any).id)) {
    return NextResponse.json(
      { error: "Nimate dovoljenja za urejanje." },
      { status: 403 }
    );
  }

  // Posodobimo obrok in vrnemo posodobljene podatke
  const [updated] = await sql`
    UPDATE meals
    SET
      naziv = ${body.naziv},
      kalorije = ${body.kalorije},
      beljakovine = ${body.beljakovine},
      ogljikovi_hidrati = ${body.ogljikovi_hidrati},
      mascobe = ${body.mascobe}
    WHERE id = ${id}
    RETURNING id, naziv, kalorije, beljakovine, ogljikovi_hidrati, mascobe, cas
  `;

  return NextResponse.json(updated);
}

/**
 * DELETE /api/meals/[id]
 * Namen:
 * - izbriše obrok po ID-ju
 * Pravilo:
 * - obrok lahko izbriše samo lastnik
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ID obroka dobimo iz URL parametra
  const { id } = await params;

  // Preverimo prijavo
  const session = await getUserFromSession();
  if ("error" in session) return session.error;

  // Preverimo, kdo je lastnik obroka
  const [meal] = await sql`
    SELECT user_id
    FROM meals
    WHERE id = ${id}
  `;

  // Če obrok ne obstaja
  if (!meal) {
    return NextResponse.json({ error: "Obrok ne obstaja." }, { status: 404 });
  }

  // Varnost: briše lahko samo lastnik
  if (String(meal.user_id) !== String((session.user as any).id)) {
    return NextResponse.json(
      { error: "Nimate dovoljenja za brisanje." },
      { status: 403 }
    );
  }

  // Izbrišemo obrok
  await sql`
    DELETE FROM meals
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}
