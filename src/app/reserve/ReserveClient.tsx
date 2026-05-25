"use client";

import dynamic from "next/dynamic";

const BookingIsland = dynamic(
  () => import("@/components/booking/BookingIsland"),
  { ssr: false }
);

interface ReserveClientProps {
  mapsApiKey: string;
}

export default function ReserveClient({ mapsApiKey }: ReserveClientProps) {
  return (
    <div className="reserve-layout">
      {/* Background */}
      <div className="reserve-bg" aria-hidden="true" />
      <div className="reserve-wash" aria-hidden="true" />

      {/* Content */}
      <div className="reserve-content">
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <p className="eyebrow" style={{ display: "inline-block" }}>
            Velvet Experience
          </p>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
              fontWeight: 400,
              lineHeight: 1.12,
              color: "var(--text)",
              marginTop: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            Reserve your ride.
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              maxWidth: "32rem",
              margin: "0 auto",
            }}
          >
            Airport transfers, point-to-point rides, and hourly bookings across
            Delhi NCR.
          </p>
        </div>

        <BookingIsland apiKey={mapsApiKey} alwaysExpanded />
      </div>
    </div>
  );
}
