import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      return new NextResponse(null, { status: 401 });
    }

    const user: any = jwt.verify(token, process.env.JWT_SECRET!);

    const [row] = await sql`
      SELECT avatar FROM users WHERE id = ${user.id}
    `;

    if (!row?.avatar) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(row.avatar, {
      headers: {
        "Content-Type": "image/jpeg", // ali image/png
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Avatar fetch error:", err);
    return new NextResponse(null, { status: 500 });
  }
}
