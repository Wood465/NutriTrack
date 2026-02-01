import { getSql } from './db';
import { User, Meal } from './definitions';

export async function getUsers(): Promise<User[]> {
  const sql = getSql();
  const result = await sql<User[]>`SELECT * FROM users ORDER BY ime`;
  return result;
}

export async function getMealsByUser(userId: string): Promise<Meal[]> {
  const sql = getSql();
  const result = await sql<Meal[]>`
    SELECT * FROM meals
    WHERE user_id = ${userId}
    ORDER BY cas DESC
  `;
  return result;
}

export async function addMeal(
  userId: string,
  naziv: string,
  kalorije: number,
  energijska_vrednost: number
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO meals (user_id, naziv, kalorije, energijska_vrednost)
    VALUES (${userId}, ${naziv}, ${kalorije}, ${energijska_vrednost})
  `;
}
