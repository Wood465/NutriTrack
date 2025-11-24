import postgres from 'postgres';
import { User, Meal } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getUsers(): Promise<User[]> {
  const { rows } = await sql`SELECT * FROM users`;
  return rows;
}

export async function getMealsByUser(userId: string): Promise<Meal[]> {
  const { rows } = await sql`
    SELECT * FROM meals WHERE user_id = ${userId} ORDER BY cas DESC
  `;
  return rows;
}

export async function addMeal(
  userId: string,
  naziv: string,
  kalorije: number,
  energijska_vrednost: number
) {
  await sql`
    INSERT INTO meals (user_id, naziv, kalorije, energijska_vrednost)
    VALUES (${userId}, ${naziv}, ${kalorije}, ${energijska_vrednost})
  `;
}
