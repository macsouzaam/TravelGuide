import type { TravelFormValues } from "@/lib/types";

const styleDescriptions: Record<string, { "pt-BR": string; en: string }> = {
  family: {
    "pt-BR":
      "Viagem em família com crianças. Priorize atrações infantis, ritmo tranquilo, restaurantes com opções para crianças e locais seguros.",
    en: "Family trip with children. Prioritize kid-friendly attractions, relaxed pace, child-friendly restaurants, and safe areas.",
  },
  friends: {
    "pt-BR":
      "Viagem com amigos. Inclua vida noturna, bares, experiências compartilhadas, atividades em grupo e locais animados.",
    en: "Trip with friends. Include nightlife, bars, shared experiences, group activities, and lively venues.",
  },
  romantic: {
    "pt-BR":
      "Viagem romântica para casal. Priorize restaurantes íntimos, paisagens, atividades a dois e experiências memoráveis.",
    en: "Romantic couple's trip. Prioritize intimate restaurants, scenic spots, couple activities, and memorable experiences.",
  },
  solo: {
    "pt-BR":
      "Viagem solo. Valorize liberdade de horários, hostels ou hotéis boutique, conexão com a cultura local e segurança.",
    en: "Solo travel. Value flexible schedules, hostels or boutique hotels, local culture connection, and personal safety.",
  },
  adventure: {
    "pt-BR":
      "Viagem de aventura. Inclua atividades ao ar livre, trilhas, esportes, contato com a natureza e experiências fora do comum.",
    en: "Adventure trip. Include outdoor activities, hiking, sports, nature immersion, and off-the-beaten-path experiences.",
  },
  luxury: {
    "pt-BR":
      "Viagem de luxo. Priorize hotéis cinco estrelas, restaurantes premiados, experiências exclusivas e serviços premium.",
    en: "Luxury trip. Prioritize five-star hotels, award-winning restaurants, exclusive experiences, and premium services.",
  },
};

const budgetDescriptions: Record<string, { "pt-BR": string; en: string }> = {
  economy: {
    "pt-BR": "Orçamento econômico — foque em opções custo-benefício, transporte público e atrações gratuitas ou baratas.",
    en: "Budget travel — focus on cost-effective options, public transport, and free or inexpensive attractions.",
  },
  moderate: {
    "pt-BR": "Orçamento moderado — misture boas experiências gastronômicas com atrações pagas sem exagerar nos gastos.",
    en: "Moderate budget — mix good dining experiences with paid attractions without overspending.",
  },
  premium: {
    "pt-BR": "Orçamento premium — não economize em qualidade, conforto e experiências diferenciadas.",
    en: "Premium budget — do not compromise on quality, comfort, or unique experiences.",
  },
};

const transportDescriptions: Record<string, { "pt-BR": string; en: string }> = {
  rental_car: {
    "pt-BR": "Carro alugado",
    en: "Rental car",
  },
  public_transport: {
    "pt-BR": "Transporte público",
    en: "Public transport",
  },
  walking: {
    "pt-BR": "A pé",
    en: "Walking",
  },
  mixed: {
    "pt-BR": "Misto",
    en: "Mixed",
  },
};

const paceDescriptions: Record<string, { "pt-BR": string; en: string }> = {
  slow: {
    "pt-BR": "Ritmo leve",
    en: "Slow pace",
  },
  balanced: {
    "pt-BR": "Ritmo equilibrado",
    en: "Balanced pace",
  },
  fast: {
    "pt-BR": "Ritmo intenso",
    en: "Fast pace",
  },
};

function normalizeDestinations(form: TravelFormValues): string[] {
  const list = form.destinations
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (list.length === 0 && form.destination.trim()) {
    return [form.destination.trim()];
  }

  if (list.length > 0 && form.destination.trim()) {
    const primary = form.destination.trim();
    if (!list.some((d) => d.toLowerCase() === primary.toLowerCase())) {
      return [primary, ...list];
    }
  }

  return list;
}

