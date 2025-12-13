import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const users = await sql`
      SELECT id, ime, priimek, email, role
      FROM users
      ORDER BY id ASC
    `;

    return NextResponse.json(users);
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
