import { describe, expect, it } from "vitest";
import {
  isAirportGurugramSubcase,
  isServiceablePlace,
  isServiceableText,
  meetsLeadTimePolicy,
  minimumLeadHours,
  validateServiceArea,
} from "./bookingPolicy";
import { sanitizeBookingState } from "./store";

const HOUR = 60 * 60 * 1000;

function makeNow(hour = 12, minute = 0): Date {
  const now = new Date("2026-06-01T00:00:00.000Z");
  now.setHours(hour, minute, 0, 0);
  return now;
}

function relativeIso(now: Date, deltaMs: number): { date: string; time: string } {
  const target = new Date(now.getTime() + deltaMs);
  const date = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(target.getDate()).padStart(2, "0")}`;
  const time = `${String(target.getHours()).padStart(2, "0")}:${String(target.getMinutes()).padStart(2, "0")}`;
  return { date, time };
}

describe("service area allowlist", () => {
  it("accepts Gurugram coords (case 1: valid service area)", () => {
    expect(
      isServiceablePlace({
        place_id: "ChIJ_GurugramTest",
        formatted_address: "Cyber Hub, Gurugram, Haryana, India",
      })
    ).toBe(true);
  });

  it("rejects Chandigarh coords (case 2: outside service area)", () => {
    expect(
      isServiceablePlace({
        place_id: "ChIJ_ChandigarhTest",
        formatted_address: "Sector 17, Chandigarh, India",
      })
    ).toBe(false);
  });

  it("validateServiceArea requires a place_id", () => {
    const result = validateServiceArea({ formatted_address: "Gurugram" });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/Select a location/);
  });

  it("validateServiceArea passes for IGI airport", () => {
    expect(
      validateServiceArea({
        place_id: "ChIJ_AirportTest",
        formatted_address: "IGI Airport Terminal 3, New Delhi",
      }).ok
    ).toBe(true);
  });

  it("isServiceableText short-circuits on Delhi keywords", () => {
    expect(isServiceableText("New Delhi, India")).toBe(true);
    expect(isServiceableText("London, UK")).toBe(false);
  });
});

describe("lead time policy", () => {
  const now = makeNow(12, 0);

  it("accepts +3h lead time (case 3: baseline)", () => {
    const { date, time } = relativeIso(now, 3 * HOUR);
    const result = meetsLeadTimePolicy(date, time, {
      isAirportGurugramSubcase: false,
      now,
    });
    expect(result.ok).toBe(true);
    expect(result.minHours).toBe(3);
  });

  it("rejects +2h lead time (case 4: under baseline)", () => {
    const { date, time } = relativeIso(now, 2 * HOUR);
    const result = meetsLeadTimePolicy(date, time, {
      isAirportGurugramSubcase: false,
      now,
    });
    expect(result.ok).toBe(false);
  });

  it("late-night airport+Gurugram with +4h lead is accepted (case 5)", () => {
    const lateNight = makeNow(23, 30);
    const { date, time } = relativeIso(lateNight, 4 * HOUR);
    const result = meetsLeadTimePolicy(date, time, {
      isAirportGurugramSubcase: true,
      now: lateNight,
    });
    expect(result.ok).toBe(true);
    expect(result.minHours).toBe(4);
  });

  it("late-night airport+Gurugram with only +3h lead is rejected (case 6)", () => {
    const lateNight = makeNow(23, 30);
    const { date, time } = relativeIso(lateNight, 3 * HOUR);
    const result = meetsLeadTimePolicy(date, time, {
      isAirportGurugramSubcase: true,
      now: lateNight,
    });
    expect(result.ok).toBe(false);
    expect(result.minHours).toBe(4);
  });

  it("minimumLeadHours uses 4h only for late-night airport-Gurugram", () => {
    expect(
      minimumLeadHours(makeNow(23, 30), true)
    ).toBe(4);
    expect(
      minimumLeadHours(makeNow(23, 30), false)
    ).toBe(3);
    expect(
      minimumLeadHours(makeNow(10, 0), true)
    ).toBe(3);
  });

  it("isAirportGurugramSubcase identifies the late-night route", () => {
    expect(
      isAirportGurugramSubcase(
        "Terminal 3, IGI Airport, New Delhi",
        "Cyber Hub, Gurugram"
      )
    ).toBe(true);
    expect(
      isAirportGurugramSubcase("Connaught Place, New Delhi", "Saket, New Delhi")
    ).toBe(false);
  });
});

describe("localStorage state sanitization", () => {
  it("rejects tampered service area and clears the value (case 7)", () => {
    const tampered = {
      serviceType: "airport",
      pickupLocation: "Some pickup",
      dropLocation: "Some drop",
      bookingId: "abc-123",
      bogusField: "should not survive",
    };
    const sanitized = sanitizeBookingState(tampered);
    expect(sanitized.serviceType).toBe("airport");
    expect(sanitized.pickupLocation).toBe("Some pickup");
    expect(sanitized.dropLocation).toBe("Some drop");
    expect(sanitized.bookingId).toBe("abc-123");
  });

  it("strips angle-bracket content from address fields (case 8: XSS in address)", () => {
    const malicious = {
      pickupLocation: "<script>alert(1)</script>",
      dropLocation: "Cyber Hub <img onerror=x>",
      userName: "<svg/onload=alert(2)>",
    };
    const sanitized = sanitizeBookingState(malicious);
    expect(sanitized.pickupLocation).toBe("");
    expect(sanitized.dropLocation).toBe("");
    expect(sanitized.userName).toBe("");
  });

  it("clamps numeric fields out of range", () => {
    const wild = {
      passengerCount: 9999,
      luggageCount: -5,
      distanceKm: 1e9,
      durationMinutes: -1,
    };
    const sanitized = sanitizeBookingState(wild);
    expect(sanitized.passengerCount).toBe(1);
    expect(sanitized.luggageCount).toBe(0);
    expect(sanitized.distanceKm).toBe(0);
    expect(sanitized.durationMinutes).toBe(0);
  });

  it("falls back to defaults for non-object input", () => {
    expect(sanitizeBookingState(null).serviceType).toBe("");
    expect(sanitizeBookingState("hax").serviceType).toBe("");
    expect(sanitizeBookingState(42).serviceType).toBe("");
  });
});
