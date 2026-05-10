"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { Observer } from "gsap/Observer";
import { fleetTiers } from "@/lib/data";
import {
  isAirportGurugramSubcase,
  meetsLeadTimePolicy,
  SERVICE_AREA_ERROR,
  validateServiceArea,
} from "@/lib/bookingPolicy";

function animateSplitText() {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;
  document.fonts.ready.then(() => {
    document.querySelectorAll<HTMLElement>(".split-heading").forEach((heading) => {
      // Avoid heavy SplitText DOM wrapping on mobile/reduced-motion.
      if (reduceMotionQuery.matches || isMobile) {
        gsap.from(heading, {
          y: 18,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 84%",
            once: true,
          },
        });
        return;
      }
      SplitText.create(heading, {
        type: "lines, words",
        wordsClass: "split-word",
        linesClass: "split-line",
        aria: "auto",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 105,
            autoAlpha: 0,
            duration: 0.95,
            ease: "power4.out",
            stagger: 0.035,
            scrollTrigger: {
              trigger: heading,
              start: "top 82%",
              once: true
            }
          });
        }
      });
    });
  });
}

function initHero() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".site-header", { y: -20, duration: 0.8, clearProps: "transform" })
    .from(".hero__media img", { scale: 1.18, duration: 1.5 }, 0)
    .from(".hero__eyebrow", { y: 16, autoAlpha: 0, duration: 0.7 }, 0.25)
    .from(".hero__copy", { y: 18, autoAlpha: 0, duration: 0.75 }, 0.55);

  gsap.to(".hero__media img", {
    yPercent: 11,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
}

function initSmartHeader() {
  const header = document.querySelector<HTMLElement>(".site-header");
  if (!header) return;

  let lastScroll = window.scrollY;
  let ticking = false;
  let hidden = false;

  const showHeader = () => {
    if (!hidden) return;
    hidden = false;
    gsap.to(header, { yPercent: 0, duration: 0.28, ease: "power3.out", overwrite: true });
  };

  const hideHeader = () => {
    if (hidden) return;
    hidden = true;
    gsap.to(header, { yPercent: -150, duration: 0.28, ease: "power3.out", overwrite: true });
  };

  const updateHeader = () => {
    const current = window.scrollY;
    const delta = current - lastScroll;
    header.classList.toggle("is-compact", current > 16);

    if (current < 48 || delta < -4) {
      showHeader();
    } else if (delta > 4 && current > 90) {
      hideHeader();
    }

    lastScroll = Math.max(current, 0);
    ticking = false;
  };

  window.addEventListener("pointermove", (event) => {
    if (event.clientY < 88 || window.scrollY < 80) {
      showHeader();
    }
  });

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

function initCursorGlow() {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const touchQuery = window.matchMedia("(pointer: coarse)");
  if (touchQuery.matches || reduceMotionQuery.matches) return;

  const glow = document.querySelector<HTMLElement>(".cursor-glow");
  if (!glow) return;

  const xTo = gsap.quickTo(glow, "x", { duration: 0.45, ease: "power3.out" });
  const yTo = gsap.quickTo(glow, "y", { duration: 0.45, ease: "power3.out" });

  window.addEventListener("pointermove", (event) => {
    xTo(event.clientX);
    yTo(event.clientY);
  });

  Observer.create({
    target: window,
    type: "pointer",
    onMove: () => gsap.to(glow, { autoAlpha: 0.42, duration: 0.25 }),
    onStop: () => gsap.to(glow, { autoAlpha: 0.16, duration: 0.8 })
  });
}

function initMonogramField() {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const touchQuery = window.matchMedia("(pointer: coarse)");
  const field = document.querySelector<HTMLElement>(".monogram-field");
  const premise = document.querySelector<HTMLElement>(".premise");
  if (!field || !premise) return;
  if (reduceMotionQuery.matches) return;
  const columns = touchQuery.matches ? 5 : 10;
  const rows = touchQuery.matches ? 6 : 7;
  const particles = Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const xBase = ((column + 0.5) / columns) * 100;
    const yBase = ((row + 0.5) / rows) * 100;
    const xOffset = row % 2 === 0 ? 1.2 : -1.2;
    const yOffset = 0;

    const particle = document.createElement("span");
    particle.className = "monogram-particle";
    const image = document.createElement("img");
    image.src = "/assets/monogram-gold.png";
    image.alt = "";
    image.decoding = "async";
    particle.appendChild(image);
    particle.style.setProperty("--x", `${xBase + xOffset}%`);
    particle.style.setProperty("--y", `${yBase + yOffset}%`);
    particle.style.setProperty("--size", touchQuery.matches ? "30px" : "48px");
    particle.style.setProperty("--alpha", `${0.13 + ((column + row) % 3) * 0.035}`);
    particle.style.setProperty("--rotate", "0deg");
    particle.dataset.depth = `${0.55 + ((column + row) % 4) * 0.16}`;
    particle.dataset.homeX = "0";
    particle.dataset.homeY = "0";
    field.appendChild(particle);

    gsap.to(particle, {
      y: index % 2 === 0 ? -4 : 4,
      x: 0,
      rotation: 0,
      duration: 6 + (index % 5),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    return particle;
  });

  const repel = (event: PointerEvent) => {
    const rect = premise.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;

    particles.forEach((particle) => {
      const particleRect = particle.getBoundingClientRect();
      const particleX = particleRect.left - rect.left + particleRect.width / 2;
      const particleY = particleRect.top - rect.top + particleRect.height / 2;
      const dx = particleX - pointerX;
      const dy = particleY - pointerY;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const radius = 180;

      if (distance > radius) {
        gsap.to(particle, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
        return;
      }

      const depth = Number(particle.dataset.depth ?? 1);
      const force = (1 - distance / radius) * 58 * depth;
      gsap.to(particle, {
        x: (dx / distance) * force,
        y: (dy / distance) * force,
        duration: 0.42,
        ease: "power3.out",
        overwrite: "auto"
      });
    });
  };

  if (!touchQuery.matches) {
    premise.addEventListener("pointermove", repel);
    premise.addEventListener("pointerleave", () => {
      particles.forEach((particle) => {
        gsap.to(particle, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
      });
    });
  }
}

function initMotionReel() {
  const touchQuery = window.matchMedia("(pointer: coarse)");
  const copy = document.querySelector<HTMLElement>(".motion-reel__copy");
  const monogram = document.querySelector<HTMLElement>(".motion-reel__monogram");

  if (copy && monogram && !touchQuery.matches) {
    copy.addEventListener("pointermove", (event) => {
      const rect = monogram.getBoundingClientRect();
      copy.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      copy.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      copy.closest(".motion-reel")?.classList.add("is-spotlit");
    });

    copy.addEventListener("pointerleave", () => {
      copy.closest(".motion-reel")?.classList.remove("is-spotlit");
    });
  }

  gsap.utils.toArray<HTMLElement>(".motion-reel__stage").forEach((stage) => {
    const triggerSection = stage.closest<HTMLElement>("section") ?? stage;
    gsap.timeline({
      scrollTrigger: {
        trigger: triggerSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    })
      .fromTo(
        stage,
        { scale: 1.22, yPercent: 11, clipPath: "inset(16% 24% round 8px)" },
        { scale: 1, yPercent: 0, clipPath: "inset(0% 0% round 8px)", ease: "power2.inOut", duration: 0.48 }
      )
      .to(stage, {
        scale: 0.88,
        yPercent: -12,
        clipPath: "inset(10% 18% round 8px)",
        ease: "power2.inOut",
        duration: 0.52
      });

    const ticker = stage.querySelector<HTMLElement>(".motion-reel__ticker");
    if (!ticker) return;
    gsap.to(ticker, {
      xPercent: -35,
      ease: "none",
      scrollTrigger: {
        trigger: triggerSection,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
}

function initRevealItems() {
  ScrollTrigger.batch(".reveal-item", {
    start: "top 84%",
    once: true,
    onEnter: (items) => {
      gsap.to(items, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08
      });
    }
  });
}

function initFleetTiers() {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const touchQuery = window.matchMedia("(pointer: coarse)");
  const carEl = document.querySelector<HTMLImageElement>(".fleet-tiers__car");
  const selector = document.querySelector<HTMLElement>(".fleet-tiers__selector");
  const carSwitch = document.querySelector<HTMLElement>(".fleet-tiers__car-switch");
  const details = document.querySelector<HTMLElement>(".fleet-tiers__details");
  const carMeta = document.querySelector<HTMLElement>(".fleet-tiers__car-meta");
  const ambient = document.querySelector<HTMLElement>(".fleet-tiers__ambient");
  const showroom = document.querySelector<HTMLElement>(".fleet-tiers__showroom");
  const panels = gsap.utils.toArray<HTMLButtonElement>(".fleet-tiers__tier-btn");
  if (!carEl || panels.length === 0) return;

  let activeTierIndex = fleetTiers.length - 1;
  let activeCarIndex = 0;
  let detailsTransitionId = 0;
  let metaTransitionId = 0;
  let isDraggingCar = false;

  function currentTier() {
    return fleetTiers[activeTierIndex];
  }

  function currentCar() {
    return currentTier().cars[activeCarIndex];
  }

  function updateAmbient(tier: typeof fleetTiers[number]) {
    if (!ambient) return;
    gsap.to(ambient, {
      background: `radial-gradient(ellipse 80% 60% at 50% 45%, ${tier.accentGlow}, transparent 70%)`,
      duration: 0.9,
      ease: "power2.inOut",
    });
  }

  function updateDetails(tier: typeof fleetTiers[number], animate = true) {
    if (!details) return;
    const models = details.querySelector<HTMLElement>(".fleet-tiers__models");
    const spec = details.querySelector<HTMLElement>(".fleet-tiers__spec");
    const points = details.querySelector<HTMLElement>(".fleet-tiers__points");
    if (!models || !spec || !points) return;

    const newModels = `${tier.cars.map((c) => c.model).join(" / ")} or similar`;
    const paxMatch = tier.capacity.match(/\d+/);
    const paxCount = paxMatch ? paxMatch[0] : "3";
    const luggageMatch = tier.luggage.match(/\d+/);
    const luggageCount = luggageMatch ? luggageMatch[0] : "3";
    const newSpecHtml = `
      <span class="fleet-tiers__spec-item">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1"></path><circle cx="9.5" cy="7" r="3"></circle></svg>
        ${paxCount}
      </span>
      <span class="fleet-tiers__spec-sep">|</span>
      <span class="fleet-tiers__spec-item">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="7" width="14" height="12" rx="2"></rect><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
        ${luggageCount}
      </span>
    `;
    const newPoints = tier.points
      .map((point) => point.replace(/^Meet and greet included$/i, "Meet & greet"))
      .join(" · ");

    if (!animate) {
      models.textContent = newModels;
      spec.innerHTML = newSpecHtml;
      points.textContent = newPoints;
      return;
    }

    const id = ++detailsTransitionId;
    gsap.to(details, {
      autoAlpha: 1,
      y: 0,
      duration: 0.2,
      ease: "power2.out",
      overwrite: true,
      onComplete: () => {
        if (id !== detailsTransitionId) return;
        models.textContent = newModels;
        spec.innerHTML = newSpecHtml;
        points.textContent = newPoints;
        gsap.fromTo(
          details.querySelectorAll(".fleet-tiers__models, .fleet-tiers__spec, .fleet-tiers__points"),
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.03, ease: "power3.out", overwrite: true }
        );
      },
    });
  }

  function updateCarMeta(car: typeof fleetTiers[number]["cars"][number], tier: typeof fleetTiers[number], animate = true) {
    if (!carMeta) return;
    const eyebrow = carMeta.querySelector<HTMLElement>(".fleet-tiers__car-eyebrow");
    const model = carMeta.querySelector<HTMLElement>(".fleet-tiers__car-model");
    if (!eyebrow || !model) return;

    if (!animate) {
      eyebrow.textContent = tier.name;
      model.textContent = car.model;
      return;
    }

    const id = ++metaTransitionId;
    gsap.to(carMeta, {
      autoAlpha: 1,
      y: 0,
      duration: 0.16,
      ease: "power2.out",
      overwrite: true,
      onComplete: () => {
        if (id !== metaTransitionId) return;
        eyebrow.textContent = tier.name;
        model.textContent = car.model;
        gsap.fromTo(
          carMeta.querySelectorAll(".fleet-tiers__car-eyebrow, .fleet-tiers__car-model"),
          { autoAlpha: 0, y: 5 },
          { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.02, ease: "power3.out", overwrite: true }
        );
      },
    });
  }

  function swapCar(nextSrc: string, direction: "up" | "down" = "up") {
    if (!carEl) return;
    isDraggingCar = false;
    gsap.killTweensOf(carEl);

    const outgoing = carEl.cloneNode(false) as HTMLImageElement;
    outgoing.removeAttribute("id");
    outgoing.alt = "";
    outgoing.setAttribute("aria-hidden", "true");
    outgoing.classList.add("fleet-tiers__car-ghost");
    carEl.parentElement?.appendChild(outgoing);

    carEl.src = nextSrc;

    if (direction === "up") {
      gsap.set(carEl, { y: 60, scale: 0.94, rotate: -1.5, autoAlpha: 0 });
      gsap.set(outgoing, { y: 0, scale: 1, rotate: 0, autoAlpha: 1 });
    } else {
      gsap.set(carEl, { y: -60, scale: 0.94, rotate: 1.5, autoAlpha: 0 });
      gsap.set(outgoing, { y: 0, scale: 1, rotate: 0, autoAlpha: 1 });
    }

    gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => outgoing.remove(),
    })
      .to(outgoing, {
        y: direction === "up" ? -70 : 70,
        scale: 0.92,
        rotate: direction === "up" ? 3 : -3,
        autoAlpha: 0,
        duration: 0.42,
        ease: "power2.inOut",
      }, 0)
      .to(carEl, {
        y: 0,
        scale: 1,
        rotate: 0,
        autoAlpha: 1,
        duration: 0.56,
        ease: "power3.out",
      }, 0.1);
  }

  function selectTier(index: number) {
    if (index === activeTierIndex) return;
    const tier = fleetTiers[index];
    activeTierIndex = index;
    activeCarIndex = 0;

    panels.forEach((panel, i) => {
      panel.classList.toggle("is-active", i === index);
      panel.setAttribute("aria-selected", String(i === index));
    });

    if (selector) selector.dataset.activeIndex = String(index);

    if (carSwitch) {
      carSwitch.innerHTML = tier.cars
        .map(
          (car, i) => `
            <button class="fleet-tiers__car-btn${i === 0 ? " is-active" : ""}" type="button" data-car-index="${i}" role="tab" aria-selected="${i === 0 ? "true" : "false"}">
              ${car.model}
            </button>
          `
        )
        .join("");
      bindCarSwitchButtons();
    }

    const nextSrc = tier.cars[0].image;
    const preload = new Image();
    preload.onload = () => swapCar(nextSrc, "up");
    preload.onerror = () => swapCar(nextSrc, "up");
    preload.src = nextSrc;

    updateAmbient(tier);
    updateDetails(tier);
    updateCarMeta(tier.cars[0], tier);
  }

  function selectCar(index: number) {
    if (index === activeCarIndex) return;
    const tier = currentTier();
    const car = tier.cars[index];
    const direction = index > activeCarIndex ? "up" : "down";
    activeCarIndex = index;

    const btns = carSwitch?.querySelectorAll<HTMLButtonElement>(".fleet-tiers__car-btn");
    btns?.forEach((btn, i) => {
      btn.classList.toggle("is-active", i === index);
      btn.setAttribute("aria-selected", String(i === index));
    });

    const preload = new Image();
    preload.onload = () => swapCar(car.image, direction);
    preload.onerror = () => swapCar(car.image, direction);
    preload.src = car.image;

    updateCarMeta(car, tier);
  }

  function bindCarSwitchButtons() {
    carSwitch?.querySelectorAll<HTMLButtonElement>(".fleet-tiers__car-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.carIndex ?? "0", 10);
        selectCar(idx);
      });
      btn.addEventListener("focus", () => {
        const idx = parseInt(btn.dataset.carIndex ?? "0", 10);
        selectCar(idx);
      });
    });
  }

  const initialTier = currentTier();
  updateAmbient(initialTier);
  updateDetails(initialTier, false);
  updateCarMeta(initialTier.cars[0], initialTier, false);
  bindCarSwitchButtons();
  if (selector) selector.dataset.activeIndex = String(activeTierIndex);

  gsap.from(".fleet-tiers__header, .fleet-tiers__selector, .fleet-tiers__showroom, .fleet-tiers__details", {
    y: 34,
    autoAlpha: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".fleet-tiers",
      start: "top 68%",
      once: true,
    },
  });

  if (showroom && !touchQuery.matches && !reduceMotionQuery.matches) {
    const xTo = gsap.quickTo(carEl, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(carEl, "y", { duration: 0.55, ease: "power3.out" });
    const rotateTo = gsap.quickTo(carEl, "rotate", { duration: 0.55, ease: "power3.out" });

    showroom.addEventListener("pointermove", (event) => {
      if (isDraggingCar) return;
      const rect = showroom.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      xTo(x * 18);
      yTo(y * 10);
      rotateTo(x * 1.2);
    });

    showroom.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
      rotateTo(0);
    });
  }

  if (!reduceMotionQuery.matches) {
    Draggable.create(carEl, {
      type: "x,y",
      allowNativeTouchScrolling: false,
      onPress() {
        isDraggingCar = true;
        gsap.killTweensOf(carEl);
        gsap.to(carEl, { scale: 1.015, duration: 0.18, ease: "power2.out", overwrite: true });
      },
      onDrag() {
        gsap.set(carEl, { rotate: this.x * 0.018 });
      },
      onRelease() {
        isDraggingCar = false;
        gsap.to(carEl, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.82,
          ease: "elastic.out(1, 0.62)",
          overwrite: true,
        });
      },
    });
  }

  if (!reduceMotionQuery.matches) {
    gsap.to(carEl, {
      y: "-=6",
      duration: 3.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  panels.forEach((panel) => {
    panel.addEventListener("click", () => {
      const idx = parseInt(panel.dataset.tierIndex ?? "0", 10);
      selectTier(idx);
    });
    panel.addEventListener("focus", () => {
      const idx = parseInt(panel.dataset.tierIndex ?? "0", 10);
      selectTier(idx);
    });
  });
}

function initChauffeurSequence() {
  const frames = gsap.utils.toArray<HTMLElement>(".story-frame");
  if (frames.length === 0) return;
  const sequence = document.querySelector<HTMLElement>(".chauffeur__sequence");
  const SESSION_KEY = "velvet_chauffeur_sequence_seen";
  const hasSeenSequence = (() => {
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  })();

  const mm = gsap.matchMedia();

  mm.add("(min-width: 900px)", () => {
    if (hasSeenSequence) {
      if (sequence) sequence.style.minHeight = "auto";
      frames.forEach((frame, index) => {
        if (index === 0) {
          gsap.set(frame, {
            clearProps: "all",
            position: "relative",
            inset: "auto",
            display: "block",
            clipPath: "none",
            filter: "none",
            xPercent: 0,
            rotation: 0,
            autoAlpha: 1,
            height: "min(60vh, 34rem)",
          });
        } else {
          gsap.set(frame, { display: "none" });
        }
      });
      return;
    }

    gsap.set(frames, {
      autoAlpha: 1,
      transformOrigin: "50% 78%",
      zIndex: (index) => index + 1
    });
    gsap.set(frames.slice(1), {
      xPercent: 110,
      rotation: 7,
      clipPath: "inset(0 0 0 100% round 8px)"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".chauffeur",
        start: "top top",
        end: `+=${frames.length * 720}`,
        scrub: 0.8,
        pin: true,
        onEnter: () => {
          try {
            window.sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            // ignore storage failures
          }
        }
      }
    });

    frames.forEach((frame, index) => {
      if (index === 0) return;
      tl.to(frames[index - 1], { xPercent: -13, scale: 0.88, rotation: -3.5, filter: "brightness(0.52)", duration: 0.9 }, index)
        .to(frame, { xPercent: 0, rotation: 0, clipPath: "inset(0 0 0 0% round 8px)", duration: 1, ease: "power2.inOut" }, index)
        .fromTo(frame.querySelector("figcaption"), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, index + 0.52);
    });
  });

  mm.add("(max-width: 899px)", () => {
    frames.forEach((frame) => {
      gsap.from(frame, {
        y: 34,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: frame,
          start: "top 82%",
          once: true
        }
      });
    });
  });
}

function initMagneticButtons() {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const touchQuery = window.matchMedia("(pointer: coarse)");
  if (touchQuery.matches || reduceMotionQuery.matches) return;

  document.querySelectorAll<HTMLElement>(".magnetic").forEach((button) => {
    const xTo = gsap.quickTo(button, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(button, "y", { duration: 0.35, ease: "power3.out" });

    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      xTo((event.clientX - rect.left - rect.width / 2) * 0.18);
      yTo((event.clientY - rect.top - rect.height / 2) * 0.28);
    });

    button.addEventListener("mouseleave", () => {
      xTo(0);
      yTo(0);
    });
  });
}

