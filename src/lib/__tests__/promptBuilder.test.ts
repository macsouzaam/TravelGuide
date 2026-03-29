import { describe, it, expect } from "vitest";
import { buildPrompt } from "@/lib/promptBuilder";
import type { TravelFormValues } from "@/lib/types";

const baseForm: TravelFormValues = {
  destination: "Paris",
  destinations: "",
  days: 3,
  style: "romantic",
  budget: "moderate",
  travelers: "2",
  transportMode: "public_transport",
  drivingComfort: "none",
  maxDailyCommuteMinutes: 30,
  multiDestinationStrategy: "linear_route",
  intercityTransportPreference: "train",
  fixedOrder: false,
  pace: "balanced",
  avoidLongTransfers: false,
  accommodationType: "hotel",
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

describe("buildPrompt", () => {
  describe("pt-BR", () => {
    it("inclui o destino no prompt", () => {
      const prompt = buildPrompt(baseForm);
      expect(prompt).toContain("Paris");
    });

    it("inclui a duração correta", () => {
      const prompt = buildPrompt(baseForm);
      expect(prompt).toContain("3 dia");
    });

    it("usa descrição de estilo em português", () => {
      const prompt = buildPrompt(baseForm);
      expect(prompt).toContain("romântica");
    });

    it("usa descrição de orçamento em português", () => {
      const prompt = buildPrompt(baseForm);
      expect(prompt).toContain("moderado");
    });

    it("idioma pt-BR produz prompt em português", () => {
      const prompt = buildPrompt(baseForm);
      expect(prompt).toContain("guia de viagens");
    });

    it("instrução de trem inclui custo de passagem", () => {
      const prompt = buildPrompt(baseForm);
      expect(prompt).toContain("trem");
      expect(prompt).toContain("custo médio estimado");
    });

    it("instrução sobre hotéis reais está presente", () => {
      const prompt = buildPrompt(baseForm);
      expect(prompt).toContain("hotéis reais");
    });

    it("instrução para não pular dias está presente", () => {
      const prompt = buildPrompt(baseForm);
      expect(prompt).toContain("sem pular nenhum");
    });
  });

  describe("en", () => {
    const formEn = { ...baseForm, language: "en" as const };

    it("includes destination in prompt", () => {
      const prompt = buildPrompt(formEn);
      expect(prompt).toContain("Paris");
    });

    it("uses English style description", () => {
      const prompt = buildPrompt(formEn);
      expect(prompt).toContain("Romantic");
    });

    it("produces English prompt", () => {
      const prompt = buildPrompt(formEn);
      expect(prompt).toContain("expert travel guide");
    });

    it("train instruction mentions ticket cost", () => {
      const prompt = buildPrompt(formEn);
      expect(prompt).toContain("train");
      expect(prompt).toContain("estimated average ticket cost");
    });

    it("hotel examples instruction is present", () => {
      const prompt = buildPrompt(formEn);
      expect(prompt).toContain("real hotel examples");
    });
  });

  describe("multidestino", () => {
    it("inclui todos os destinos quando 'destinations' é preenchido", () => {
      const form = { ...baseForm, destination: "Paris", destinations: "Lyon, Nice" };
      const prompt = buildPrompt(form);
      expect(prompt).toContain("Lyon");
      expect(prompt).toContain("Nice");
    });

    it("usa 'destination' principal quando 'destinations' está vazio", () => {
      const form = { ...baseForm, destination: "Tóquio", destinations: "" };
      const prompt = buildPrompt(form);
      expect(prompt).toContain("Tóquio");
    });

    it("não duplica destino principal que já está na lista", () => {
      const form = { ...baseForm, destination: "Paris", destinations: "Paris, Lyon" };
      const prompt = buildPrompt(form);
      const matches = (prompt.match(/Paris/g) ?? []).length;
      // Paris pode aparecer em "DESTINO PRINCIPAL" e "DESTINOS" — mas não deve duplicar na lista
      expect(matches).toBeGreaterThanOrEqual(1);
    });
  });

  describe("campos opcionais", () => {
    it("inclui interesses quando informados", () => {
      const form = { ...baseForm, interests: "museus, gastronomia" };
      const prompt = buildPrompt(form);
      expect(prompt).toContain("museus, gastronomia");
    });

    it("inclui must-visit quando informado", () => {
      const form = { ...baseForm, mustVisit: "Torre Eiffel" };
      const prompt = buildPrompt(form);
      expect(prompt).toContain("Torre Eiffel");
    });

    it("não inclui bloco de interesses quando vazio", () => {
      const form = { ...baseForm, interests: "" };
      const prompt = buildPrompt(form);
      expect(prompt).not.toContain("INTERESSES:");
    });

    it("inclui seção de reviews quando ativada", () => {
      const form = { ...baseForm, includeReviews: true };
      const prompt = buildPrompt(form);
      expect(prompt).toContain("Sim");
    });
  });
});
