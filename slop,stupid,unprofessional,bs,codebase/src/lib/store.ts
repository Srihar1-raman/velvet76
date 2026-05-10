"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { z } from "zod";

const STORAGE_KEY = "velvet-booking-v1";

const SAFE_TEXT_MAX = 240;
const SAFE_PHONE_MAX = 20;
const SAFE_EMAIL_MAX = 120;
const SAFE_BOOKING_ID_MAX = 64;

const SAFE_TEXT_PATTERN = /^[^<>]*$/;

const safeText = (max: number) =>
  z
    .string()
    .max(max)
    .regex(SAFE_TEXT_PATTERN, "Disallowed characters in restored text");

const BookingStateSchema = z
  .object({
    serviceType: z.enum(["", "airport", "point-to-point", "hourly"]).catch(""),
    airportSubType: z.enum(["", "pickup", "drop"]).catch(""),
    pickupLocation: safeText(SAFE_TEXT_MAX).catch(""),
    dropLocation: safeText(SAFE_TEXT_MAX).catch(""),
    travelDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .or(z.literal(""))
      .catch(""),
    travelTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .or(z.literal(""))
      .catch(""),
    flightNumber: safeText(32).catch(""),
    hourlyPackage: z.enum(["", "4h40km", "6h60km", "8h80km"]).catch(""),
    passengerCount: z.number().int().min(0).max(20).catch(1),
    luggageCount: z.number().int().min(0).max(20).catch(0),
    bookingFor: z.enum(["me", "other"]).catch("me"),
    guestPhone: z.string().max(SAFE_PHONE_MAX).regex(/^[+\d\s\-()]*$/).catch(""),
    guestName: safeText(SAFE_TEXT_MAX).catch(""),
    phone: z.string().max(SAFE_PHONE_MAX).regex(/^[+\d\s\-()]*$/).catch(""),
    userName: safeText(SAFE_TEXT_MAX).catch(""),
    email: z.string().max(SAFE_EMAIL_MAX).catch(""),
    otpVerified: z.boolean().catch(false),
    selectedTier: z.enum(["", "vault", "premier", "elite"]).catch(""),
    distanceKm: z.number().min(0).max(2000).catch(0),
    distanceText: safeText(64).catch(""),
    durationMinutes: z.number().min(0).max(60 * 24).catch(0),
    durationText: safeText(64).catch(""),
    estimatedDropTime: safeText(64).catch(""),
    bookingId: z
      .string()
      .max(SAFE_BOOKING_ID_MAX)
      .regex(/^[A-Za-z0-9_-]*$/)
      .catch(""),
  })
  .strip();

const defaults: BookingState = {
  serviceType: "",
  airportSubType: "",
  pickupLocation: "",
  dropLocation: "",
  travelDate: "",
  travelTime: "",
  flightNumber: "",
  hourlyPackage: "",
  passengerCount: 1,
  luggageCount: 0,
  bookingFor: "me",
  guestPhone: "",
  guestName: "",
  phone: "",
  userName: "",
  email: "",
  otpVerified: false,
  selectedTier: "",
  distanceKm: 0,
  distanceText: "",
  durationMinutes: 0,
  durationText: "",
  estimatedDropTime: "",
  bookingId: "",
};

export interface BookingState {
  serviceType: string;
  airportSubType: string;
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  travelTime: string;
  flightNumber: string;
  hourlyPackage: string;
  passengerCount: number;
  luggageCount: number;
  bookingFor: string;
  guestPhone: string;
  guestName: string;
  phone: string;
  userName: string;
  email: string;
  otpVerified: boolean;
  selectedTier: string;
  distanceKm: number;
  distanceText: string;
  durationMinutes: number;
  durationText: string;
  estimatedDropTime: string;
  bookingId: string;
}

export function sanitizeBookingState(raw: unknown): BookingState {
  if (!raw || typeof raw !== "object") return { ...defaults };
  const merged = { ...defaults, ...(raw as Record<string, unknown>) };
  const result = BookingStateSchema.safeParse(merged);
  if (!result.success) {
    return { ...defaults };
  }
  return { ...defaults, ...(result.data as BookingState) };
}

function loadState(): BookingState {
  if (typeof window === "undefined") return { ...defaults };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaults };
    return sanitizeBookingState(JSON.parse(stored));
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    return { ...defaults };
  }
}