function initHoverPreview() {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const touchQuery = window.matchMedia("(pointer: coarse)");
  if (touchQuery.matches || reduceMotionQuery.matches) return;

  const card = document.querySelector<HTMLElement>(".hover-preview");
  if (!card) return;

  const img = card.querySelector("img")!;
  gsap.set(card, { scale: 0.88, opacity: 0, x: 0, y: 0 });

  const xTo = gsap.quickTo(card, "x", { duration: 0.12, ease: "power2.out" });
  const yTo = gsap.quickTo(card, "y", { duration: 0.12, ease: "power2.out" });

  const show = (src: string) => {
    img.src = src;
    gsap.to(card, { opacity: 1, scale: 1, duration: 0.28, ease: "power2.out", overwrite: true });
    gsap.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out", overwrite: true });
  };

  const move = (event: PointerEvent) => {
    const gap = 20;
    const cardH = card.offsetHeight || 277;
    const targetX = event.clientX + gap;
    const targetY = Math.min(
      Math.max(8, event.clientY - cardH / 2),
      window.innerHeight - cardH - 8
    );
    xTo(targetX);
    yTo(targetY);
  };

  const hide = () => {
    gsap.to(card, { opacity: 0, scale: 0.88, duration: 0.18, ease: "power2.in", overwrite: true });
  };

  gsap.utils.toArray<HTMLElement>("[data-premise-img]").forEach((line) => {
    line.addEventListener("mouseenter", () => show(line.dataset.premiseImg!));
    line.addEventListener("pointermove", move);
    line.addEventListener("mouseleave", hide);
  });

  gsap.utils.toArray<HTMLElement>("[data-hover-img]").forEach((item) => {
    item.addEventListener("mouseenter", () => show(item.dataset.hoverImg!));
    item.addEventListener("pointermove", move);
    item.addEventListener("mouseleave", hide);
  });
}

