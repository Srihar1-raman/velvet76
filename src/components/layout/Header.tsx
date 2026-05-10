"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  variant?: "home" | "book";
}

export default function Header({ variant = "home" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleReserve = () => {
    if (variant === "home") {
      const el = document.getElementById("booking-island");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Trigger expand
        el.dispatchEvent(new CustomEvent("velvet:expand-booking"));
      }
    } else {
      window.location.href = "/reserve";
    }
  };

  return (
    <>
      <div
        ref={headerRef}
        className="header-pill"
        style={{
          background: scrolled
            ? "rgba(8, 7, 11, 0.96)"
            : "rgba(10, 9, 13, 0.88)",
        }}
      >
        {/* Logo - V monogram only, balanced padding */}
        <a
          href="/"
          aria-label="Velvet Experience home"
          className="brand-v flex-shrink-0 flex items-center"
          style={{ width: "2.1rem", height: "2.1rem", padding: "0 0.1rem" }}
        >
          <Image
            src="/assets/monogram-gold.svg"
            alt="V"
            width={32}
            height={32}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            priority
          />
        </a>

        {/* Nav links - desktop only */}
        <nav className="nav-links" aria-label="Primary navigation">
          <a href={variant === "home" ? "#services" : "/#services"}>
            Services
          </a>
          <a href={variant === "home" ? "#fleet" : "/#fleet"}>Fleet</a>
          <a href={variant === "home" ? "#contact" : "/#contact"}>Contact</a>
        </nav>

        {/* Spacer on mobile to push hamburger right */}
        <div className="flex-1 md:hidden" />

        {/* Reserve button - desktop, balanced right padding matching logo left padding */}
        <button
          type="button"
          className="reserve-btn hidden md:inline-flex"
          onClick={handleReserve}
          style={{ marginRight: "0.1rem" }}
        >
          Reserve now
        </button>

        {/* Hamburger - mobile */}
        <button
          type="button"
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/8 transition-colors md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <Menu size={20} />
        </button>
      </div>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onReserve={handleReserve}
      />
    </>
  );
}
