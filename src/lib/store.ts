"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { z } from "zod";

const STORAGE_KEY = "velvet-booking-v2";

const SAFE_TEXT_MAX = 240;
const SAFE_PHONE_MAX = 20;
const SAFE_EMAIL_MAX = 120;

const SAFE_TEXT_PATTERN = /^[^<>]*$/;
const safeText = (max: number) =>
  z.string().max(max).regex(SAFE_TEXT_PATTERN).catch("");

const Schema = z
  .object({
    serviceType: z
      .enum(["", "airport", "point-to-point", "hourly"])
      .catch(""),
    airportSubType: z.enum(["", "arrival", "departure"]).catch(""),
    airportTerminal: safeText(SAFE_TEXT_MAX),
    pickupName: safeText(SAFE_TEXT_MAX),
    pickupAddress: safeText(SAFE_TEXT_MAX),
    pickupPlaceId: safeText(64),
    dropName: safeText(SAFE_TEXT_MAX),
    dropAddress: safeText(SAFE_TEXT_MAX),
    dropPlaceId: safeText(64),
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
    flightNumber: safeText(32),
    hourlyPackage: z
      .enum(["", "4h40km", "6h60km", "8h80km", "10h100km"])
      .catch(""),
    selectedTier: z.enum(["", "vault", "premier", "elite"]).catch(""),
    distanceKm: z.number().min(0).max(2000).catch(0),
    distanceText: safeText(64),
    durationMinutes: z.number().min(0).max(1440).catch(0),
    durationText: safeText(64),
    estimatedDropTime: safeText(64),
    userName: safeText(SAFE_TEXT_MAX),
    phone: z
      .string()
      .max(SAFE_PHONE_MAX)
      .regex(/^[+\d\s\-()\s]*$/)
      .catch(""),
    email: z.string().max(SAFE_EMAIL_MAX).catch(""),
  })
  .strip();

type BookingState = z.infer<typeof Schema>;

const defaults: BookingState = {
  serviceType: "",
  airportSubType: "",
  airportTerminal: "",
  pickupName: "",
  pickupAddress: "",
  pickupPlaceId: "",
  dropName: "",
  dropAddress: "",
  dropPlaceId: "",
  travelDate: "",
  travelTime: "",
  flightNumber: "",
  hourlyPackage: "",
  selectedTier: "",
  distanceKm: 0,
  distanceText: "",
  durationMinutes: 0,
  durationText: "",
  estimatedDropTime: "",
  userName: "",
  phone: "",
  email: "",
};

export type { BookingState };
export { defaults };

function sanitize(raw: unknown): BookingState {
  if (!raw || typeof raw !== "object") return { ...defaults };
  const merged = { ...defaults, ...(raw as Record<string, unknown>) };
  const result = Schema.safeParse(merged);
  return result.success ? { ...defaults, ...result.data } : { ...defaults };
}

function loadState(): BookingState {
  if (typeof window === "undefined") return { ...defaults };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaults };
    return sanitize(JSON.parse(stored));
  } catch {
    return { ...defaults };
  }
}

function saveState(state: BookingState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// Singleton store outside React for cross-component access
let _state = loadState();
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((l) => l());
}

export const bookingStore = {
  get(): BookingState {
    return _state;
  },
  set(partial: Partial<BookingState>): void {
    _state = { ..._state, ...partial };
    saveState(_state);
    notify();
  },
  reset(): void {
    _state = { ...defaults };
    saveState(_state);
    notify();
  },
  subscribe(listener: () => void): () => void {
    _listeners.add(listener);
    return () => _listeners.delete(listener);
  },
};

export function useBookingStore() {
  const get = useCallback(() => bookingStore.get(), []);
  const subscribe = useCallback(
    (cb: () => void) => bookingStore.subscribe(cb),
    []
  );
  const state = useSyncExternalStore(subscribe, get, () => defaults);

  const set = useCallback((partial: Partial<BookingState>) => {
    bookingStore.set(partial);
  }, []);

  const reset = useCallback(() => {
    bookingStore.reset();
  }, []);

  return { state, set, reset };
}
