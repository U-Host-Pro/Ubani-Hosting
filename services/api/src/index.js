import { bearerToken, hashPassword, makeToken, verifyToken } from "./lib/auth.js";
import { deployFiles } from "./lib/deploy.js";
import { newId, nowIso, userByEmail, userById } from "./lib/db.js";
import { sendZohoEmail } from "./lib/email/zoho.js";
import { error, json, parseJson, corsHeaders } from "./lib/http.js";
import { createYocoCheckout } from "./lib/payments/yoco.js";
import { rewardReferral } from "./lib/referrals.js";
import { supportReply } from "./lib/supportAi.js";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin");
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    try {
      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/api/health") {
        return json({ ok: true, service: "ubani-api" }, { headers: cors });
      }

      if (request.method === "POST" && url.pathname === "/api/register") {
        return withCors(await register(request, env), cors);
      }

      if (request.method === "POST" && url.pathname === "/api/login") {
        return withCors(await login(request, env), cors);
      }

      if (request.method === "POST" && url.pathname === "/api/deploy") {
        return withCors(await deploy(request, env), cors);
      }

      if (request.method === "POST" && url.pathname === "/api/invoice") {
        return withCors(await invoice(request, env), cors);
      }

      if (request.method === "POST" && url.pathname === "/api/support/chat") {
        return withCors(await support(request, env), cors);
      }

      return withCors(error(404, "Not found", "not_found"), cors);
    } catch (err) {
      return withCors(error(500, err.message || "Unexpected error", "internal_error"), cors);
    }
  }
};

function withCors(response, cors) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(cors)) headers.set(k, v);
  return new Response(response.body, { status: response.status, headers });
}

async function register(request, env) {
  const body = await parseJson(request);
  if (!body?.email || !body?.password) {
    return error(400, "email and password are required", "validation_error");
  }

  const existing = await userByEmail(env.DB, body.email);
  if (existing) return error(409, "Email already exists", "duplicate_email");

  const id = newId("usr");
  const now = nowIso();
  const passwordHash = await hashPassword(body.password, env.PASSWORD_SALT || "change-me");
  const referrerId = body.referrerId || null;

  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, credit, referrer_id, created_at, updated_at)
     VALUES (?1, ?2, ?3, 0, ?4, ?5, ?5)`
  )
    .bind(id, body.email.toLowerCase(), passwordHash, referrerId, now)
    .run();

  if (referrerId) {
    await rewardReferral({ env, referrerId, referredUserId: id });
  }

  try {
    await sendZohoEmail({
      env,
      to: body.email,
      subject: "Welcome to Ubani Hosting",
      content: "Your account is ready. Log in and launch your site."
    });
  } catch {
    // Email should not block signup.
  }

  return json({ id, email: body.email.toLowerCase() }, { status: 201 });
}

async function login(request, env) {
  const body = await parseJson(request);
  if (!body?.email || !body?.password) {
    return error(400, "email and password are required", "validation_error");
  }

  const user = await userByEmail(env.DB, body.email);
  if (!user) return error(401, "Invalid credentials", "invalid_credentials");

  const actual = await hashPassword(body.password, env.PASSWORD_SALT || "change-me");
  if (actual !== user.password_hash) {
    return error(401, "Invalid credentials", "invalid_credentials");
  }

  const token = await makeToken(
    {
      sub: user.id,
      email: user.email,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7
    },
    env.JWT_SECRET || "change-me"
  );

  return json({ token, user: { id: user.id, email: user.email, credit: user.credit } });
}

async function deploy(request, env) {
  const user = await requireUser(request, env);
  if (!user) return error(401, "Unauthorized", "unauthorized");

  const body = await parseJson(request);
  const files = Array.isArray(body?.files) ? body.files : [];
  if (!files.length) {
    return error(400, "files array is required", "validation_error");
  }

  const result = await deployFiles({
    env,
    userId: user.id,
    projectName: body.projectName,
    files
  });

  return json(result, { status: 201 });
}

async function invoice(request, env) {
  const user = await requireUser(request, env);
  if (!user) return error(401, "Unauthorized", "unauthorized");

  const body = await parseJson(request);
  const amountCents = Number(body?.amountCents);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return error(400, "amountCents must be a positive number", "validation_error");
  }

  const invoiceId = newId("inv");
  const now = nowIso();

  await env.DB.prepare(
    `INSERT INTO invoices (id, user_id, amount_cents, currency, status, provider, provider_reference, created_at, updated_at)
     VALUES (?1, ?2, ?3, 'ZAR', 'pending', 'yoco', NULL, ?4, ?4)`
  )
    .bind(invoiceId, user.id, amountCents, now)
    .run();

  const checkout = await createYocoCheckout({ amountCents, invoiceId, env });

  await env.DB.prepare("UPDATE invoices SET provider_reference = ?1, updated_at = ?2 WHERE id = ?3")
    .bind(checkout.id || null, nowIso(), invoiceId)
    .run();

  return json({ invoiceId, checkout }, { status: 201 });
}

async function support(request, env) {
  const user = await requireUser(request, env);
  if (!user) return error(401, "Unauthorized", "unauthorized");

  const body = await parseJson(request);
  if (!body?.question) return error(400, "question is required", "validation_error");

  const reply = await supportReply({ env, question: body.question });
  return json({ answer: reply.text });
}

async function requireUser(request, env) {
  const token = bearerToken(request);
  if (!token) return null;
  const payload = await verifyToken(token, env.JWT_SECRET || "change-me");
  if (!payload?.sub) return null;
  return userById(env.DB, payload.sub);
}
