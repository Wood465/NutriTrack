import postgres from 'postgres';

let sqlInstance: ReturnType<typeof postgres> | null = null;

export function getSql() {
  if (sqlInstance) return sqlInstance;

  const url = process.env.POSTGRES_URL;
  if (!url) {
    throw new Error('POSTGRES_URL is not set');
  }

  sqlInstance = postgres(url, { ssl: 'require' });
  return sqlInstance;
}
