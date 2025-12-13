import { NextResponse } from "next/server";
import postgres from "postgres";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Preverimo uporabnika + role
    const users = await sql`
      SELECT id, ime, priimek, email, password_hash, role 
      FROM users 
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "Uporabnik ne obstaja" }, { status: 400 });
    }

    const user = users[0];

    // 2. Preverimo geslo
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ error: "Napačno geslo" }, { status: 400 });
    }

    // 3. JWT token z ROLO
    const token = jwt.sign(
      {
        id: user.id,
        ime: user.ime,
        priimek: user.priimek,
        email: user.email,
        role: user.role,       // <-- DODANO
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Odgovor + session cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dni
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Napaka na strežniku" }, { status: 500 });
  }
}
