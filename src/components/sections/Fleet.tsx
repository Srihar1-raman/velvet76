"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { fleetTiers } from "@/lib/data";

// Tier order: vault (0), premier (1), elite (2)
const TIERS = fleetTiers;

export default function Fleet() {
  const [activeTier, setActiveTier] = useState(2); // Elite by default (center)
  const [activeCar, setActiveCar] = useState(0);
  const ambientRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTier = TIERS[activeTier];
  const currentCar = currentTier.cars[activeCar];

  const updateAmbient = useCallback((tierIndex: number) => {
    if (!ambientRef.current) return;
    const tier = TIERS[tierIndex];
    ambientRef.current.style.background = `radial-gradient(ellipse 70% 50% at 50% 60%, ${tier.accentGlow}, transparent 70%)`;
  }, []);

  const selectTier = useCallback((idx: number) => {
    setActiveTier(idx);
    setActiveCar(0);
    updateAmbient(idx);
    // Reset auto timer on manual interaction
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(startAutoPlay, 4000);
  }, [updateAmbient]);

  const startAutoPlay = useCallback(() => {
    autoTimerRef.current = setTimeout(() => {
      setActiveTier((prev) => {
        const next = (prev + 1) % TIERS.length;
        setActiveCar(0);
        updateAmbient(next);
        return next;
      });
      startAutoPlay();
    }, 4000);
  }, [updateAmbient]);

  useEffect(() => {
    updateAmbient(activeTier);
    startAutoPlay();
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      className="fleet-tiers section-pad"
      id="fleet"
      aria-label="Choose the mood"
    >
      {/* Header */}
      <div className="fleet-tiers__header">
        <div>
          <p className="eyebrow">Choose the mood</p>
          <h2 className="section-title split-heading">
            Three tiers. One standard.
          </h2>
        </div>
        <p>
          Every vehicle is sourced to match a specific kind of day. Select the
          tier that fits.
        </p>
      </div>

      {/* Stage */}
      <div className="fleet-stage">
        {/* Tier tabs */}
        <div
          className="fleet-tier-tabs"
          data-active={activeTier}
          role="tablist"
          aria-label="Fleet tiers"
        >
          {TIERS.map((tier, i) => (
            <button
              key={tier.key}
              type="button"
              className="fleet-tier-btn"
              data-active={String(activeTier === i)}
              role="tab"
              aria-selected={activeTier === i}
              onClick={() => selectTier(i)}
            >
              <span className="fleet-tier-eyebrow">{tier.eyebrow}</span>
              <span className="fleet-tier-name">{tier.name.replace("Velvet ", "")}</span>
            </button>
          ))}
        </div>

        {/* Car display */}
        <div style={{ position: "relative", width: "min(100%, 68rem)" }}>
          {/* Ambient glow */}
          <div
            ref={ambientRef}
            className="fleet-ambient"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "50%",
              filter: "blur(80px)",
              opacity: 0.7,
            }}
          />

          {/* Car image */}
          <div className="fleet-car-display">
            {/* Car model switcher - left side */}
            <div
              className="fleet-car-switch"
              style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}
            >
              {currentTier.cars.map((car, i) => (
                <button
                  key={car.model}
                  type="button"
                  className={`fleet-car-btn ${activeCar === i ? "is-active" : ""}`}
                  onClick={() => {
                    setActiveCar(i);
                    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
                    autoTimerRef.current = setTimeout(startAutoPlay, 4000);
                  }}
                >
                  {car.model}
                </button>
              ))}
            </div>

            {/* Main car image */}
            <Image
              ref={carRef}
              key={`${currentTier.key}-${activeCar}`}
              src={currentCar.image}
              alt={currentCar.model}
              width={900}
              height={500}
              className="fleet-car-img"
              style={{
                animation: "fleetCarFadeIn 500ms ease both",
              }}
              priority={activeTier === 2}
              sizes="(max-width: 768px) 100vw, 68rem"
            />
          </div>
        </div>

        {/* Details */}
        <div className="fleet-details">
          <p className="fleet-models">
            {currentTier.cars.map((c) => c.model).join("  ·  ")}
          </p>
          <p className="fleet-points">
            {currentTier.points.join("  ·  ")}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fleetCarFadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
}
