import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function smartDayLabel(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function toDateInputString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getMinTime(dateStr: string): string {
  const today = toDateInputString(new Date());
  if (dateStr !== today) return "00:00";
  const now = new Date();
  now.setMinutes(now.getMinutes() + 180); // +3 hours
  now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0); // round up to next 30 min
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function getDefaultTime(dateStr: string): string {
  const today = toDateInputString(new Date());
  if (dateStr !== today) return "09:00";
  return getMinTime(dateStr);
}

export function formatPrice(price: number): string {
  return "\u20B9" + price.toLocaleString("en-IN");
}

export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m} min`;
  if (!m) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export function generate30MinSlots(from: string = "00:00"): string[] {
  const slots: string[] = [];
  const [fromH, fromM] = from.split(":").map(Number);
  const startMinutes = fromH * 60 + fromM;

  for (let i = 0; i < 48; i++) {
    const totalMins = i * 30;
    if (totalMins < startMinutes) continue;
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h >= 24) break;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}

export function formatTimeDisplay(time24: string): string {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}