export function buildPrompt(form: TravelFormValues): string {
  const lang = form.language;
  const style = styleDescriptions[form.style]?.[lang] ?? form.style;
  const budget = budgetDescriptions[form.budget]?.[lang] ?? form.budget;
  const transportMode = transportDescriptions[form.transportMode]?.[lang] ?? form.transportMode;
  const pace = paceDescriptions[form.pace]?.[lang] ?? form.pace;
  const destinations = normalizeDestinations(form);
  const mainDestination = destinations[0] ?? form.destination;
  const destinationList = destinations.join(" | ");
  const fixedOrder = form.fixedOrder ? (lang === "pt-BR" ? "Sim" : "Yes") : lang === "pt-BR" ? "Não" : "No";
  const avoidLongTransfers = form.avoidLongTransfers
    ? lang === "pt-BR"
      ? "Sim"
      : "Yes"
    : lang === "pt-BR"
      ? "Não"
      : "No";

  if (lang === "pt-BR") {
    return `Você é um guia de viagens especialista. Crie um roteiro detalhado para a seguinte solicitação.

DESTINO PRINCIPAL: ${mainDestination}
DESTINOS (ordem sugerida): ${destinationList}
DURAÇÃO: ${form.days} dia(s)
ESTILO: ${style}
ORÇAMENTO: ${budget}
VIAJANTES: ${form.travelers}
MOBILIDADE LOCAL: ${transportMode}
CONFORTO AO DIRIGIR: ${form.drivingComfort}
TEMPO MÁXIMO DE DESLOCAMENTO/DIA: ${form.maxDailyCommuteMinutes} minutos
ESTRATÉGIA MULTIDESTINO: ${form.multiDestinationStrategy}
PREFERÊNCIA DE TRANSPORTE ENTRE CIDADES: ${form.intercityTransportPreference}
ORDEM DOS DESTINOS É FIXA: ${fixedOrder}
RITMO DA VIAGEM: ${pace}
EVITAR DESLOCAMENTOS LONGOS: ${avoidLongTransfers}
${form.interests ? `INTERESSES: ${form.interests}` : ""}
${form.mustVisit ? `LUGARES OBRIGATÓRIOS: ${form.mustVisit}` : ""}
${form.avoidAreas ? `ÁREAS A EVITAR: ${form.avoidAreas}` : ""}
${form.notes ? `OBSERVAÇÕES: ${form.notes}` : ""}

INSTRUÇÕES:
- Organize os ${form.days} dia(s) com sugestões de manhã, tarde e noite.
- Para cada período cite ao menos 2 opções de atividade ou ponto turístico, incluindo nome, descrição breve e dica prática.
- Indique ao menos 1 restaurante por dia com culinária típica e faixa de preço.
- Distribua os dias entre os destinos informados de forma coerente com o ritmo da viagem.
- Em cada troca de cidade/país, indique o melhor modal de transporte, tempo estimado e custo relativo (baixo, médio ou alto).
- Acrescente dicas de logística (como se locomover, melhor horário para cada atração, reservas necessárias).
- Se mobilidade for a pé, priorize atrações próximas no mesmo bairro/região por bloco do dia.
- Se mobilidade for transporte público, inclua passes, linhas-chave e estações centrais quando útil.
- Se mobilidade incluir carro alugado, traga alertas de pedágio, estacionamento e trecho ideal para dirigir.
- Finalize com até 3 dicas gerais para a viagem.
- Escreva em português claro e amigável.`;
  }

  return `You are an expert travel guide. Create a detailed itinerary for the following request.

PRIMARY DESTINATION: ${mainDestination}
DESTINATIONS (suggested order): ${destinationList}
DURATION: ${form.days} day(s)
STYLE: ${style}
BUDGET: ${budget}
TRAVELERS: ${form.travelers}
LOCAL MOBILITY: ${transportMode}
DRIVING COMFORT: ${form.drivingComfort}
MAX DAILY COMMUTE: ${form.maxDailyCommuteMinutes} minutes
MULTI-DESTINATION STRATEGY: ${form.multiDestinationStrategy}
PREFERRED INTERCITY TRANSPORT: ${form.intercityTransportPreference}
DESTINATION ORDER IS FIXED: ${fixedOrder}
TRIP PACE: ${pace}
AVOID LONG TRANSFERS: ${avoidLongTransfers}
${form.interests ? `INTERESTS: ${form.interests}` : ""}
${form.mustVisit ? `MUST-VISIT PLACES: ${form.mustVisit}` : ""}
${form.avoidAreas ? `AREAS TO AVOID: ${form.avoidAreas}` : ""}
${form.notes ? `NOTES: ${form.notes}` : ""}

INSTRUCTIONS:
- Organize the ${form.days} day(s) with morning, afternoon, and evening suggestions.
- For each period, list at least 2 activity or sightseeing options, including name, brief description, and a practical tip.
- Recommend at least 1 restaurant per day with local cuisine and price range.
- Distribute days across the listed destinations coherently with the selected pace.
- For each city/country transfer, recommend the best transport mode, estimated time, and relative cost (low, medium, high).
- Add logistics tips (how to get around, best times for each attraction, required bookings).
- If mobility is walking, keep activities geographically close in each time block.
- If mobility is public transport, include passes, key lines, and central stations when useful.
- If mobility includes rental car, include toll, parking, and best driving windows.
- Finish with up to 3 general travel tips.
- Write in clear, friendly English.`;
}
