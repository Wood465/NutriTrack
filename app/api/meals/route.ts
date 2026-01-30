import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: Request) {
  try {
    const rows = await sql`
      SELECT id, naziv, kalorije, beljakovine, ogljikovi_hidrati, mascobe, cas 
      FROM meals where user_id = ${new URL(request.url).searchParams.get("user_id")}
      ORDER BY cas DESC
    `;
    return Response.json(rows);
  } catch (e) {
    console.error("GET /meals error:", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("POST /meals body:", body);

    const naziv = typeof body.naziv === "string" ? body.naziv.trim() : "";
    const userId = Number(body.user_id);
    const kalorije = Number(body.kalorije);
    const beljakovine = Number(body.beljakovine);
    const ogljikovi_hidrati = Number(body.ogljikovi_hidrati);
    const mascobe = Number(body.mascobe);

    if (
      !naziv ||
      !Number.isFinite(userId) ||
      !Number.isFinite(kalorije) ||
      !Number.isFinite(beljakovine) ||
      !Number.isFinite(ogljikovi_hidrati) ||
      !Number.isFinite(mascobe) ||
      kalorije < 0 ||
      beljakovine < 0 ||
      ogljikovi_hidrati < 0 ||
      mascobe < 0
    ) {
      return Response.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const result = await sql`
        INSERT INTO meals (
        user_id, naziv, kalorije,
        beljakovine, ogljikovi_hidrati, mascobe, cas
        )
        VALUES (
        ${userId},
        ${naziv},
        ${kalorije},
        ${beljakovine},
        ${ogljikovi_hidrati},
        ${mascobe},
        NOW()
        )
        RETURNING id, naziv, kalorije, beljakovine, ogljikovi_hidrati, mascobe, cas

    `;

    return Response.json(result[0]);
  } catch (e: any) {
    console.error("POST /meals SQL ERROR:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}


