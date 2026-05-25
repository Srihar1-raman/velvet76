"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import TierSelector from "@/components/booking/TierSelector";
import ConfirmSheet from "@/components/booking/ConfirmSheet";
import { useBookingStore } from "@/lib/store";
import { ChevronLeft, MapPin, Calendar, Clock } from "lucide-react";
import { smartDayLabel, formatTimeDisplay } from "@/lib/utils";

const VelvetMap = dynamic(() => import("@/components/maps/VelvetMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "rgba(9, 8, 14, 0.9)",
        borderRadius: "var(--radius)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-soft)",
        fontSize: "0.82rem",
      }}
    >
      Loading map…
    </div>
  ),
});

type Step = "tier" | "confirm";

interface BookPageClientProps {
  mapsApiKey: string;
}

export default function BookPageClient({ mapsApiKey }: BookPageClientProps) {
  const { state, set } = useBookingStore();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("tier");
  const [routeLoaded, setRouteLoaded] = useState(false);
  const [tierError, setTierError] = useState("");

  // Sync URL params into store on mount
  useEffect(() => {
    const mode = searchParams.get("mode");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const sub = searchParams.get("sub");
    const terminal = searchParams.get("terminal");
    const pkg = searchParams.get("pkg");

    const update: Partial<typeof state> = {};
    if (mode) update.serviceType = mode as typeof state.serviceType;
    if (date) update.travelDate = date;
    if (time) update.travelTime = time;
    if (sub) update.airportSubType = sub as typeof state.airportSubType;
    if (terminal) update.airportTerminal = terminal;
    if (pkg) update.hourlyPackage = pkg as typeof state.hourlyPackage;

    if (Object.keys(update).length > 0) {
      set(update);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTierSelect = (tier: string) => {
    set({ selectedTier: tier as typeof state.selectedTier });
  };

  const handleRouteLoaded = (
    distanceKm: number,
    distanceText: string,
    durationMinutes: number,
    durationText: string
  ) => {
    set({ distanceKm, distanceText, durationMinutes, durationText });
    setRouteLoaded(true);
  };

  const mapOrigin =
    state.serviceType === "airport" && state.airportSubType === "arrival"
      ? state.airportTerminal
      : state.pickupAddress || state.pickupName;

  const mapDestination =
    state.serviceType === "airport" && state.airportSubType === "departure"
      ? state.airportTerminal
      : state.dropAddress || state.dropName;

  const summaryParts = [
    state.pickupName || state.pickupAddress,
    state.dropName || state.dropAddress,
  ].filter(Boolean);

  return (
    <div className="book-layout">
      <Header variant="book" />

      <div
        className="book-content"
        style={{ paddingTop: "80px" }}
      >
        {/* Map panel - desktop sticky left, mobile at top */}
        <div
          className="book-map-panel"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, padding: "1rem" }}>
            {mapsApiKey && (
              <VelvetMap
                apiKey={mapsApiKey}
                origin={mapOrigin}
                destination={mapDestination}
                onRouteLoaded={handleRouteLoaded}
              />
            )}
            {!mapsApiKey && (
              <div
                style={{
                  height: "100%",
                  background: "rgba(9, 8, 14, 0.9)",
                  borderRadius: "var(--radius)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-soft)",
                  fontSize: "0.82rem",
                  minHeight: "20rem",
                }}
              >
                Map requires a Google Maps API key.
              </div>
            )}
          </div>

          {/* Route summary below map */}
          {(state.pickupName || state.pickupAddress) && (
            <div
              style={{
                padding: "1rem",
                borderTop: "1px solid var(--line)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                }}
              >
                <MapPin size={12} style={{ color: "var(--gold)", flexShrink: 0 }} />
                <span className="truncate">{state.pickupName || state.pickupAddress}</span>
              </div>
              {(state.dropName || state.dropAddress) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                  }}
                >
                  <MapPin size={12} style={{ color: "var(--text-soft)", flexShrink: 0 }} />
                  <span className="truncate">{state.dropName || state.dropAddress}</span>
                </div>
              )}
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                {state.travelDate && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.78rem",
                      color: "var(--text-soft)",
                    }}
                  >
                    <Calendar size={11} />
                    {smartDayLabel(state.travelDate)}
                  </div>
                )}
                {state.travelTime && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.78rem",
                      color: "var(--text-soft)",
                    }}
                  >
                    <Clock size={11} />
                    {formatTimeDisplay(state.travelTime)}
                  </div>
                )}
                {state.distanceText && (
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-soft)",
                    }}
                  >
                    {state.distanceText}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form panel */}
        <div className="book-form-panel">
          {/* Back to search */}
          <a
            href="/reserve"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.82rem",
              color: "var(--text-soft)",
              textDecoration: "none",
            }}
          >
            <ChevronLeft size={14} />
            Modify search
          </a>

          {/* Step label */}
          <div>
            {step === "tier" ? (
              <>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "var(--gold)" }}
                >
                  Select your tier
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Choose the ride that fits your day.
                  {state.distanceText && (
                    <> · {state.distanceText}{state.durationText && ` · ${state.durationText}`}</>
                  )}
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep("tier")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.82rem",
                    color: "var(--text-soft)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    marginBottom: "0.5rem",
                  }}
                >
                  <ChevronLeft size={14} />
                  Back to tier selection
                </button>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "var(--gold)" }}
                >
                  Confirm booking
                </p>
              </>
            )}
          </div>

          {/* Tier selection */}
          {step === "tier" && (
            <>
              <TierSelector
                selectedTier={state.selectedTier}
                onSelect={handleTierSelect}
                serviceType={state.serviceType}
                distanceKm={state.distanceKm}
                hourlyPackage={state.hourlyPackage}
              />

              {tierError && (
                <p
                  role="alert"
                  className="text-sm"
                  style={{ color: "#f87171", margin: 0 }}
                >
                  {tierError}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!state.selectedTier) {
                    setTierError("Please select a tier to continue.");
                    return;
                  }
                  setTierError("");
                  setStep("confirm");
                }}
                className="btn btn-gold w-full"
                style={{ marginTop: "0.5rem" }}
              >
                Continue
              </button>
            </>
          )}

          {/* Confirmation */}
          {step === "confirm" && (
            <ConfirmSheet state={state} onBack={() => setStep("tier")} />
          )}
        </div>
      </div>

      {/* Mobile map at bottom */}
      <style>{`
        @media (max-width: 768px) {
          .book-content {
            grid-template-columns: 1fr !important;
          }
          .book-map-panel {
            position: static !important;
            height: 45vw !important;
            min-height: 16rem !important;
            max-height: 22rem !important;
          }
        }
      `}</style>
    </div>
  );
}
