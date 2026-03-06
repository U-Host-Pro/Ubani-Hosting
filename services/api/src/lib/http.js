const DEFAULT_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

export function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  for (const [k, v] of Object.entries(DEFAULT_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function error(status, message, code = "error") {
  return json({ error: { code, message } }, { status });
}

export async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function corsHeaders(origin) {
  return {
    "access-control-allow-origin": origin || "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "authorization,content-type"
  };
}
