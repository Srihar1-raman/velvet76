"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { whatsappSendUrl } from "@/lib/whatsapp";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onReserve: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  onReserve,
}: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleNavClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const id = href.replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 320);
  };

  const conciergeUrl = whatsappSendUrl(
    "Hi Velvet, I'd like to speak with your concierge."
  );

  return (
    <div
      className={`mobile-drawer ${isOpen ? "is-open" : ""}`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="mobile-drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="mobile-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <a href="/" onClick={onClose} aria-label="Velvet Experience home">
            <Image
              src="/assets/monogram-gold.svg"
              alt="V"
              width={36}
              height={36}
              style={{ width: "2.2rem", height: "2.2rem", objectFit: "contain" }}
            />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Intro */}
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "var(--gold)" }}
          >
            Velvet Experience
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Choose where you want to go next.
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "var(--text-soft)" }}
          >
            Explore
          </p>
          {[
            { label: "Services", href: "#services" },
            { label: "Fleet", href: "#fleet" },
            { label: "Contact", href: "#contact" },
          ].map(({ label, href }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleNavClick(href)}
              className="text-left text-lg font-medium py-2 border-b transition-colors"
              style={{
                borderColor: "var(--line)",
                color: "var(--text)",
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-auto">
          <button
            type="button"
            className="btn btn-gold w-full"
            onClick={() => {
              onClose();
              setTimeout(onReserve, 320);
            }}
          >
            Reserve now
          </button>
          <a
            href={conciergeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost w-full text-center"
            onClick={onClose}
          >
            Speak to Concierge
          </a>
        </div>

        {/* Footer helper */}
        <p className="text-xs text-center" style={{ color: "var(--text-soft)" }}>
          Private chauffeur rides for Delhi NCR and IGI Airport.
        </p>
      </div>
    </div>
  );
}
