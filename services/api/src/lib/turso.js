import { createClient } from "@libsql/client/web";

let cachedKey = null;
let cachedClient = null;

export function getTursoClient(env) {
  const url = env.TURSO_DATABASE_URL;
  const authToken = env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error("Turso is not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.");
  }

  const key = `${url}:${authToken.slice(0, 6)}`;
  if (cachedClient && cachedKey === key) return cachedClient;

  cachedClient = createClient({ url, authToken });
  cachedKey = key;
  return cachedClient;
}

export async function queryOne(env, sql, args = []) {
  const rs = await getTursoClient(env).execute({ sql, args });
  const rows = rs?.rows || [];
  return rows.length ? rows[0] : null;
}

export async function runQuery(env, sql, args = []) {
  return getTursoClient(env).execute({ sql, args });
}
