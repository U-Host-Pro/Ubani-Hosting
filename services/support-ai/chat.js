export async function chat(question, env) {
  const response = await fetch(`${env.OPENAI_API_URL}/responses`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: env.SUPPORT_AI_MODEL || "gpt-4.1-mini",
      input: question
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  return response.json();
}
