export async function createYocoCheckout({ amountCents, invoiceId, env }) {
  if (!env.YOCO_SECRET_KEY) throw new Error("YOCO_SECRET_KEY is not configured");

  const response = await fetch(`${env.YOCO_API_URL}/checkouts`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.YOCO_SECRET_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      amount: amountCents,
      currency: "ZAR",
      metadata: {
        invoiceId
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Yoco checkout failed: ${response.status} ${text}`);
  }

  return response.json();
}
