"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { whatsappSendUrl } from "@/lib/whatsapp";

export default function Footer() {
  const [concierge, setConcierge] = useState("");
  const [sent, setSent] = useState(false);

  const handleConcierge = () => {
    const msg = concierge.trim()
      ? `Hi Velvet, ${concierge}`
      : "Hi Velvet, I'd like to make an enquiry.";
    window.open(whatsappSendUrl(msg), "_blank", "noopener,noreferrer");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const conciergeUrl = whatsappSendUrl(
    "Hi Velvet, I'd like to speak with your concierge."
  );

  return (
    <footer className="closing" id="contact" aria-label="Contact and footer">
      {/* Watermark */}
      <div className="closing__watermark" aria-hidden="true" />

      <div className="closing__shell">
        {/* CTA grid */}
        <div className="closing-cta-grid">
          {/* Headline */}
          <div>
            <h2 className="split-heading">
              Ready to reserve.
            </h2>
          </div>

          {/* Concierge textarea */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.55rem",
              gridColumn: 2,
            }}
          >
            <label
              htmlFor="concierge-msg"
              className="text-sm font-semibold"
              style={{ color: "rgba(247,242,232,0.68)" }}
            >
              Leave a message for our concierge
            </label>
            <textarea
              id="concierge-msg"
              value={concierge}
              onChange={(e) => setConcierge(e.target.value)}
              placeholder="Any specific requirement, preference, or question…"
              rows={3}
              className="concierge-textarea"
              maxLength={500}
            />
          </div>

          {/* Reserve button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/reserve"
              className="btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                minWidth: "min(100%, 14rem)",
                justifyContent: "center",
              }}
            >
              Reserve a ride
            </a>
          </div>

          {/* Speak to concierge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleConcierge}
              className="btn-outline"
              style={{
                minWidth: "min(100%, 14rem)",
                justifyContent: "center",
              }}
            >
              {sent ? "Opening WhatsApp…" : "Speak to concierge"}
            </button>
          </div>
        </div>

        {/* Footer row */}
        <div className="closing-foot">
          {/* Tagline */}
          <p className="closing__tagline">
            Velvet Experience is a private chauffeur service for ultra-premium
            clients across Gurugram and Delhi NCR. Every standard upheld, every
            mile unmistakably Velvet.
          </p>

          {/* Nav + socials */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <nav className="closing-nav" aria-label="Footer navigation">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(247,242,232,0.4)" }}
              >
                Navigate
              </p>
              <a href="#services">Services</a>
              <a href="#fleet">Fleet</a>
              <a href="/reserve">Reserve</a>
            </nav>

            <div className="closing-socials">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(247,242,232,0.4)" }}
              >
                Connect
              </p>
              <a href={conciergeUrl} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <a
                href="https://instagram.com/velvetexperiencein"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              <a href="mailto:hello@velvetexperience.in">Email</a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "2.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Image
                src="/assets/monogram-gold.svg"
                alt="Velvet V monogram"
                width={20}
                height={20}
                style={{ opacity: 0.6 }}
              />
              <span
                className="text-xs"
                style={{ color: "rgba(247,242,232,0.4)" }}
              >
                Velvet Experience
              </span>
            </div>

            <div
              className="flex gap-4 text-xs"
              style={{ color: "rgba(247,242,232,0.35)" }}
            >
              <a
                href="/privacy"
                className="hover:text-white/70 transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="hover:text-white/70 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
          <p
            className="text-xs text-right"
            style={{ color: "rgba(247,242,232,0.25)" }}
          >
            Delhi NCR · India
          </p>
        </div>
      </div>
    </footer>
  );
}
