/**
 * Generic cloud / Anthropic Claude provider wrapper.
 * Requires: CLOUD_API_KEY and CLOUD_API_URL in environment.
 * Follows the Anthropic Messages API format by default.
 * Swap CLOUD_API_URL to point at any OpenAI-compatible endpoint.
 */
export async function callCloud(prompt: string): Promise<string> {
  const apiKey = process.env.CLOUD_API_KEY;
  const apiUrl = process.env.CLOUD_API_URL ?? "https://api.anthropic.com/v1/messages";

  if (!apiKey) throw new Error("CLOUD_API_KEY is not set.");

  const isAnthropic = apiUrl.includes("anthropic.com");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(isAnthropic
      ? {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        }
      : { Authorization: `Bearer ${apiKey}` }),
  };

  const body = isAnthropic
    ? JSON.stringify({
        model: process.env.CLOUD_MODEL ?? "claude-3-5-haiku-latest",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      })
    : JSON.stringify({
        model: process.env.CLOUD_MODEL ?? "default",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2048,
      });

  const res = await fetch(apiUrl, { method: "POST", headers, body });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Cloud API error ${res.status}: ${errorBody}`);
  }

  if (isAnthropic) {
    const data = (await res.json()) as {
      content: { type: string; text: string }[];
    };
    return data.content.filter((b) => b.type === "text").map((b) => b.text).join("") ?? "";
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "";
}
