import type { AppLanguage } from "@/lib/copy";

export type LlmProvider = "openai" | "gemini" | "cloud";
export type TransportMode = "rental_car" | "public_transport" | "walking" | "mixed";
export type DrivingComfort = "none" | "short_only" | "long_drives_ok";
export type RouteStrategy = "hub_and_spoke" | "linear_route" | "user_defined_order";
export type IntercityTransport = "train" | "flight" | "bus" | "car" | "mixed";
export type TravelPace = "slow" | "balanced" | "fast";

export type TravelFormValues = {
  destination: string;
  destinations: string;
  days: number;
  style: string;
  budget: string;
  travelers: string;
  transportMode: TransportMode;
  drivingComfort: DrivingComfort;
  maxDailyCommuteMinutes: number;
  multiDestinationStrategy: RouteStrategy;
  intercityTransportPreference: IntercityTransport;
  fixedOrder: boolean;
  pace: TravelPace;
  avoidLongTransfers: boolean;
  interests: string;
  mustVisit: string;
  avoidAreas: string;
  notes: string;
  language: AppLanguage;
  provider: LlmProvider;
};

export type ItineraryResponse = {
  provider: LlmProvider;
  prompt: string;
  itinerary: string;
  mode: "mock" | "live";
};