function initAnimations() {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotionQuery.matches) {
    document.documentElement.classList.add("reduce-motion");
    return;
  }

  gsap.defaults({ duration: 0.65, ease: "power3.out" });
  gsap.set(".reveal-item", { y: 30, autoAlpha: 0 });

  animateSplitText();
  initHero();
  initSmartHeader();
  initCursorGlow();
  initMonogramField();
  initMotionReel();
  initRevealItems();
  initFleetTiers();
  initChauffeurSequence();
  initMagneticButtons();
  initHoverPreview();

  window.addEventListener("load", () => ScrollTrigger.refresh());
}

function initHeroMediaRotation() {
  const mediaEls = Array.from(document.querySelectorAll<HTMLElement>(".hero__media-el"));
  if (mediaEls.length < 2) return;
  const IMAGE_DURATION_MS = 30000;
  let rotationTimer: number | null = null;

  let activeIndex = Math.max(
    0,
    mediaEls.findIndex((el) => el.classList.contains("is-active"))
  );
  if (!mediaEls[activeIndex]) activeIndex = 0;
  const clearRotationTimer = () => {
    if (rotationTimer !== null) {
      window.clearTimeout(rotationTimer);
      rotationTimer = null;
    }
  };

  const showMediaAt = (index: number) => {
    clearRotationTimer();
    activeIndex = ((index % mediaEls.length) + mediaEls.length) % mediaEls.length;
    mediaEls.forEach((el, index) => {
      const isActive = index === activeIndex;
      el.classList.toggle("is-active", isActive);
      if (el instanceof HTMLVideoElement && !isActive) {
        el.pause();
        el.currentTime = 0;
      }
    });

    const activeEl = mediaEls[activeIndex];
    if (activeEl instanceof HTMLVideoElement) {
      activeEl.loop = false;
      activeEl.currentTime = 0;
      activeEl.onended = () => {
        showMediaAt((activeIndex + 1) % mediaEls.length);
      };
      void activeEl.play().catch(() => {
        showMediaAt((activeIndex + 1) % mediaEls.length);
      });
      return;
    }

    mediaEls.forEach((el) => {
      if (el instanceof HTMLVideoElement) {
        el.onended = null;
      }
    });
    rotationTimer = window.setTimeout(() => {
      showMediaAt((activeIndex + 1) % mediaEls.length);
    }, IMAGE_DURATION_MS);
  };

  mediaEls.forEach((el, index) => {
    const isActive = index === activeIndex;
    el.classList.toggle("is-active", isActive);
    if (el instanceof HTMLVideoElement) {
      el.loop = false;
      if (isActive) {
        el.currentTime = 0;
        void el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
  });

  const initialEl = mediaEls[activeIndex];
  if (initialEl instanceof HTMLVideoElement) {
    initialEl.onended = () => {
      showMediaAt((activeIndex + 1) % mediaEls.length);
    };
  } else {
    rotationTimer = window.setTimeout(() => {
      showMediaAt((activeIndex + 1) % mediaEls.length);
    }, IMAGE_DURATION_MS);
  }

  window.addEventListener("beforeunload", () => {
    clearRotationTimer();
    mediaEls.forEach((el) => {
      if (el instanceof HTMLVideoElement) {
        el.onended = null;
      }
    });
  });
}

function initServiceBookingInteractions() {
  const grid = document.querySelector<HTMLElement>(".service-grid");
  if (!grid) return;

  const capsules = [...grid.querySelectorAll<HTMLElement>(".service-capsule[data-service-mode]")];
  if (!capsules.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const enableHoverPreview = !prefersReduced && !coarsePointer;

  let previewEl: HTMLDivElement | null = null;
  let previewImg: HTMLImageElement | null = null;
  let activeCapsule: HTMLElement | null = null;
  let lastX = window.innerWidth / 2;
  let lastY = window.innerHeight / 2;

  const PREVIEW_W = 316;
  const PREVIEW_H = 198;
  const CURSOR_GAP_X = 56;
  const CURSOR_GAP_Y = 40;

  if (enableHoverPreview) {
    previewEl = document.createElement("div");
    previewEl.className = "service-cursor-preview";
    previewEl.setAttribute("aria-hidden", "true");
    previewImg = document.createElement("img");
    previewImg.alt = "";
    previewImg.decoding = "async";
    previewEl.appendChild(previewImg);
    document.body.appendChild(previewEl);
  }

  function positionPreview(clientX: number, clientY: number) {
    if (!previewEl) return;
    const pad = 14;
    const isHourly = activeCapsule?.dataset.serviceMode === "hourly";

    let left: number;
    if (isHourly) {
      const roomOnRight = clientX + CURSOR_GAP_X + PREVIEW_W <= window.innerWidth - pad;
      if (roomOnRight) {
        left = clientX + CURSOR_GAP_X;
      } else {
        left = clientX - CURSOR_GAP_X - PREVIEW_W;
      }
    } else {
      left = clientX + CURSOR_GAP_X;
    }

    const maxLeft = window.innerWidth - PREVIEW_W - pad;
    left = Math.min(Math.max(left, pad), maxLeft);

    let top = clientY - PREVIEW_H - CURSOR_GAP_Y;
    top = Math.min(Math.max(top, pad), window.innerHeight - PREVIEW_H - pad);
    previewEl.style.left = `${left}px`;
    previewEl.style.top = `${top}px`;
    previewEl.style.transform = "none";
  }

  document.addEventListener(
    "mousemove",
    (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!previewEl || !activeCapsule || !previewImg) return;
      positionPreview(lastX, lastY);
    },
    { passive: true }
  );

  function applyBookingMode(mode: string) {
    const apply = (window as unknown as { __velvetApplyBookingMode?: (m: "airport" | "oneway" | "hourly") => void })
      .__velvetApplyBookingMode;
    if (apply && (mode === "airport" || mode === "oneway" || mode === "hourly")) {
      apply(mode);
      return;
    }
    document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  capsules.forEach((capsule) => {
    capsule.addEventListener("mouseenter", () => {
      if (!previewEl || !previewImg) return;
      activeCapsule = capsule;
      const src = capsule.dataset.hoverImg;
      if (src) previewImg.src = src;
      previewEl.classList.add("is-visible");
      positionPreview(lastX, lastY);
    });

    capsule.addEventListener("mouseleave", () => {
      activeCapsule = null;
      previewEl?.classList.remove("is-visible");
    });

    capsule.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const mode = capsule.dataset.serviceMode;
      if (mode) applyBookingMode(mode);
    });

    capsule.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      const mode = capsule.dataset.serviceMode;
      if (mode) applyBookingMode(mode);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE KEYBOARD / VIEWPORT UTILITIES — completely rewritten
// ─────────────────────────────────────────────────────────────────────────────

/** Detect iOS Safari once at module load time. */
const isIOS = (() => {
  if (typeof navigator === "undefined" || typeof document === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
})();

const isMobileBreakpoint = () => window.matchMedia("(max-width: 899px)").matches;

/** Get the *visual* viewport metrics. Falls back to layout viewport. */
function getVV() {
  const vv = window.visualViewport;
  return {
    top: vv?.offsetTop ?? 0,
    left: vv?.offsetLeft ?? 0,
    width: vv?.width ?? window.innerWidth,
    height: vv?.height ?? window.innerHeight,
    bottom: (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight),
  };
}

/**
 * Scroll the given element into the visual viewport on mobile so it stays
 * visible above any popup that is about to open beneath it.
 * Returns a Promise that resolves after the scroll + one paint frame.
 */
function scrollFieldIntoMobileView(el: HTMLElement): Promise<void> {
  if (!isMobileBreakpoint()) return Promise.resolve();
  const vv = getVV();
  const rect = el.getBoundingClientRect();
  const padTop = 12;
  const minPanelHeight = 180;
  const panelGap = 10;
  const viewportPad = 8;

  const desiredTop = vv.top + padTop;
  const desiredBottomForInput = vv.bottom - (minPanelHeight + panelGap + viewportPad);

  // Check if the field is already fully visible with room for a panel below
  const needsScroll = rect.top < desiredTop || rect.bottom > desiredBottomForInput;

  if (needsScroll) {
    const targetTop = Math.max(desiredTop, Math.min(rect.top, desiredBottomForInput - rect.height));
    const scrollY = window.scrollY + rect.top - targetTop;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return new Promise<void>((resolve) => {
      window.scrollTo({
        top: scrollY,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      // Wait for scroll to settle, then one more paint frame
      const after = () => {
        window.requestAnimationFrame(() => resolve());
      };
      if (prefersReducedMotion) {
        window.requestAnimationFrame(after);
      } else {
        window.setTimeout(after, 220);
      }
    });
  }

  return Promise.resolve();
}

// ─────────────────────────────────────────────────────────────────────────────
// VELVET AUTOCOMPLETE — rewritten mobile positioning
// ─────────────────────────────────────────────────────────────────────────────

interface AutocompleteOptions {
  input: HTMLInputElement;
  onSelect: (place: { place_id?: string; formatted_address?: string; name?: string }) => void;
  onClear?: () => void;
  allowed?: () => boolean;
  country?: string;
  types?: string[];
}

function initVelvetAutocomplete(opts: AutocompleteOptions) {
  const { input, onSelect, onClear, allowed, country = "in", types } = opts;
  const canUse = () => allowed?.() !== false;

  const g = (window as unknown as any).google as any;
  if (!g?.maps?.places?.AutocompleteService || !g?.maps?.places?.PlacesService) return { destroy: () => {} };

  const autocompleteService = new g.maps.places.AutocompleteService();
  const dummy = document.createElement("div");
  const detailsService = new g.maps.places.PlacesService(dummy);

  interface PredictionItem {
    prediction: any;
    element: HTMLElement;
  }

  let predictions: PredictionItem[] = [];
  let activeIndex = -1;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let sessionToken: any = null;

  const container = document.createElement("div");
  container.className = "velvet-autocomplete";
  container.setAttribute("role", "listbox");
  container.setAttribute("aria-label", "Location suggestions");
  container.style.display = "none";

  // Always portal to body — avoids stacking context / overflow:hidden traps
  document.body.appendChild(container);

  /**
   * Position the dropdown relative to the input using the *visual* viewport.
   * On mobile this fires on every visualViewport resize so it stays glued
   * under the input even as the keyboard animates open.
   *
   * Mobile rule: ALWAYS open below the input. Never open above.
   * If space below is tight, reduce maxHeight to fit.
   */
  function position() {
    if (container.style.display === "none") return;

    if (!isMobileBreakpoint()) {
      // Desktop: position relative to the input's parent (offset parent).
      const inputRect = input.getBoundingClientRect();
      const viewportPad = 10;

      container.style.position = "fixed";
      container.style.width = `min(30rem, calc(100vw - 3rem))`;
      container.style.zIndex = "30";

      const panelHeight = container.offsetHeight;
      const spaceBelow = window.innerHeight - inputRect.bottom - viewportPad;
      const spaceAbove = inputRect.top - viewportPad;

      if (spaceBelow >= panelHeight || spaceAbove < panelHeight) {
        // Place below
        container.style.left = `${inputRect.left}px`;
        container.style.top = `${inputRect.bottom + 8}px`;
        container.style.bottom = "auto";
      } else {
        // Place above
        container.style.left = `${inputRect.left}px`;
        container.style.top = "auto";
        container.style.bottom = `${window.innerHeight - inputRect.top + 8}px`;
      }
      return;
    }

    // ── Mobile: always open below the input ────────────────────────────────
    const vv = getVV();
    const rect = input.getBoundingClientRect();
    const viewportPad = 8;
    const panelGap = 10;

    const desiredWidth = Math.max(260, vv.width - viewportPad * 2);
    const left = vv.left + viewportPad;
    const spaceBelow = Math.max(0, vv.bottom - (rect.bottom + panelGap) - viewportPad);
    const maxHeight = Math.max(120, Math.min(spaceBelow, Math.min(vv.height * 0.52, 360)));
    const top = Math.max(vv.top + viewportPad, rect.bottom + panelGap);

    container.style.position = "fixed";
    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
    container.style.bottom = "auto";
    container.style.width = `${desiredWidth}px`;
    container.style.maxHeight = `${maxHeight}px`;
    container.style.zIndex = "12000";
    container.style.borderRadius = "12px";
  }

  /** Reposition on every visual viewport change (keyboard slide, orientation). */
  function onViewportChange() {
    window.requestAnimationFrame(position);
  }

  window.visualViewport?.addEventListener("resize", onViewportChange, { passive: true });
  window.visualViewport?.addEventListener("scroll", onViewportChange, { passive: true });
  window.addEventListener("resize", onViewportChange, { passive: true });
  window.addEventListener("scroll", onViewportChange, { passive: true });

  function ensureSessionToken() {
    if (!sessionToken && g?.maps?.places?.AutocompleteSessionToken) {
      sessionToken = new g.maps.places.AutocompleteSessionToken();
    }
    return sessionToken;
  }

  function fetchPredictions(query: string) {
    if (!canUse() || !query.trim()) {
      close();
      return;
    }
    autocompleteService.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country },
        types: types as any,
        sessionToken: ensureSessionToken() as any,
      },
      (results: any, status: any) => {
        if (
          status !== g.maps.places.PlacesServiceStatus.OK ||
          !results ||
          results.length === 0
        ) {
          close();
          return;
        }
        render(results);
      }
    );
  }

  function appendMatchedText(
    target: HTMLElement,
    text: string,
    matches?: { offset: number; length: number }[]
  ) {
    if (!matches?.length) {
      target.textContent = text;
      return;
    }
    let cursor = 0;
    matches.forEach((match) => {
      const offset = match.offset;
      const end = offset + match.length;
      if (offset > cursor) target.append(document.createTextNode(text.slice(cursor, offset)));
      const mark = document.createElement("mark");
      mark.textContent = text.slice(offset, end);
      target.append(mark);
      cursor = end;
    });
    if (cursor < text.length) target.append(document.createTextNode(text.slice(cursor)));
  }

  function render(results: any[]) {
    predictions = [];
    activeIndex = -1;
    container.innerHTML = "";

    const list = document.createElement("ul");
    list.className = "velvet-autocomplete__list";

    results.forEach((prediction: any, index: number) => {
      const li = document.createElement("li");
      li.className = "velvet-autocomplete__item";
      li.setAttribute("role", "option");
      li.setAttribute("data-index", String(index));

      const copy = document.createElement("span");
      copy.className = "velvet-autocomplete__copy";

      const mainText = document.createElement("span");
      mainText.className = "velvet-autocomplete__main";
      appendMatchedText(
        mainText,
        prediction.structured_formatting.main_text,
        prediction.structured_formatting.main_text_matched_substrings
      );

      const secondaryText = document.createElement("span");
      secondaryText.className = "velvet-autocomplete__secondary";
      secondaryText.textContent = prediction.structured_formatting.secondary_text || "";

      copy.appendChild(mainText);
      if (secondaryText.textContent) {
        copy.appendChild(secondaryText);
      }
      li.appendChild(copy);

      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        selectPrediction(prediction);
      });
      // Touch tap — prevent ghost click issues
      li.addEventListener("touchend", (e) => {
        e.preventDefault();
        selectPrediction(prediction);
      }, { passive: false });

      list.appendChild(li);
      predictions.push({ prediction, element: li });
    });

    const attribution = document.createElement("div");
    attribution.className = "velvet-autocomplete__attribution";
    const googleLogo = document.createElement("img");
    googleLogo.src = "https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white3_hdpi.png";
    googleLogo.alt = "Powered by Google";
    googleLogo.height = 12;
    attribution.appendChild(googleLogo);
    list.appendChild(attribution);

    container.appendChild(list);
    container.style.display = "block";
    // Scroll the active input into the visible viewport first (mobile)
    const positionAfterScroll = () => {
      position();
      window.requestAnimationFrame(position);
    };
    if (isMobileBreakpoint()) {
      document.body.classList.add("v1-mobile-picker-open");
      scrollFieldIntoMobileView(input).then(positionAfterScroll);
    } else {
      positionAfterScroll();
    }
    if (isIOS) {
      window.setTimeout(position, 350);
    }
    input.setAttribute("aria-expanded", "true");
  }

  function selectPrediction(prediction: any) {
    detailsService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["formatted_address", "name", "place_id", "geometry"],
        sessionToken: sessionToken as any,
      },
      (place: any, status: any) => {
        if (status === g.maps.places.PlacesServiceStatus.OK && place) {
          input.value = place.formatted_address || place.name || prediction.description;
          onSelect(place);
          if (g?.maps?.places?.AutocompleteSessionToken) {
            sessionToken = new g.maps.places.AutocompleteSessionToken();
          }
        }
        close();
      }
    );
  }

  function highlight(index: number) {
    predictions.forEach((p, i) => {
      p.element.classList.toggle("is-active", i === index);
      p.element.setAttribute("aria-selected", String(i === index));
    });
    activeIndex = index;
    if (index >= 0) {
      predictions[index].element.scrollIntoView({ block: "nearest" });
    }
  }

  function close() {
    container.style.display = "none";
    input.setAttribute("aria-expanded", "false");
    activeIndex = -1;
    predictions = [];
    if (isMobileBreakpoint()) {
      const hasOpenPicker = Boolean(document.querySelector(".v1-picker-popover.is-open"));
      const hasOpenAutocomplete = Array.from(document.querySelectorAll<HTMLElement>(".velvet-autocomplete"))
        .some((el) => el.style.display !== "none");
      const anyOpen = hasOpenPicker || hasOpenAutocomplete;
      document.body.classList.toggle("v1-mobile-picker-open", anyOpen);
    }
  }

  function openIfQuery() {
    const query = input.value.trim();
    if (query.length >= 2) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fetchPredictions(query), 200);
    }
  }

  input.addEventListener("input", () => {
    if (!canUse()) {
      close();
      return;
    }
    if (debounceTimer) clearTimeout(debounceTimer);
    const query = input.value.trim();
    if (query.length < 2) {
      close();
      onClear?.();
      return;
    }
    debounceTimer = setTimeout(() => fetchPredictions(query), 200);
  });

  input.addEventListener("focus", () => {
    if (!canUse()) return;
    openIfQuery();
  });

  input.addEventListener("keydown", (e) => {
    if (container.style.display === "none") return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        highlight(Math.min(activeIndex + 1, predictions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        highlight(Math.max(activeIndex - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && predictions[activeIndex]) {
          selectPrediction(predictions[activeIndex].prediction);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target as Node) && !container.contains(e.target as Node)) {
      close();
    }
  });

  function destroy() {
    if (debounceTimer) clearTimeout(debounceTimer);
    close();
    window.visualViewport?.removeEventListener("resize", onViewportChange);
    window.visualViewport?.removeEventListener("scroll", onViewportChange);
    window.removeEventListener("resize", onViewportChange);
    window.removeEventListener("scroll", onViewportChange);
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }

  return { destroy };
}

// ─────────────────────────────────────────────────────────────────────────────
// PICKER UTILITIES — rewritten for visual viewport
// ─────────────────────────────────────────────────────────────────────────────

type RideMode = "airport" | "oneway" | "hourly";
type AirportSubType = "arrival" | "departure";

const HOURLY_PACKAGES: { key: string; label: string }[] = [
  { key: "4h40km", label: "4 hrs / 40 km" },
  { key: "6h60km", label: "6 hrs / 60 km" },
  { key: "8h80km", label: "8 hrs / 80 km" },
];

function getMobileViewportMetrics() {
  return getVV();
}

/**
 * Position a picker popover panel anchored to `anchor`.
 *
 * Desktop: relative positioning inside the field (CSS handles it).
 * Mobile: bottom-sheet using visual viewport so it tracks the keyboard.
 */
function placePicker(panel: HTMLElement, anchor: HTMLElement) {
    if (!isMobileBreakpoint()) {
      // Desktop: let CSS do it, but check if we need to flip above.
      panel.classList.remove("is-open-above");
      const panelRect = panel.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const viewportPad = 10;
      const spaceBelow = window.innerHeight - anchorRect.bottom - viewportPad;
      const spaceAbove = anchorRect.top - viewportPad;
      if (spaceBelow < panelRect.height && spaceAbove > panelRect.height) {
        panel.classList.add("is-open-above");
      }
      return;
    }

    // ── Mobile: keep picker under the active field using visual viewport ──
    panel.classList.remove("is-open-above");
    const vv = getVV();
    const anchorRect = anchor.getBoundingClientRect();
    const viewportPad = 8;
    const panelGap = 10;
    const desiredWidth = Math.max(260, vv.width - viewportPad * 2);
    const spaceBelow = Math.max(0, vv.bottom - (anchorRect.bottom + panelGap) - viewportPad);
    const hardMax = panel.classList.contains("v1-calendar") ? 430 : 360;
    const maxHeight = Math.max(170, Math.min(spaceBelow, Math.min(vv.height * 0.58, hardMax)));
    const top = Math.max(vv.top + viewportPad, anchorRect.bottom + panelGap);

    panel.style.position = "fixed";
    panel.style.left = `${vv.left + viewportPad}px`;
    panel.style.top = `${top}px`;
    panel.style.bottom = "auto";
    panel.style.width = `${desiredWidth}px`;
    panel.style.maxHeight = `${maxHeight}px`;
    panel.style.zIndex = "12000";
    panel.style.borderRadius = "12px";
  }

/**
 * Re-run placePicker for all currently open pickers.
 * Called on visualViewport resize/scroll so panels track the keyboard.
 */
function reanchorOpenPickers(
  dateEl: HTMLInputElement,
  timeEl: HTMLInputElement,
  dropEl: HTMLInputElement
) {
  document.querySelectorAll<HTMLElement>(".v1-picker-popover.is-open").forEach((panel) => {
    if (panel.classList.contains("v1-calendar")) {
      const field = dateEl.closest<HTMLElement>(".v1-date-field");
      if (field) placePicker(panel, field);
    } else if (panel.classList.contains("v1-time-picker") && !panel.classList.contains("v1-hourly-package-picker")) {
      const field = timeEl.closest<HTMLElement>(".v1-time-field");
      if (field) placePicker(panel, field);
    } else if (panel.classList.contains("v1-hourly-package-picker")) {
      const field = dropEl.closest<HTMLElement>("label");
      if (field) placePicker(panel, field);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN BOOKING + NAV
// ─────────────────────────────────────────────────────────────────────────────

function initVersionOneNavAndBooking() {
  const nav = document.querySelector<HTMLElement>(".v1-nav");
  const bookingCard = document.querySelector<HTMLElement>(".v1-booking-card");
  const bookingWrap = document.getElementById("hero-booking-wrapper") as HTMLElement | null;
  const heroContent = document.getElementById("hero-content");
  const heroSection = document.querySelector<HTMLElement>(".hero");
  const reserveLink = document.querySelector<HTMLAnchorElement>(".v1-reserve-link");
  const reserveNowBtn = document.getElementById("v1-nav-reserve-now") as HTMLButtonElement | null;
  const reserveNowMobileBtn = document.getElementById("v1-nav-reserve-now-mobile") as HTMLButtonElement | null;
  const reserveNowMenuBtn = document.getElementById("v1-mobile-menu-reserve") as HTMLButtonElement | null;
  const reserveNowButtons = [reserveNowBtn, reserveNowMobileBtn, reserveNowMenuBtn].filter(Boolean) as HTMLButtonElement[];
  const navModePill = document.getElementById("v1-nav-mode-pill") as HTMLDivElement | null;
  const continueBookingBtn = document.getElementById("v1-continue-booking") as HTMLButtonElement | null;
  const navModeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-v1-nav-mode]"));
  if (!nav || !bookingCard) return;
  const bookingCardEl = bookingCard;
  if (navModePill && navModePill.parentElement !== document.body) {
    document.body.appendChild(navModePill);
  }

  const openBtn = document.getElementById("v1-nav-open") as HTMLButtonElement | null;
  const closeBtn = document.getElementById("v1-nav-close") as HTMLButtonElement | null;
  const overlay = document.getElementById("v1-mobile-overlay") as HTMLDivElement | null;
  const menu = document.getElementById("v1-mobile-menu") as HTMLElement | null;

  const closeMobile = () => {
    if (!overlay || !menu || !openBtn) return;
    overlay.classList.remove("is-open");
    menu.classList.remove("is-open");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const openMobile = () => {
    if (!overlay || !menu || !openBtn) return;
    overlay.classList.add("is-open");
    menu.classList.add("is-open");
    openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  openBtn?.addEventListener("click", openMobile);
  closeBtn?.addEventListener("click", closeMobile);
  overlay?.addEventListener("click", closeMobile);
  menu?.querySelectorAll("a, button").forEach((el) => {
    if ((el as HTMLElement).id === "v1-nav-close") return;
    el.addEventListener("click", closeMobile);
  });

  const syncReserveVisibility = () => {
    if (!heroSection) return;
    const heroBounds = heroSection.getBoundingClientRect();
    nav.classList.toggle("has-reserve", heroBounds.bottom < 120);
  };
  const syncMobileReserveVisibility = () => {
    if (!reserveNowMobileBtn || !heroSection) return;
    if (!isMobileBreakpoint()) {
      reserveNowMobileBtn.setAttribute("hidden", "");
      return;
    }
    const heroBounds = heroSection.getBoundingClientRect();
    const isBeyondHero = heroBounds.bottom < 120;
    if (isBeyondHero) reserveNowMobileBtn.removeAttribute("hidden");
    else reserveNowMobileBtn.setAttribute("hidden", "");
  };
  const syncContinueBookingVisibility = () => {
    if (!continueBookingBtn) return;
    if (isMobileBreakpoint() || !heroSection) {
      continueBookingBtn.setAttribute("hidden", "");
      return;
    }
    const heroBounds = heroSection.getBoundingClientRect();
    const isBeyondHero = heroBounds.bottom < 120;
    if (isBeyondHero) continueBookingBtn.removeAttribute("hidden");
    else continueBookingBtn.setAttribute("hidden", "");
  };

  if (heroSection && "IntersectionObserver" in window) {
    const reserveObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      nav.classList.toggle("has-reserve", !entry.isIntersecting && window.scrollY > heroSection.offsetTop);
      syncMobileReserveVisibility();
    }, { threshold: 0.02 });
    reserveObserver.observe(heroSection);
  } else {
    syncReserveVisibility();
    syncMobileReserveVisibility();
    window.addEventListener("scroll", syncReserveVisibility, { passive: true });
  }

  const modeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-v1-mode]"));
  const modeWrap = document.querySelector<HTMLElement>(".v1-booking-modes");
  const transferButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-v1-airport-type]"));
  const terminalButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-v1-terminal]"));
  const airportControls = document.querySelector<HTMLElement>("[data-v1-airport-controls]");
  const dropLabel = document.querySelector<HTMLElement>("[data-v1-drop-label]");
  const pickupInput = document.querySelector<HTMLInputElement>('[data-v1-field="pickup"]');
  const dropInput = document.querySelector<HTMLInputElement>('[data-v1-field="drop"]');
  const dateInput = document.querySelector<HTMLInputElement>('[data-v1-field="date"]');
  const timeInput = document.querySelector<HTMLInputElement>('[data-v1-field="time"]');
  const submit = document.getElementById("v1-book-submit") as HTMLButtonElement | null;
  if (!pickupInput || !dropInput || !dateInput || !timeInput || !submit) return;
  const pickupEl = pickupInput;
  const dropEl = dropInput;
  const dateEl = dateInput;
  const timeEl = timeInput;
  const submitEl = submit;
  const mobileManagedFields = [pickupEl, dropEl, dateEl, timeEl];

  const clearActiveMobileField = () => {
    document.querySelectorAll<HTMLElement>(".v1-fields-shell label.is-field-active").forEach((label) => {
      label.classList.remove("is-field-active");
    });
  };

  const markActiveMobileField = (input: HTMLInputElement) => {
    clearActiveMobileField();
    input.closest<HTMLElement>("label")?.classList.add("is-field-active");
  };

  // Wire up reanchorOpenPickers with the actual field elements
  const reanchorPickers = () => reanchorOpenPickers(dateEl, timeEl, dropEl);
  let viewportResizeRaf: number | null = null;
  const onViewportChange = () => {
    if (viewportResizeRaf) cancelAnimationFrame(viewportResizeRaf);
    viewportResizeRaf = requestAnimationFrame(() => {
      reanchorPickers();
      // Also re-scroll the focused input into view when keyboard state changes
      const activeEl = document.activeElement as HTMLElement | null;
      const fields = [pickupEl, dropEl, dateEl, timeEl];
      if (activeEl && fields.includes(activeEl as HTMLInputElement)) {
        scrollFieldIntoMobileView(activeEl);
      }
    });
  };
  window.visualViewport?.addEventListener("resize", onViewportChange, { passive: true });
  window.visualViewport?.addEventListener("scroll", onViewportChange, { passive: true });

  let rideMode: RideMode = "oneway";
  let airportSubType: AirportSubType = "arrival";
  let terminal = "Terminal 3 (T3), IGI Airport, New Delhi";
  let bookingActivated = false;
  let isExpanded = false;
  let placesReady = false;
  let placesFailed = false;
  let placesFailReason = "";
  let lastAutocompleteSelectAt = 0;
  let pickupPlaceValid = false;
  let dropPlaceValid = false;
  let pickupAreaValid = false;
  let dropAreaValid = false;
  let selectedHourlyPackageKey = "4h40km";

  const syncMobilePickerBackdrop = () => {
    if (!isMobileBreakpoint()) {
      document.body.classList.remove("v1-mobile-picker-open");
      return;
    }
    const hasOpenPicker = Boolean(document.querySelector(".v1-picker-popover.is-open"));
    const hasOpenAutocomplete = Array.from(document.querySelectorAll<HTMLElement>(".velvet-autocomplete"))
      .some((el) => el.style.display !== "none");
    document.body.classList.toggle("v1-mobile-picker-open", hasOpenPicker || hasOpenAutocomplete);
  };

  const closeAutocompletePanels = () => {
    document.querySelectorAll<HTMLElement>(".velvet-autocomplete").forEach((panel) => {
      panel.style.display = "none";
    });
    pickupEl.setAttribute("aria-expanded", "false");
    dropEl.setAttribute("aria-expanded", "false");
    syncMobilePickerBackdrop();
  };

  const closePickers = () => {
    document.querySelectorAll<HTMLElement>(".v1-picker-popover.is-open").forEach((panel) => {
      panel.classList.remove("is-open");
      panel.classList.remove("is-open-above");
      panel.setAttribute("aria-hidden", "true");
    });
    syncMobilePickerBackdrop();
  };

  const emitValueChange = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const baseState = {
    serviceType: "",
    airportSubType: "",
    pickupLocation: "",
    dropLocation: "",
    travelDate: "",
    travelTime: "",
    flightNumber: "",
    hourlyPackage: "",
    passengerCount: 1,
    luggageCount: 0,
    bookingFor: "me",
    guestPhone: "",
    guestName: "",
    phone: "",
    email: "",
    otpVerified: false,
    selectedTier: "",
    distanceKm: 0,
    bookingId: ""
  };

  function currentServiceType() {
    if (rideMode === "airport") return "airport-transfer";
    if (rideMode === "hourly") return "hourly-rental";
    return "city-ride";
  }

  function hourlyPackageLabel(key: string) {
    return HOURLY_PACKAGES.find((p) => p.key === key)?.label ?? HOURLY_PACKAGES[0].label;
  }

  const PLACEHOLDER_ADDRESS = "Address, airport, hotel, \u2026";
  pickupEl.placeholder = PLACEHOLDER_ADDRESS;
  dropEl.placeholder = PLACEHOLDER_ADDRESS;

  function clearPlaceValidation(input: HTMLInputElement) {
    input.setCustomValidity("");
  }

  function markInvalidPlace(input: HTMLInputElement, message: string) {
    input.setCustomValidity(message);
  }

  function isAirportGgnContext() {
    const pickup = pickupEl.value.trim();
    const drop = rideMode === "hourly" ? "" : dropEl.value.trim();
    return isAirportGurugramSubcase(pickup, drop);
  }

  function reconcileBookingMode(from: RideMode, fromAir: AirportSubType, to: RideMode) {
    const looksLikeHourlyPreset = (v: string) => {
      const t = v.trim();
      return t === "2 hours" || HOURLY_PACKAGES.some((p) => p.label === t);
    };

    if (to === "hourly") {
      if (from === "airport" && fromAir === "arrival") {
        pickupEl.value = "";
        pickupPlaceValid = false;
        clearPlaceValidation(pickupEl);
      }
      return;
    }

    if (from === "hourly") {
      dropEl.removeAttribute("readonly");
      dropEl.placeholder = PLACEHOLDER_ADDRESS;
      dropEl.value = "";
      dropPlaceValid = false;
      clearPlaceValidation(dropEl);
      if (to === "airport") {
        if (airportSubType === "arrival") {
          pickupEl.value = terminal;
          pickupPlaceValid = true;
          clearPlaceValidation(pickupEl);
        } else {
          dropEl.value = terminal;
          dropPlaceValid = true;
          clearPlaceValidation(dropEl);
        }
      }
      return;
    }

    if (to === "airport" && from !== "airport") {
      if (airportSubType === "arrival") {
        pickupEl.value = terminal;
        pickupPlaceValid = true;
        clearPlaceValidation(pickupEl);
        if (looksLikeHourlyPreset(dropEl.value)) {
          dropEl.value = "";
          dropPlaceValid = false;
          clearPlaceValidation(dropEl);
        }
      } else {
        dropEl.value = terminal;
        dropPlaceValid = true;
        clearPlaceValidation(dropEl);
        if (pickupEl.value === terminal || looksLikeHourlyPreset(pickupEl.value)) {
          pickupEl.value = "";
          pickupPlaceValid = false;
          clearPlaceValidation(pickupEl);
        }
      }
      return;
    }

    if (from === "airport" && to === "oneway") {
      if (fromAir === "arrival") {
        pickupEl.value = "";
        pickupPlaceValid = false;
        clearPlaceValidation(pickupEl);
      } else if (dropEl.value === terminal) {
        dropEl.value = "";
        dropPlaceValid = false;
        clearPlaceValidation(dropEl);
      }
    }
  }

  function setupPlacesAutocomplete() {
    const estimator = (window as any).VelvetMapsEstimator;
    if (!estimator || typeof estimator.loadMapsApi !== "function") {
      placesFailed = true;
      placesFailReason = "maps_loader_unavailable";
      syncStatus();
      return;
    }

    estimator
      .loadMapsApi()
      .then(() => {
        const g = (window as any).google;
        if (!g?.maps?.places?.AutocompleteService) {
          placesFailed = true;
          placesFailReason = "places_library_unavailable";
          syncStatus();
          return;
        }

        initVelvetAutocomplete({
          input: pickupEl,
          country: "in",
          onSelect: (place) => {
            lastAutocompleteSelectAt = Date.now();
            const result = validateServiceArea(place ?? {});
            pickupPlaceValid = Boolean(place?.place_id);
            pickupAreaValid = result.ok;
            if (pickupPlaceValid && pickupAreaValid) {
              pickupEl.value = place.formatted_address || place.name || pickupEl.value;
              clearPlaceValidation(pickupEl);
            } else {
              markInvalidPlace(pickupEl, result.message || SERVICE_AREA_ERROR);
              pickupEl.reportValidity();
            }
            syncStatus();
          },
          onClear: () => {
            pickupPlaceValid = false;
            pickupAreaValid = false;
            syncStatus();
          },
        });

        initVelvetAutocomplete({
          input: dropEl,
          country: "in",
          allowed: () => rideMode !== "hourly",
          onSelect: (place) => {
            lastAutocompleteSelectAt = Date.now();
            const result = validateServiceArea(place ?? {});
            dropPlaceValid = Boolean(place?.place_id);
            dropAreaValid = result.ok;
            if (dropPlaceValid && dropAreaValid) {
              dropEl.value = place.formatted_address || place.name || dropEl.value;
              clearPlaceValidation(dropEl);
            } else {
              markInvalidPlace(dropEl, result.message || SERVICE_AREA_ERROR);
              dropEl.reportValidity();
            }
            syncStatus();
          },
          onClear: () => {
            dropPlaceValid = false;
            dropAreaValid = false;
            syncStatus();
          },
        });

        placesReady = true;
        syncStatus();
      })
      .catch(() => {
        placesFailed = true;
        placesFailReason =
          (typeof estimator.getLastLoadError === "function" && estimator.getLastLoadError()) || "maps_load_failed";
        syncStatus();
      });
  }

  function openPickerPanel(panel: HTMLElement, anchor: HTMLElement) {
    closeAutocompletePanels();
    closePickers();

    // Always portal pickers to body on mobile to escape overflow traps
    if (isMobileBreakpoint()) {
      if (panel.parentElement !== document.body) document.body.appendChild(panel);
    }

    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    syncMobilePickerBackdrop();

    const doPosition = () => placePicker(panel, anchor);

    if (isMobileBreakpoint()) {
      document.body.classList.add("v1-mobile-picker-open");
      // Scroll the anchor field into view first, then position the picker.
      // This prevents the picker from covering the field.
      scrollFieldIntoMobileView(anchor.querySelector("input") || anchor).then(() => {
        doPosition();
        window.requestAnimationFrame(doPosition);
      });
      // iOS keyboard animation can take ~350ms; reanchor once after settle.
      if (isIOS) {
        window.setTimeout(doPosition, 380);
      }
    } else {
      doPosition();
      window.requestAnimationFrame(doPosition);
    }
  }

  function setupDatePicker() {
    const field = dateEl.closest<HTMLElement>(".v1-date-field");
    if (!field) return;

    const panel = document.createElement("div");
    panel.className = "v1-picker-popover v1-calendar";
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("role", "dialog");
    field.appendChild(panel);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let viewDate = dateEl.value ? new Date(`${dateEl.value}T00:00:00`) : new Date(today);

    const isoDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const renderCal = () => {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      const first = new Date(year, month, 1);
      const start = new Date(year, month, 1 - first.getDay());
      const selected = dateEl.value;
      const monthName = viewDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      const cells = Array.from({ length: 42 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        const value = isoDate(date);
        const muted = date.getMonth() !== month;
        const disabled = date < today;
        return `<button type="button" class="${muted ? "is-muted" : ""} ${value === selected ? "is-selected" : ""}" data-date="${value}" ${disabled ? "disabled" : ""}>${date.getDate()}</button>`;
      }).join("");

      panel.innerHTML = `
        <div class="v1-picker-head">
          <button type="button" data-calendar-prev>Prev</button>
          <strong>${monthName}</strong>
          <button type="button" data-calendar-next>Next</button>
        </div>
        <div class="v1-calendar-weekdays">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>
        <div class="v1-calendar-grid">${cells}</div>
      `;
    };

    panel.addEventListener("click", (event) => {
      event.stopPropagation();
      const target = event.target as HTMLElement;
      if (target.closest("[data-calendar-prev]")) {
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        renderCal();
        return;
      }
      if (target.closest("[data-calendar-next]")) {
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        renderCal();
        return;
      }
      const day = target.closest<HTMLButtonElement>("[data-date]");
      if (!day || day.disabled) return;
      emitValueChange(dateEl, day.dataset.date || "");
      closePickers();
      syncStatus();
    });

    dateEl.addEventListener("click", (event) => {
      event.stopPropagation();
      expandCard();
      viewDate = dateEl.value ? new Date(`${dateEl.value}T00:00:00`) : viewDate;
      renderCal();
      openPickerPanel(panel, field);
    });
  }

  function setupTimePicker() {
    const field = timeEl.closest<HTMLElement>(".v1-time-field");
    if (!field) return;

    const panel = document.createElement("div");
    panel.className = "v1-picker-popover v1-time-picker";
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("role", "listbox");
    field.appendChild(panel);

    const options = Array.from({ length: 96 }, (_, index) => {
      const total = index * 15;
      const hour = String(Math.floor(total / 60)).padStart(2, "0");
      const minute = String(total % 60).padStart(2, "0");
      return `${hour}:${minute}`;
    });

    const renderTime = () => {
      const selectedDate = dateEl.value;
      const now = new Date();
      const leadPolicy = selectedDate
        ? meetsLeadTimePolicy(selectedDate, "00:00", { isAirportGurugramSubcase: isAirportGgnContext(), now })
        : { minHours: 3 };
      panel.innerHTML = options
        .map((value) => {
          let disabled = false;
          if (selectedDate) {
            const slot = new Date(`${selectedDate}T${value}:00`);
            const minMs = leadPolicy.minHours * 60 * 60 * 1000;
            disabled = !Number.isNaN(slot.getTime()) && slot.getTime() - now.getTime() < minMs;
          }
          return `<button type="button" class="${value === timeEl.value ? "is-selected" : ""}" data-time="${value}" role="option" aria-selected="${value === timeEl.value}" ${disabled ? "disabled" : ""}>${value}</button>`;
        })
        .join("");

      // Scroll selected item into view after render
      window.requestAnimationFrame(() => {
        const selected = panel.querySelector<HTMLElement>(".is-selected");
        selected?.scrollIntoView({ block: "center" });
      });
    };

    panel.addEventListener("click", (event) => {
      event.stopPropagation();
      const target = event.target as HTMLElement;
      const option = target.closest<HTMLButtonElement>("[data-time]");
      if (!option || option.disabled) return;
      emitValueChange(timeEl, option.dataset.time || "");
      closePickers();
      syncStatus();
    });

    timeEl.addEventListener("click", (event) => {
      event.stopPropagation();
      expandCard();
      renderTime();
      openPickerPanel(panel, field);
    });
  }

  function setupHourlyPackagePicker() {
    const dropField = dropEl.closest<HTMLElement>("label");
    if (!dropField) return;

    dropField.classList.add("v1-package-field");
    const panel = document.createElement("div");
    panel.className = "v1-picker-popover v1-time-picker v1-hourly-package-picker";
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("role", "listbox");
    dropField.appendChild(panel);

    const renderHourly = () => {
      panel.innerHTML = HOURLY_PACKAGES.map(
        (p) =>
          `<button type="button" class="${p.key === selectedHourlyPackageKey ? "is-selected" : ""}" data-hourly-pkg="${p.key}" role="option" aria-selected="${p.key === selectedHourlyPackageKey}">${p.label}</button>`
      ).join("");
    };

    panel.addEventListener("click", (event) => {
      event.stopPropagation();
      const opt = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-hourly-pkg]");
      if (!opt) return;
      selectedHourlyPackageKey = opt.dataset.hourlyPkg || selectedHourlyPackageKey;
      dropEl.value = hourlyPackageLabel(selectedHourlyPackageKey);
      closePickers();
      syncStatus();
    });

    dropEl.addEventListener("click", (event) => {
      if (rideMode !== "hourly") return;
      event.preventDefault();
      event.stopPropagation();
      expandCard();
      renderHourly();
      openPickerPanel(panel, dropField);
    });
    renderHourly();
  }

  function syncUI() {
    modeButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.v1Mode === rideMode));
    navModeButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.v1NavMode === rideMode));
    transferButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.v1AirportType === airportSubType));
    terminalButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.v1Terminal === terminal));
    if (airportControls) {
      airportControls.classList.toggle("is-visible", rideMode === "airport");
      airportControls.setAttribute("aria-hidden", String(rideMode !== "airport"));
    }

    if (rideMode === "hourly") {
      pickupEl.disabled = false;
      dropLabel && (dropLabel.textContent = "Packages");
      dropEl.removeAttribute("disabled");
      dropEl.readOnly = true;
      dropEl.setAttribute("aria-haspopup", "listbox");
      dropEl.placeholder = "Hours & km package";
      if (!HOURLY_PACKAGES.some((p) => p.label === dropEl.value.trim())) {
        dropEl.value = hourlyPackageLabel(selectedHourlyPackageKey);
      } else {
        const match = HOURLY_PACKAGES.find((p) => p.label === dropEl.value.trim());
        if (match) selectedHourlyPackageKey = match.key;
      }
      dropPlaceValid = true;
    } else if (rideMode === "airport" && airportSubType === "arrival") {
      dropEl.removeAttribute("readonly");
      dropEl.placeholder = PLACEHOLDER_ADDRESS;
      pickupEl.value = terminal;
      pickupEl.disabled = true;
      pickupPlaceValid = true;
      dropLabel && (dropLabel.textContent = "Drop-off location");
      dropEl.disabled = false;
      if (dropEl.value === terminal || HOURLY_PACKAGES.some((p) => p.label === dropEl.value.trim()) || dropEl.value === "2 hours") {
        dropEl.value = "";
        dropPlaceValid = false;
      }
    } else if (rideMode === "airport" && airportSubType === "departure") {
      dropEl.removeAttribute("readonly");
      dropEl.placeholder = PLACEHOLDER_ADDRESS;
      pickupEl.disabled = false;
      if (
        pickupEl.value === terminal ||
        pickupEl.value === "2 hours" ||
        HOURLY_PACKAGES.some((p) => p.label === pickupEl.value.trim())
      ) {
        pickupEl.value = "";
        pickupPlaceValid = false;
      }
      dropLabel && (dropLabel.textContent = "Drop-off terminal");
      dropEl.value = terminal;
      dropEl.disabled = true;
      dropPlaceValid = true;
    } else {
      dropEl.removeAttribute("readonly");
      dropEl.placeholder = PLACEHOLDER_ADDRESS;
      pickupEl.disabled = false;
      if (pickupEl.value === terminal && airportSubType === "arrival") {
        pickupEl.value = "";
        pickupPlaceValid = false;
      }
      dropLabel && (dropLabel.textContent = "Drop-off location");
      if (
        dropEl.value === "2 hours" ||
        HOURLY_PACKAGES.some((p) => p.label === dropEl.value.trim()) ||
        (dropEl.value === terminal && airportSubType === "departure")
      ) {
        dropEl.value = "";
        dropPlaceValid = false;
      }
      dropEl.disabled = false;
    }
  }

  function expandCard() {
    isExpanded = true;
    bookingCardEl.classList.remove("is-collapsed");
    if (isMobileBreakpoint()) {
      heroContent?.classList.remove("is-hidden");
    } else {
      heroContent?.classList.add("is-hidden");
    }
  }

  function collapseCard() {
    if (isMobileBreakpoint()) {
      expandCard();
      return;
    }
    isExpanded = false;
    closePickers();
    bookingWrap?.classList.remove("is-centered");
    bookingCardEl.classList.add("is-collapsed");
    heroContent?.classList.remove("is-hidden");
    syncStatus();
    syncContinueBookingVisibility();
  }

  function revealBookingFromModeSelection() {
    bookingActivated = true;
    bookingWrap?.removeAttribute("hidden");
    bookingWrap?.classList.remove("is-centered");
    continueBookingBtn?.setAttribute("hidden", "");
    expandCard();
    syncStatus();
  }

  function revealBookingOnLandingSmooth() {
    if (!heroSection) {
      revealBookingFromModeSelection();
      return;
    }
    heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      revealBookingFromModeSelection();
    }, 380);
  }

  reserveLink?.addEventListener("click", (event) => {
    event.preventDefault();
    revealBookingOnLandingSmooth();
  });

  continueBookingBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    revealBookingOnLandingSmooth();
  });

  const closeNavModePill = () => {
    if (!navModePill) return;
    navModePill.classList.remove("is-open");
    reserveNowButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
  };

  const activeReserveTrigger = () => {
    if (isMobileBreakpoint()) return reserveNowMobileBtn ?? reserveNowBtn;
    return reserveNowBtn ?? reserveNowMobileBtn;
  };

  const positionNavModePill = () => {
    const trigger = activeReserveTrigger();
    if (!navModePill || !trigger) return;
    const gap = 24;
    const viewportPad = 12;
    if (isMobileBreakpoint()) {
      const navRect = nav.getBoundingClientRect();
      const left = Math.max(viewportPad, navRect.left + viewportPad);
      const maxWidth = Math.max(220, navRect.width - viewportPad * 2);
      const top = navRect.bottom + 10;
      navModePill.style.left = `${left}px`;
      navModePill.style.top = `${top}px`;
      navModePill.style.width = `${maxWidth}px`;
      return;
    }
    navModePill.style.removeProperty("width");
    const btnRect = trigger.getBoundingClientRect();
    const pillRect = navModePill.getBoundingClientRect();
    const buttonCenter = btnRect.left + btnRect.width / 2;
    const oneWayCenterOffset = pillRect.width / 2;
    const preferredLeft = buttonCenter - oneWayCenterOffset;
    const maxLeft = window.innerWidth - pillRect.width - viewportPad;
    const left = Math.max(viewportPad, Math.min(preferredLeft, maxLeft));
    const top = btnRect.bottom + gap;
    navModePill.style.left = `${left}px`;
    navModePill.style.top = `${top}px`;
  };

  reserveNowButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      closeNavModePill();
      revealBookingOnLandingSmooth();
    });
  });

  navModeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const nextMode = button.dataset.v1NavMode as RideMode | undefined;
      if (!nextMode) return;
      if (nextMode !== rideMode) {
        reconcileBookingMode(rideMode, airportSubType, nextMode);
      }
      rideMode = nextMode;
      syncUI();
      syncStatus();
      revealBookingOnLandingSmooth();
    });
  });

  window.addEventListener("resize", () => {
    closeNavModePill();
    positionNavModePill();
    syncMobileReserveVisibility();
    syncContinueBookingVisibility();
  });
  window.addEventListener("scroll", () => {
    positionNavModePill();
    syncContinueBookingVisibility();
  }, { passive: true });

  function isReady() {
    const pickupNeedsSelection = !pickupEl.disabled;
    const pickupOk = pickupNeedsSelection
      ? Boolean(pickupEl.value.trim()) && (pickupPlaceValid || !placesReady) && (pickupAreaValid || !placesReady)
      : true;
    let dropOk: boolean;
    if (rideMode === "hourly") {
      dropOk = Boolean(selectedHourlyPackageKey) && HOURLY_PACKAGES.some((p) => p.key === selectedHourlyPackageKey);
    } else {
      const dropNeedsSelection = !dropEl.disabled;
      dropOk = dropNeedsSelection
        ? Boolean(dropEl.value.trim()) && (dropPlaceValid || !placesReady) && (dropAreaValid || !placesReady)
        : true;
    }
    const hasDateTime = Boolean(dateEl.value) && Boolean(timeEl.value);
    const leadTime = hasDateTime
      ? meetsLeadTimePolicy(dateEl.value, timeEl.value, { isAirportGurugramSubcase: isAirportGgnContext() })
      : { ok: false, minHours: 3 };
    return placesReady && pickupOk && dropOk && hasDateTime && leadTime.ok;
  }

  function persistAndNavigate() {
    if (!pickupEl.value.trim()) {
      markInvalidPlace(pickupEl, "Enter pickup location.");
      pickupEl.reportValidity();
      return;
    }
    if (rideMode !== "hourly" && !dropEl.disabled && !dropEl.value.trim()) {
      markInvalidPlace(dropEl, "Enter drop-off location.");
      dropEl.reportValidity();
      return;
    }
    if (!pickupEl.disabled && !pickupPlaceValid) {
      pickupPlaceValid = Boolean(pickupEl.value.trim());
    }
    if (rideMode !== "hourly" && !dropEl.disabled && !dropPlaceValid) {
      dropPlaceValid = Boolean(dropEl.value.trim());
    }
    const leadTime = meetsLeadTimePolicy(dateEl.value, timeEl.value, {
      isAirportGurugramSubcase: isAirportGgnContext(),
    });
    if (!leadTime.ok) {
      markInvalidPlace(timeEl, `Pickup time must be at least ${leadTime.minHours} hours from now.`);
      timeEl.reportValidity();
      return;
    }
    if (!isReady()) return;
    const state = { ...baseState };
    state.serviceType = currentServiceType();
    state.airportSubType = rideMode === "airport" ? airportSubType : "";
    state.hourlyPackage = rideMode === "hourly" ? selectedHourlyPackageKey : "";
    state.pickupLocation = rideMode === "airport" && airportSubType === "arrival" ? terminal : pickupEl.value.trim();
    state.dropLocation = rideMode === "hourly" ? "" : (rideMode === "airport" && airportSubType === "departure" ? terminal : dropEl.value.trim());
    state.travelDate = dateEl.value;
    state.travelTime = timeEl.value;

    localStorage.setItem("vb", JSON.stringify(state));
    const store = (window as any).VelvetStore;
    if (store) {
      (store as any).serviceType = state.serviceType;
      (store as any).airportSubType = state.airportSubType;
      (store as any).hourlyPackage = state.hourlyPackage;
      (store as any).pickupLocation = state.pickupLocation;
      (store as any).dropLocation = state.dropLocation;
      (store as any).travelDate = state.travelDate;
      (store as any).travelTime = state.travelTime;
      if (typeof (store as any).save === "function") {
        (store as any).save();
      }
    }
    window.location.href = `/book?type=${rideMode}`;
    (window as any).VelvetAnalytics?.track("booking_start", { rideMode });
  }

  function syncStatus() {
    const ready = isReady();
    submitEl.style.opacity = ready ? "1" : "0.35";
    submitEl.style.pointerEvents = ready ? "auto" : "none";
    const pickupNeedsSelection = !pickupEl.disabled;
    const pickupOk = pickupNeedsSelection ? Boolean(pickupEl.value.trim()) && pickupPlaceValid : true;
    const pkgOk =
      rideMode === "hourly" &&
      Boolean(selectedHourlyPackageKey) &&
      HOURLY_PACKAGES.some((p) => p.key === selectedHourlyPackageKey);
  }

  modeButtons.forEach((b) => {
    b.addEventListener("click", () => {
      const next = (b.dataset.v1Mode as RideMode) || "oneway";
      if (next !== rideMode) {
        reconcileBookingMode(rideMode, airportSubType, next);
      }
      rideMode = next;
      syncUI();
      syncStatus();
    });
  });

  transferButtons.forEach((b) => {
    b.addEventListener("click", () => {
      airportSubType = (b.dataset.v1AirportType as AirportSubType) || "arrival";
      syncUI();
      syncStatus();
    });
  });

  terminalButtons.forEach((b) => {
    b.addEventListener("click", () => {
      terminal = b.dataset.v1Terminal || terminal;
      syncUI();
      syncStatus();
    });
  });

  // On mobile, remove the body lock class when all booking fields lose focus
  // and no panel is open. Uses a short delay to allow re-focus events to fire.
  const handleFieldBlur = () => {
    if (!isMobileBreakpoint()) return;
    setTimeout(() => {
      const activeEl = document.activeElement as HTMLElement | null;
      const fieldStillFocused = activeEl && mobileManagedFields.includes(activeEl as HTMLInputElement);
      if (fieldStillFocused) {
        markActiveMobileField(activeEl as HTMLInputElement);
      } else {
        clearActiveMobileField();
      }
      if (!fieldStillFocused) {
        const hasOpenPicker = Boolean(document.querySelector(".v1-picker-popover.is-open"));
        const hasOpenAutocomplete = Array.from(document.querySelectorAll<HTMLElement>(".velvet-autocomplete"))
          .some((el) => el.style.display !== "none");
        if (!hasOpenPicker && !hasOpenAutocomplete) {
          document.body.classList.remove("v1-mobile-picker-open");
        }
      }
    }, 150);
  };
  mobileManagedFields.forEach((input) => {
    input.addEventListener("blur", handleFieldBlur);
  });

  mobileManagedFields.forEach((input) => {
    input.addEventListener("focus", () => {
      if (!isMobileBreakpoint()) return;
      markActiveMobileField(input);
    });
  });

  [pickupEl, dropEl, dateEl, timeEl].forEach((input) => {
    input.addEventListener("input", syncStatus);
    input.addEventListener("change", syncStatus);
  });

  pickupEl.addEventListener("focus", () => {
    closeAutocompletePanels();
    closePickers();
    if (isMobileBreakpoint()) {
      scrollFieldIntoMobileView(pickupEl);
    }
  });
  dropEl.addEventListener("focus", () => {
    closeAutocompletePanels();
    closePickers();
    if (isMobileBreakpoint()) {
      scrollFieldIntoMobileView(dropEl);
    }
  });
  dateEl.addEventListener("focus", () => {
    if (isMobileBreakpoint()) {
      scrollFieldIntoMobileView(dateEl);
    }
  });
  timeEl.addEventListener("focus", () => {
    if (isMobileBreakpoint()) {
      scrollFieldIntoMobileView(timeEl);
    }
  });

  pickupEl.addEventListener("input", () => {
    if (pickupEl.disabled) return;
    pickupPlaceValid = false;
    pickupAreaValid = false;
    clearPlaceValidation(pickupEl);
    syncStatus();
  });
  dropEl.addEventListener("input", () => {
    if (rideMode === "hourly") {
      dropPlaceValid = true;
      return;
    }
    if (dropEl.disabled) return;
    dropPlaceValid = false;
    dropAreaValid = false;
    clearPlaceValidation(dropEl);
    syncStatus();
  });

  submitEl.addEventListener("click", persistAndNavigate);

  bookingCardEl.addEventListener("click", (event) => {
    if (!isExpanded) {
      event.preventDefault();
      expandCard();
    }
  });

  document.addEventListener("click", (event) => {
    if (isMobileBreakpoint()) return;
    const t = event.target as HTMLElement;
    const hasOpenAutocompletePanels = Array.from(document.querySelectorAll<HTMLElement>(".velvet-autocomplete"))
      .some((panel) => panel.style.display !== "none");
    const activeEl = document.activeElement as HTMLElement | null;
    const inputFocused = Boolean(activeEl && (activeEl === pickupEl || activeEl === dropEl));
    const clickedReserveTrigger = reserveNowButtons.some((button) => button.contains(t));
    const clickedContinue = continueBookingBtn?.contains(t);
    const clickedBookingCard = bookingCardEl.contains(t);
    if (!clickedReserveTrigger && !navModePill?.contains(t) && !clickedContinue && !clickedBookingCard) {
      closeNavModePill();
    }
    if (!isExpanded) return;
    if (Date.now() - lastAutocompleteSelectAt < 1500) return;
    if (hasOpenAutocompletePanels) return;
    if (inputFocused) return;
    if (modeWrap?.contains(t)) return;
    if (bookingCardEl.contains(t)) return;
    if (t.closest(".velvet-autocomplete, .pac-container")) return;
    if (t.closest(".v1-picker-popover")) return;
    if (t.closest(".service-capsule[data-service-mode]")) return;
    if (continueBookingBtn?.contains(t)) return;
    if (clickedReserveTrigger || navModePill?.contains(t)) return;
    closePickers();
    closeNavModePill();
    collapseCard();
  });

  // Guard against collapse during autocomplete item click lifecycle
  document.addEventListener("mousedown", (event) => {
    const t = event.target as HTMLElement | null;
    if (!t) return;
    if (t.closest(".velvet-autocomplete, .pac-container")) {
      lastAutocompleteSelectAt = Date.now();
    }
  }, true);

  (window as unknown as { __velvetApplyBookingMode?: (mode: RideMode) => void }).__velvetApplyBookingMode = (mode: RideMode) => {
    if (mode !== "airport" && mode !== "oneway" && mode !== "hourly") return;
    if (mode !== rideMode) {
      reconcileBookingMode(rideMode, airportSubType, mode);
    }
    rideMode = mode;
    syncUI();
    syncStatus();
    revealBookingFromModeSelection();
    const store = (window as any).VelvetStore;
    if (store) {
      (store as any).serviceType = currentServiceType();
      (store as any).airportSubType = rideMode === "airport" ? airportSubType : "";
      (store as any).hourlyPackage = rideMode === "hourly" ? selectedHourlyPackageKey : "";
      if (typeof (store as any).save === "function") (store as any).save();
    }
  };

  document.addEventListener("keydown", (event) => {
    if (isMobileBreakpoint()) return;
    if (event.key === "Escape" && isExpanded) {
      collapseCard();
    }
  });

  gsap.set(".v1-nav", { clearProps: "transform,opacity" });
  closeNavModePill();
  positionNavModePill();
  if (isMobileBreakpoint()) {
    bookingWrap?.removeAttribute("hidden");
    bookingWrap?.classList.remove("is-centered");
    continueBookingBtn?.setAttribute("hidden", "");
    bookingCardEl.classList.remove("is-collapsed");
    isExpanded = true;
    heroContent?.classList.remove("is-hidden");
  } else {
    bookingWrap?.removeAttribute("hidden");
    bookingWrap?.classList.remove("is-centered");
    continueBookingBtn?.setAttribute("hidden", "");
    bookingCardEl.classList.add("is-collapsed");
    isExpanded = false;
    heroContent?.classList.remove("is-hidden");
  }
  syncContinueBookingVisibility();
  syncMobileReserveVisibility();
  window.addEventListener("resize", () => {
    if (!bookingActivated) {
      if (isMobileBreakpoint()) {
        bookingWrap?.removeAttribute("hidden");
        bookingWrap?.classList.remove("is-centered");
        continueBookingBtn?.setAttribute("hidden", "");
        bookingCardEl.classList.remove("is-collapsed");
        isExpanded = true;
        heroContent?.classList.remove("is-hidden");
      } else {
        bookingWrap?.removeAttribute("hidden");
        bookingWrap?.classList.remove("is-centered");
        continueBookingBtn?.setAttribute("hidden", "");
        bookingCardEl.classList.add("is-collapsed");
        isExpanded = false;
        heroContent?.classList.remove("is-hidden");
      }
      syncContinueBookingVisibility();
      syncMobileReserveVisibility();
      return;
    }
    if (isMobileBreakpoint()) {
      expandCard();
    } else if (isExpanded) {
      heroContent?.classList.add("is-hidden");
    } else {
      heroContent?.classList.remove("is-hidden");
    }
    syncContinueBookingVisibility();
    syncMobileReserveVisibility();
  });
  syncUI();
  syncStatus();
  setupPlacesAutocomplete();
  setupDatePicker();
  setupTimePicker();
  setupHourlyPackagePicker();
}

export default function HomeClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, Observer);

    initAnimations();
    initHeroMediaRotation();
    initVersionOneNavAndBooking();
    initServiceBookingInteractions();
  }, []);

  return null;
}