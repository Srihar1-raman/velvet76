export interface PolicyPlace {
  place_id?: string;
  formatted_address?: string;
  name?: string;
  address_components?: Array<{
    long_name?: string;
    short_name?: string;
    types?: string[];
  }>;
}

export const SERVICE_AREA_ERROR =
  "Currently serving Delhi, Gurugram, and IGI Airport only.";

const BASE_MIN_HOURS = 3;
const LATE_NIGHT_HOUR = 22;

const AIRPORT_WORDS = ["igi", "indira gandhi", "airport", "terminal"];
const DELHI_WORDS = ["delhi", "new delhi", "nct"];
const GURUGRAM_WORDS = ["gurugram", "gurgaon", "ggn"];

function normalize(text: string) {
  return text.toLowerCase();
}

function flattenAddress(place: PolicyPlace): string {
  const parts = [
    place.formatted_address ?? "",
    place.name ?? "",
    ...(place.address_components ?? []).flatMap((c) => [
      c.long_name ?? "",
      c.short_name ?? "",
    ]),
  ];
  return normalize(parts.join(" "));
}

export function isServiceablePlace(place: PolicyPlace): boolean {
  const haystack = flattenAddress(place);
  return isServiceableText(haystack);
}

export function isServiceableText(text: string): boolean {
  const haystack = normalize(text);
  const isAirport = AIRPORT_WORDS.some((k) => haystack.includes(k));
  const isDelhi = DELHI_WORDS.some((k) => haystack.includes(k));
  const isGurugram = GURUGRAM_WORDS.some((k) => haystack.includes(k));
  return isAirport || isDelhi || isGurugram;
}

export function validateServiceArea(place: PolicyPlace): {
  ok: boolean;
  message: string;
} {
  if (!place.place_id) {
    return { ok: false, message: "Select a location from the suggestions." };
  }
  if (!isServiceablePlace(place)) {
    return { ok: false, message: SERVICE_AREA_ERROR };
  }
  return { ok: true, message: "" };
}

export function minimumLeadHours(
  now: Date,
  isAirportGurugramCase: boolean
): number {
  if (isAirportGurugramCase && now.getHours() >= LATE_NIGHT_HOUR) {
    return BASE_MIN_HOURS + 1;
  }
  return BASE_MIN_HOURS;
}

export function meetsLeadTimePolicy(
  travelDate: string,
  travelTime: string,
  context: { isAirportGurugramSubcase: boolean; now?: Date }
): { ok: boolean; minHours: number } {
  const now = context.now ?? new Date();
  const selected = new Date(`${travelDate}T${travelTime}:00`);
  if (Number.isNaN(selected.getTime()))
    return { ok: false, minHours: BASE_MIN_HOURS };
  const minHours = minimumLeadHours(now, context.isAirportGurugramSubcase);
  const diffMs = selected.getTime() - now.getTime();
  return { ok: diffMs >= minHours * 60 * 60 * 1000, minHours };
}

export function isAirportGurugramSubcase(
  pickup: string,
  drop: string
): boolean {
  const combined = normalize(`${pickup} ${drop}`);
  const hasAirport = AIRPORT_WORDS.some((k) => combined.includes(k));
  const hasGurugram = GURUGRAM_WORDS.some((k) => combined.includes(k));
  return hasAirport && hasGurugram;
}
