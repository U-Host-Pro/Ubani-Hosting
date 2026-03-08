import { queryOne } from "./turso.js";

export function nowIso() {
  return new Date().toISOString();
}

export function newId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function userByEmail(env, email) {
  return queryOne(
    env,
    "SELECT id, email, password_hash, credit FROM users WHERE email = ?",
    [email.toLowerCase()]
  );
}

export async function userById(env, id) {
  return queryOne(env, "SELECT id, email, credit, created_at FROM users WHERE id = ?", [id]);
}
