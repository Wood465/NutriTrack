import { NextResponse } from "next/server";
import postgres from "postgres";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function POST(request: Request) {
  try {
    const { oldPassword, newPassword } = await request.json();

    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("session="));

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = sessionCookie.split("=")[1];
    let sessionData: any;

    try {
      sessionData = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = sessionData.id;

    const users = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      return NextResponse.json({ error: "Staro geslo je napačno" }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE users
      SET password_hash = ${newHash}
      WHERE id = ${userId}
    `;

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Napaka na strežniku" }, { status: 500 });
  }
}
