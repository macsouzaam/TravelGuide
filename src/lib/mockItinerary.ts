import type { TravelFormValues } from "@/lib/types";

export function buildMockItinerary(form: TravelFormValues): string {
  const isPt = form.language === "pt-BR";
  const multiDestinations = form.destinations
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const destinations = multiDestinations.length > 0 ? multiDestinations : [form.destination];
  const mobilityLine = isPt
    ? `Mobilidade escolhida: ${form.transportMode} | ritmo: ${form.pace} | deslocamento máximo diário: ${form.maxDailyCommuteMinutes} min`
    : `Selected mobility: ${form.transportMode} | pace: ${form.pace} | max daily commute: ${form.maxDailyCommuteMinutes} min`;
  const routeLine = isPt
    ? `Destinos planejados: ${destinations.join(" -> ")}`
    : `Planned destinations: ${destinations.join(" -> ")}`;
  const stayLine = isPt
    ? `Hospedagem preferida: ${form.accommodationType} | prioridade de localização: ${form.accommodationLocationPriority || "não informado"}`
    : `Preferred stay: ${form.accommodationType} | location priority: ${form.accommodationLocationPriority || "not specified"}`;

  if (isPt) {
    return `📍 Roteiro de exemplo para ${form.destination} — ${form.days} dia(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este é um roteiro simulado (modo local). Configure sua chave de API para receber um roteiro personalizado.

${mobilityLine}
${routeLine}
${stayLine}

🗓 Dia 1 — Chegada e primeiras impressões
  🌅 Manhã
    • Passeio pelo centro histórico
    • Visita ao museu principal da cidade
  ☀️ Tarde
    • Almoço em restaurante típico (€€)
    • Visita a ponto turístico icônico
  🌙 Noite
    • Jantar com culinária local (€€)
    • Passeio pelo bairro mais animado

${
  form.days > 1
    ? `🗓 Dia 2 — Exploração e experiências locais
  🌅 Manhã
    • Café da manhã em mercado local
    • Visita a parque ou área natural próxima
  ☀️ Tarde
    • Almoço em bistrô regional
    • Tour cultural ou visita guiada
  🌙 Noite
    • Jantar especial (${form.budget === "premium" ? "restaurante premiado" : "opção popular e saborosa"})
    • Experiência de entretenimento local\n`
    : ""
}
💡 Dicas gerais
  1. Reserve ingressos com antecedência para os museus mais populares.
  2. Use transporte público — geralmente mais rápido e econômico.
  3. Pesquise restaurantes fora das áreas de alto tráfego turístico para melhores preços.

🚆 Logística entre destinos
  • Estratégia escolhida: ${form.multiDestinationStrategy}
  • Preferência de modal intermunicipal/internacional: ${form.intercityTransportPreference}
  • Ordem fixa de destinos: ${form.fixedOrder ? "sim" : "não"}
  • Evitar deslocamentos longos: ${form.avoidLongTransfers ? "sim" : "não"}

🏨 Sugestões de hospedagem
  • Região central: melhor para deslocamentos rápidos e vida noturna.
  • Região residencial com metrô: melhor equilíbrio entre custo e conforto.
  • Dica: compare hotel e Airbnb nessas duas regiões antes de reservar.

${
  form.includeReviews
    ? `⭐ Reviews resumidos (simulados)
  • Cidade: 4.6/5 (limpa, boa estrutura turística)
  • Museus principais: 4.7/5 (excelente curadoria)
  • Hotéis/Airbnb: 4.4/5 (boa relação localização x conforto)
  • Restaurantes locais: 4.5/5 (ótima gastronomia)
  • Foco: ${form.reviewFocus || "geral"}
`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Modo de demonstração local — sem chamada real à API.`;
  }

  return `📍 Sample itinerary for ${form.destination} — ${form.days} day(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a simulated itinerary (local mode). Configure your API key to receive a personalised itinerary.

${mobilityLine}
${routeLine}
${stayLine}

🗓 Day 1 — Arrival & first impressions
  🌅 Morning
    • Stroll through the historic centre
    • Visit the city's main museum
  ☀️ Afternoon
    • Lunch at a local restaurant ($$)
    • Visit iconic landmark
  🌙 Evening
    • Dinner with local cuisine ($$)
    • Walk through the liveliest neighbourhood

${
  form.days > 1
    ? `🗓 Day 2 — Deep exploration
  🌅 Morning
    • Breakfast at a local market
    • Visit a park or nearby natural area
  ☀️ Afternoon
    • Lunch at a regional bistro
    • Cultural tour or guided visit
  🌙 Evening
    • Special dinner (${form.budget === "premium" ? "award-winning restaurant" : "popular local favourite"})
    • Local entertainment experience\n`
    : ""
}
💡 General tips
  1. Book tickets in advance for the most popular museums.
  2. Use public transport — usually faster and cheaper.
  3. Look for restaurants away from high-traffic tourist areas for better value.

🚆 Intercity logistics
  • Selected strategy: ${form.multiDestinationStrategy}
  • Intercity/international transport preference: ${form.intercityTransportPreference}
  • Fixed destination order: ${form.fixedOrder ? "yes" : "no"}
  • Avoid long transfers: ${form.avoidLongTransfers ? "yes" : "no"}

🏨 Accommodation suggestions
  • Central area: best for quick transfers and nightlife.
  • Residential area near metro: best balance between cost and comfort.
  • Tip: compare hotel and Airbnb in both areas before booking.

${
  form.includeReviews
    ? `⭐ Condensed reviews (mock)
  • City: 4.6/5 (clean, good tourist infrastructure)
  • Main museums: 4.7/5 (excellent curation)
  • Hotels/Airbnb: 4.4/5 (good location/comfort balance)
  • Local restaurants: 4.5/5 (strong food scene)
  • Focus: ${form.reviewFocus || "general"}
`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Local demo mode — no real API call made.`;
}
