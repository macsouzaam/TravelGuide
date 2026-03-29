import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import type { TravelFormValues } from "@/lib/types";

// Isola providers de LLM para não fazer chamadas reais durante testes
vi.mock("@/lib/providers/openai", () => ({ callOpenAI: vi.fn() }));
vi.mock("@/lib/providers/gemini", () => ({ callGemini: vi.fn() }));
vi.mock("@/lib/providers/cloud", () => ({ callCloud: vi.fn() }));

// Importa DEPOIS dos mocks
const { POST } = await import("@/app/api/itinerary/route");

const validForm: TravelFormValues = {
  destination: "Lisboa",
  destinations: "",
  days: 2,
  style: "solo",
  budget: "economy",
  travelers: "1",
  transportMode: "walking",
  drivingComfort: "none",
  maxDailyCommuteMinutes: 20,
  multiDestinationStrategy: "linear_route",
  intercityTransportPreference: "bus",
  fixedOrder: false,
  pace: "slow",
  avoidLongTransfers: false,
  accommodationType: "either",
  accommodationLocationPriority: "",
  includeReviews: false,
  reviewFocus: "",
  interests: "",
  mustVisit: "",
  avoidAreas: "",
  notes: "",
  language: "pt-BR",
  provider: "gemini",
};

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/itinerary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/itinerary", () => {
  beforeEach(() => {
    // Garante que nenhuma chave de API está ativa (usa modo mock)
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.stubEnv("OPENAI_API_KEY", "");
    vi.stubEnv("CLOUD_API_KEY", "");
  });

  describe("validação de entrada", () => {
    it("retorna 400 quando o body não é JSON válido", async () => {
      const req = new NextRequest("http://localhost/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "não é json",
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("retorna 422 quando destination e destinations estão vazios", async () => {
      const req = makeRequest({ ...validForm, destination: "", destinations: "" });
      const res = await POST(req);
      expect(res.status).toBe(422);
    });

    it("retorna 422 quando days é 0", async () => {
      const req = makeRequest({ ...validForm, days: 0 });
      const res = await POST(req);
      expect(res.status).toBe(422);
    });

    it("retorna 422 quando days é 31 (acima do máximo)", async () => {
      const req = makeRequest({ ...validForm, days: 31 });
      const res = await POST(req);
      expect(res.status).toBe(422);
    });

    it("retorna 422 quando days está ausente", async () => {
      const { days: _, ...withoutDays } = validForm;
      const req = makeRequest(withoutDays);
      const res = await POST(req);
      expect(res.status).toBe(422);
    });
  });

  describe("resposta em modo mock", () => {
    it("retorna 200 com formulário válido", async () => {
      const req = makeRequest(validForm);
      const res = await POST(req);
      expect(res.status).toBe(200);
    });

    it("resposta contém os campos esperados", async () => {
      const req = makeRequest(validForm);
      const res = await POST(req);
      const body = await res.json();
      expect(body).toHaveProperty("itinerary");
      expect(body).toHaveProperty("prompt");
      expect(body).toHaveProperty("provider");
      expect(body).toHaveProperty("mode", "mock");
    });

    it("prompt contém o destino solicitado", async () => {
      const req = makeRequest(validForm);
      const res = await POST(req);
      const body = await res.json();
      expect(body.prompt).toContain("Lisboa");
    });

    it("aceita days = 30 (valor máximo)", async () => {
      const req = makeRequest({ ...validForm, days: 30 });
      const res = await POST(req);
      expect(res.status).toBe(200);
    });

    it("aceita destinations em vez de destination", async () => {
      const req = makeRequest({ ...validForm, destination: "", destinations: "Porto, Braga" });
      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });
});
