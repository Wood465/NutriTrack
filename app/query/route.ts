import { getSql } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = getSql();
    const users = await sql`SELECT * FROM users ORDER BY ime`;
    const meals = await sql`SELECT * FROM meals ORDER BY cas DESC`;

    return NextResponse.json({
      users,
      meals,
    });
  } catch (error) {
    console.error("DB read error:", error);
    return NextResponse.json({ error: "Database read failed" }, { status: 500 });
  }
}
