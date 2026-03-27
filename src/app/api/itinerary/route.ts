import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/promptBuilder";
import { buildMockItinerary } from "@/lib/mockItinerary";
import { callOpenAI } from "@/lib/providers/openai";
import { callGemini } from "@/lib/providers/gemini";
import { callCloud } from "@/lib/providers/cloud";
import type { TravelFormValues, ItineraryResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  let form: TravelFormValues;

  try {
    form = (await req.json()) as TravelFormValues;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Basic validation
  const hasPrimaryDestination = Boolean(form.destination?.trim());
  const hasDestinationList = Boolean(form.destinations?.trim());

  if ((!hasPrimaryDestination && !hasDestinationList) || !form.days || form.days < 1 || form.days > 30) {
    return NextResponse.json(
      { error: "destination (or destinations) and days (1–30) are required." },
      { status: 422 }
    );
  }

  const prompt = buildPrompt(form);

  // Determine if a live key is available for the chosen provider
  const hasKey: Record<string, boolean> = {
    openai: Boolean(process.env.OPENAI_API_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    cloud: Boolean(process.env.CLOUD_API_KEY),
  };

  const useLive = hasKey[form.provider] ?? false;

  try {
    let itinerary: string;

    if (useLive) {
      if (form.provider === "openai") itinerary = await callOpenAI(prompt);
      else if (form.provider === "gemini") itinerary = await callGemini(prompt);
      else itinerary = await callCloud(prompt);
    } else {
      itinerary = buildMockItinerary(form);
    }

    const response: ItineraryResponse = {
      provider: form.provider,
      prompt,
      itinerary,
      mode: useLive ? "live" : "mock",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[itinerary] provider error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
