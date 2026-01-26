import postgres from "postgres";

// Povezava na PostgreSQL bazo (POSTGRES_URL je v .env)
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * GET /api/meals?user_id=123
 *
 * Namen:
 * - vrne vse obroke za določenega uporabnika (user_id)
 *
 * Pričakuje:
 * - query parameter: user_id (v URL-ju)
 *
 * Vrne:
 * - seznam obrokov, urejen po času (najnovejši najprej)
 */
export async function GET(request: Request) {
  try {
    // Iz URL-ja preberemo user_id (npr. /meals?user_id=5)
    const userId = new URL(request.url).searchParams.get("user_id");

    // Poizvedba v bazo: obroki samo za tega uporabnika
    const rows = await sql`
      SELECT id, naziv, kalorije, beljakovine, ogljikovi_hidrati, mascobe, cas
      FROM meals
      WHERE user_id = ${userId}
      ORDER BY cas DESC
    `;

    // Vrnemo seznam obrokov kot JSON
    return Response.json(rows);
  } catch (e) {
    // Če pride do napake, jo izpišemo in vrnemo 500
    console.error("GET /meals error:", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

/**
 * POST /api/meals
 *
 * Namen:
 * - doda nov obrok v bazo
 *
 * Pričakuje (body):
 * {
 *   user_id: string | number,
 *   naziv: string,
 *   kalorije: number,
 *   beljakovine: number,
 *   ogljikovi_hidrati: number,
 *   mascobe: number
 * }
 *
 * Opomba:
 * - cas se nastavi avtomatsko na NOW()
 */
export async function POST(request: Request) {
  try {
    // Preberemo podatke obroka iz body-ja
    const body = await request.json();

    // Debug izpis (lahko kasneje odstraniš)
    console.log("POST /meals body:", body);

    // Vstavimo nov obrok v bazo in vrnemo nazaj ustvarjen obrok
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

    // result je array, zato vrnemo prvi (novo ustvarjen) obrok
    return Response.json(result[0]);
  } catch (e: any) {
    // Če SQL faila, izpišemo napako in vrnemo 500
    console.error("POST /meals SQL ERROR:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
