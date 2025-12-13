import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: Request, context: any) {
  const { id } = await context.params;
  const body = await request.json();
  const role = body.role;

  try {
    await sql`
      UPDATE users SET role = ${role} WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE ROLE ERROR:", err);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
