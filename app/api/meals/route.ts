import { getSql } from '@/app/lib/db';

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

/**
 * GET /api/meals?user_id=...
 *
 * - Vrne seznam obrokov za dolocenega uporabnika
 * - Rezultat je sortiran po casu vnosa (DESC)
 */
export async function GET(request: Request) {
  try {
    const sql = getSql();
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
    const sql = getSql();
    // Preberemo podatke iz request body-ja
    const body = await request.json();

    console.log('POST /meals body:', body);

    // Priprava in osnovna validacija podatkov
    const naziv = typeof body.naziv === 'string' ? body.naziv.trim() : '';
    const userId = typeof body.user_id === 'string' ? body.user_id.trim() : '';
    const kalorije = Number(body.kalorije);
    const beljakovine = Number(body.beljakovine);
    const ogljikovi_hidrati = Number(body.ogljikovi_hidrati);
    const mascobe = Number(body.mascobe);

    const invalidFields: string[] = [];
    if (!naziv) invalidFields.push('naziv');
    if (!userId) invalidFields.push('user_id');
    if (!Number.isFinite(kalorije) || kalorije < 0) invalidFields.push('kalorije');
    if (!Number.isFinite(beljakovine) || beljakovine < 0)
      invalidFields.push('beljakovine');
    if (!Number.isFinite(ogljikovi_hidrati) || ogljikovi_hidrati < 0)
      invalidFields.push('ogljikovi_hidrati');
    if (!Number.isFinite(mascobe) || mascobe < 0) invalidFields.push('mascobe');

    if (invalidFields.length > 0) {
      return Response.json(
        { error: 'Invalid input', fields: invalidFields },
        { status: 400 }
      );
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
