"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Animations() {
  useEffect(() => {
    // ── Hero entry animation ──────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".header-pill", { y: -20, autoAlpha: 0, duration: 0.8, clearProps: "all" })
      .from(".hero__eyebrow", { y: 16, autoAlpha: 0, duration: 0.7 }, 0.25)
      .from(".hero__title", { y: 22, autoAlpha: 0, duration: 0.9 }, 0.45)
      .from(".hero__copy", { y: 18, autoAlpha: 0, duration: 0.75 }, 0.65)
      .from(".booking-wrap", { y: 14, autoAlpha: 0, duration: 0.7 }, 0.75);

    // ── Hero media parallax ────────────────────────────────────
    gsap.to(".hero__media", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // ── Section headings: split reveal ─────────────────────────
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    document.querySelectorAll<HTMLElement>(".split-heading").forEach((el) => {
      // Skip the hero title (animated with entry TL above)
      if (el.closest(".hero__content")) return;

      if (reduceMotion || isMobile) {
        gsap.from(el, {
          y: 18,
          autoAlpha: 0,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true,
          },
        });
        return;
      }

      // Word-by-word reveal (no SplitText club membership needed)
      const words = el.textContent?.split(/\s+/).filter(Boolean) || [];
      const originalHtml = el.innerHTML;

      // Wrap each word in a span with overflow hidden
      const newHtml = originalHtml.replace(/(\S+)/g, (w) => {
        return `<span class="split-word" style="display:inline-block;overflow:hidden;padding-bottom:0.08em"><span class="split-inner" style="display:inline-block">${w}</span></span>`;
      });
      el.innerHTML = newHtml;

      const inners = el.querySelectorAll<HTMLElement>(".split-inner");
      if (inners.length === 0) return;

      gsap.from(inners, {
        yPercent: 105,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.04,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 83%",
          once: true,
        },
      });
    });

    // ── Service cards stagger ───────────────────────────────────
    gsap.from(".service-item", {
      y: 22,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".service-grid",
        start: "top 82%",
        once: true,
      },
    });

    // ── Fleet section fade-in ──────────────────────────────────
    gsap.from(".fleet-tiers", {
      autoAlpha: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".fleet-tiers",
        start: "top 90%",
        once: true,
      },
    });

    // ── Footer: closing headline ───────────────────────────────
    gsap.from(".closing h2", {
      y: 24,
      autoAlpha: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".closing",
        start: "top 82%",
        once: true,
      },
    });

    // ── Cursor glow ─────────────────────────────────────────────
    const glow = document.querySelector<HTMLElement>(".cursor-glow");
    if (glow && !isMobile) {
      glow.style.opacity = "1";
      const xSet = gsap.quickSetter(glow, "x", "px");
      const ySet = gsap.quickSetter(glow, "y", "px");
      const onMove = (e: MouseEvent) => {
        xSet(e.clientX);
        ySet(e.clientY);
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMove);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
