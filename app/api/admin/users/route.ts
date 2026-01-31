import { NextResponse } from "next/server";
import { getSql } from "@/app/lib/db";

export async function GET() {
  try {
    const sql = getSql();
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
