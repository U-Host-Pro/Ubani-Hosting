export async function sendZohoEmail({ env, to, subject, content }) {
  if (!env.ZOHO_ACCESS_TOKEN || !env.ZOHO_MAIL_ACCOUNT_ID) {
    throw new Error("ZOHO_ACCESS_TOKEN or ZOHO_MAIL_ACCOUNT_ID is missing");
  }

  const response = await fetch(
    `${env.ZOHO_API_URL}/mail/v1/accounts/${env.ZOHO_MAIL_ACCOUNT_ID}/messages`,
    {
      method: "POST",
      headers: {
        authorization: `Zoho-oauthtoken ${env.ZOHO_ACCESS_TOKEN}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        fromAddress: env.ZOHO_FROM_EMAIL,
        toAddress: to,
        subject,
        content
      })
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Zoho send failed: ${response.status} ${text}`);
  }

  return response.json();
}
