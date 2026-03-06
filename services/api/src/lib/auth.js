const enc = new TextEncoder();

async function sha256(input) {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toBase64Url(input) {
  const bytes = typeof input === "string" ? enc.encode(input) : input;
  let b64 = btoa(String.fromCharCode(...bytes));
  b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return b64;
}

function fromBase64Url(input) {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, "=");
  const raw = atob(padded);
  return new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
}

async function sign(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toBase64Url(new Uint8Array(sig));
}

export async function hashPassword(password, salt) {
  return sha256(`${salt}:${password}`);
}

export async function makeToken(payload, secret) {
  const body = toBase64Url(JSON.stringify(payload));
  const signature = await sign(body, secret);
  return `${body}.${signature}`;
}

export async function verifyToken(token, secret) {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await sign(body, secret);
  if (expected !== sig) return null;

  const payloadBytes = fromBase64Url(body);
  const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
  if (!payload.exp || Date.now() > payload.exp) return null;
  return payload;
}

export function bearerToken(request) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.toLowerCase().startsWith("bearer ")) return null;
  return auth.slice(7).trim();
}
