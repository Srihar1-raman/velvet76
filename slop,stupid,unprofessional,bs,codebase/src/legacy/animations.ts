import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, Observer, ScrollToPlugin);

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const touchQuery = window.matchMedia("(pointer: coarse)");

function animateSplitText() {
  document.fonts.ready.then(() => {
    document.querySelectorAll<HTMLElement>(".split-heading").forEach((heading) => {
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
    if (document.body.classList.contains("is-fleet-scroll-active")) return;
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

    if (document.body.classList.contains("is-fleet-scroll-active")) {
      hideHeader();
    } else if (current < 48 || delta < -4) {
      showHeader();
    } else if (delta > 4 && current > 90) {
      hideHeader();
    }

    lastScroll = Math.max(current, 0);
    ticking = false;
  };

  window.addEventListener("pointermove", (event) => {
    if (document.body.classList.contains("is-fleet-scroll-active")) return;
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
  const field = document.querySelector<HTMLElement>(".monogram-field");
  const premise = document.querySelector<HTMLElement>(".premise");
  if (!field || !premise) return;

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
    image.src = `${import.meta.env.BASE_URL}assets/monogram-gold.png`;
    image.alt = "";
    image.decoding = "async";
    particle.appendChild(image);
    particle.style.setProperty("--x", `${xBase + xOffset}%`);
    particle.style.setProperty("--y", `${yBase + yOffset}%`);
    particle.style.setProperty("--size", `${touchQuery.matches ? 34 : 48}px`);
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

  if (touchQuery.matches) return;

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

  premise.addEventListener("pointermove", repel);
  premise.addEventListener("pointerleave", () => {
    particles.forEach((particle) => {
      gsap.to(particle, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
    });
  });
}

function initMotionReel() {
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

function initFleet() {
  const track = document.querySelector<HTMLElement>(".fleet-track");
  const slides = gsap.utils.toArray<HTMLElement>(".fleet-slide");
  if (!track || slides.length === 0) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 900px)", () => {
    const bodies = slides
      .map((slide) => slide.querySelector<HTMLElement>(".fleet-slide__body"))
      .filter(Boolean) as HTMLElement[];

    gsap.set(bodies, { y: 42, autoAlpha: 0 });
    if (bodies[0]) gsap.set(bodies[0], { y: 0, autoAlpha: 1 });

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: ".fleet",
        start: "top top",
        end: () => `+=${Math.max(track.scrollWidth * 0.72, window.innerWidth * 2.6)}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        refreshPriority: 1,
        onEnter: () => document.body.classList.add("is-fleet-scroll-active"),
        onEnterBack: () => document.body.classList.add("is-fleet-scroll-active"),
        onLeave: () => document.body.classList.remove("is-fleet-scroll-active"),
        onLeaveBack: () => document.body.classList.remove("is-fleet-scroll-active")
      }
    });

    slides.forEach((slide, index) => {
      if (index === 0) return;
      const body = slide.querySelector(".fleet-slide__body");
      if (!body) return;
      gsap.fromTo(
        body,
        { y: 42, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "power3.out",
          immediateRender: true,
          scrollTrigger: {
            trigger: slide,
            containerAnimation: tween,
            start: "left 64%",
            end: "left 36%",
            scrub: 0.8,
            invalidateOnRefresh: true
          }
        }
      );
    });
  });

  mm.add("(max-width: 899px)", () => {
    slides.forEach((slide) => {
      gsap.from(slide, {
        y: 42,
        autoAlpha: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: slide,
          start: "top 82%",
          once: true
        }
      });
    });
  });
}

function initTiers() {
  const media = document.querySelector<HTMLImageElement>(".tier-media img");
  const details = document.querySelector<HTMLElement>(".tier-active-details");
  const list = document.querySelector<HTMLElement>(".tier-list");
  const stage = document.querySelector<HTMLElement>(".tier-stage");
  const panels = gsap.utils.toArray<HTMLButtonElement>(".tier-panel");
  if (!media || panels.length === 0) return;
  const tierMedia = media;
  let transitionId = 0;
  let isDraggingCar = false;

  gsap.from(".tier-media img, .tier-list, .tier-active-details", {
    y: 34,
    autoAlpha: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".tiers",
      start: "top 68%",
      once: true
    }
  });

  if (stage && !touchQuery.matches && !reduceMotionQuery.matches) {
    const xTo = gsap.quickTo(tierMedia, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(tierMedia, "y", { duration: 0.55, ease: "power3.out" });
    const rotateTo = gsap.quickTo(tierMedia, "rotate", { duration: 0.55, ease: "power3.out" });

    stage.addEventListener("pointermove", (event) => {
      if (isDraggingCar) return;
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      xTo(x * 18);
      yTo(y * 10);
      rotateTo(x * 1.2);
    });

    stage.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
      rotateTo(0);
    });
  }

  if (!reduceMotionQuery.matches) {
    Draggable.create(tierMedia, {
      type: "x,y",
      allowNativeTouchScrolling: false,
      onPress() {
        isDraggingCar = true;
        gsap.killTweensOf(tierMedia);
        gsap.to(tierMedia, { scale: 1.015, duration: 0.18, ease: "power2.out", overwrite: true });
      },
      onDrag() {
        gsap.set(tierMedia, { rotate: this.x * 0.018 });
      },
      onRelease() {
        isDraggingCar = false;
        gsap.to(tierMedia, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.82,
          ease: "elastic.out(1, 0.62)",
          overwrite: true
        });
      }
    });
  }

  function selectPanel(panel: HTMLButtonElement) {
    if (panel.classList.contains("is-selected")) return;

    const nextSrc = panel.dataset.tierImage ?? tierMedia.src;
    const currentTransition = ++transitionId;
    isDraggingCar = false;
    panels.forEach((item) => item.classList.toggle("is-selected", item === panel));
    if (list) list.dataset.activeIndex = panel.dataset.tierIndex ?? "0";

    const swapCar = () => {
      if (currentTransition !== transitionId) return;
      gsap.killTweensOf(tierMedia);

      const outgoing = tierMedia.cloneNode(false) as HTMLImageElement;
      outgoing.removeAttribute("id");
      outgoing.alt = "";
      outgoing.setAttribute("aria-hidden", "true");
      outgoing.classList.add("tier-media__ghost");
      tierMedia.parentElement?.appendChild(outgoing);

      tierMedia.src = nextSrc;
      gsap.set(tierMedia, { x: -150, y: 18, rotate: -3.4, scale: 0.97, autoAlpha: 0 });
      gsap.set(outgoing, { x: 0, y: 0, rotate: 0, scale: 1, autoAlpha: 1 });

      gsap.timeline({
        defaults: { overwrite: true },
        onComplete: () => outgoing.remove()
      })
        .to(outgoing, {
          x: 170,
          y: -10,
          rotate: 4.2,
          scale: 0.98,
          autoAlpha: 0,
          duration: 0.44,
          ease: "power2.inOut"
        }, 0)
        .to(tierMedia, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.62,
          ease: "power3.out"
        }, 0.14);
    };

    const preload = new Image();
    preload.onload = swapCar;
    preload.onerror = swapCar;
    preload.src = nextSrc;

    if (details) {
      gsap.to(details, {
        autoAlpha: 0,
        y: 8,
        duration: 0.18,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          if (currentTransition !== transitionId) return;
          details.innerHTML = `
            <p>${panel.dataset.tierModels ?? ""}</p>
            <p>${panel.dataset.tierMeta ?? ""}</p>
            <p>${panel.dataset.tierPoints ?? ""}</p>
          `;
          gsap.to(details, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out", overwrite: true });
        }
      });
    }
  }

  panels.forEach((panel) => {
    panel.addEventListener("focus", () => selectPanel(panel));
    panel.addEventListener("click", () => selectPanel(panel));
  });
}

function initChauffeurSequence() {
  const frames = gsap.utils.toArray<HTMLElement>(".story-frame");
  if (frames.length === 0) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 900px)", () => {
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
        pin: true
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

export function initAnimations() {
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
  initFleet();
  initTiers();
  initChauffeurSequence();
  initMagneticButtons();
  initHoverPreview();

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
