import { initAnimations } from "./animations";
import { fleet, services, tiers } from "./assets";
import { initVelvetAutocomplete } from "./autocomplete";
import "./store.js";
import gsap from "gsap";

const SERVICE_BOOKING_MODES = ["oneway", "airport", "hourly"] as const;

function renderServices() {
  const grid = document.querySelector<HTMLDivElement>(".service-grid");
  if (!grid) return;

  grid.innerHTML = services
    .map(
      (service, index) => `
        <article
          class="service-item reveal-item service-capsule"
          data-hover-img="${service.image}"
          data-service-mode="${SERVICE_BOOKING_MODES[index]}"
          role="button"
          tabindex="0"
          aria-label="Book ${service.name}: open booking form with this ride type"
        >
          <span class="item-index">${String(index + 1).padStart(2, "0")}</span>
          <h3>${service.name}</h3>
          <p>${service.line}</p>
          <strong>${service.scope}</strong>
        </article>
      `
    )
    .join("");
}

function renderFleet() {
  const track = document.querySelector<HTMLDivElement>(".fleet-track");
  if (!track) return;

  track.innerHTML = fleet
    .map(
      (vehicle, index) => `
        <article class="fleet-slide" style="--fleet-index: ${index}">
          <div class="fleet-slide__image">
            <img src="${vehicle.image}" alt="${vehicle.model}" loading="${index === 0 ? "eager" : "lazy"}" />
          </div>
          <div class="fleet-slide__body">
            <span>${vehicle.className}</span>
            <h3>${vehicle.model}</h3>
          </div>
        </article>
      `
    )
    .join("");
}

function renderTiers() {
  const list = document.querySelector<HTMLDivElement>(".tier-list");
  if (!list) return;

  list.dataset.activeIndex = "2";
  list.innerHTML = tiers
    .map(
      (tier, index) => `
        <button class="tier-panel reveal-item ${index === 2 ? "is-selected" : ""}" type="button" data-tier-index="${index}" data-tier-image="${tier.image}" data-tier-models="${tier.models}" data-tier-meta="${tier.capacity} | ${tier.luggage}" data-tier-points="${tier.points.join(" / ")}">
          <span class="tier-panel__eyebrow">${tier.eyebrow}</span>
          <span class="tier-panel__name">${tier.name}</span>
        </button>
      `
    )
    .join("");
}

function initTheme() {
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll<HTMLButtonElement>("[data-theme-choice]")];
  const saved = localStorage.getItem("velvet-theme");
  const initialTheme = saved === "light" || saved === "dark" ? saved : "dark";

  function applyTheme(theme: "dark" | "light") {
    root.dataset.theme = theme;
    localStorage.setItem("velvet-theme", theme);
    buttons.forEach((button) => {
      const isActive = button.dataset.themeChoice === theme;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  applyTheme(initialTheme);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.themeChoice === "light" ? "light" : "dark";
      applyTheme(theme);
    });
  });
}

