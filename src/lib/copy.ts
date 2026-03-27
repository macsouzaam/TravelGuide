export type AppLanguage = "pt-BR" | "en";

export const copy = {
  "pt-BR": {
    eyebrow: "Planejamento inteligente de viagens",
    heroTitle: "Bem-vindo, viajante.",
    heroSubtitle:
      "Descreva o tipo de jornada que você quer viver e deixe a IA montar um roteiro com atrações, restaurantes, ritmo diário e sugestões alinhadas ao seu estilo.",
    heroStats: [
      { value: "3", label: "provedores prontos para orquestrar" },
      { value: "2", label: "idiomas na interface" },
      { value: "AWS-ready", label: "fácil de subir depois" },
    ],
    languageTitle: "Idioma da interface",
    languageBody:
      "Começamos localmente com português e inglês. Depois podemos conectar autenticação, banco e deploy na AWS sem reescrever a base.",
    providerTitle: "Motor de IA",
    providerBody:
      "Escolha um provedor para testes locais. A API monta um prompt customizado a partir dos parâmetros do viajante.",
    formTitle: "Monte o briefing da viagem",
    formBody:
      "Quanto melhor o contexto, melhor o roteiro. A geração final pode incluir passeios, restaurantes, agenda por dia e observações logísticas.",
    resultTitle: "Roteiro sugerido",
    resultPlaceholder:
      "Preencha os parâmetros ao lado para gerar um exemplo local de roteiro. Quando as chaves de API estiverem configuradas, a mesma interface poderá chamar Gemini, OpenAI ou um provider cloud.",
    generate: "Gerar roteiro",
    generating: "Gerando...",
    reset: "Limpar",
    fields: {
      destination: "Destino",
      destinations: "Múltiplos destinos (opcional)",
      days: "Duração em dias",
      style: "Estilo de viagem",
      budget: "Orçamento",
      travelers: "Quem vai",
      transportMode: "Como pretende se locomover",
      drivingComfort: "Conforto para dirigir",
      maxDailyCommuteMinutes: "Deslocamento máximo por dia (min)",
      multiDestinationStrategy: "Estratégia de rota",
      intercityTransportPreference: "Transporte entre cidades/países",
      fixedOrder: "Ordem dos destinos é obrigatória",
      pace: "Ritmo da viagem",
      avoidLongTransfers: "Evitar deslocamentos longos",
      interests: "Interesses",
      mustVisit: "Lugares obrigatórios",
      avoidAreas: "Áreas a evitar",
      notes: "Observações extras",
    },
    placeholders: {
      destination: "Ex.: Lisboa, Portugal",
      destinations: "Ex.: Lisboa, Porto, Madri, Barcelona",
      interests: "Museus, gastronomia, mirantes, praias...",
      mustVisit: "Ex.: Torre de Belém, Sagrada Família",
      avoidAreas: "Ex.: áreas com muita subida, regiões de balada",
      notes: "Preferências alimentares, mobilidade, horários, bairros desejados...",
    },
    styles: {
      family: "Família",
      friends: "Amigos",
      romantic: "Romântica",
      solo: "Solo",
      adventure: "Aventura",
      luxury: "Luxo",
    },
    budgets: {
      economy: "Econômico",
      moderate: "Moderado",
      premium: "Premium",
    },
    travelersOptions: {
      couple: "Casal",
      family: "Família com crianças",
      group: "Grupo de amigos",
      solo: "Viajante solo",
    },
    transportModes: {
      rental_car: "Carro alugado",
      public_transport: "Transporte público",
      walking: "A pé",
      mixed: "Misto",
    },
    drivingComfortOptions: {
      none: "Não vou dirigir",
      short_only: "Apenas trajetos curtos",
      long_drives_ok: "Tudo bem com trajetos longos",
    },
    multiDestinationStrategies: {
      hub_and_spoke: "Cidade-base com bate-volta",
      linear_route: "Rota linear (cidade A -> B -> C)",
      user_defined_order: "Seguir ordem exata informada",
    },
    intercityTransportOptions: {
      train: "Trem",
      flight: "Voo",
      bus: "Ônibus",
      car: "Carro",
      mixed: "Misto",
    },
    paceOptions: {
      slow: "Leve",
      balanced: "Equilibrado",
      fast: "Intenso",
    },
    footer:
      "Execução local primeiro. Próximo passo natural: persistir histórico, autenticar usuário e publicar em AWS com secrets por ambiente.",
    providerBadge: "Modo local",
    errors: {
      generic: "Não foi possível gerar o roteiro agora.",
    },
  },
  en: {
    eyebrow: "Smart travel planning",
    heroTitle: "Welcome, traveler.",
    heroSubtitle:
      "Describe the kind of journey you want and let AI build an itinerary with sightseeing, restaurants, daily pacing, and recommendations matched to your style.",
    heroStats: [
      { value: "3", label: "providers ready to orchestrate" },
      { value: "2", label: "interface languages" },
      { value: "AWS-ready", label: "easy to deploy later" },
    ],
    languageTitle: "Interface language",
    languageBody:
      "We start locally in Portuguese and English. Later we can add auth, database, and AWS deployment without rewriting the foundation.",
    providerTitle: "AI engine",
    providerBody:
      "Pick a provider for local testing. The API assembles a custom prompt from the traveler's parameters.",
    formTitle: "Build the trip brief",
    formBody:
      "The better the context, the better the itinerary. Final generation can include sightseeing, restaurants, day-by-day pacing, and logistics notes.",
    resultTitle: "Suggested itinerary",
    resultPlaceholder:
      "Fill in the parameters to generate a local sample itinerary. Once API keys are configured, the same interface can call Gemini, OpenAI, or a cloud provider.",
    generate: "Generate itinerary",
    generating: "Generating...",
    reset: "Reset",
    fields: {
      destination: "Destination",
      destinations: "Multiple destinations (optional)",
      days: "Trip length in days",
      style: "Travel style",
      budget: "Budget",
      travelers: "Travel party",
      transportMode: "How you plan to move around",
      drivingComfort: "Driving comfort",
      maxDailyCommuteMinutes: "Max daily commute (minutes)",
      multiDestinationStrategy: "Route strategy",
      intercityTransportPreference: "Intercity/international transport",
      fixedOrder: "Destination order is fixed",
      pace: "Trip pace",
      avoidLongTransfers: "Avoid long transfers",
      interests: "Interests",
      mustVisit: "Must-visit places",
      avoidAreas: "Areas to avoid",
      notes: "Extra notes",
    },
    placeholders: {
      destination: "Example: Lisbon, Portugal",
      destinations: "Example: Lisbon, Porto, Madrid, Barcelona",
      interests: "Museums, food, viewpoints, beaches...",
      mustVisit: "Example: Belem Tower, Sagrada Familia",
      avoidAreas: "Example: steep areas, heavy nightlife districts",
      notes: "Dietary restrictions, accessibility, preferred schedule, neighborhoods...",
    },
    styles: {
      family: "Family",
      friends: "Friends",
      romantic: "Romantic",
      solo: "Solo",
      adventure: "Adventure",
      luxury: "Luxury",
    },
    budgets: {
      economy: "Budget",
      moderate: "Moderate",
      premium: "Premium",
    },
    travelersOptions: {
      couple: "Couple",
      family: "Family with children",
      group: "Group of friends",
      solo: "Solo traveler",
    },
    transportModes: {
      rental_car: "Rental car",
      public_transport: "Public transport",
      walking: "Walking",
      mixed: "Mixed",
    },
    drivingComfortOptions: {
      none: "I will not drive",
      short_only: "Short drives only",
      long_drives_ok: "Long drives are fine",
    },
    multiDestinationStrategies: {
      hub_and_spoke: "Hub and spoke (base city + day trips)",
      linear_route: "Linear route (city A -> B -> C)",
      user_defined_order: "Follow the exact order provided",
    },
    intercityTransportOptions: {
      train: "Train",
      flight: "Flight",
      bus: "Bus",
      car: "Car",
      mixed: "Mixed",
    },
    paceOptions: {
      slow: "Slow",
      balanced: "Balanced",
      fast: "Fast",
    },
    footer:
      "Local execution first. Natural next step: persist history, authenticate users, and publish to AWS with per-environment secrets.",
    providerBadge: "Local mode",
    errors: {
      generic: "Could not generate the itinerary right now.",
    },
  },
} as const;

export type CopyBundle = (typeof copy)[AppLanguage];