function saveState(state: BookingState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useVelvetStore() {
  const stateRef = useRef<BookingState>(loadState());
  const listeners = useRef(new Set<() => void>());

  const getState = useCallback(() => stateRef.current, []);
  const subscribe = useCallback((listener: () => void) => {
    listeners.current.add(listener);
    return () => listeners.current.delete(listener);
  }, []);

  useSyncExternalStore(subscribe, getState);

  const set = useCallback((partial: Partial<BookingState>) => {
    stateRef.current = { ...stateRef.current, ...partial };
    saveState(stateRef.current);
    listeners.current.forEach((l) => l());
  }, []);

  const reset = useCallback(() => {
    stateRef.current = { ...defaults };
    saveState(stateRef.current);
    listeners.current.forEach((l) => l());
  }, []);

  return { get state() { return stateRef.current; }, set, reset };
}

export const VEHICLE_TIERS = [
  { key: "vault", tier: "Velvet Vault", subtitle: "SUV Comfort", models: "BMW iX1 / Audi Q3", capacity: "Up to 3 passengers", luggage: "3 medium or 2 large" },
  { key: "premier", tier: "Velvet Premier", subtitle: "Business Class", models: "Mercedes C-Class / BMW 330Li", capacity: "Up to 3 passengers", luggage: "3 medium or 2 large" },
  { key: "elite", tier: "Velvet Elite", subtitle: "The Flagship", models: "Mercedes E-Class / BMW 5 Series", capacity: "Up to 3 passengers", luggage: "3 medium or 2 large" },
];

export const IGI_TERMINALS = [
  { label: "T1", value: "Terminal 1 (T1), IGI Airport, New Delhi" },
  { label: "T2", value: "Terminal 2 (T2), IGI Airport, New Delhi" },
  { label: "T3", value: "Terminal 3 (T3), IGI Airport, New Delhi" },
  { label: "Private Jet", value: "Private Jet Terminal, IGI Airport, New Delhi" },
];

export const TIER_CONSTRAINTS: Record<string, { maxPassengers: number; maxLuggage: number }> = {
  vault: { maxPassengers: 3, maxLuggage: 3 },
  premier: { maxPassengers: 2, maxLuggage: 2 },
  elite: { maxPassengers: 2, maxLuggage: 2 },
};

export const POINT_TO_POINT_RATES: Record<string, number> = { vault: 100, premier: 125, elite: 175 };

export const HOURLY_PACKAGES = [
  { key: "4h40km", label: "4 hrs / 40 km", hours: 4, km: 40, prices: { vault: 5000, premier: 6250, elite: 8500 } } as const,
  { key: "6h60km", label: "6 hrs / 60 km", hours: 6, km: 60, prices: { vault: 7500, premier: 9000, elite: 12000 } } as const,
  { key: "8h80km", label: "8 hrs / 80 km", hours: 8, km: 80, prices: { vault: 9000, premier: 12000, elite: 16000 } } as const,
];

export const MARKUP_FACTOR = 1.35;

export function getPointToPointPrice(tier: string, km: number): number {
  const rate = POINT_TO_POINT_RATES[tier] || 100;
  const minKm = Math.max(km || 0, 12);
  return Math.ceil((minKm * rate) / 100) * 100;
}

export function getHourlyPackagePrice(tier: string, packageKey: string): number {
  const pkg = HOURLY_PACKAGES.find((p) => p.key === packageKey);
  return pkg ? pkg.prices[tier as keyof typeof pkg.prices] || 0 : 0;
}

export function getStrikethroughPrice(actualPrice: number): number {
  return Math.ceil((actualPrice * MARKUP_FACTOR) / 100) * 100;
}

export function formatPrice(price: number): string {
  return "\u20B9" + price.toLocaleString("en-IN");
}

export function getParkingCharge(terminalValue: string): number {
  if (!terminalValue) return 0;
  if (terminalValue.includes("T3")) return 270;
  if (terminalValue.includes("T1") || terminalValue.includes("T2") || terminalValue.includes("Hindon") || terminalValue.includes("Jewar")) return 200;
  return 0;
}

if (typeof window !== "undefined") {
  const initial = loadState();
  (window as unknown as any).VelvetStore = {
    ...initial,
    load() { return this; },
    save() { saveState(initial); return this; },
    reset() { Object.assign(this, defaults); saveState(defaults); return this; },
    ...defaults,
    ...initial,
  };
}