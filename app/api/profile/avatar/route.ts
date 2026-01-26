import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import postgres from "postgres";

// Povezava na PostgreSQL bazo
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * POST /api/avatar
 *
 * Namen:
 * - naloži (upload) avatar za prijavljenega uporabnika
 *
 * Pravila:
 * - uporabnik mora biti prijavljen (session cookie)
 * - avatar mora biti manjši od 2 MB
 * - avatar se shrani v bazo (users.avatar)
 */
export async function POST(request: Request) {
  try {
    // Preberemo cookie-je (Next.js 16: cookies() je async)
    const cookieStore = await cookies();

    // Iz cookie-ja dobimo JWT token
    const token = cookieStore.get("session")?.value;

    // Če ni tokena, uporabnik ni prijavljen
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Preverimo JWT in dobimo podatke o uporabniku
    const user: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Preberemo formData (file upload)
    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    // Če datoteka ne obstaja
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Omejitev velikosti datoteke (max 2 MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Pretvorimo datoteko v Buffer (za shranjevanje v bazo)
    const buffer = Buffer.from(await file.arrayBuffer());

    // Shranimo avatar v bazo
    await sql`
      UPDATE users
      SET avatar = ${buffer}
      WHERE id = ${user.id}
    `;

    // Uspešen upload
    return NextResponse.json({ success: true });
  } catch (err) {
    // Napaka na strežniku
    console.error("Avatar upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
