"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useBookingStore } from "@/lib/store";
import { IGI_TERMINALS, HOURLY_PACKAGES } from "@/lib/data";
import {
  isAirportGurugramSubcase,
  meetsLeadTimePolicy,
} from "@/lib/booking-policy";
import { toDateInputString, getDefaultTime, smartDayLabel, formatTimeDisplay } from "@/lib/utils";
import LocationInput from "./LocationInput";
import type { PlaceResult } from "./LocationInput";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";

type ServiceMode = "point-to-point" | "airport" | "hourly";
type AirportSubType = "arrival" | "departure";

interface BookingIslandProps {
  apiKey: string;
  /** If true the island is always expanded (reserve page) */
  alwaysExpanded?: boolean;
}

export default function BookingIsland({
  apiKey,
  alwaysExpanded = false,
}: BookingIslandProps) {
  const router = useRouter();
  const { state, set } = useBookingStore();

  const [mode, setMode] = useState<ServiceMode>(
    (state.serviceType as ServiceMode) || "point-to-point"
  );
  const [airportSub, setAirportSub] = useState<AirportSubType>(
    (state.airportSubType as AirportSubType) || "arrival"
  );
  const [terminal, setTerminal] = useState(
    state.airportTerminal || IGI_TERMINALS[2].value // T3 default
  );
  const [date, setDate] = useState(state.travelDate || "");
  const [time, setTime] = useState(state.travelTime || "");
  const [hourlyPkg, setHourlyPkg] = useState(
    state.hourlyPackage || HOURLY_PACKAGES[0].key
  );
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(alwaysExpanded);

  const cardRef = useRef<HTMLDivElement>(null);

  // Listen for expand event from header "Reserve now" click
  useEffect(() => {
    const el = document.getElementById("booking-island");
    if (!el) return;
    const handler = () => setExpanded(true);
    el.addEventListener("velvet:expand-booking", handler);
    return () => el.removeEventListener("velvet:expand-booking", handler);
  }, []);

  const handleModeChange = (m: ServiceMode) => {
    setMode(m);
    setError("");
    set({ serviceType: m });
    if (!expanded) setExpanded(true);
  };

  const handlePickupSelect = (result: PlaceResult) => {
    set({
      pickupName: result.name,
      pickupAddress: result.address,
      pickupPlaceId: result.placeId,
    });
  };

  const handleDropSelect = (result: PlaceResult) => {
    set({
      dropName: result.name,
      dropAddress: result.address,
      dropPlaceId: result.placeId,
    });
  };

  const handleDateChange = (d: string) => {
    setDate(d);
    set({ travelDate: d });
    // Reset time if it's now invalid for the new date
    const newMin = getDefaultTime(d);
    if (!time || time < newMin) {
      setTime(newMin);
      set({ travelTime: newMin });
    }
  };

  const handleTimeChange = (t: string) => {
    setTime(t);
    set({ travelTime: t });
  };

  const pickupLabel = (() => {
    if (mode !== "airport") return "Pickup location";
    return airportSub === "arrival" ? "Airport terminal" : "Pickup location";
  })();

  const dropLabel = (() => {
    if (mode !== "airport") return "Drop-off location";
    return airportSub === "arrival" ? "Drop-off location" : "Airport terminal";
  })();

  const handleSubmit = () => {
    setError("");
    if (!date || !time) {
      setError("Please select a date and time.");
      return;
    }

    const pickup = state.pickupName || state.pickupAddress;
    const drop = state.dropName || state.dropAddress;

    if (mode !== "hourly" && (!pickup || !drop)) {
      setError("Please enter pickup and drop-off locations.");
      return;
    }

    if (mode === "hourly" && !pickup) {
      setError("Please enter a pickup location.");
      return;
    }

    const isAGSub = isAirportGurugramSubcase(
      state.pickupAddress,
      state.dropAddress
    );
    const leadCheck = meetsLeadTimePolicy(date, time, {
      isAirportGurugramSubcase: isAGSub,
    });

    if (!leadCheck.ok) {
      setError(
        `Please book at least ${leadCheck.minHours} hours in advance.`
      );
      return;
    }

    // Save everything to store
    set({
      serviceType: mode,
      airportSubType: airportSub,
      airportTerminal: mode === "airport" ? terminal : "",
      travelDate: date,
      travelTime: time,
      hourlyPackage: (mode === "hourly" ? hourlyPkg : "") as typeof state.hourlyPackage,
    });

    const params = new URLSearchParams({
      mode,
      date,
      time,
      ...(mode === "airport" && { sub: airportSub, terminal }),
      ...(mode === "hourly" && { pkg: hourlyPkg }),
    });

    router.push(`/book?${params.toString()}`);
  };

  const collapsedSummary = (() => {
    const parts: string[] = [];
    if (state.pickupName) parts.push(state.pickupName);
    if (state.dropName) parts.push(state.dropName);
    if (date) parts.push(smartDayLabel(date) || date);
    if (time) parts.push(formatTimeDisplay(time));
    if (parts.length === 0) return "Where are you going?";
    return parts.join("  ·  ");
  })();

  return (
    <div id="booking-island" className="booking-island">
      {/* Mode tabs */}
      <div className="booking-modes-row">
        {(
          [
            { key: "airport", label: "Airport transfer" },
            { key: "point-to-point", label: "One-way" },
            { key: "hourly", label: "By the hour" },
          ] as { key: ServiceMode; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`booking-mode-btn ${mode === key ? "is-active" : ""}`}
            onClick={() => handleModeChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Booking card */}
      <div ref={cardRef} className="booking-card">
        {/* Collapsed row - tap to expand */}
        {!expanded && (
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 text-left"
            onClick={() => setExpanded(true)}
          >
            <span className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
              {collapsedSummary}
            </span>
            <ChevronDown size={16} style={{ color: "var(--gold)", flexShrink: 0, marginLeft: "0.5rem" }} />
          </button>
        )}

        {/* Expanded form */}
        {expanded && (
          <>
            {/* Airport sub-controls */}
            {mode === "airport" && (
              <div className="airport-controls">
                <div className="airport-toggle-row">
                  <button
                    type="button"
                    className={`airport-toggle-btn ${airportSub === "arrival" ? "is-active" : ""}`}
                    onClick={() => setAirportSub("arrival")}
                  >
                    Arrival
                  </button>
                  <button
                    type="button"
                    className={`airport-toggle-btn ${airportSub === "departure" ? "is-active" : ""}`}
                    onClick={() => setAirportSub("departure")}
                  >
                    Departure
                  </button>
                </div>
                <div className="airport-toggle-row">
                  {IGI_TERMINALS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`airport-toggle-btn ${terminal === t.value ? "is-active" : ""}`}
                      onClick={() => setTerminal(t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hourly package selector */}
            {mode === "hourly" && (
              <div className="airport-controls">
                <div className="airport-toggle-row">
                  {HOURLY_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.key}
                      type="button"
                      className={`airport-toggle-btn ${hourlyPkg === pkg.key ? "is-active" : ""}`}
                      onClick={() => setHourlyPkg(pkg.key)}
                    >
                      {pkg.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main fields */}
            <div className="booking-fields-wrap">
              <div
                className="booking-fields-grid"
                style={{
                  gridTemplateColumns:
                    mode === "hourly"
                      ? "repeat(3, minmax(0,1fr))"
                      : "repeat(4, minmax(0,1fr)) auto",
                }}
              >
                {/* Pickup */}
                <LocationInput
                  label={pickupLabel}
                  placeholder="Hotel, landmark, area…"
                  value={state.pickupName || state.pickupAddress}
                  onSelect={handlePickupSelect}
                  apiKey={apiKey}
                />

                {/* Drop-off (not for hourly) */}
                {mode !== "hourly" && (
                  <LocationInput
                    label={dropLabel}
                    placeholder="Hotel, landmark, area…"
                    value={state.dropName || state.dropAddress}
                    onSelect={handleDropSelect}
                    apiKey={apiKey}
                  />
                )}

                {/* Date */}
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={handleDateChange}
                />

                {/* Time */}
                <TimePicker
                  label="Pickup time"
                  value={time}
                  date={date || toDateInputString(new Date())}
                  onChange={handleTimeChange}
                />

                {/* Submit button */}
                <div className="booking-field" style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    type="button"
                    className="booking-search-btn"
                    onClick={handleSubmit}
                  >
                    View options
                  </button>
                </div>
              </div>

              {error && (
                <p
                  className="text-sm"
                  role="alert"
                  style={{ color: "#f87171", margin: 0 }}
                >
                  {error}
                </p>
              )}
            </div>
          </>
        )}

        <p className="booking-quote">
          Every mile, unmistakably <span>Velvet</span>.
        </p>
      </div>
    </div>
  );
}
