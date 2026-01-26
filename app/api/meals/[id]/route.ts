import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return { error: NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 }) };
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return { user };
  } catch {
    return { error: NextResponse.json({ error: "Neveljavna seja." }, { status: 401 }) };
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getUserFromSession();
  if ("error" in session) return session.error;

  const [meal] = await sql`
    SELECT id, user_id, naziv, kalorije, beljakovine, ogljikovi_hidrati, mascobe, cas
    FROM meals
    WHERE id = ${id}
  `;

  if (!meal) {
    return NextResponse.json({ error: "Obrok ne obstaja." }, { status: 404 });
  }

  if (String(meal.user_id) !== String((session.user as any).id)) {
    return NextResponse.json({ error: "Nimate dovoljenja za ogled." }, { status: 403 });
  }

  return NextResponse.json(meal);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getUserFromSession();
  if ("error" in session) return session.error;

  const body = await req.json();

  const [meal] = await sql`
    SELECT user_id
    FROM meals
    WHERE id = ${id}
  `;

  if (!meal) {
    return NextResponse.json({ error: "Obrok ne obstaja." }, { status: 404 });
  }

  if (String(meal.user_id) !== String((session.user as any).id)) {
    return NextResponse.json({ error: "Nimate dovoljenja za urejanje." }, { status: 403 });
  }

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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getUserFromSession();
  if ("error" in session) return session.error;

  const [meal] = await sql`
    SELECT user_id
    FROM meals
    WHERE id = ${id}
  `;

  if (!meal) {
    return NextResponse.json({ error: "Obrok ne obstaja." }, { status: 404 });
  }

  if (String(meal.user_id) !== String((session.user as any).id)) {
    return NextResponse.json({ error: "Nimate dovoljenja za brisanje." }, { status: 403 });
  }

  await sql`
    DELETE FROM meals
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}
