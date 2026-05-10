"use client";

import { useEffect } from "react";
import {
  isAirportGurugramSubcase,
  isServiceableText,
  meetsLeadTimePolicy,
  SERVICE_AREA_ERROR,
} from "@/lib/bookingPolicy";
import { escapeAttr, escapeHtml } from "@/lib/escapeHtml";
import { whatsappSendUrl } from "@/lib/whatsapp";

export default function BookClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Source of truth: `Velvet/public/book.html` inline IIFE.
    // Intentionally kept as close as possible; only route paths were adapted
    // from `*.html` to App Router routes.
    (function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      var TIERS = [
        {
          key: "elite",
          tier: "Velvet Elite",
          subtitle: "The Flagship",
          models: "Mercedes E-Class / BMW 5 Series",
          capacity: "Up to 3 passengers",
          luggage: "3 medium or 2 large",
          img: "/assets/elite%20tier%20mercedes%20e%20class.png",
        },
        {
          key: "premier",
          tier: "Velvet Premier",
          subtitle: "Business Class",
          models: "Mercedes C-Class / BMW 330Li",
          capacity: "Up to 3 passengers",
          luggage: "3 medium or 2 large",
          img: "/assets/premier%20tier%20c%20class%20mercedes.png",
        },
        {
          key: "vault",
          tier: "Velvet Vault",
          subtitle: "SUV Comfort",
          models: "BMW iX1 / Audi Q3",
          capacity: "Up to 3 passengers",
          luggage: "3 medium or 2 large",
          img: "/assets/vault%20tierbmw%20ix1.png",
        },
      ];
      var CARS = [
        { model: "Mercedes E-Class", img: "/assets/elite%20tier%20mercedes%20e%20class.png", tier: "elite" },
        { model: "BMW 5 Series", img: "/assets/elite%20tier%20bmw%205%20series.png", tier: "elite" },
        { model: "Mercedes C-Class", img: "/assets/premier%20tier%20c%20class%20mercedes.png", tier: "premier" },
        { model: "BMW 330Li", img: "/assets/premier%20tier%20bmw%20330%20li.png", tier: "premier" },
        { model: "Audi Q3", img: "/assets/vault%20tier%20audi%20q3.png", tier: "vault" },
        { model: "BMW iX1", img: "/assets/vault%20tierbmw%20ix1.png", tier: "vault" },
      ];
      var ABOUT_STORY_BY_TIER: any = {
        elite: "/assets/about/8.jpg",
        premier: "/assets/about/6.jpg",
        vault: "/assets/about/4.jpg",
      };
      var STEP3_TIER_VIDEO: any = {
        elite: "/assets/hero1.mp4",
        premier: "/assets/hero2.mp4",
        vault: "/assets/fleet-reel.mp4",
      };
      var STORY_SERVICES = [
        { label: "Premium Alkaline Water", img: "/assets/about/1.jpg", desc: "Premium Alkaline Water" },
        { label: "Easy-Pour Tea & Coffee", img: "/assets/about/2.jpeg", desc: "Easy-Pour Tea & Coffee" },
        { label: "Disposable Hygiene Neck-Rest", img: "/assets/about/3.jpg", desc: "Disposable Hygiene Neck-Rest" },
        { label: "Daily Newspaper", img: "/assets/about/4.jpg", desc: "Daily Newspaper" },
        { label: "White-Gloved Trained Chauffeurs", img: "/assets/about/5.jpeg", desc: "White-Gloved Trained Chauffeurs" },
        { label: "Fragrance Setup", img: "/assets/about/6.jpg", desc: "Fragrance Setup" },
        { label: "Infotainment Screens", img: "/assets/about/7.jpeg", desc: "Infotainment Screens" },
        { label: "Pre-Cool Temperature", img: "/assets/about/8.jpg", desc: "Pre-Cool Temperature" },
      ];
      // kept for parity (not all keys are used in runtime)
      var CONSTRAINTS = { vault: { maxPax: 3, maxMed: 3, maxLg: 2 }, premier: { maxPax: 3, maxMed: 3, maxLg: 2 }, elite: { maxPax: 3, maxMed: 3, maxLg: 2 } };
      var P2P_RATES = { vault: 100, premier: 125, elite: 175 };
      var P2P_STRIKE_RATES = { vault: 125, premier: 150, elite: 225 };
      var WAITING_PER_15_MIN = { vault: 250, premier: 375, elite: 500 };
      var EXTRA_TIME_PER_30_MIN = { vault: 500, premier: 750, elite: 1000 };
      var HOURLY_PKGS = [
        { key: "4h40km", label: "4 hrs / 40 km", hours: 4, kmIncluded: 40, prices: { vault: 5500, premier: 7000, elite: 9000 } },
        { key: "6h60km", label: "6 hrs / 60 km", hours: 6, kmIncluded: 60, prices: { vault: 8000, premier: 10500, elite: 13500 } },
        { key: "8h80km", label: "8 hrs / 80 km", hours: 8, kmIncluded: 80, prices: { vault: 10500, premier: 14000, elite: 18000 } },
        { key: "10h100km", label: "10 hrs / 100 km", hours: 10, kmIncluded: 100, prices: { vault: 12500, premier: 17500, elite: 22500 } },
      ];
      function normalizeHourlyKey(k: string) {
        if (!k) return "4h40km";
        return HOURLY_PKGS.some(function (p) { return p.key === k; }) ? k : "4h40km";
      }
      function hourlyLabelFromKey(key: string) {
        var p = HOURLY_PKGS.find(function (x) { return x.key === key; });
        return p ? p.label : "";
      }
      function hourlyKmFromStore(S: any) {
        if (!S || S.serviceType !== "hourly-rental" || !S.hourlyPackage) return null;
        var p = HOURLY_PKGS.find(function (x) { return x.key === S.hourlyPackage; });
        return p ? p.kmIncluded : null;
      }
      function calcPrice(tierKey: string) {
        var S = (window as any).VelvetStore;
        if (!S) return 0;
        if (S.serviceType === "hourly-rental" && S.hourlyPackage) {
          var pkg = HOURLY_PKGS.find(function (p) { return p.key === S.hourlyPackage; });
          return pkg ? (pkg as any).prices[tierKey] : 0;
        }
        var km = Math.max(S.distanceKm || 0, 12);
        return Math.ceil((km * (P2P_RATES as any)[tierKey]) / 100) * 100;
      }
      function calcParking() {
        var S = (window as any).VelvetStore;
        if (!S) return 0;
        if (S.serviceType !== "airport-transfer" || S.airportSubType !== "arrival") return 0;
        var loc = S.pickupLocation || "";
        if (loc.includes("T3")) return 270;
        if (loc.includes("T1") || loc.includes("T2")) return 200;
        return 0;
      }
      function fmtPrice(v: number) { return "\u20B9" + v.toLocaleString("en-IN"); }
      function tierKeySafe(tierKey: string) {
        return TIERS.some(function (t) { return t.key === tierKey; }) ? tierKey : "vault";
      }
      function extraKmRate(tierKey: string) {
        var safe = tierKeySafe(tierKey);
        return (P2P_RATES as any)[safe];
      }
      function waitingRatePer15(tierKey: string) {
        var safe = tierKeySafe(tierKey);
        return (WAITING_PER_15_MIN as any)[safe];
      }
      function extraTimeRatePer30(tierKey: string) {
        var safe = tierKeySafe(tierKey);
        return (EXTRA_TIME_PER_30_MIN as any)[safe];
      }
      function getSelectedDateTime() {
        if (!dateEl || !timeEl || !dateEl.value || !timeEl.value) return null;
        var dt = new Date(dateEl.value + "T" + timeEl.value + ":00");
        return Number.isNaN(dt.getTime()) ? null : dt;
      }
      function meetsMinPrebookingWindow() {
        var selected = getSelectedDateTime();
        if (!selected) return false;
        var policy = meetsLeadTimePolicy(dateEl.value, timeEl.value, {
          isAirportGurugramSubcase: isAirportGurugramSubcase(pickupEl.value || "", dropEl.value || ""),
        });
        return policy.ok;
      }
      function fmtStrike(tierKey: string) {
        var p = calcPrice(tierKey);
        if ((window as any).VelvetStore && (window as any).VelvetStore.serviceType === "hourly-rental") return Math.round(p * 1.25);
        var km = Math.max(((window as any).VelvetStore.distanceKm || 0), 12);
        return Math.ceil((km * (P2P_STRIKE_RATES as any)[tierKey]) / 100) * 100;
      }

      var currentStep = 1;
      var selectedTier = "";
      var selectedCar = "";
      var paxCount = 1;
      var adultCount = 1;
      var infantCount = 0;
      var cabinBags = 0;
      var smallBags = 0;
      var medBags = 0;
      var lgBags = 0;
      var otpVerified = true;
      var lastEstimateKey = "";

      var bookedFor = "self";
      var passengerNames = [""];
      var passengerPhone = "";
      var mapStoryIndex = 0;
      var mapStoryArmed = false;
      var mapStoryTimer: number | null = null;
      var mapStoryResumeAt = 0;
      var step2AutoAdvanceTimer: number | null = null;

      function stopMapStoryAutoplay() {
        if (mapStoryTimer !== null) {
          window.clearTimeout(mapStoryTimer);
          mapStoryTimer = null;
        }
      }
      function clearStep2AutoAdvance() {
        if (step2AutoAdvanceTimer !== null) {
          window.clearTimeout(step2AutoAdvanceTimer);
          step2AutoAdvanceTimer = null;
        }
      }

      function startMapStoryAutoplay(totalSlides: number, S: any) {
        stopMapStoryAutoplay();
        if (!S || totalSlides <= 1) return;
        var isMobileStory = window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
        mapStoryTimer = window.setTimeout(function () {
          if (Date.now() < mapStoryResumeAt) {
            startMapStoryAutoplay(totalSlides, S);
            return;
          }
          mapStoryIndex = (mapStoryIndex + 1) % totalSlides;
          renderMapStoryLayer(S, true);
          startMapStoryAutoplay(totalSlides, S);
        }, isMobileStory ? 3000 : 3000);
      }

      function holdMapStoryAutoplay(ms: number) {
        mapStoryResumeAt = Date.now() + ms;
      }

      function goToStep(n: number) {
        if (n < 1) n = 1;
        if (n > 3) n = 3;
        currentStep = n;
        (window as any).VelvetAnalytics?.track("booking_step_view", { step: currentStep });
        render();
        var panel = document.getElementById("flow-panel") as HTMLDivElement | null;
        if (panel) panel.scrollTop = 0;
        if (window.matchMedia && window.matchMedia("(max-width: 1023px)").matches) {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      }

      function render() {
        var S = (window as any).VelvetStore;
        var panel = document.getElementById("flow-panel") as HTMLDivElement | null;
        var mapPanel = document.querySelector(".map-panel") as HTMLElement | null;
        var layout = document.querySelector(".book-layout") as HTMLElement | null;
        if (!panel) return;
        if (!S || !S.serviceType || !S.travelDate || !S.travelTime) {
          panel.innerHTML = '<div class="no-booking"><h2>No ride details found</h2><p>Start by entering your pickup and drop-off on the homepage.</p><a href="/#booking">Go to booking</a></div>';
          document.body.classList.remove("otp-gate-active");
          return;
        }
        updateNav(S);
        var html = "";
        html += '<div class="step-indicator">';
        for (var i = 1; i <= 3; i++) {
          html += '<div class="step-dot' + (i === currentStep ? " is-active" : (i < currentStep ? " is-complete" : "")) + '"></div>';
        }
        html += "</div>";

        if (currentStep === 1) html += renderStep2(S);
        else if (currentStep === 2) html += renderStep3PricingOtp(S);
        else if (currentStep === 3) html += renderStep4FinalRequest(S);

        panel.innerHTML = html;
        panel.classList.toggle("step-closing-focus", currentStep >= 2);
        if (mapPanel) {
          mapPanel.classList.toggle("step-closing-focus", currentStep >= 2);
          mapPanel.setAttribute("data-current-step", String(currentStep));
          mapPanel.setAttribute("data-selected-tier", selectedTier || (S && S.selectedTier) || "elite");
        }
        if (layout) {
          layout.setAttribute("data-current-step", String(currentStep));
          layout.setAttribute("data-selected-tier", selectedTier || (S && S.selectedTier) || "elite");
        }
        document.body.classList.remove("otp-gate-active");
        bindEvents();
        estimateRoute(S);
        clearStep2AutoAdvance();
        if (currentStep === 2) {
          step2AutoAdvanceTimer = window.setTimeout(function () {
            if (currentStep === 2) goToStep(3);
          }, 850);
        }
        var canShowStoryLayer = currentStep >= 2;
        renderMapStoryLayer(S, canShowStoryLayer);
      }

      function renderMapStoryLayer(S: any, visible: boolean) {
        var shell = document.getElementById("map-story-ribbon") as HTMLDivElement | null;
        if (!shell) return;
        if (!visible) {
          stopMapStoryAutoplay();
          shell.classList.remove("is-visible");
          shell.innerHTML = "";
          return;
        }
        var tier = selectedTier || (S && S.selectedTier) || "elite";
        var cars = CARS.filter(function (c) { return c.tier === tier; });
        var heroCar = cars.length ? cars[0] : null;
        var tierObj = TIERS.find(function (t) { return t.key === tier; }) || TIERS[0];
        var storySlides: any[] = [];
        if (heroCar) {
          storySlides.push({
            label: tierObj.subtitle,
            img: ABOUT_STORY_BY_TIER[tierObj.key] || heroCar.img,
            desc: tierObj.tier + " for your chosen route.",
          });
        }
        STORY_SERVICES.forEach(function (s) { storySlides.push(s); });
        if (!storySlides.length) return;
        if (mapStoryIndex >= storySlides.length) mapStoryIndex = 0;
        if (mapStoryIndex < 0) mapStoryIndex = 0;
        var activeSlide = storySlides[mapStoryIndex];
        var storyLine = currentStep === 2 ? "Preview the arrival mood." : "Refined, ready, on call.";
        shell.setAttribute("data-story-tier", tierObj.key);
        shell.setAttribute("data-story-index", String(mapStoryIndex));
        shell.setAttribute("data-story-total", String(storySlides.length));
        shell.innerHTML =
          '<div class="map-story-stage">' +
          '<div class="map-story-track" style="transform:translateX(' + (-100 * mapStoryIndex) + '%)">' +
          storySlides.map(function (slide) {
            return '<div class="map-story-media" style="background-image:url(\'' + slide.img + '\')"><div class="map-story-media-label">' + slide.label + "</div></div>";
          }).join("") +
          "</div>" +
          "</div>" +
          '<div class="map-story-copy">' +
          '<p class="map-story-kicker">' + tierObj.tier + "</p>" +
          '<h3 class="map-story-title">' + activeSlide.label + "</h3>" +
          '<div class="map-story-controls">' +
          '<div class="map-story-dots">' +
          storySlides.map(function (_s, i) {
            return '<button type="button" class="map-story-dot' + (i === mapStoryIndex ? " is-active" : "") + '" data-story-dot="' + i + '" onclick="window._mapStoryGo(' + i + ');return false;" aria-label="View slide ' + (i + 1) + '"></button>';
          }).join("") +
          "</div>" +
          '<div class="map-story-nav">' +
          '<button type="button" class="map-story-nav-btn" data-story-nav="prev" onclick="window._mapStoryNav(\'prev\');return false;" aria-label="Previous visual">‹</button>' +
          '<button type="button" class="map-story-nav-btn" data-story-nav="next" onclick="window._mapStoryNav(\'next\');return false;" aria-label="Next visual">›</button>' +
          "</div>" +
          "</div>" +
          "</div>" +
          '<div class="map-story-grain" aria-hidden="true"></div>';
        shell.classList.add("is-visible");
        startMapStoryAutoplay(storySlides.length, S);
      }

      function updateNav(S: any) {
        var p = document.getElementById("nav-pickup");
        var d = document.getElementById("nav-drop");
        var dt = document.getElementById("nav-datetime");
        if (p) p.textContent = S.pickupLocation || "Pickup";
        if (d) d.textContent = S.serviceType === "hourly-rental" ? hourlyLabelFromKey(S.hourlyPackage || "") : (S.dropLocation || "Drop-off");
        if (dt) dt.textContent = (S.travelDate || "") + " at " + (S.travelTime || "");
      }

      function renderStep2(S: any) {
        paxCount = Math.max(1, adultCount + infantCount);
        var nameRows = "";
        var primaryPassengerName = passengerNames[0] || "";
        var passengerPhoneHint = "Trip details and updates will be provided on this number only.";
        nameRows += '<div class="passenger-name-row"><label class="input-label">Passenger name <span style="color:#ef4444">*</span></label><input type="text" class="input-field" data-pax-name="0" placeholder="Full name" value="' + escapeAttr(primaryPassengerName) + '"></div>';
        nameRows +=
          '<div class="passenger-name-row">' +
          '<label class="input-label">Passenger mobile number <span style="color:#ef4444">*</span></label>' +
          '<div style="display:flex;align-items:center;gap:0.5rem">' +
          '<span style="font-size:0.94rem;color:var(--text-muted);white-space:nowrap">+91</span>' +
          '<input type="tel" class="input-field" data-passenger-phone="1" placeholder="10-digit mobile number" inputmode="numeric" maxlength="10" style="flex:1;min-width:0" value="' + escapeAttr(passengerPhone) + '">' +
          '</div>' +
          '<div class="input-hint">' + passengerPhoneHint + "</div>" +
          "</div>";
        var invalidAdults = adultCount > 3;
        var invalidInfants = infantCount > 2;
        var invalidTotal = paxCount > 4;
        var passengerMixInvalid = invalidAdults || invalidInfants || invalidTotal;
        var policyBlock = passengerMixInvalid
          ? '<div class="policy-alert">Passenger mix not supported for one car. Max 3 adults, max 2 infants, and max 4 total passengers.</div>'
          : "";
        return '<p class="step-eyebrow">Step 1 of 3</p>' +
          '<h1 class="step-title">Passenger details</h1>' +
          '<p class="step-subtitle">Add adults, infants, and luggage type before viewing prices.</p>' +
          '<div class="section-kicker"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1"></path><circle cx="9.5" cy="7" r="3"></circle></svg>Passenger info</div>' +
          '<div class="stepper-row">' +
          '<span class="stepper-label">Adults</span>' +
          '<div style="display:flex;align-items:center;gap:0.5rem;margin-left:auto">' +
          '<button class="stepper-btn" onclick="window._adultChange(-1)">−</button>' +
          '<span class="stepper-value">' + adultCount + "</span>" +
          '<button class="stepper-btn" onclick="window._adultChange(1)">+</button>' +
          "</div>" +
          "</div>" +
          '<div class="stepper-row">' +
          '<span class="stepper-label">Infants</span>' +
          '<div style="display:flex;align-items:center;gap:0.5rem;margin-left:auto">' +
          '<button class="stepper-btn" onclick="window._infantChange(-1)">−</button>' +
          '<span class="stepper-value">' + infantCount + "</span>" +
          '<button class="stepper-btn" onclick="window._infantChange(1)">+</button>' +
          "</div>" +
          "</div>" +
          policyBlock +
          '<div class="info-divider"></div>' +
          '<div class="section-kicker"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="7" width="14" height="12" rx="2"></rect><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>Luggage info</div>' +
          '<div class="stepper-row">' +
          '<span class="stepper-label">Small/Cabin luggage</span>' +
          '<div style="display:flex;align-items:center;gap:0.5rem;margin-left:auto">' +
          '<button class="stepper-btn" onclick="window._cabinChange(-1)">−</button>' +
          '<span class="stepper-value">' + (cabinBags + smallBags) + "</span>" +
          '<button class="stepper-btn" onclick="window._cabinChange(1)">+</button>' +
          "</div>" +
          "</div>" +
          '<div class="stepper-row" style="margin-top:0.5rem">' +
          '<span class="stepper-label">Medium luggage</span>' +
          '<div style="display:flex;align-items:center;gap:0.5rem;margin-left:auto">' +
          '<button class="stepper-btn" onclick="window._lgChange(-1)">−</button>' +
          '<span class="stepper-value">' + medBags + "</span>" +
          '<button class="stepper-btn" onclick="window._lgChange(1)">+</button>' +
          "</div>" +
          "</div>" +
          '<div class="stepper-row" style="margin-top:0.5rem">' +
          '<span class="stepper-label">Large luggage</span>' +
          '<div style="display:flex;align-items:center;gap:0.5rem;margin-left:auto">' +
          '<button class="stepper-btn" onclick="window._xlChange(-1)">−</button>' +
          '<span class="stepper-value">' + lgBags + "</span>" +
          '<button class="stepper-btn" onclick="window._xlChange(1)">+</button>' +
          "</div>" +
          "</div>" +
          '<div class="input-hint">* Cabin and small luggage are hand-carry category. Infants are included in rider manifest.</div>' +
          '<div class="booking-for-toggle">' +
          '<button type="button" class="' + (bookedFor === "self" ? "is-active" : "") + "\" onclick=\"window._setBookedFor('self')\">For me</button>" +
          '<button type="button" class="' + (bookedFor === "other" ? "is-active" : "") + "\" onclick=\"window._setBookedFor('other')\">For someone else</button>" +
          "</div>" +
          '<div style="margin-bottom:1.25rem">' + nameRows + "</div>" +
          '<div class="btn-row"><button class="btn btn-outline" onclick="window._prevStep()">Back</button><button class="btn btn-primary" onclick="window._nextStep()">Continue</button></div>';
      }

      function renderPricingCards(S: any) {
        var hasSelection = !!selectedTier;
        return TIERS.map(function (t: any) {
          var base = calcPrice(t.key);
          var parking = calcParking();
          var total = base + parking;
          var strike = fmtStrike(t.key);
          var toneClass = t.key === "elite" ? " tier-pricing-card--elite" : (t.key === "premier" ? " tier-pricing-card--premier" : " tier-pricing-card--vault");
          var isSelected = t.key === selectedTier;
          var selClass = isSelected ? " is-selected" : (hasSelection ? " is-dimmed" : "");
          var heroCar = CARS.find(function (c: any) { return c.tier === t.key; });
          var cardStyle = heroCar ? ' style="margin-bottom:0;--tier-hero-image:url(\'' + heroCar.img + '\')"' : ' style="margin-bottom:0"';
          return '<div class="tier-card tier-pricing-card' + toneClass + selClass + '" data-tier-pricing="' + t.key + '"' + cardStyle + ">" +
            '<span class="tier-eyebrow">' + t.tier + "</span>" +
            '<div class="tier-pricing-top">' +
            '<span class="tier-name">' + t.subtitle + "</span>" +
            '<span class="tier-pricing-icons">' +
            '<span class="tier-meta-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1"></path><circle cx="9.5" cy="7" r="3"></circle></svg>3</span>' +
            '<span class="tier-meta-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="7" width="14" height="12" rx="2"></rect><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>3</span>' +
            "</span>" +
            "</div>" +
            '<div class="tier-pricing-head">' +
            '<span class="tier-models">' + t.models + "</span>" +
            "</div>" +
            '<div class="tier-pricing-fare"><span class="tier-pricing-fare-label">Estimated fare</span><span class="tier-pricing-fare-values"><strong>' + fmtPrice(total) + '</strong><span class="tier-pricing-strike">' + fmtPrice(strike) + "</span></span></div>" +
            "</div>";
        }).join("");
      }

      function renderStep3PricingOtp(S: any) {
        return '<p class="step-eyebrow">Step 2 of 3</p>' +
          '<h1 class="step-title">Pricing unlock</h1>' +
          '<p class="step-subtitle">Online booking is being updated. We are taking you to the final request step.</p>' +
          '<div class="price-card-wrap has-selection" style="position:relative">' +
          '<div class="tier-pricing-list" style="filter:blur(12px);opacity:0.5;pointer-events:none">' + renderPricingCards(S) + "</div>" +
          '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:1rem">' +
          '<div style="width:min(92%,24rem);text-align:center;background:rgba(10,10,16,0.92);border:1px solid rgba(255,255,255,0.2);border-radius:10px;padding:1rem 1.15rem;box-shadow:0 10px 30px rgba(0,0,0,0.35)">' +
          '<p style="margin:0;font-size:0.9rem;line-height:1.55;color:rgba(247,242,232,0.95)"><strong style="color:#f2e1b3">Online booking coming soon.</strong><br/>Continuing to final step...</p>' +
          "</div>" +
          "</div>" +
          "</div>";
      }

      function renderStep4FinalRequest(S: any) {
        var nameValue = S && S.userName ? S.userName : "";
        var tier = TIERS.find(function (t) { return t.key === selectedTier; }) || TIERS[0];
        var basePrice = calcPrice(selectedTier);
        var parking = calcParking();
        var total = basePrice + parking;
        var extraKm = extraKmRate(selectedTier);
        var waiting = waitingRatePer15(selectedTier);
        var extraTime = extraTimeRatePer30(selectedTier);
        var isHourly = S.serviceType === "hourly-rental";
        var isAirport = S.serviceType === "airport-transfer";
        var serviceNotes = "";
        serviceNotes += '<div style="margin-top:0.15rem;padding:0.7rem 0.8rem;border:1px solid rgba(255,255,255,0.14);border-radius:8px;background:rgba(255,255,255,0.04)">' +
          '<div style="font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.42rem">Service & extra charges</div>' +
          '<div class="detail-row"><span class="detail-label">Waiting</span><span class="detail-value">' + fmtPrice(waiting) + " / 15 mins</span></div>";
        if (isHourly) {
          serviceNotes += '<div class="detail-row"><span class="detail-label">Extra km / time</span><span class="detail-value">' + fmtPrice(extraKm) + " / km · " + fmtPrice(extraTime) + " / 30 mins</span></div>";
        } else if (isAirport && parking > 0) {
          serviceNotes += '<div class="detail-row"><span class="detail-label">Airport parking</span><span class="detail-value">' + fmtPrice(parking) + "</span></div>";
        }
        serviceNotes += '<div class="detail-row"><span class="detail-label">Toll / parking</span><span class="detail-value">As actuals</span></div>' +
          '<div class="detail-row"><span class="detail-label">GST</span><span class="detail-value">18% included</span></div>' +
          "</div>";
        var distLine = S.serviceType === "hourly-rental" ? ((hourlyKmFromStore(S) != null) ? ("Up to " + hourlyKmFromStore(S) + " km included") : "—") : (S.distanceKm ? (S.distanceKm + " km") : "Calculating...");
        var luggageParts: string[] = [];
        if ((cabinBags + smallBags) > 0) luggageParts.push((cabinBags + smallBags) + " small/cabin");
        if (medBags > 0) luggageParts.push(medBags + " medium");
        if (lgBags > 0) luggageParts.push(lgBags + " large");
        var luggageLine = luggageParts.length ? luggageParts.join(", ") : "—";
        var recapVideo = STEP3_TIER_VIDEO[selectedTier] || "/assets/interior-reel.mp4";
        return '<p class="step-eyebrow">Step 3 of 3</p>' +
          '<div class="input-group"><label class="input-label">Your name</label><input type="text" class="input-field" id="name-input" placeholder="What should we call you?" value="' + escapeAttr(nameValue) + '"></div>' +
          '<div class="step-hero-recap">' +
          '<video class="step-hero-ambient" autoplay muted loop playsinline preload="none" aria-hidden="true"><source src="' + escapeAttr(recapVideo) + '" type="video/mp4"></video>' +
          '<div class="step-hero-content">' +
          '<span class="step-hero-tier">' + escapeHtml(tier.tier) + '</span>' +
          '<span class="step-hero-subtitle">' + escapeHtml(tier.subtitle) + '</span>' +
          '<span class="step-hero-models">' + escapeHtml(tier.models) + '</span>' +
          '</div>' +
          '<div class="step-hero-gradient" aria-hidden="true"></div>' +
          '</div>' +
          '<div class="price-card price-card--ambient">' +
          '<div style="font-family:Playfair Display,Georgia,serif;font-size:1.1rem;color:var(--text);margin-bottom:0.75rem">' + escapeHtml(tier.tier) + " — " + escapeHtml(tier.subtitle) + "</div>" +
          '<div class="detail-row"><span class="detail-label">Pickup</span><span class="detail-value">' + escapeHtml(S.pickupLocation || "") + "</span></div>" +
          (S.serviceType === "hourly-rental"
            ? '<div class="detail-row"><span class="detail-label">Package</span><span class="detail-value">' + escapeHtml(hourlyLabelFromKey(S.hourlyPackage || "")) + "</span></div>"
            : '<div class="detail-row"><span class="detail-label">Drop-off</span><span class="detail-value">' + escapeHtml(S.dropLocation || "") + "</span></div>") +
          '<div style="height:0.45rem"></div>' +
          '<div class="detail-row"><span class="detail-label">When</span><span class="detail-value">' + escapeHtml(S.travelDate) + " at " + escapeHtml(S.travelTime) + "</span></div>" +
          '<div class="detail-row"><span class="detail-label">Distance</span><span class="detail-value">' + escapeHtml(distLine) + "</span></div>" +
          '<div style="height:0.45rem"></div>' +
          '<div class="detail-row"><span class="detail-label">Passengers</span><span class="detail-value">' + paxCount + " (" + adultCount + " adults, " + infantCount + " infants)</span></div>" +
          '<div class="detail-row"><span class="detail-label">Luggage</span><span class="detail-value">' + escapeHtml(luggageLine) + "</span></div>" +
          '<div style="height:0.45rem"></div>' +
          '<div class="summary-price-separator"></div>' +
          serviceNotes +
          '<p style="margin:0.65rem 0 0;color:var(--text-dim);font-size:0.72rem;line-height:1.45">Fare and chauffeur allocation are confirmed on WhatsApp after route and availability checks.</p>' +
          "</div>" +
          '<div class="input-group" style="margin-top:1.25rem"><label class="input-label">Special requests</label><textarea class="input-field" id="special-request" rows="3" placeholder="Mention PNR for tracking, request same chauffeur, luggage help, child seat, or cabin preferences." style="resize:vertical;font-size:0.88rem;min-height:80px">' + escapeHtml(((window as any).VelvetStore && (window as any).VelvetStore.specialRequest) ? (window as any).VelvetStore.specialRequest : "") + "</textarea></div>" +
          '<div class="step-cta-fade" aria-hidden="true"></div>' +
          '<p role="status" style="font-size:0.82rem;line-height:1.55;color:#d4ffe0;margin-top:1rem;padding:0.85rem 1rem;border-radius:8px;border:1px solid rgba(34,197,94,0.72);background:rgba(14,88,48,0.34)"><strong style="color:#9af2bb">Before you continue:</strong> Tapping <strong>Request now</strong> opens WhatsApp with your ride details pre-filled in the message box. You must tap <strong>Send</strong> in WhatsApp so our team receives your request. Payment and final confirmation are coordinated on WhatsApp after we receive your message.</p>' +
          '<div class="btn-row"><button class="btn btn-outline" onclick="window._goToStep(1)">Back</button><button class="btn btn-primary" onclick="window._requestRide()">Request now</button></div>' +
          '<p style="text-align:center;font-size:0.75rem;color:var(--text-dim);margin-top:0.75rem;line-height:1.4">Payment and ride confirmation happen via WhatsApp after ride allocation.</p>';
      }

      function bindEvents() {
        document.querySelectorAll(".tier-card").forEach(function (el) {
          el.addEventListener("click", function () {
            selectedTier = (el as HTMLElement).getAttribute("data-tier") || selectedTier;
            var S = (window as any).VelvetStore;
            if (S) { S.selectedTier = selectedTier; S.save(); }
            render();
          });
        });
        document.querySelectorAll("[data-tier-pricing]").forEach(function (el) {
          el.addEventListener("click", function () {
            selectedTier = (el as HTMLElement).getAttribute("data-tier-pricing") || selectedTier;
            var cars = CARS.filter(function (c) { return c.tier === selectedTier; });
            if (cars.length) selectedCar = cars[0].model;
            mapStoryIndex = 0;
            mapStoryArmed = true;
            var S = (window as any).VelvetStore;
            if (S) { S.selectedTier = selectedTier; S.save(); }
            render();
          });
        });
        var storyRibbon = document.getElementById("map-story-ribbon") as HTMLDivElement | null;
        if (storyRibbon && !(storyRibbon as any).dataset.bound) {
          var ribbon = storyRibbon;
          (ribbon as any).dataset.bound = "1";
          ribbon.addEventListener("click", function (e) {
            var t = e.target as HTMLElement;
            if (!t) return;
            var total = parseInt(ribbon.getAttribute("data-story-total") || "0", 10);
            if (!Number.isFinite(total) || total <= 0) return;
            var isMobileStory = window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
            if (isMobileStory) return;
            var navBtn = t.closest("[data-story-nav]") as HTMLElement | null;
            if (navBtn) {
              e.stopPropagation();
              e.preventDefault();
              var dir = navBtn.getAttribute("data-story-nav");
              mapStoryIndex = dir === "prev"
                ? (mapStoryIndex - 1 + total) % total
                : (mapStoryIndex + 1) % total;
              holdMapStoryAutoplay(5200);
              render();
              return;
            }
            var dotBtn = t.closest("[data-story-dot]") as HTMLElement | null;
            if (dotBtn) {
              e.stopPropagation();
              e.preventDefault();
              var idx = parseInt(dotBtn.getAttribute("data-story-dot") || "0", 10);
              if (!Number.isFinite(idx)) return;
              mapStoryIndex = Math.max(0, Math.min(total - 1, idx));
              holdMapStoryAutoplay(5200);
              render();
              return;
            }
            var stage = t.closest(".map-story-stage") as HTMLElement | null;
            if (stage) {
              mapStoryIndex = (mapStoryIndex + 1) % total;
              holdMapStoryAutoplay(3200);
              render();
            }
          });
          ribbon.addEventListener("keydown", function (e) {
            var ev = e as KeyboardEvent;
            var total = parseInt(ribbon.getAttribute("data-story-total") || "0", 10);
            if (!Number.isFinite(total) || total <= 0) return;
            if (ev.key === "ArrowRight") {
              mapStoryIndex = (mapStoryIndex + 1) % total;
              render();
            } else if (ev.key === "ArrowLeft") {
              mapStoryIndex = (mapStoryIndex - 1 + total) % total;
              render();
            }
          });
        }
        document.querySelectorAll<HTMLInputElement>("[data-pax-name]").forEach(function (el) {
          el.addEventListener("input", function () {
            var idx = parseInt(el.getAttribute("data-pax-name") || "0");
            passengerNames[idx] = el.value;
            var S = (window as any).VelvetStore;
            if (S) { S.passengerNames = passengerNames; S.save(); }
          });
        });
        document.querySelectorAll<HTMLInputElement>("[data-passenger-phone]").forEach(function (el) {
          el.addEventListener("input", function () {
            var digits = (el.value || "").replace(/\D/g, "").slice(0, 10);
            el.value = digits;
            passengerPhone = digits;
            var S = (window as any).VelvetStore;
            if (S) { S.phone = passengerPhone; S.save(); }
          });
        });
      }

      function estimateRoute(S: any) {
        if (S.serviceType === "hourly-rental") return;
        if (!S.pickupLocation || !S.dropLocation) return;
        var key = [S.pickupLocation, S.dropLocation, S.travelDate, S.travelTime].join("|");
        if (key === lastEstimateKey) return;
        lastEstimateKey = key;
        if ((window as any).VelvetMapsEstimator) {
          (window as any).VelvetMapsEstimator.estimateAndStore(S).then(function () {
            render();
          });
        }
      }

      function initMap(S: any) {
        if (!S.pickupLocation) return;
        var canvas = document.getElementById("map-canvas") as HTMLElement | null;
        if (!canvas || (canvas as any).dataset.init === "1") return;
        (canvas as any).dataset.init = "1";
        if ((window as any).VelvetMapsEstimator) {
          var dest = S.dropLocation || S.pickupLocation;
          (window as any).VelvetMapsEstimator.initStyledMap(canvas, {
            origin: S.pickupLocation,
            destination: dest,
            travelDate: S.travelDate,
            travelTime: S.travelTime,
            durationText: S.durationText || "",
            estimatedDropTime: S.estimatedDropTime || "",
          }).then(function () { render(); }).catch(function () { });
        } else {
          canvas.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(247,242,232,0.5);font-size:0.82rem;text-align:center;padding:2rem">Map loads when Google Maps is configured.</div>';
        }
      }

      (window as any)._nextStep = function () {
        clearStep2AutoAdvance();
        if (currentStep === 3) {
          var nameEl = document.getElementById("name-input") as HTMLInputElement | null;
          if (nameEl && nameEl.value.trim()) {
            var S = (window as any).VelvetStore;
            if (S) { S.userName = nameEl.value.trim(); S.save(); }
          }
        }
        goToStep(currentStep + 1);
      };
      (window as any)._goToStep = function (n: number) { goToStep(n); };
      (window as any)._prevStep = function () { goToStep(currentStep - 1); };
      (window as any)._mapStoryNav = function (dir: string) {
        var shell = document.getElementById("map-story-ribbon");
        var total = parseInt((shell && shell.getAttribute("data-story-total")) || "0", 10);
        if (!Number.isFinite(total) || total <= 0) return false;
        mapStoryIndex = dir === "prev"
          ? (mapStoryIndex - 1 + total) % total
          : (mapStoryIndex + 1) % total;
        holdMapStoryAutoplay(5200);
        render();
        return false;
      };
      (window as any)._mapStoryGo = function (idx: number) {
        var shell = document.getElementById("map-story-ribbon");
        var total = parseInt((shell && shell.getAttribute("data-story-total")) || "0", 10);
        if (!Number.isFinite(total) || total <= 0) return false;
        if (!Number.isFinite(idx)) return false;
        mapStoryIndex = Math.max(0, Math.min(total - 1, idx));
        holdMapStoryAutoplay(5200);
        render();
        return false;
      };
      (window as any)._adultChange = function (d: number) {
        adultCount = Math.max(1, Math.min(6, adultCount + d));
        paxCount = adultCount + infantCount;
        passengerNames = [(passengerNames[0] || "").trim()];
        var S = (window as any).VelvetStore;
        if (S) { S.passengerCount = paxCount; S.passengerNames = passengerNames; S.save(); }
        render();
      };
      (window as any)._infantChange = function (d: number) {
        infantCount = Math.max(0, Math.min(3, infantCount + d));
        paxCount = adultCount + infantCount;
        var S = (window as any).VelvetStore;
        if (S) { S.passengerCount = paxCount; S.save(); }
        render();
      };
      (window as any)._cabinChange = function (d: number) { cabinBags = Math.max(0, Math.min(6, cabinBags + smallBags + d)); smallBags = 0; var S = (window as any).VelvetStore; if (S) { S.luggageCount = cabinBags + medBags + lgBags; S.save(); } render(); };
      (window as any)._lgChange = function (d: number) { medBags = Math.max(0, Math.min(5, medBags + d)); var S = (window as any).VelvetStore; if (S) { S.luggageCount = cabinBags + medBags + lgBags; S.save(); } render(); };
      (window as any)._xlChange = function (d: number) { lgBags = Math.max(0, Math.min(3, lgBags + d)); var S = (window as any).VelvetStore; if (S) { S.luggageCount = cabinBags + medBags + lgBags; S.save(); } render(); };
      (window as any)._setBookedFor = function (v: string) { bookedFor = v; var S = (window as any).VelvetStore; if (S) { S.bookedFor = bookedFor; S.save(); } render(); };

      (window as any)._requestRide = function () {
        var S = (window as any).VelvetStore;
        if (!S) return;
        var declarationOk = window.confirm("Declaration: No smoking, drinking, or eating inside the car. Please confirm you agree to Velvet travel etiquette.");
        if (!declarationOk) return;
        var nameEl = document.getElementById("name-input") as HTMLInputElement | null;
        var contactName = (nameEl && nameEl.value.trim()) || (S.userName && String(S.userName).trim()) || "";
        if (nameEl && nameEl.value.trim()) {
          S.userName = nameEl.value.trim();
          S.save();
        }
        var reqEl = document.getElementById("special-request") as HTMLTextAreaElement | null;
        var specialRequest = reqEl ? reqEl.value.trim() : "";
        if (specialRequest) { S.specialRequest = specialRequest; S.save(); }
        var tier = TIERS.find(function (t) { return t.key === selectedTier; }) || TIERS[0];
        var namesText = passengerNames.filter(function (n) { return n.trim(); }).join(", ") || "—";
        var displayName = contactName || namesText || "—";
        var paxLine =
          (adultCount === 1 ? "1 adult" : adultCount + " adults") +
          (infantCount > 0 ? (infantCount === 1 ? ", 1 infant" : ", " + infantCount + " infants") : "");
        var lugBits: string[] = [];
        if (lgBags > 0) lugBits.push(lgBags + " large");
        if (medBags > 0) lugBits.push(medBags + " medium");
        var smallCabin = cabinBags + smallBags;
        if (smallCabin > 0) lugBits.push(smallCabin + " small/cabin");
        var luggageMsg = lugBits.length ? lugBits.join(", ") : "None specified";
        var fullPickupLocation = String(S.pickupLocation || "—").replace(/\s+/g, " ").trim();
        var fullDropLocation = S.serviceType === "hourly-rental"
          ? ("Not applicable (hourly rental package: " + hourlyLabelFromKey(S.hourlyPackage || "") + ")")
          : String(S.dropLocation || "—").replace(/\s+/g, " ").trim();
        var bookingForLine = "\n🔖 Booking for: " + (bookedFor === "self" ? "Myself" : "Someone else");
        var specBlock =
          (specialRequest ? specialRequest : "—") +
          "\n📱 Contact phone: +91 " +
          S.phone +
          (namesText !== "—" ? "\n👥 Passenger names on booking: " + namesText : "");
        var msg =
          "I'm requesting a ride with Velvet Experience. Here are the details:\n" +
          "👤 My Name: " +
          displayName +
          "\n" +
          "🗓️ Travel Date: " +
          S.travelDate +
          "\n" +
          "🕐 Pick-up Time: " +
          S.travelTime +
          "\n" +
          "📍 Pick-up Location (full): " +
          fullPickupLocation +
          "\n" +
          "📍 Drop Location (full): " +
          fullDropLocation +
          "\n" +
          "👥 Number of Passengers: " +
          paxLine +
          "\n" +
          "🧳 Luggage: " +
          luggageMsg +
          "\n" +
          "🚘 Preferred Category: " +
          tier.tier +
          "\n" +
          "📝 Special Requests: " +
          specBlock +
          bookingForLine +
          "\n\n" +
          "Please share available tier options and booking guidance for this trip. I would like to proceed with confirmation.\n\n" +
          displayName;
        var waUrl = whatsappSendUrl(msg);
        window.open(waUrl, "_blank");
        currentStep = 5;
        var panel = document.getElementById("flow-panel") as HTMLElement | null;
        if (!panel) return;
        panel.innerHTML = '<div class="confirmation-msg" style="text-align:center;max-width:640px;margin:0 auto;padding:3rem 1rem">' +
          '<h2 style="display:flex;align-items:center;justify-content:center;gap:0.55rem"><span style="color:#22c55e;font-size:1.25em;line-height:1">✓</span>WhatsApp opened</h2>' +
          "<p>We've opened WhatsApp with your ride details pre-filled. Please tap <strong>Send</strong> in WhatsApp so our concierge receives your request.</p>" +
          '<p style="color:var(--text-muted);font-size:0.82rem;line-height:1.5;margin-top:0.5rem">Until that message is sent, your request is not received. A Velvet concierge will respond within 5 minutes after your message goes through, with confirmation and payment details.</p>' +
          '<div style="margin-top:2rem;display:flex;flex-direction:column;gap:0.65rem;align-items:center">' +
          '<a href="/" class="btn btn-primary" style="max-width:280px">Back to homepage</a>' +
          '<a href="/profile?from=booking" class="btn btn-outline" style="max-width:280px">View your rides</a>' +
          "</div>" +
          "</div>";
      };

      var headerExpanded = false;
      var rideMode: any = "oneway";
      var airportSubType: any = "arrival";
      var terminal = "Terminal 3 (T3), IGI Airport, New Delhi";
      var pickupPlaceValid = false;
      var dropPlaceValid = false;
      var hourlyPackageKey = "4h40km";
      var PLACEHOLDER_ADDRESS_BOOK = "Address, airport, hotel, …";

      var pickupEl: any, dropEl: any, dateEl: any, timeEl: any, dropLabel: any, airportControls: any, headerWrap: any, headerToggle: any;
      var calendarPanel: any, timePanel: any, hourlyPkgPanel: any;
      var calendarViewDate: any;
      var pickupAC: any, dropAC: any;

      function closePickers() {
        document.querySelectorAll(".v1-picker-popover.is-open").forEach(function (p) {
          p.classList.remove("is-open");
          p.setAttribute("aria-hidden", "true");
        });
        closeAllAutocomplete();
      }

      function closeAllAutocomplete() {
        if (pickupAC) pickupAC.close();
        if (dropAC) dropAC.close();
      }

      function setupDatePicker() {
        var field = dateEl.closest(".v1-date-field");
        if (!field) return;
        calendarPanel = document.createElement("div");
        calendarPanel.className = "v1-picker-popover v1-calendar";
        calendarPanel.setAttribute("aria-hidden", "true");
        calendarPanel.setAttribute("role", "dialog");
        field.style.position = "relative";
        field.appendChild(calendarPanel);

        calendarViewDate = dateEl.value ? new Date(dateEl.value + "T00:00:00") : new Date();

        function renderCalendar() {
          var year = calendarViewDate.getFullYear();
          var month = calendarViewDate.getMonth();
          var first = new Date(year, month, 1);
          var start = new Date(year, month, 1 - first.getDay());
          var selected = dateEl.value;
          var today = new Date(); today.setHours(0, 0, 0, 0);
          var monthName = calendarViewDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
          var cells = "";
          for (var i = 0; i < 42; i++) {
            var d = new Date(start);
            d.setDate(start.getDate() + i);
            var iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
            var muted = d.getMonth() !== month;
            var disabled = d < today;
            var cls = (muted ? " is-muted" : "") + (iso === selected ? " is-selected" : "");
            cells += '<button type="button" class="' + cls + '" data-date="' + iso + '"' + (disabled ? " disabled" : "") + ">" + d.getDate() + "</button>";
          }
          calendarPanel.innerHTML = '<div class="v1-picker-head"><button type="button" data-calendar-prev>Prev</button><strong>' + monthName + '</strong><button type="button" data-calendar-next>Next</button></div><div class="v1-calendar-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div class="v1-calendar-grid">' + cells + "</div>";
        }

        calendarPanel.addEventListener("click", function (e: any) {
          e.stopPropagation();
          var target = (e.target as HTMLElement).closest("[data-calendar-prev]") as HTMLElement | null;
          if (target) { calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1); renderCalendar(); return; }
          target = (e.target as HTMLElement).closest("[data-calendar-next]") as HTMLElement | null;
          if (target) { calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1); renderCalendar(); return; }
          var day = (e.target as HTMLElement).closest("[data-date]") as HTMLButtonElement | null;
          if (!day || day.disabled) return;
          dateEl.value = day.getAttribute("data-date") || "";
          dateEl.dispatchEvent(new Event("change", { bubbles: true }));
          closePickers();
          syncBookButton();
        });

        dateEl.addEventListener("click", function (e: any) {
          e.stopPropagation();
          closePickers();
          calendarViewDate = dateEl.value ? new Date(dateEl.value + "T00:00:00") : new Date();
          renderCalendar();
          calendarPanel.classList.add("is-open");
          calendarPanel.setAttribute("aria-hidden", "false");
        });

        renderCalendar();
      }

      function setupTimePicker() {
        var field = timeEl.closest(".v1-time-field");
        if (!field) return;
        timePanel = document.createElement("div");
        timePanel.className = "v1-picker-popover v1-time-picker";
        timePanel.setAttribute("aria-hidden", "true");
        timePanel.setAttribute("role", "listbox");
        field.style.position = "relative";
        field.appendChild(timePanel);

        function renderTime() {
          var now = new Date();
          var leadPolicy = meetsLeadTimePolicy(dateEl.value, "00:00", {
            isAirportGurugramSubcase: isAirportGurugramSubcase(pickupEl.value || "", dropEl.value || ""),
            now: now,
          });
          var options = "";
          for (var i = 0; i < 96; i++) {
            var total = i * 15;
            var hour = String(Math.floor(total / 60)).padStart(2, "0");
            var minute = String(total % 60).padStart(2, "0");
            var val = hour + ":" + minute;
            var disabled = false;
            if (dateEl.value) {
              var slot = new Date(dateEl.value + "T" + val + ":00");
              var minMs = leadPolicy.minHours * 60 * 60 * 1000;
              disabled = !Number.isNaN(slot.getTime()) && slot.getTime() - now.getTime() < minMs;
            }
            options += '<button type="button" class="' + (val === timeEl.value ? " is-selected" : "") + '" data-time="' + val + '" role="option" aria-selected="' + (val === timeEl.value) + '"' + (disabled ? " disabled" : "") + ">" + val + "</button>";
          }
          timePanel.innerHTML = options;
        }

        timePanel.addEventListener("click", function (e: any) {
          e.stopPropagation();
          var target = (e.target as HTMLElement).closest("[data-time]") as HTMLElement | null;
          if (!target) return;
          if ((target as HTMLButtonElement).disabled) return;
          timeEl.value = target.getAttribute("data-time") || "";
          timeEl.dispatchEvent(new Event("change", { bubbles: true }));
          closePickers();
          syncBookButton();
        });

        timeEl.addEventListener("click", function (e: any) {
          e.stopPropagation();
          closePickers();
          renderTime();
          timePanel.classList.add("is-open");
          timePanel.setAttribute("aria-hidden", "false");
        });

        renderTime();
      }

      function looksLikeHourlyLabel(v: string) {
        if (!v) return false;
        var t = String(v).trim();
        if (t === "2 hours") return true;
        return HOURLY_PKGS.some(function (p) { return p.label === t; });
      }

      function reconcileBookingMode(from: any, fromAir: any, to: any) {
        if (to === "hourly") {
          if (from === "airport" && fromAir === "arrival") {
            pickupEl.value = "";
            pickupPlaceValid = false;
            if (pickupAC) pickupAC.close();
          }
          return;
        }
        if (from === "hourly") {
          dropEl.removeAttribute("readonly");
          dropEl.placeholder = PLACEHOLDER_ADDRESS_BOOK;
          dropEl.value = "";
          dropPlaceValid = false;
          if (dropAC) dropAC.close();
          if (to === "airport") {
            if (airportSubType === "arrival") {
              pickupEl.value = terminal;
              pickupPlaceValid = true;
            } else {
              dropEl.value = terminal;
              dropPlaceValid = true;
            }
          }
          return;
        }
        if (to === "airport" && from !== "airport") {
          if (airportSubType === "arrival") {
            pickupEl.value = terminal;
            pickupPlaceValid = true;
            if (looksLikeHourlyLabel(dropEl.value)) { dropEl.value = ""; dropPlaceValid = false; }
          } else {
            dropEl.value = terminal;
            dropPlaceValid = true;
            if (pickupEl.value === terminal || looksLikeHourlyLabel(pickupEl.value)) { pickupEl.value = ""; pickupPlaceValid = false; }
          }
          return;
        }
        if (from === "airport" && to === "oneway") {
          if (fromAir === "arrival") {
            pickupEl.value = ""; pickupPlaceValid = false;
          } else if (dropEl.value === terminal) {
            dropEl.value = ""; dropPlaceValid = false;
          }
        }
      }

      function syncBookButton() {
        var btn = document.getElementById("v1-book-submit") as HTMLButtonElement | null;
        if (!btn) return;
        var pkOk = pickupEl.disabled || (pickupEl.value.trim() && pickupPlaceValid);
        var drOk: any;
        if (rideMode === "hourly") {
          drOk = Boolean(hourlyPackageKey) && HOURLY_PKGS.some(function (p) { return p.key === hourlyPackageKey; });
        } else {
          drOk = dropEl.disabled || (dropEl.value.trim() && dropPlaceValid);
        }
        var leadTimeOk = meetsMinPrebookingWindow();
        var ready = pkOk && drOk && dateEl.value && timeEl.value && leadTimeOk;
        btn.style.opacity = ready ? "1" : "0.35";
        btn.style.pointerEvents = ready ? "auto" : "none";
        btn.title = leadTimeOk ? "" : "Pickup time must be at least 3 hours from now.";
      }

      function syncHeaderUI() {
        document.querySelectorAll("[data-v1-mode]").forEach(function (b) {
          b.classList.toggle("is-active", (b as HTMLElement).getAttribute("data-v1-mode") === rideMode);
        });
        document.querySelectorAll("[data-v1-airport-type]").forEach(function (b) {
          b.classList.toggle("is-active", (b as HTMLElement).getAttribute("data-v1-airport-type") === airportSubType);
        });
        document.querySelectorAll("[data-v1-terminal]").forEach(function (b) {
          b.classList.toggle("is-active", (b as HTMLElement).getAttribute("data-v1-terminal") === terminal);
        });
        if (airportControls) {
          airportControls.classList.toggle("is-visible", rideMode === "airport");
          airportControls.setAttribute("aria-hidden", String(rideMode !== "airport"));
        }
        if (rideMode === "hourly") {
          pickupEl.disabled = false;
          if (!pickupEl.value.trim()) pickupPlaceValid = false;
          if (dropLabel) dropLabel.textContent = "Packages";
          dropEl.removeAttribute("disabled");
          dropEl.readOnly = true;
          dropEl.placeholder = "Hours & km package";
          dropEl.value = hourlyLabelFromKey(hourlyPackageKey);
          dropPlaceValid = true;
        } else if (rideMode === "airport" && airportSubType === "arrival") {
          dropEl.removeAttribute("readonly");
          dropEl.placeholder = PLACEHOLDER_ADDRESS_BOOK;
          pickupEl.value = terminal;
          pickupEl.disabled = true;
          pickupPlaceValid = true;
          if (dropLabel) dropLabel.textContent = "Drop-off location";
          dropEl.disabled = false;
          if (dropEl.value === terminal || looksLikeHourlyLabel(dropEl.value) || dropEl.value === "2 hours") {
            dropEl.value = ""; dropPlaceValid = false;
          } else {
            dropPlaceValid = Boolean(dropEl.value.trim());
          }
        } else if (rideMode === "airport" && airportSubType === "departure") {
          dropEl.removeAttribute("readonly");
          dropEl.placeholder = PLACEHOLDER_ADDRESS_BOOK;
          pickupEl.disabled = false;
          if (pickupEl.value === terminal || looksLikeHourlyLabel(pickupEl.value)) { pickupEl.value = ""; pickupPlaceValid = false; }
          pickupPlaceValid = Boolean(pickupEl.value.trim());
          if (dropLabel) dropLabel.textContent = "Drop-off terminal";
          dropEl.value = terminal;
          dropEl.disabled = true;
          dropPlaceValid = true;
        } else {
          dropEl.removeAttribute("readonly");
          dropEl.placeholder = PLACEHOLDER_ADDRESS_BOOK;
          pickupEl.disabled = false;
          dropEl.disabled = false;
          if (dropLabel) dropLabel.textContent = "Drop-off location";
          if (pickupEl.value === terminal && airportSubType === "arrival") { pickupEl.value = ""; pickupPlaceValid = false; }
          pickupPlaceValid = Boolean(pickupEl.value.trim());
          if (looksLikeHourlyLabel(dropEl.value) || dropEl.value === "2 hours" || (dropEl.value === terminal && airportSubType === "departure")) {
            dropEl.value = ""; dropPlaceValid = false;
          } else {
            dropPlaceValid = Boolean(dropEl.value.trim());
          }
        }
        syncBookButton();
      }

      function initHeaderForm(S: any) {
        rideMode = S.serviceType === "airport-transfer" ? "airport" : (S.serviceType === "hourly-rental" ? "hourly" : "oneway");
        airportSubType = S.airportSubType || "arrival";
        if (S.pickupLocation && S.pickupLocation.includes("Terminal")) terminal = S.pickupLocation;
        else if (S.dropLocation && S.dropLocation.includes("Terminal")) terminal = S.dropLocation;

        if (headerExpanded) { headerWrap.classList.add("is-expanded"); headerWrap.style.overflow = "visible"; }
        else { headerWrap.style.overflow = "hidden"; headerWrap.classList.remove("is-expanded"); }
        headerToggle.textContent = headerExpanded ? "Close" : "Modify ride";

        hourlyPackageKey = normalizeHourlyKey(S.hourlyPackage);
        if (pickupEl) { pickupEl.placeholder = PLACEHOLDER_ADDRESS_BOOK; pickupEl.value = S.pickupLocation || ""; pickupPlaceValid = Boolean(S.pickupLocation); }
        if (dropEl) {
          dropEl.placeholder = PLACEHOLDER_ADDRESS_BOOK;
          if (rideMode === "hourly") { dropPlaceValid = true; }
          else { dropEl.removeAttribute("readonly"); dropEl.value = S.dropLocation || ""; dropPlaceValid = Boolean(S.dropLocation); }
        }
        if (dateEl) dateEl.value = S.travelDate || "";
        if (timeEl) timeEl.value = S.travelTime || "";

        syncHeaderUI();
        if (pickupAC) pickupAcSync();
        if (dropAC) dropAcSync();
      }

      function pickupAcSync() { if (!pickupAC) return; if (rideMode === "airport" && airportSubType === "arrival") pickupAC.disable(); else pickupAC.enable(); }
      function dropAcSync() { if (!dropAC) return; if (rideMode === "hourly" || (rideMode === "airport" && airportSubType === "departure")) dropAC.disable(); else dropAC.enable(); }

      function setupHourlyPackagePicker() {
        if (!dropEl) return;
        var field = dropEl.closest(".v1-package-field") || dropEl.closest("label");
        if (field) field.classList.add("v1-package-field");
        hourlyPkgPanel = document.createElement("div");
        hourlyPkgPanel.className = "v1-picker-popover v1-time-picker v1-hourly-package-picker";
        hourlyPkgPanel.setAttribute("aria-hidden", "true");
        hourlyPkgPanel.setAttribute("role", "listbox");
        field.appendChild(hourlyPkgPanel);
        function renderHourlyPk() {
          hourlyPkgPanel.innerHTML = HOURLY_PKGS.map(function (p) {
            var sel = p.key === hourlyPackageKey ? " is-selected" : "";
            return '<button type="button" class="' + sel + '" data-hourly-pkg="' + p.key + '" role="option" aria-selected="' + (p.key === hourlyPackageKey) + '">' + p.label + "</button>";
          }).join("");
        }
        hourlyPkgPanel.addEventListener("click", function (e: any) {
          e.stopPropagation();
          var opt = (e.target as HTMLElement).closest("[data-hourly-pkg]") as HTMLElement | null;
          if (!opt) return;
          hourlyPackageKey = opt.getAttribute("data-hourly-pkg") || hourlyPackageKey;
          dropEl.value = hourlyLabelFromKey(hourlyPackageKey);
          closePickers();
          syncBookButton();
        });
        dropEl.addEventListener("click", function (e: any) {
          if (rideMode !== "hourly") return;
          e.preventDefault(); e.stopPropagation();
          closePickers();
          renderHourlyPk();
          hourlyPkgPanel.classList.add("is-open");
          hourlyPkgPanel.setAttribute("aria-hidden", "false");
        });
        renderHourlyPk();
      }

      function bindHeaderEvents() {
        document.querySelectorAll("[data-v1-mode]").forEach(function (b) {
          b.addEventListener("click", function (e) {
            e.stopPropagation();
            var mode = (b as HTMLElement).getAttribute("data-v1-mode");
            if (mode) (window as any)._setMode?.(mode);
          });
        });
        document.querySelectorAll("[data-v1-airport-type]").forEach(function (b) {
          b.addEventListener("click", function (e) {
            e.stopPropagation();
            airportSubType = (b as HTMLElement).getAttribute("data-v1-airport-type");
            syncHeaderUI();
          });
        });
        document.querySelectorAll("[data-v1-terminal]").forEach(function (b) {
          b.addEventListener("click", function (e) {
            e.stopPropagation();
            terminal = (b as HTMLElement).getAttribute("data-v1-terminal") || "";
            syncHeaderUI();
          });
        });
        if (headerToggle) {
          headerToggle.addEventListener("click", function (e: any) {
            e.preventDefault();
            e.stopPropagation();
            (window as any)._toggleHeader?.();
          });
        }
        if (pickupEl) pickupEl.addEventListener("input", syncBookButton);
        if (dropEl) dropEl.addEventListener("input", syncBookButton);
        if (dateEl) dateEl.addEventListener("change", syncBookButton);
        if (timeEl) timeEl.addEventListener("change", syncBookButton);
        var updateRideBtn = document.getElementById("v1-book-submit");
        if (updateRideBtn) {
          updateRideBtn.addEventListener("click", function (e) {
            e.preventDefault();
            (window as any)._updateRide();
          });
        }

        document.addEventListener("click", function (e: any) {
          var insideHeader = headerWrap && headerWrap.contains(e.target);
          if (headerExpanded && !insideHeader) {
            headerExpanded = false;
            headerWrap.style.overflow = "hidden";
            headerWrap.classList.remove("is-expanded");
            headerToggle.textContent = "Modify ride";
          }
          if ((e.target as HTMLElement).closest(".v1-picker-popover")) return;
          if ((e.target as HTMLElement).closest(".velvet-autocomplete")) return;
          if ((e.target as HTMLElement).closest("[data-v1-field]")) return;
          closePickers();
        });

        document.addEventListener("keydown", function (e: any) {
          if (e.key === "Escape") closePickers();
        });
      }

      function VelvetAc(this: any, input: any, opts: any) {
        var self = this;
        self.input = input;
        self.opts = opts || {};
        self.panel = null;
        self.service = null;
        self.placesService = null;
        self.debounceTimer = null;
        self.enabled = true;
        self.isOpen = false;

        function createPanel() {
          self.panel = document.createElement("div");
          self.panel.className = "velvet-autocomplete";
          self.panel.setAttribute("role", "listbox");
          input.closest("label").style.position = "relative";
          input.closest("label").appendChild(self.panel);
        }

        function ensureServices() {
          if (self.service) return Promise.resolve();
          return new Promise(function (resolve) {
            if ((window as any).VelvetMapsEstimator && (window as any).VelvetMapsEstimator.loadMapsApi) {
              (window as any).VelvetMapsEstimator.loadMapsApi().then(function () {
                self.service = new (window as any).google.maps.places.AutocompleteService();
                self.placesService = new (window as any).google.maps.places.PlacesService(document.createElement("div"));
                resolve(undefined);
              }).catch(function () { resolve(undefined); });
            } else { resolve(undefined); }
          });
        }

        function highlight(text: string, query: string) {
          var safeText = escapeHtml(text);
          if (!query) return safeText;
          var idx = String(text).toLowerCase().indexOf(String(query).toLowerCase());
          if (idx === -1) return safeText;
          var before = escapeHtml(String(text).slice(0, idx));
          var match = escapeHtml(String(text).slice(idx, idx + query.length));
          var after = escapeHtml(String(text).slice(idx + query.length));
          return before + "<mark>" + match + "</mark>" + after;
        }

        function render(predictions: any[], query: string) {
          if (!predictions || !predictions.length) { self.panel.innerHTML = '<div style="padding:1rem;text-align:center;color:rgba(255,255,255,0.4);font-size:0.82rem">No results found</div>'; self.panel.classList.add("is-open"); self.isOpen = true; return; }
          var html = '<ul class="velvet-autocomplete__list">';
          predictions.forEach(function (pred: any) {
            var main = pred.structured_formatting ? pred.structured_formatting.main_text : pred.description;
            var secondary = pred.structured_formatting ? pred.structured_formatting.secondary_text : "";
            var placeIdAttr = escapeAttr(pred.place_id);
            var descriptionAttr = escapeAttr(pred.description);
            var secondaryHtml = secondary
              ? '<span class="velvet-autocomplete__secondary">' + escapeHtml(secondary) + "</span>"
              : "";
            html += '<li class="velvet-autocomplete__item" data-place-id="' + placeIdAttr + '" data-description="' + descriptionAttr + '"><div class="velvet-autocomplete__copy"><span class="velvet-autocomplete__main">' + highlight(main, query) + "</span>" + secondaryHtml + "</div></li>";
          });
          html += '</ul><div class="velvet-autocomplete__attribution"><img src="https://maps.google.com/mapfiles/api/v3/images/google_white4.png" alt="Google" width="60" height="12"></div>';
          self.panel.innerHTML = html;
          self.panel.classList.add("is-open");
          self.isOpen = true;

          self.panel.querySelectorAll(".velvet-autocomplete__item").forEach(function (item: any) {
            item.addEventListener("click", function () {
              var desc = item.getAttribute("data-description");
              self.input.value = desc;
              self.input.dispatchEvent(new Event("input", { bubbles: true }));
              self.close();
              if (self.opts.onSelect) self.opts.onSelect(desc, item.getAttribute("data-place-id"));
              syncBookButton();
            });
          });
        }

        self.close = function () { if (self.panel) { self.panel.classList.remove("is-open"); self.panel.innerHTML = ""; self.isOpen = false; } };
        self.disable = function () { self.enabled = false; self.close(); };
        self.enable = function () { self.enabled = true; };
        self.search = function (query: string) {
          if (!self.enabled || !query || query.length < 2) { self.close(); return; }
          ensureServices().then(function () {
            if (!self.service) return;
            self.service.getPlacePredictions({ input: query, componentRestrictions: { country: "in" }, sessionToken: new (window as any).google.maps.places.AutocompleteSessionToken() }, function (predictions: any, status: any) {
              if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) render(predictions, query);
              else self.close();
            });
          });
        };

        createPanel();
        self.input.addEventListener("input", function () {
          clearTimeout(self.debounceTimer);
          var val = self.input.value.trim();
          self.debounceTimer = setTimeout(function () { self.search(val); }, 200);
        });
        self.input.addEventListener("focus", function () {
          if (!self.enabled) return;
          var val = self.input.value.trim();
          if (val.length >= 2) self.search(val);
        });
        self.input.addEventListener("click", function (e: any) { e.stopPropagation(); });
      }

      function resetMap() { var c = document.getElementById("map-canvas") as any; if (c) { delete c.dataset.init; c.innerHTML = ""; } }
      (window as any)._setMode = function (m: any) { var next = m; if (next !== rideMode) { reconcileBookingMode(rideMode, airportSubType, next); } rideMode = next; resetMap(); syncHeaderUI(); if (pickupAC) pickupAcSync(); if (dropAC) dropAcSync(); };
      (window as any)._setAirportType = function (t: any) { airportSubType = t; syncHeaderUI(); };
      (window as any)._setTerminal = function (t: any) { terminal = t; syncHeaderUI(); };

      (window as any)._toggleHeader = function () {
        if (headerExpanded) {
          headerWrap.style.overflow = "hidden";
          headerExpanded = false;
        } else {
          headerExpanded = true;
          headerWrap.classList.add("is-expanded");
          setTimeout(function () { if (headerExpanded) headerWrap.style.overflow = "visible"; }, 450);
          return;
        }
        var S = (window as any).VelvetStore;
        if (S) initHeaderForm(S);
      };

      (window as any)._updateRide = function () {
        var S = (window as any).VelvetStore;
        if (!S) return;
        if (!meetsMinPrebookingWindow()) {
          var latePolicy = meetsLeadTimePolicy(dateEl.value, timeEl.value, {
            isAirportGurugramSubcase: isAirportGurugramSubcase(pickupEl.value || "", dropEl.value || ""),
          });
          window.alert("Pickup time must be at least " + latePolicy.minHours + " hours from now.");
          return;
        }
        if (!isServiceableText((pickupEl.value || "") + " " + (dropEl.value || ""))) {
          window.alert(SERVICE_AREA_ERROR);
          return;
        }
        S.serviceType = rideMode === "airport" ? "airport-transfer" : rideMode === "hourly" ? "hourly-rental" : "city-ride";
        S.airportSubType = rideMode === "airport" ? airportSubType : "";
        S.pickupLocation = pickupEl && !pickupEl.disabled ? pickupEl.value.trim() : terminal;
        if (rideMode === "hourly") {
          S.dropLocation = "";
          S.hourlyPackage = normalizeHourlyKey(hourlyPackageKey);
        } else {
          S.hourlyPackage = "";
          S.dropLocation = dropEl && !dropEl.disabled ? dropEl.value.trim() : terminal;
        }
        S.travelDate = dateEl ? dateEl.value : "";
        S.travelTime = timeEl ? timeEl.value : "";
        S.selectedTier = selectedTier || "elite";
        S.distanceKm = 0; S.distanceText = ""; S.durationText = ""; S.estimatedDropTime = "";
        S.save();
        window.location.reload();
      };

      function init() {
        var S = (window as any).VelvetStore;
        var panel = document.getElementById("flow-panel");
        if (!S || !S.serviceType || !S.travelDate || !S.travelTime) {
          if (panel) panel.innerHTML = '<div class="no-booking"><h2>No ride details found</h2><p>Start by entering your pickup and drop-off on the homepage.</p><a href="/#booking">Go to booking</a></div>';
          stopMapStoryAutoplay();
          return;
        }
        if (S.selectedTier && (CONSTRAINTS as any)[S.selectedTier]) selectedTier = S.selectedTier;
        else selectedTier = "elite";
        if (S.passengerCount) {
          var parsedPax = parseInt(S.passengerCount, 10);
          if (Number.isFinite(parsedPax)) paxCount = Math.max(1, Math.min(6, parsedPax));
        }
        adultCount = Math.max(1, Math.min(6, paxCount));
        infantCount = 0;
        if (S.luggageCount) {
          var parsedLuggage = parseInt(S.luggageCount, 10);
          if (Number.isFinite(parsedLuggage)) {
            parsedLuggage = Math.max(0, Math.min(12, parsedLuggage));
            cabinBags = Math.min(parsedLuggage, 2);
            parsedLuggage -= cabinBags;
            smallBags = Math.min(parsedLuggage, 2);
            parsedLuggage -= smallBags;
            medBags = Math.min(parsedLuggage, 5);
            parsedLuggage -= medBags;
            lgBags = Math.min(parsedLuggage, 3);
            cabinBags = Math.min(6, cabinBags + smallBags);
            smallBags = 0;
          }
        }
        otpVerified = true;
        mapStoryArmed = false;
        mapStoryIndex = 0;
        if (S.bookedFor) bookedFor = S.bookedFor;
        if (S.passengerNames && Array.isArray(S.passengerNames)) {
          passengerNames = S.passengerNames.map(function (n: any) { return typeof n === "string" ? n : ""; });
        } else {
          passengerNames = [];
        }
        passengerNames = [((passengerNames[0] || "") as string).trim()];
        if (S.phone) {
          var phoneDigits = String(S.phone).replace(/\D/g, "").slice(0, 10);
          passengerPhone = phoneDigits;
        } else {
          passengerPhone = "";
        }
        render();
        initMap(S);

        headerWrap = document.getElementById("header-wrap");
        headerToggle = document.getElementById("header-toggle");
        airportControls = document.querySelector("[data-v1-airport-controls]");
        pickupEl = document.querySelector('[data-v1-field="pickup"]');
        dropEl = document.querySelector('[data-v1-field="drop"]');
        dateEl = document.querySelector('[data-v1-field="date"]');
        timeEl = document.querySelector('[data-v1-field="time"]');
        dropLabel = document.querySelector("[data-v1-drop-label]");

        try { setupDatePicker(); } catch { }
        try { setupTimePicker(); } catch { }
        try { setupHourlyPackagePicker(); } catch { }
        bindHeaderEvents();

        pickupAC = new (VelvetAc as any)(pickupEl, {
          onSelect: function (desc: string) {
            pickupPlaceValid = true;
            var S = (window as any).VelvetStore;
            if (S) { S.pickupLocation = desc; S.save(); }
            syncBookButton();
          },
        });
        dropAC = new (VelvetAc as any)(dropEl, {
          onSelect: function (desc: string) {
            dropPlaceValid = true;
            var S = (window as any).VelvetStore;
            if (S) { S.dropLocation = desc; S.save(); }
            syncBookButton();
          },
        });

        initHeaderForm(S);
      }

      if (!(window as any).VelvetStore) {
        var s = document.createElement("script");
        s.src = "/src/store.js";
        s.onload = init;
        document.head.appendChild(s);
      } else {
        init();
      }

      window.addEventListener("beforeunload", function () {
        clearStep2AutoAdvance();
        stopMapStoryAutoplay();
      });
    })();
  }, []);

  return null;
}

