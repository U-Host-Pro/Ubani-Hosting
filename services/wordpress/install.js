export async function installWordpress(userId, env) {
  if (!env.SITES) throw new Error("R2 binding SITES not configured");

  const templateUrl = env.WORDPRESS_TEMPLATE_URL || "https://ubanihosting.co.za/templates/wp.zip";
  const template = await fetch(templateUrl);
  if (!template.ok) {
    throw new Error(`Failed to fetch WordPress template: ${template.status}`);
  }

  const data = await template.arrayBuffer();
  await env.SITES.put(`${userId}/wordpress/wp.zip`, data, {
    httpMetadata: { contentType: "application/zip" }
  });

  return { installed: true };
}
