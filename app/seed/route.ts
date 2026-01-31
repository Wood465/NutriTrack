import bcrypt from "bcrypt";
import { getSql } from "@/app/lib/db";
import { users, meals } from "../lib/placeholder-data";

async function seedUsers(sql: ReturnType<typeof getSql>) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      ime TEXT NOT NULL,
      priimek TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashed = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, ime, priimek, email, password_hash)
        VALUES (${user.id}, ${user.ime}, ${user.priimek}, ${user.email}, ${hashed})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedMeals(sql: ReturnType<typeof getSql>) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//await sql`DROP TABLE IF EXISTS meals;`;
 await sql`
  CREATE TABLE IF NOT EXISTS meals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    naziv TEXT NOT NULL,
    kalorije INT NOT NULL,
    beljakovine INT NOT NULL,
    ogljikovi_hidrati INT NOT NULL,
    mascobe INT NOT NULL,
    cas TIMESTAMP DEFAULT NOW()
  );
`;


  const insertedMeals = await Promise.all(
  meals.map(
    (meal) => sql`
      INSERT INTO meals (
        id, user_id, naziv, kalorije,
        beljakovine, ogljikovi_hidrati, mascobe, cas
      )
      VALUES (
        ${meal.id},
        ${meal.user_id},
        ${meal.naziv},
        ${meal.kalorije},
        ${meal.beljakovine},
        ${meal.ogljikovi_hidrati},
        ${meal.mascobe},
        ${meal.cas}
      )
      ON CONFLICT (id) DO NOTHING;
    `
  )
);


  return insertedMeals;
}

export async function GET() {
  try {
    const sql = getSql();
    await sql.begin((sql) => [
      seedUsers(sql),
      seedMeals(sql),
    ]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed failed:", error);
    return Response.json({ error }, { status: 500 });
  }
}
