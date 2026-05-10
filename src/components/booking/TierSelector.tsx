"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { fleetTiers, HOURLY_PACKAGES, getPointToPointPrice, getHourlyPackagePrice, getStrikethroughPrice } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

interface TierSelectorProps {
  selectedTier: string;
  onSelect: (tier: string) => void;
  serviceType: string;
  distanceKm?: number;
  hourlyPackage?: string;
}

export default function TierSelector({
  selectedTier,
  onSelect,
  serviceType,
  distanceKm = 0,
  hourlyPackage = "4h40km",
}: TierSelectorProps) {
  const getPrice = (tierKey: string): { actual: number; strike: number } => {
    let actual = 0;
    if (serviceType === "hourly") {
      actual = getHourlyPackagePrice(tierKey, hourlyPackage);
    } else {
      actual = getPointToPointPrice(tierKey, distanceKm);
    }
    return { actual, strike: getStrikethroughPrice(actual) };
  };

  const orderedTiers = ["vault", "premier", "elite"].map(
    (k) => fleetTiers.find((t) => t.key === k)!
  ).filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      {orderedTiers.map((tier) => {
        const { actual, strike } = getPrice(tier.key);
        const isSelected = selectedTier === tier.key;

        return (
          <button
            key={tier.key}
            type="button"
            onClick={() => onSelect(tier.key)}
            className={`tier-card text-left transition-all`}
            aria-pressed={isSelected}
          >
            <div className="flex items-center gap-3">
              {/* Car image */}
              <div
                style={{
                  width: "5rem",
                  height: "3.5rem",
                  flexShrink: 0,
                  position: "relative",
                  borderRadius: "6px",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {tier.cars[0] && (
                  <Image
                    src={tier.cars[0].image}
                    alt={tier.cars[0].model}
                    fill
                    style={{ objectFit: "contain", objectPosition: "center" }}
                    sizes="80px"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-0.5"
                      style={{ color: "var(--gold)", opacity: 0.85 }}
                    >
                      {tier.eyebrow}
                    </p>
                    <p
                      className="font-medium"
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "1.05rem",
                        color: "var(--text)",
                        lineHeight: 1.2,
                      }}
                    >
                      {tier.name}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {tier.cars.map((c) => c.model).join(" / ")}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    {actual > 0 && (
                      <>
                        <p
                          className="text-xs line-through mb-0.5"
                          style={{ color: "var(--text-soft)" }}
                        >
                          {formatPrice(strike)}
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: "var(--gold)", fontSize: "1rem" }}
                        >
                          {formatPrice(actual)}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Points */}
                <div className="flex flex-wrap gap-x-3 mt-2">
                  {tier.points.map((pt) => (
                    <span
                      key={pt}
                      className="text-xs"
                      style={{ color: "var(--text-soft)" }}
                    >
                      {pt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selected check */}
              <div
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: isSelected ? "var(--gold)" : "transparent",
                  border: `2px solid ${isSelected ? "var(--gold)" : "rgba(255,255,255,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 200ms, border-color 200ms",
                }}
              >
                {isSelected && <Check size={10} color="#09080d" strokeWidth={3} />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
