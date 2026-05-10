"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { buildWhatsappMessage, whatsappSendUrl } from "@/lib/whatsapp";
import type { BookingState } from "@/lib/store";
import { fleetTiers } from "@/lib/data";
import { smartDayLabel, formatTimeDisplay } from "@/lib/utils";

interface ConfirmSheetProps {
  state: BookingState;
  onBack?: () => void;
}

export default function ConfirmSheet({ state, onBack }: ConfirmSheetProps) {
  const [consented, setConsented] = useState(false);
  const [sent, setSent] = useState(false);

  const tier = fleetTiers.find((t) => t.key === state.selectedTier);

  const handleSend = () => {
    if (!consented) return;

    const msg = buildWhatsappMessage({
      serviceType: state.serviceType,
      airportSubType: state.airportSubType,
      pickupName: state.pickupName,
      pickupAddress: state.pickupAddress,
      dropName: state.dropName,
      dropAddress: state.dropAddress,
      travelDate: state.travelDate,
      travelTime: state.travelTime,
      selectedTier: state.selectedTier,
      distanceText: state.distanceText,
      durationText: state.durationText,
      hourlyPackage: state.hourlyPackage,
    });

    window.open(whatsappSendUrl(msg), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            background: "rgba(216,184,90,0.15)",
            border: "1.5px solid var(--gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send size={18} style={{ color: "var(--gold)" }} />
        </div>
        <div>
          <p
            className="font-medium text-sm"
            style={{ color: "var(--text)", marginBottom: "0.35rem" }}
          >
            Request sent on WhatsApp
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            The Velvet team will confirm your booking shortly.
          </p>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs"
            style={{ color: "var(--text-soft)", background: "none", border: "none", cursor: "pointer" }}
          >
            Make another booking
          </button>
        )}
      </div>
    );
  }

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.68rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--text-soft)",
    fontWeight: 600,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "0.9rem",
    color: "var(--text)",
    fontWeight: 500,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Summary card */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--gold)" }}
        >
          Booking summary
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div style={fieldStyle}>
            <span style={labelStyle}>Service</span>
            <span style={valueStyle}>
              {state.serviceType === "airport"
                ? "Airport transfer"
                : state.serviceType === "hourly"
                ? "Hourly rental"
                : "Point to point"}
            </span>
          </div>

          {tier && (
            <div style={fieldStyle}>
              <span style={labelStyle}>Tier</span>
              <span style={valueStyle}>{tier.name}</span>
            </div>
          )}

          <div style={fieldStyle}>
            <span style={labelStyle}>Pickup</span>
            <span style={valueStyle}>
              {state.pickupName || state.pickupAddress || "—"}
            </span>
          </div>

          {state.dropName || state.dropAddress ? (
            <div style={fieldStyle}>
              <span style={labelStyle}>Drop-off</span>
              <span style={valueStyle}>
                {state.dropName || state.dropAddress}
              </span>
            </div>
          ) : null}

          <div style={fieldStyle}>
            <span style={labelStyle}>Date</span>
            <span style={valueStyle}>
              {state.travelDate
                ? `${smartDayLabel(state.travelDate)}, ${state.travelDate}`
                : "—"}
            </span>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>Time</span>
            <span style={valueStyle}>
              {state.travelTime ? formatTimeDisplay(state.travelTime) : "—"}
            </span>
          </div>

          {state.distanceText && (
            <div style={fieldStyle}>
              <span style={labelStyle}>Distance</span>
              <span style={valueStyle}>{state.distanceText}</span>
            </div>
          )}

          {state.durationText && (
            <div style={fieldStyle}>
              <span style={labelStyle}>Duration</span>
              <span style={valueStyle}>{state.durationText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Consent checkbox — must be checked to enable send */}
      <label
        className="flex items-start gap-3 cursor-pointer select-none"
        style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}
      >
        <div
          style={{
            width: "1.1rem",
            height: "1.1rem",
            borderRadius: "4px",
            border: `1.5px solid ${consented ? "var(--gold)" : "rgba(255,255,255,0.3)"}`,
            background: consented ? "var(--gold)" : "transparent",
            flexShrink: 0,
            marginTop: "0.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 150ms, border-color 150ms",
          }}
          onClick={() => setConsented((c) => !c)}
          role="checkbox"
          aria-checked={consented}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") setConsented((c) => !c);
          }}
        >
          {consented && (
            <svg
              width="8"
              height="6"
              viewBox="0 0 8 6"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 3L3 5L7 1"
                stroke="#09080d"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span>
          I understand that this will open WhatsApp to send a booking request
          to Velvet. My ride will be confirmed by the team after they respond.
        </span>
      </label>

      {/* Send button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!consented}
        className="btn btn-gold w-full flex items-center justify-center gap-2"
        style={{
          opacity: consented ? 1 : 0.4,
          cursor: consented ? "pointer" : "not-allowed",
          fontSize: "0.95rem",
        }}
        aria-disabled={!consented}
      >
        <Send size={15} />
        Send request on WhatsApp
      </button>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-center w-full"
          style={{ color: "var(--text-soft)", background: "none", border: "none", cursor: "pointer" }}
        >
          Back to tier selection
        </button>
      )}
    </div>
  );
}
