/**
 * Google Gemini provider wrapper.
 * Requires: GEMINI_API_KEY in environment.
 * Uses the generateContent REST endpoint (no SDK dependency).
 */
export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");

  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  const maxOutputTokens = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? "4096");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as {
    candidates: { content: { parts: { text: string }[] } }[];
  };

  return data.candidates[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
}
