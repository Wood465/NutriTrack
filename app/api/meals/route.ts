import postgres from 'postgres';

/**
 * API: /api/meals
 *
 * Namen endpointa:
 * - GET: vrne vse obroke uporabnika (po user_id), urejene po datumu (najnovejsi prvi)
 * - POST: doda nov obrok v bazo in ga vrne kot response
 *
 * Opomba:
 * - Ta endpoint predpostavlja, da je uporabnik ze avtenticiran na frontend-u
 *   (user_id pride iz seje na klientu).
 */

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * GET /api/meals?user_id=...
 *
 * - Vrne seznam obrokov za dolocenega uporabnika
 * - Rezultat je sortiran po casu vnosa (DESC)
 */
export async function GET(request: Request) {
  try {
    // user_id dobimo iz query parametra
    const userId = new URL(request.url).searchParams.get('user_id');

    const rows = await sql`
      SELECT
        id,
        naziv,
        kalorije,
        beljakovine,
        ogljikovi_hidrati,
        mascobe,
        cas
      FROM meals
      WHERE user_id = ${userId}
      ORDER BY cas DESC
    `;

    return Response.json(rows);
  } catch (e) {
    console.error('GET /meals error:', e);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

/**
 * POST /api/meals
 *
 * - Sprejme JSON body z podatki o obroku
 * - Validira vhodne podatke
 * - Shrani obrok v bazo
 * - Vrne shranjeni obrok
 */
export async function POST(request: Request) {
  try {
    // Preberemo podatke iz request body-ja
    const body = await request.json();

    console.log('POST /meals body:', body);

    // Priprava in osnovna validacija podatkov
    const naziv = typeof body.naziv === 'string' ? body.naziv.trim() : '';
    const userId = Number(body.user_id);
    const kalorije = Number(body.kalorije);
    const beljakovine = Number(body.beljakovine);
    const ogljikovi_hidrati = Number(body.ogljikovi_hidrati);
    const mascobe = Number(body.mascobe);

    /**
     * Validacija:
     * - vsa stevila morajo biti veljavna
     * - vrednosti ne smejo biti negativne
     * - naziv ne sme biti prazen
     */
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
      return Response.json({ error: 'Invalid input' }, { status: 400 });
    }

    /**
     * Vstavljanje novega obroka v bazo
     * - cas = NOW() pomeni trenutni datum in cas
     * - RETURNING vrne shranjen zapis nazaj v response
     */
    const result = await sql`
      INSERT INTO meals (
        user_id,
        naziv,
        kalorije,
        beljakovine,
        ogljikovi_hidrati,
        mascobe,
        cas
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
      RETURNING
        id,
        naziv,
        kalorije,
        beljakovine,
        ogljikovi_hidrati,
        mascobe,
        cas
    `;

    // Vrnemo pravkar dodan obrok
    return Response.json(result[0]);
  } catch (e: any) {
    console.error('POST /meals SQL ERROR:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
