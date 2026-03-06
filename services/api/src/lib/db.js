export function nowIso() {
  return new Date().toISOString();
}

export function newId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function userByEmail(db, email) {
  return db
    .prepare("SELECT id, email, password_hash, credit FROM users WHERE email = ?1")
    .bind(email.toLowerCase())
    .first();
}

export async function userById(db, id) {
  return db
    .prepare("SELECT id, email, credit, created_at FROM users WHERE id = ?1")
    .bind(id)
    .first();
}
