"use client";

import { useState } from "react";
import { copy, type AppLanguage } from "@/lib/copy";
import type { LlmProvider, TravelFormValues, ItineraryResponse } from "@/lib/types";

const PROVIDERS: { id: LlmProvider; label: string }[] = [
  { id: "gemini", label: "Gemini" },
  { id: "openai", label: "OpenAI" },
  { id: "cloud", label: "Claude" },
];

const DEFAULT_FORM: Omit<TravelFormValues, "language" | "provider"> = {
  destination: "",
  destinations: "",
  days: 3,
  style: "friends",
  budget: "moderate",
  travelers: "group",
  transportMode: "public_transport",
  drivingComfort: "none",
  maxDailyCommuteMinutes: 60,
  multiDestinationStrategy: "hub_and_spoke",
  intercityTransportPreference: "train",
  fixedOrder: false,
  pace: "balanced",
  avoidLongTransfers: true,
  interests: "",
  mustVisit: "",
  avoidAreas: "",
  notes: "",
};

export default function HomePage() {
  const [lang, setLang] = useState<AppLanguage>("pt-BR");
  const [provider, setProvider] = useState<LlmProvider>("gemini");
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ItineraryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = copy[lang];

  function handleField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    const numericFields = new Set(["days", "maxDailyCommuteMinutes"]);

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : numericFields.has(name) ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload: TravelFormValues = { ...form, language: lang, provider };

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t.errors.generic);
      } else {
        setResult(data as ItineraryResponse);
      }
    } catch {
      setError(t.errors.generic);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm({ ...DEFAULT_FORM });
    setResult(null);
    setError(null);
  }

  return (
    <main className="page-shell">
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">✈️ {t.eyebrow}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSubtitle}</p>
            <div className="hero-stats">
              {t.heroStats.map((s) => (
                <div className="stat-card" key={s.value}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — language + provider selectors */}
          <div className="hero-side">
            <div className="language-card">
              <strong>{t.languageTitle}</strong>
              <p style={{ margin: "8px 0 0", fontSize: "0.94rem", color: "var(--muted)" }}>
                {t.languageBody}
              </p>
              <div className="language-toggle">
                <button
                  className={lang === "pt-BR" ? "active" : ""}
                  onClick={() => setLang("pt-BR")}
                >
                  🇧🇷 Português
                </button>
                <button
                  className={lang === "en" ? "active" : ""}
                  onClick={() => setLang("en")}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            <div className="provider-card">
              <strong>{t.providerTitle}</strong>
              <p style={{ margin: "8px 0 0", fontSize: "0.94rem", color: "var(--muted)" }}>
                {t.providerBody}
              </p>
              <div className="provider-list">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    className={`provider-button ${provider === p.id ? "active" : ""}`}
                    onClick={() => setProvider(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM + RESULT ───────────────────────────────────── */}
      <div className="main-grid">
        {/* Form */}
        <section className="form-card">
          <strong style={{ fontSize: "1.12rem" }}>{t.formTitle}</strong>
          <p style={{ margin: "6px 0 20px", color: "var(--muted)", fontSize: "0.95rem" }}>
            {t.formBody}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field full">
                <label htmlFor="destination">{t.fields.destination}</label>
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  required
                  value={form.destination}
                  onChange={handleField}
                  placeholder={t.placeholders.destination}
                />
              </div>

              <div className="field full">
                <label htmlFor="destinations">{t.fields.destinations}</label>
                <input
                  id="destinations"
                  name="destinations"
                  type="text"
                  value={form.destinations}
                  onChange={handleField}
                  placeholder={t.placeholders.destinations}
                />
              </div>

              <div className="field">
                <label htmlFor="days">{t.fields.days}</label>
                <input
                  id="days"
                  name="days"
                  type="number"
                  min={1}
                  max={30}
                  required
                  value={form.days}
                  onChange={handleField}
                />
              </div>

              <div className="field">
                <label htmlFor="style">{t.fields.style}</label>
                <select id="style" name="style" value={form.style} onChange={handleField}>
                  {Object.entries(t.styles).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="budget">{t.fields.budget}</label>
                <select id="budget" name="budget" value={form.budget} onChange={handleField}>
                  {Object.entries(t.budgets).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="travelers">{t.fields.travelers}</label>
                <select id="travelers" name="travelers" value={form.travelers} onChange={handleField}>
                  {Object.entries(t.travelersOptions).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="transportMode">{t.fields.transportMode}</label>
                <select id="transportMode" name="transportMode" value={form.transportMode} onChange={handleField}>
                  {Object.entries(t.transportModes).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="drivingComfort">{t.fields.drivingComfort}</label>
                <select id="drivingComfort" name="drivingComfort" value={form.drivingComfort} onChange={handleField}>
                  {Object.entries(t.drivingComfortOptions).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="maxDailyCommuteMinutes">{t.fields.maxDailyCommuteMinutes}</label>
                <input
                  id="maxDailyCommuteMinutes"
                  name="maxDailyCommuteMinutes"
                  type="number"
                  min={10}
                  max={240}
                  value={form.maxDailyCommuteMinutes}
                  onChange={handleField}
                />
              </div>

              <div className="field">
                <label htmlFor="multiDestinationStrategy">{t.fields.multiDestinationStrategy}</label>
                <select
                  id="multiDestinationStrategy"
                  name="multiDestinationStrategy"
                  value={form.multiDestinationStrategy}
                  onChange={handleField}
                >
                  {Object.entries(t.multiDestinationStrategies).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="intercityTransportPreference">{t.fields.intercityTransportPreference}</label>
                <select
                  id="intercityTransportPreference"
                  name="intercityTransportPreference"
                  value={form.intercityTransportPreference}
                  onChange={handleField}
                >
                  {Object.entries(t.intercityTransportOptions).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="pace">{t.fields.pace}</label>
                <select id="pace" name="pace" value={form.pace} onChange={handleField}>
                  {Object.entries(t.paceOptions).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="field full checkline">
                <label htmlFor="fixedOrder">
                  <input
                    id="fixedOrder"
                    name="fixedOrder"
                    type="checkbox"
                    checked={form.fixedOrder}
                    onChange={handleField}
                  />
                  {t.fields.fixedOrder}
                </label>
              </div>

              <div className="field full checkline">
                <label htmlFor="avoidLongTransfers">
                  <input
                    id="avoidLongTransfers"
                    name="avoidLongTransfers"
                    type="checkbox"
                    checked={form.avoidLongTransfers}
                    onChange={handleField}
                  />
                  {t.fields.avoidLongTransfers}
                </label>
              </div>

              <div className="field full">
                <label htmlFor="interests">{t.fields.interests}</label>
                <input
                  id="interests"
                  name="interests"
                  type="text"
                  value={form.interests}
                  onChange={handleField}
                  placeholder={t.placeholders.interests}
                />
              </div>

              <div className="field full">
                <label htmlFor="mustVisit">{t.fields.mustVisit}</label>
                <input
                  id="mustVisit"
                  name="mustVisit"
                  type="text"
                  value={form.mustVisit}
                  onChange={handleField}
                  placeholder={t.placeholders.mustVisit}
                />
              </div>

              <div className="field full">
                <label htmlFor="avoidAreas">{t.fields.avoidAreas}</label>
                <input
                  id="avoidAreas"
                  name="avoidAreas"
                  type="text"
                  value={form.avoidAreas}
                  onChange={handleField}
                  placeholder={t.placeholders.avoidAreas}
                />
              </div>

              <div className="field full">
                <label htmlFor="notes">{t.fields.notes}</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleField}
                  placeholder={t.placeholders.notes}
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? t.generating : t.generate}
              </button>
              <button className="secondary-button" type="button" onClick={handleReset}>
                {t.reset}
              </button>
            </div>
          </form>
        </section>

        {/* Result panel */}
        <section className="result-card">
          <div className="result-header">
            <strong style={{ fontSize: "1.05rem" }}>{t.resultTitle}</strong>
            {result && (
              <span className="badge">
                {result.mode === "live" ? result.provider : t.providerBadge}
              </span>
            )}
          </div>

          {error && (
            <p style={{ color: "var(--accent)" }}>{error}</p>
          )}

          {result ? (
            <pre className="result-content">{result.itinerary}</pre>
          ) : (
            !error && (
              <p className="result-placeholder">{t.resultPlaceholder}</p>
            )
          )}
        </section>
      </div>

      <p className="footer-note">{t.footer}</p>
    </main>
  );
}
