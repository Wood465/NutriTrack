import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, naziv, kalorije, beljakovine, ogljikovi_hidrati, mascobe, cas 
      FROM meals 
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

    const result = await sql`
        INSERT INTO meals (
        user_id, naziv, kalorije,
        beljakovine, ogljikovi_hidrati, mascobe, cas
        )
        VALUES (
        ${body.user_id},
        ${body.naziv},
        ${body.kalorije},
        ${body.beljakovine},
        ${body.ogljikovi_hidrati},
        ${body.mascobe},
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


