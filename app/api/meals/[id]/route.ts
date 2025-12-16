import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. preberi ID (UUID ali string)
  const { id } = await params;

  // 2. preveri session
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Niste prijavljeni." },
      { status: 401 }
    );
  }

  // 3. preberi user iz JWT
  let user: any;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json(
      { error: "Neveljavna seja." },
      { status: 401 }
    );
  }

  // 4. preveri, ali obrok obstaja in komu pripada
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
      { error: "Nimate dovoljenja za brisanje." },
      { status: 403 }
    );
  }

  // 5. izbriši obrok
  await sql`
    DELETE FROM meals
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}
