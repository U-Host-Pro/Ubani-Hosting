import { newId, nowIso } from "./db.js";
import { runQuery } from "./turso.js";

export async function deployFiles({ env, userId, projectName, files }) {
  if (!env.SITES) throw new Error("R2 binding SITES not configured");

  const projectId = newId("proj");
  const root = `${userId}/${projectId}`;

  for (const f of files) {
    const key = `${root}/${sanitizeFileName(f.name)}`;
    const body = f.contentBase64 ? Uint8Array.from(atob(f.contentBase64), (c) => c.charCodeAt(0)) : (f.content || "");
    await env.SITES.put(key, body, {
      httpMetadata: {
        contentType: f.contentType || "text/plain; charset=utf-8"
      }
    });
  }

  const now = nowIso();
  await runQuery(
    env,
    `INSERT INTO projects (id, user_id, name, domain, source_type, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'upload', 'live', ?, ?)`,
    [projectId, userId, projectName || "My Website", null, now, now]
  );

  return { projectId, status: "live", path: root };
}

function sanitizeFileName(name) {
  return name.replace(/\.\./g, "").replace(/^\/+/, "");
}
