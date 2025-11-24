import { NextResponse } from "next/server";
import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: Request) {
  try {
    const { ime, priimek, email, password } = await request.json();

    if (!ime || !priimek || !email || !password) {
      return NextResponse.json({ error: "Manjkajo podatki" }, { status: 400 });
    }

    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email že obstaja" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (ime, priimek, email, password_hash)
      VALUES (${ime}, ${priimek}, ${email}, ${hashed})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Napaka pri registraciji" }, { status: 500 });
  }
}
