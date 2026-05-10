"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const BookingIsland = dynamic(
  () => import("@/components/booking/BookingIsland"),
  { ssr: false }
);

const HERO_MEDIA = [
  { type: "video", src: "/assets/hero1.mp4", poster: "/assets/new-night-front.png" },
  { type: "video", src: "/assets/hero2.mp4", poster: "/assets/new-night-front.png" },
  { type: "image", src: "/assets/new landing test.png" },
];

interface HeroProps {
  mapsApiKey: string;
}

export default function Hero({ mapsApiKey }: HeroProps) {
  const mediaRefs = useRef<(HTMLVideoElement | HTMLImageElement | null)[]>([]);
  const currentIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Activate first
    const activateMedia = (idx: number) => {
      mediaRefs.current.forEach((el, i) => {
        if (!el) return;
        const isActive = i === idx;
        el.classList.toggle("is-active", isActive);
        if (isActive && el instanceof HTMLVideoElement) {
          el.currentTime = 0;
          el.play().catch(() => {});
        }
      });
    };

    activateMedia(0);

    const advance = () => {
      currentIndex.current =
        (currentIndex.current + 1) % HERO_MEDIA.length;
      activateMedia(currentIndex.current);
      timerRef.current = setTimeout(advance, 6000);
    };

    timerRef.current = setTimeout(advance, 6000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section className="hero" aria-label="Hero">
      {/* Media layer */}
      <div className="hero__media" aria-hidden="true">
        {HERO_MEDIA.map((media, i) =>
          media.type === "video" ? (
            <video
              key={media.src}
              ref={(el) => { mediaRefs.current[i] = el; }}
              src={media.src}
              poster={media.poster}
              className="hero__media-el hero__media-video"
              muted
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
              loop={false}
              aria-hidden="true"
            />
          ) : (
            <Image
              key={media.src}
              ref={(el) => { mediaRefs.current[i] = el as HTMLImageElement; }}
              src={media.src}
              alt=""
              fill
              className="hero__media-el hero__media-image"
              priority={i === 0}
              sizes="100vw"
              aria-hidden="true"
            />
          )
        )}
      </div>

      {/* Wash */}
      <div className="hero__wash" aria-hidden="true" />

      {/* Content */}
      <div className="hero__content" id="hero-content">
        <p className="eyebrow hero__eyebrow">Velvet Experience</p>
        <h1 className="hero__title split-heading">
          Your time deserves better.
        </h1>
        <p className="hero__copy">
          Private chauffeur rides across Gurugram, Central Delhi, and IGI
          Airport. Airport, point-to-point, or the whole day — on your terms.
        </p>
      </div>

      {/* Booking island */}
      <div className="booking-wrap">
        <BookingIsland apiKey={mapsApiKey} />
      </div>
    </section>
  );
}
