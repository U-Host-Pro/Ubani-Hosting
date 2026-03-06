export async function supportReply({ env, question }) {
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");

  const response = await fetch(`${env.OPENAI_API_URL}/responses`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: env.SUPPORT_AI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "You are Ubani Hosting support. Give concise, correct answers."
        },
        {
          role: "user",
          content: question
        }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Support AI failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const text = data.output_text || "";
  return { text, raw: data };
}
