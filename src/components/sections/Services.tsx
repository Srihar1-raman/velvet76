"use client";

import Image from "next/image";
import { services } from "@/lib/data";

export default function Services() {
  const handleServiceClick = (mode: string) => {
    const island = document.getElementById("booking-island");
    if (island) {
      island.dispatchEvent(new CustomEvent("velvet:expand-booking"));
      island.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // The booking island will handle mode setting via the store
    import("@/lib/store").then(({ bookingStore }) => {
      bookingStore.set({ serviceType: mode as "airport" | "point-to-point" | "hourly" });
    });
  };

  return (
    <section
      className="services section-pad"
      id="services"
      aria-label="Our services"
    >
      <div className="section-head">
        <p className="eyebrow">What we offer</p>
        <h2 className="section-title split-heading">Three ways to ride.</h2>
      </div>

      <div className="service-grid" role="list">
        {services.map((service, i) => (
          <div
            key={service.name}
            role="listitem"
            className="service-item service-capsule"
            tabIndex={0}
            onClick={() => handleServiceClick(service.mode)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleServiceClick(service.mode);
              }
            }}
            aria-label={`Select ${service.name} service`}
          >
            <div>
              <Image
                src={service.image}
                alt={service.name}
                width={316}
                height={198}
                style={{
                  width: "100%",
                  height: "12rem",
                  objectFit: "cover",
                  borderRadius: "var(--radius)",
                  marginBottom: "1rem",
                  opacity: 0,
                  transition: "opacity 400ms ease",
                }}
                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "1";
                }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <span className="item-index">0{i + 1}</span>
            <h3>{service.name}</h3>
            <p>{service.line}</p>
            <strong>{service.scope}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
