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
    const userId =
      typeof body.user_id === "string" ? body.user_id.trim() : "";
    const kalorije = Number(body.kalorije);
    const beljakovine = Number(body.beljakovine);
    const ogljikovi_hidrati = Number(body.ogljikovi_hidrati);
    const mascobe = Number(body.mascobe);

    const invalidFields: string[] = [];
    if (!naziv) invalidFields.push("naziv");
    if (!userId) invalidFields.push("user_id");
    if (!Number.isFinite(kalorije) || kalorije < 0) invalidFields.push("kalorije");
    if (!Number.isFinite(beljakovine) || beljakovine < 0)
      invalidFields.push("beljakovine");
    if (!Number.isFinite(ogljikovi_hidrati) || ogljikovi_hidrati < 0)
      invalidFields.push("ogljikovi_hidrati");
    if (!Number.isFinite(mascobe) || mascobe < 0) invalidFields.push("mascobe");

    if (invalidFields.length > 0) {
      return Response.json(
        { error: "Invalid input", fields: invalidFields },
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


