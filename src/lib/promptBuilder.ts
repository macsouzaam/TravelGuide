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

const accommodationDescriptions: Record<string, { "pt-BR": string; en: string }> = {
  hotel: {
    "pt-BR": "Hotel",
    en: "Hotel",
  },
  airbnb: {
    "pt-BR": "Airbnb",
    en: "Airbnb",
  },
  either: {
    "pt-BR": "Tanto faz",
    en: "Either",
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
  const accommodation = accommodationDescriptions[form.accommodationType]?.[lang] ?? form.accommodationType;
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
TIPO DE HOSPEDAGEM: ${accommodation}
PRIORIDADE DE LOCALIZAÇÃO DA HOSPEDAGEM: ${form.accommodationLocationPriority || "não informado"}
INCLUIR REVIEWS: ${form.includeReviews ? "Sim" : "Não"}
${form.reviewFocus ? `FOCO DOS REVIEWS: ${form.reviewFocus}` : ""}
${form.interests ? `INTERESSES: ${form.interests}` : ""}
${form.mustVisit ? `LUGARES OBRIGATÓRIOS: ${form.mustVisit}` : ""}
${form.avoidAreas ? `ÁREAS A EVITAR: ${form.avoidAreas}` : ""}
${form.notes ? `OBSERVAÇÕES: ${form.notes}` : ""}

INSTRUÇÕES:
- Organize os ${form.days} dia(s) com sugestões de manhã, tarde e noite.
- Entregue obrigatoriamente TODOS os ${form.days} dia(s), sem pular nenhum. Se faltar espaço, reduza detalhes, mas mantenha todos os dias.
- Use exatamente o formato "Dia 1", "Dia 2", ... até "Dia ${form.days}".
- Para cada período cite ao menos 2 opções de atividade ou ponto turístico, incluindo nome, descrição breve e dica prática.
- Indique ao menos 1 restaurante por dia com culinária típica e faixa de preço.
- Distribua os dias entre os destinos informados de forma coerente com o ritmo da viagem.
- Em cada troca de cidade/país, indique o melhor modal de transporte, tempo estimado e custo relativo (baixo, médio ou alto).
- Quando o modal de transporte entre cidades for trem, informe o custo médio estimado das passagens por pessoa (em moeda local ou em BRL, indicando a moeda) e o nome da linha/serviço ferroviário quando relevante.
- Acrescente dicas de logística (como se locomover, melhor horário para cada atração, reservas necessárias).
- Se mobilidade for a pé, priorize atrações próximas no mesmo bairro/região por bloco do dia.
- Se mobilidade for transporte público, inclua passes, linhas-chave e estações centrais quando útil.
- Se mobilidade incluir carro alugado, traga alertas de pedágio, estacionamento e trecho ideal para dirigir.
- Sugira 2 a 4 melhores regiões para hospedagem no destino (ou por destino), explicando prós e contras para hotel e/ou Airbnb conforme preferência.
- Para cada região sugerida, cite nível de conveniência para transporte, segurança e acesso a atrações.
- Quando fizer sentido, sugira perfis de hospedagem (econômico, conforto, premium) com faixa de preço por noite.
- Em cada perfil de hospedagem, liste de 2 a 3 exemplos de hotéis reais com nome completo, breve descrição e faixa de preço estimada por noite.
- Se INCLUIR REVIEWS for "Sim", adicione uma seção opcional de reviews resumidos de cidade, pontos turísticos, museus, hospedagens e restaurantes com notas médias estimadas (escala 1-5) e breve justificativa.
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
ACCOMMODATION TYPE: ${accommodation}
ACCOMMODATION LOCATION PRIORITY: ${form.accommodationLocationPriority || "not specified"}
INCLUDE REVIEWS: ${form.includeReviews ? "Yes" : "No"}
${form.reviewFocus ? `REVIEW FOCUS: ${form.reviewFocus}` : ""}
${form.interests ? `INTERESTS: ${form.interests}` : ""}
${form.mustVisit ? `MUST-VISIT PLACES: ${form.mustVisit}` : ""}
${form.avoidAreas ? `AREAS TO AVOID: ${form.avoidAreas}` : ""}
${form.notes ? `NOTES: ${form.notes}` : ""}

INSTRUCTIONS:
- Organize the ${form.days} day(s) with morning, afternoon, and evening suggestions.
- You must include ALL ${form.days} day(s) and never skip any day. If space is limited, reduce detail but keep every day.
- Use the exact structure "Day 1", "Day 2", ... through "Day ${form.days}".
- For each period, list at least 2 activity or sightseeing options, including name, brief description, and a practical tip.
- Recommend at least 1 restaurant per day with local cuisine and price range.
- Distribute days across the listed destinations coherently with the selected pace.
- For each city/country transfer, recommend the best transport mode, estimated time, and relative cost (low, medium, high).
- When the intercity transport mode is train, provide the estimated average ticket cost per person (in local currency, indicating the currency) and the name of the train service/line when relevant.
- Add logistics tips (how to get around, best times for each attraction, required bookings).
- If mobility is walking, keep activities geographically close in each time block.
- If mobility is public transport, include passes, key lines, and central stations when useful.
- If mobility includes rental car, include toll, parking, and best driving windows.
- Suggest 2 to 4 best accommodation areas (overall or per destination), explaining pros/cons for hotel and/or Airbnb based on user preference.
- For each suggested area, include convenience level for transit, safety, and access to attractions.
- When useful, suggest accommodation profiles (budget, comfort, premium) with nightly price range.
- For each accommodation profile, list 2 to 3 real hotel examples with the full hotel name, a brief description, and an estimated nightly price range.
- If INCLUDE REVIEWS is "Yes", add an optional section with concise reviews for city, sightseeing spots, museums, accommodations, and restaurants with estimated average ratings (1-5) and brief rationale.
- Finish with up to 3 general travel tips.
- Write in clear, friendly English.`;
}