function initLinks() {
  const scrollToBooking = () => {
    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  document.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("[data-scroll-book]").forEach((link) => {
    link.addEventListener("click", () => {
      scrollToBooking();
    });
  });

  document.querySelectorAll<HTMLAnchorElement>("a[href='#contact'], a[href='#top']").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = link.getAttribute("href") === "#contact" ? "#contact" : "#top";
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function initBookingCard() {
  const card = document.querySelector('[data-booking-card]') as HTMLElement;
  const collapsedRow = document.querySelector('[data-booking-collapsed]') as HTMLElement;
  const airportControls = document.querySelector('[data-airport-controls]') as HTMLElement;
  const modeBtns = document.querySelectorAll('[data-booking-mode-btn]') as NodeListOf<HTMLElement>;
  const transferBtns = document.querySelectorAll('[data-transfer-type]') as NodeListOf<HTMLElement>;
  const terminalBtns = document.querySelectorAll('[data-terminal]') as NodeListOf<HTMLElement>;
  const pickupInput = document.querySelector('[data-input-role="pickup"]') as HTMLInputElement;
  const dropInput = document.querySelector('[data-input-role="drop"]') as HTMLInputElement;
  const dateInput = document.querySelector('[data-input-role="date"]') as HTMLInputElement;
  const timeInput = document.querySelector('[data-input-role="time"]') as HTMLInputElement;
  const statusEl = document.querySelector('[data-booking-status]') as HTMLElement;
  const dropLabels = document.querySelectorAll('[data-drop-label]') as NodeListOf<HTMLElement>;
  const searchBtns = document.querySelectorAll('[data-booking-search-btn]') as NodeListOf<HTMLAnchorElement>;
  const summaryPickup = document.querySelector('[data-summary-pickup]') as HTMLElement;
  const summaryDrop = document.querySelector('[data-summary-drop]') as HTMLElement;
  const summaryDate = document.querySelector('[data-summary-date]') as HTMLElement;
  const summaryTime = document.querySelector('[data-summary-time]') as HTMLElement;
  const heroContent = document.getElementById('hero-content') as HTMLElement;

  if (!card || !pickupInput) return;

  let rideMode: 'airport' | 'oneway' | 'hourly' = 'oneway';
  let airportTransferType: 'arrival' | 'departure' = 'arrival';
  let airportTerminal = 'Terminal 3 (T3), IGI Airport, New Delhi';
  let isExpanded = false;

  function updateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    if (service === 'airport-transfer') rideMode = 'airport';
    else if (service === 'hourly-rental') rideMode = 'hourly';
    else if (service === 'city-ride') rideMode = 'oneway';
    applyMode();
  }

  function applyMode() {
    modeBtns.forEach(btn => {
      btn.classList.toggle('is-active', (btn as HTMLElement).dataset.mode === rideMode);
    });

    if (airportControls) {
      airportControls.classList.toggle('is-visible', rideMode === 'airport');
    }

    dropLabels.forEach(el => {
      if (rideMode === 'hourly') el.textContent = 'Duration';
      else if (rideMode === 'airport' && airportTransferType === 'departure') el.textContent = 'Drop-off terminal';
      else el.textContent = 'Drop-off location';
    });

    if (rideMode === 'airport' && airportTransferType === 'arrival') {
      pickupInput.value = airportTerminal;
      pickupInput.disabled = true;
    } else {
      if (pickupInput.disabled) pickupInput.value = '';
      pickupInput.disabled = false;
    }

    if (rideMode === 'hourly') {
      dropInput.value = '2 hours';
      dropInput.disabled = true;
    } else if (rideMode === 'airport' && airportTransferType === 'departure') {
      dropInput.value = airportTerminal;
      dropInput.disabled = true;
    } else {
      if (dropInput.value === '2 hours') dropInput.value = '';
      dropInput.disabled = false;
    }

    updateCollapsed();
    updateStatus();
  }

  function updateCollapsed() {
    if (!summaryPickup) return;
    const pk = rideMode === 'airport' ? (airportTransferType === 'arrival' ? airportTerminal : (pickupInput.value || 'Pickup not set')) : (pickupInput.value || 'Address, airport, hotel, ...');
    const dr = rideMode === 'hourly' ? '2 hours' : rideMode === 'airport' && airportTransferType === 'departure' ? airportTerminal : (dropInput.value || 'Select destination');
    summaryPickup.textContent = pk;
    summaryDrop.textContent = dr;
    summaryDate.textContent = dateInput.value ? formatDate(dateInput.value) : 'Select a date';
    summaryTime.textContent = timeInput.value ? formatTime(timeInput.value) : 'Select time';
  }

  function formatDate(v: string) {
    const d = new Date(v + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function formatTime(v: string) {
    const [h, m] = v.split(':');
    const d = new Date(2000, 0, 1, parseInt(h), parseInt(m));
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  }

  function updateStatus() {
    const hasPickup = rideMode === 'airport' ? true : Boolean(pickupInput.value.trim());
    const hasDrop = rideMode === 'hourly' ? true : Boolean(dropInput.value.trim());
    const hasDate = Boolean(dateInput.value);
    const hasTime = Boolean(timeInput.value);
    const ready = hasPickup && hasDrop && hasDate && hasTime;

    if (statusEl) {
      statusEl.textContent = ready ? 'Ready to view available rides' : 'Enter your trip details above';
    }

    const store = (window as any).VelvetStore;
    if (store) {
      const type = rideMode === 'hourly' ? 'hourly-rental' : rideMode === 'airport' ? 'airport-transfer' : 'city-ride';
      const effectivePickup = rideMode === 'airport' ? (airportTransferType === 'arrival' ? airportTerminal : pickupInput.value) : pickupInput.value;
      const effectiveDrop = rideMode === 'hourly' ? '' : rideMode === 'airport' && airportTransferType === 'departure' ? airportTerminal : dropInput.value;
      store.serviceType = type;
      store.airportSubType = rideMode === 'airport' ? airportTransferType : '';
      store.pickupLocation = effectivePickup;
      store.dropLocation = effectiveDrop;
      store.travelDate = dateInput.value;
      store.travelTime = timeInput.value;
      store.save();
    }

    searchBtns.forEach(btn => {
      if (!btn) return;
      btn.style.opacity = ready ? '1' : '0.35';
      btn.style.pointerEvents = ready ? 'auto' : 'none';
    });
  }

  function revealCard() {
    isExpanded = true;
    card.classList.remove('is-collapsed');
    if (heroContent) heroContent.classList.add('is-hidden');
    applyMode();
  }

  function collapseCard() {
    isExpanded = false;
    card.classList.add('is-collapsed');
    if (heroContent) heroContent.classList.remove('is-hidden');
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rideMode = (btn as HTMLElement).dataset.mode as 'airport' | 'oneway' | 'hourly';
      if (!isExpanded) revealCard();
      applyMode();
    });
  });

  transferBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      airportTransferType = (btn as HTMLElement).dataset.transferType as 'arrival' | 'departure';
      transferBtns.forEach(b => b.classList.toggle('is-active', b === btn));
      applyMode();
    });
  });

  terminalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      airportTerminal = (btn as HTMLElement).dataset.terminal || '';
      terminalBtns.forEach(b => b.classList.toggle('is-active', b === btn));
      applyMode();
    });
  });

  [pickupInput, dropInput, dateInput, timeInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => { updateCollapsed(); updateStatus(); });
    input.addEventListener('change', () => { updateCollapsed(); updateStatus(); });
  });

  card.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-booking-mode-btn]') || target.closest('[data-transfer-type]') || target.closest('[data-terminal]') || target.closest('input') || target.closest('a') || target.closest('button')) return;
    if (!isExpanded) revealCard();
  });

  if (collapsedRow) {
    collapsedRow.addEventListener('click', () => { if (!isExpanded) revealCard(); });
  }

  document.addEventListener('click', (e) => {
    if (card.contains(e.target as Node)) return;
    if (!isExpanded) return;
    collapseCard();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isExpanded) collapseCard();
  });

  card.addEventListener('keydown', (e) => {
    const ready = !searchBtns[0] || searchBtns[0].style.opacity !== '0.35';
    if (e.key === 'Enter' && ready) {
      const store = (window as any).VelvetStore;
      if (store) store.save();
      window.location.href = './book.html';
    }
  });

  if (heroContent) heroContent.classList.remove('is-hidden');
  card.classList.add('is-collapsed');
  updateFromURL();
  updateCollapsed();
  updateStatus();
}

