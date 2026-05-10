"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { chauffeurFrames } from "@/lib/data";

const FRAMES = chauffeurFrames;
const AUTO_INTERVAL = 4200;

export default function HumanLayer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Desktop: cycling story frames
  const goToIndex = (idx: number) => {
    const next = (idx + FRAMES.length) % FRAMES.length;
    setActiveIndex(next);
  };

  const resetAutoTimer = () => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FRAMES.length);
    }, AUTO_INTERVAL);
  };

  useEffect(() => {
    resetAutoTimer();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  // Mobile drag/touch carousel
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouchDevice) return;

    let startScrollLeft = 0;
    let startClientX = 0;

    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      startClientX = e.touches[0].clientX;
      startScrollLeft = track.scrollLeft;
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = startClientX - e.touches[0].clientX;
      track.scrollLeft = startScrollLeft + dx;
    };

    const onTouchEnd = () => {
      isDragging.current = false;
      resetAutoTimer();
    };

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <section
      className="chauffeur-section section-pad"
      id="chauffeurs"
      aria-label="The human layer"
    >
      {/* Text column */}
      <div className="chauffeur-text">
        <p className="eyebrow">The Human Layer</p>
        <h2 className="section-title split-heading" style={{ color: "#100f0d" }}>
          The ride is only as good as the person running it.
        </h2>
        <p style={{ color: "rgba(16,15,13,0.72)", lineHeight: 1.6, fontSize: "1.08rem", marginTop: "1rem" }}>
          Every Velvet chauffeur is background-verified, trained in luxury
          hospitality, and briefed for your journey before they arrive.
        </p>

        {/* Desktop nav dots */}
        <div
          className="hidden md:flex gap-2 mt-6"
          role="tablist"
          aria-label="Chauffeur story frames"
        >
          {FRAMES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Frame ${i + 1}`}
              onClick={() => {
                goToIndex(i);
                resetAutoTimer();
              }}
              style={{
                width: i === activeIndex ? "1.5rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "999px",
                background:
                  i === activeIndex
                    ? "#8b6d24"
                    : "rgba(16,15,13,0.25)",
                border: "none",
                cursor: "pointer",
                transition: "width 300ms ease, background 300ms ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Desktop: stacked story frames */}
      <div
        className="chauffeur-carousel hidden md:block"
        aria-live="polite"
        aria-atomic="true"
      >
        {FRAMES.map((frame, i) => (
          <figure
            key={frame.src}
            className={`story-frame ${i === activeIndex ? "is-active" : ""}`}
            style={{
              transition: "opacity 500ms ease",
              margin: 0,
            }}
            aria-hidden={i !== activeIndex}
          >
            {frame.isVideo ? (
              <video
                src={frame.src}
                autoPlay={i === activeIndex}
                muted
                playsInline
                loop
                preload="metadata"
                aria-label={frame.alt}
              />
            ) : (
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 44vw"
                priority={i === 0}
              />
            )}
            <figcaption>{frame.caption}</figcaption>
            {frame.tag && (
              <span className="story-detail-tag">{frame.tag}</span>
            )}
          </figure>
        ))}
      </div>

      {/* Mobile: horizontal scroll carousel */}
      <div
        ref={trackRef}
        className="chauffeur-mobile-carousel md:hidden"
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          gap: "1rem",
          padding: "0 1rem",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        role="region"
        aria-label="Chauffeur stories"
      >
        {FRAMES.map((frame) => (
          <figure
            key={frame.src}
            className="story-card"
            style={{
              scrollSnapAlign: "start",
              flexShrink: 0,
              margin: 0,
            }}
          >
            {frame.isVideo ? (
              <video
                src={frame.src}
                autoPlay
                muted
                playsInline
                loop
                preload="metadata"
              />
            ) : (
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="82vw"
              />
            )}
            <figcaption>{frame.caption}</figcaption>
            {frame.tag && (
              <span className="story-detail-tag">{frame.tag}</span>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
