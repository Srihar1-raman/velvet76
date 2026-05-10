"use client";

import Image from "next/image";

const TICKER_WORDS = [
  "Private",
  "Premium",
  "Punctual",
  "Personal",
  "Professional",
];

export default function Promise() {
  return (
    <section
      className="premise section-pad"
      id="premise"
      aria-label="The Velvet premise"
    >
      <div className="premise__inner">
        {/* Copy */}
        <div className="premise__copy">
          <p className="eyebrow">The Velvet Premise</p>

          <p className="premise__line split-heading">Not a cab.</p>
          <p className="premise__line split-heading">Not a rental.</p>
          <p className="premise__line split-heading">
            A private movement experience.
          </p>
        </div>

        {/* Reel + ticker */}
        <div className="premise-reel-stage" aria-hidden="true">
          <video
            src="/assets/interior-reel.mp4"
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="motion-ticker" aria-hidden="true">
            {TICKER_WORDS.concat(TICKER_WORDS).map((word, i) => (
              <span key={`${word}-${i}`}>{word}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Monogram watermark */}
      <div className="monogram-field" aria-hidden="true">
        <div
          style={{
            position: "absolute",
            right: "-4rem",
            bottom: "-2rem",
            width: "min(30rem, 55vw)",
            aspectRatio: "1",
            opacity: 0.04,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/assets/monogram-gold.png"
            alt=""
            fill
            style={{ objectFit: "contain" }}
            sizes="30rem"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