function initMobileMenu() {
  const openBtn = document.querySelector('.hamburger-btn') as HTMLButtonElement;
  const closeBtn = document.getElementById('mobile-close') as HTMLButtonElement;
  const overlay = document.getElementById('mobile-overlay') as HTMLDivElement;
  const menu = document.getElementById('mobile-menu') as HTMLDivElement;

  if (!openBtn || !menu) return;

  function openMenu() {
    overlay.style.display = 'block';
    menu.classList.remove('is-closed');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.style.display = 'none';
    menu.classList.add('is-closed');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  const bookingLinks = menu.querySelectorAll('[data-booking-mode]') as NodeListOf<HTMLElement>;
  bookingLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const mode = link.dataset.bookingMode as string;
      const store = (window as any).VelvetStore;
      if (store) {
        if (mode === 'airport') store.serviceType = 'airport-transfer';
        else if (mode === 'oneway') store.serviceType = 'city-ride';
        else if (mode === 'hourly') store.serviceType = 'hourly-rental';
        store.save();
      }
      closeMenu();
      const bookingCard = document.getElementById('booking-card');
      if (bookingCard) {
        e.preventDefault();
        bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
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

renderServices();
renderFleet();
renderTiers();
initTheme();
initLinks();
initAnimations();
initBookingCard();
initMobileMenu();
initHeroMediaRotation();

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
  const syncContinueBookingVisibility = () => {
    if (!continueBookingBtn) return;
    if (isMobileView() || !heroSection) {
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
    }, { threshold: 0.02 });
    reserveObserver.observe(heroSection);
  } else {
    syncReserveVisibility();
    window.addEventListener("scroll", syncReserveVisibility, { passive: true });
  }

  let lastMobileScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      if (!isMobileView()) {
        nav.classList.remove("is-hidden");
        lastMobileScrollY = window.scrollY;
        return;
      }
      const currentY = window.scrollY;
      if (currentY < 14) {
        nav.classList.remove("is-hidden");
        lastMobileScrollY = currentY;
        return;
      }
      if (currentY > lastMobileScrollY + 3) {
        nav.classList.add("is-hidden");
      } else if (currentY < lastMobileScrollY - 3) {
        nav.classList.remove("is-hidden");
      }
      lastMobileScrollY = currentY;
    },
    { passive: true }
  );

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
  const status = document.getElementById("v1-book-status");
  const submit = document.getElementById("v1-book-submit") as HTMLButtonElement | null;
  if (!pickupInput || !dropInput || !dateInput || !timeInput || !submit) return;
  const pickupEl = pickupInput;
  const dropEl = dropInput;
  const dateEl = dateInput;
  const timeEl = timeInput;
  const submitEl = submit;

  type RideMode = "airport" | "oneway" | "hourly";
  type AirportSubType = "arrival" | "departure";

  let rideMode: RideMode = "oneway";
  let airportSubType: AirportSubType = "arrival";
  let terminal = "Terminal 3 (T3), IGI Airport, New Delhi";
  let bookingActivated = false;
  let isExpanded = false;
  let placesReady = false;
  let placesFailed = false;
  let pickupPlaceValid = false;
  let dropPlaceValid = false;
  /** Keys match `HOURLY_PACKAGES` in `store.js`. */
  const HOURLY_PACKAGES: { key: string; label: string }[] = [
    { key: "4h40km", label: "4 hrs / 40 km" },
    { key: "6h60km", label: "6 hrs / 60 km" },
    { key: "8h80km", label: "8 hrs / 80 km" },
  ];
  let selectedHourlyPackageKey = "4h40km";
  const isMobileView = () => window.matchMedia("(max-width: 899px)").matches;
  const closePickers = () => {
    document.querySelectorAll<HTMLElement>(".v1-picker-popover.is-open").forEach((panel) => {
      panel.classList.remove("is-open");
      panel.classList.remove("is-open-above");
      panel.setAttribute("aria-hidden", "true");
    });
  };
  const placePicker = (panel: HTMLElement, anchor: HTMLElement) => {
    panel.classList.remove("is-open-above");
    const panelRect = panel.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const viewportPad = 10;
    const spaceBelow = window.innerHeight - anchorRect.bottom - viewportPad;
    const spaceAbove = anchorRect.top - viewportPad;
    if (spaceBelow < panelRect.height && spaceAbove > panelRect.height) {
      panel.classList.add("is-open-above");
    }
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

  /** Avoid mixing airport-terminal / hourly-package values when switching tabs. */
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

  const PLACEHOLDER_ADDRESS = "Address, airport, hotel, …";
  pickupEl.placeholder = PLACEHOLDER_ADDRESS;
  dropEl.placeholder = PLACEHOLDER_ADDRESS;

  function clearPlaceValidation(input: HTMLInputElement) {
    input.setCustomValidity("");
  }

  function markInvalidPlace(input: HTMLInputElement, message: string) {
    input.setCustomValidity(message);
  }

  function setupPlacesAutocomplete() {
    const estimator = (window as any).VelvetMapsEstimator;
    if (!estimator || typeof estimator.loadMapsApi !== "function") {
      placesFailed = true;
      syncStatus();
      return;
    }

    estimator
      .loadMapsApi()
      .then(() => {
        const g = (window as any).google;
        if (!g?.maps?.places?.AutocompleteService) {
          placesFailed = true;
          syncStatus();
          return;
        }

        initVelvetAutocomplete({
          input: pickupEl,
          country: "in",
          onSelect: (place) => {
            pickupPlaceValid = Boolean(place?.place_id);
            if (pickupPlaceValid) {
              pickupEl.value = place.formatted_address || place.name || pickupEl.value;
              clearPlaceValidation(pickupEl);
            }
            syncStatus();
          },
          onClear: () => {
            pickupPlaceValid = false;
            syncStatus();
          },
        });

        initVelvetAutocomplete({
          input: dropEl,
          country: "in",
          allowed: () => rideMode !== "hourly",
          onSelect: (place) => {
            dropPlaceValid = Boolean(place?.place_id);
            if (dropPlaceValid) {
              dropEl.value = place.formatted_address || place.name || dropEl.value;
              clearPlaceValidation(dropEl);
            }
            syncStatus();
          },
          onClear: () => {
            dropPlaceValid = false;
            syncStatus();
          },
        });

        placesReady = true;
        syncStatus();
      })
      .catch(() => {
        placesFailed = true;
        syncStatus();
      });
  }

  function setupDatePicker() {
    const field = dateEl.closest(".v1-date-field");
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

    const render = () => {
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
        render();
        return;
      }
      if (target.closest("[data-calendar-next]")) {
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        render();
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
      closePickers();
      viewDate = dateEl.value ? new Date(`${dateEl.value}T00:00:00`) : viewDate;
      render();
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      placePicker(panel, field as HTMLElement);
    });
  }

  function setupTimePicker() {
    const field = timeEl.closest(".v1-time-field");
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

    const render = () => {
      panel.innerHTML = options.map((value) => `<button type="button" class="${value === timeEl.value ? "is-selected" : ""}" data-time="${value}" role="option" aria-selected="${value === timeEl.value}">${value}</button>`).join("");
    };

    panel.addEventListener("click", (event) => {
      event.stopPropagation();
      const target = event.target as HTMLElement;
      const option = target.closest<HTMLButtonElement>("[data-time]");
      if (!option) return;
      emitValueChange(timeEl, option.dataset.time || "");
      closePickers();
      syncStatus();
    });

    timeEl.addEventListener("click", (event) => {
      event.stopPropagation();
      expandCard();
      closePickers();
      render();
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      placePicker(panel, field as HTMLElement);
    });
  }

  function setupHourlyPackagePicker() {
    const dropField = dropEl.closest("label");
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
      closePickers();
      renderHourly();
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      placePicker(panel, dropField);
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
    if (isMobileView()) {
      heroContent?.classList.remove("is-hidden");
    } else {
      heroContent?.classList.add("is-hidden");
    }
  }

  function collapseCard() {
    if (isMobileView()) {
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
    if (isMobileView()) return reserveNowMobileBtn ?? reserveNowBtn;
    return reserveNowBtn ?? reserveNowMobileBtn;
  };

  const positionNavModePill = () => {
    const trigger = activeReserveTrigger();
    if (!navModePill || !trigger) return;
    const gap = 24;
    const viewportPad = 12;
    if (isMobileView()) {
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
    syncContinueBookingVisibility();
  });
  window.addEventListener(
    "scroll",
    () => {
      positionNavModePill();
      syncContinueBookingVisibility();
    },
    { passive: true }
  );

  function isReady() {
    const pickupNeedsSelection = !pickupEl.disabled;
    const pickupOk = pickupNeedsSelection ? Boolean(pickupEl.value.trim()) && pickupPlaceValid : true;
    let dropOk: boolean;
    if (rideMode === "hourly") {
      dropOk = Boolean(selectedHourlyPackageKey) && HOURLY_PACKAGES.some((p) => p.key === selectedHourlyPackageKey);
    } else {
      const dropNeedsSelection = !dropEl.disabled;
      dropOk = dropNeedsSelection ? Boolean(dropEl.value.trim()) && dropPlaceValid : true;
    }
    const hasDateTime = Boolean(dateEl.value) && Boolean(timeEl.value);
    return placesReady && pickupOk && dropOk && hasDateTime;
  }

  function persistAndNavigate() {
    if (!placesReady) return;
    if (!pickupEl.disabled && !pickupPlaceValid) {
      markInvalidPlace(pickupEl, "Select a pickup from Google Maps suggestions.");
      pickupEl.reportValidity();
      return;
    }
    if (rideMode !== "hourly" && !dropEl.disabled && !dropPlaceValid) {
      markInvalidPlace(dropEl, "Select a drop-off from Google Maps suggestions.");
      dropEl.reportValidity();
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
      store.serviceType = state.serviceType;
      store.airportSubType = state.airportSubType;
      store.hourlyPackage = state.hourlyPackage;
      store.pickupLocation = state.pickupLocation;
      store.dropLocation = state.dropLocation;
      store.travelDate = state.travelDate;
      store.travelTime = state.travelTime;
      if (typeof store.save === "function") {
        store.save();
      }
    }
    window.location.href = `./book.html?type=${rideMode}`;
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
    if (status) {
      if (placesFailed) status.textContent = "Google Maps failed to load. Refresh and try again.";
      else if (!placesReady) status.textContent = "Loading Google Maps place search...";
      else if (ready) status.textContent = "Ready to view available rides";
      else if (rideMode === "hourly") {
        status.textContent =
          pickupOk && pkgOk
            ? "Select date and pickup time"
            : "Select pickup and hourly package from the lists";
      } else status.textContent = "Select pickup/drop from Google Maps suggestions";
    }
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

  [pickupEl, dropEl, dateEl, timeEl].forEach((input) => {
    input.addEventListener("input", syncStatus);
    input.addEventListener("change", syncStatus);
  });

  pickupEl.addEventListener("input", () => {
    if (pickupEl.disabled) return;
    pickupPlaceValid = false;
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
    if (isMobileView()) return;
    const t = event.target as HTMLElement;
    const clickedReserveTrigger = reserveNowButtons.some((button) => button.contains(t));
    const clickedContinue = continueBookingBtn?.contains(t);
    const clickedBookingCard = bookingCardEl.contains(t);
    if (!clickedReserveTrigger && !navModePill?.contains(t) && !clickedContinue && !clickedBookingCard) {
      closeNavModePill();
    }
    if (!isExpanded) return;
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
      store.serviceType = currentServiceType();
      store.airportSubType = rideMode === "airport" ? airportSubType : "";
      store.hourlyPackage = rideMode === "hourly" ? selectedHourlyPackageKey : "";
      if (typeof store.save === "function") store.save();
    }
  };

  document.addEventListener("keydown", (event) => {
    if (isMobileView()) return;
    if (event.key === "Escape" && isExpanded) {
      collapseCard();
    }
  });

  // Keep the navbar stable on first paint to avoid visible jump/glitch.
  gsap.set(".v1-nav", { clearProps: "transform,opacity" });
  closeNavModePill();
  positionNavModePill();
  if (isMobileView()) {
    bookingWrap?.setAttribute("hidden", "");
    continueBookingBtn?.setAttribute("hidden", "");
    bookingCardEl.classList.add("is-collapsed");
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
  window.addEventListener("resize", () => {
    if (!bookingActivated) {
      if (isMobileView()) {
        bookingWrap?.setAttribute("hidden", "");
        bookingWrap?.classList.remove("is-centered");
        continueBookingBtn?.setAttribute("hidden", "");
        bookingCardEl.classList.add("is-collapsed");
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
      return;
    }
    if (isMobileView()) {
      expandCard();
    } else if (isExpanded) {
      heroContent?.classList.add("is-hidden");
    } else {
      heroContent?.classList.remove("is-hidden");
    }
    syncContinueBookingVisibility();
  });
  syncUI();
  syncStatus();
  setupPlacesAutocomplete();
  setupDatePicker();
  setupTimePicker();
  setupHourlyPackagePicker();
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
  let lastX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  let lastY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

  /** Preview card size + gap from cursor (up-right diagonal from pointer). */
  const PREVIEW_W = 316;
  const PREVIEW_H = 198;
  const CURSOR_GAP_X = 56;
  /** Space between preview bottom edge and cursor (preview sits above pointer). */
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

initVersionOneNavAndBooking();
initServiceBookingInteractions();
