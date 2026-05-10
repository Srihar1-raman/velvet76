"use client";

import { useEffect } from "react";
import { escapeAttr, escapeHtml } from "@/lib/escapeHtml";
import { MOCK_OTP, OTP_HINT_TEXT } from "@/lib/devConfig";
import { VELVET_WHATSAPP_PHONE, whatsappSendUrl } from "@/lib/whatsapp";

const PROFILE_SESSION_TTL_MS = 10 * 60 * 1000;

export default function ProfileClient() {
  useEffect(() => {
    const wrap = document.querySelector<HTMLElement>(".profile-wrap");
    if (!wrap) return;

    const onWheel = (event: WheelEvent) => {
      if (window.matchMedia("(max-width: 860px)").matches) return;
      if (!wrap.classList.contains("profile-main-view")) return;
      const content = document.querySelector<HTMLElement>(".profile-main-view .content");
      if (!content) return;
      if (Math.abs(event.deltaY) < 0.1) return;
      const interactiveTarget = (event.target as HTMLElement | null)?.closest(
        "input, textarea, select, [contenteditable='true']"
      );
      if (interactiveTarget) return;
      event.preventDefault();
      content.scrollTop += event.deltaY;
    };

    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      wrap.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".profile-wrap");
    const field = document.querySelector<HTMLElement>(".profile-monogram-field");
    if (!field || !page) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 899px)").matches;
    if (reduceMotion) return;

    field.innerHTML = "";
    const columns = isMobile ? 4 : 8;
    const rows = isMobile ? 4 : 6;
    const particles = Array.from({ length: columns * rows }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const particle = document.createElement("span");
      particle.className = "profile-monogram-particle";
      particle.style.setProperty("--x", `${((column + 0.5) / columns) * 100}%`);
      particle.style.setProperty("--y", `${((row + 0.5) / rows) * 100}%`);
      particle.style.setProperty("--size", isMobile ? "48px" : "86px");
      particle.style.setProperty("--alpha", `${0.12 + ((column + row) % 4) * 0.045}`);
      particle.style.setProperty("--dur", `${7 + ((column + row) % 5)}s`);
      particle.style.setProperty("--delay", `${(index % 8) * 0.25}s`);
      particle.style.setProperty("--tx", "0px");
      particle.style.setProperty("--ty", "0px");
      particle.dataset.depth = `${0.65 + ((column + row) % 4) * 0.18}`;
      const image = document.createElement("img");
      image.src = "/assets/monogram-gold.png";
      image.alt = "";
      image.decoding = "async";
      particle.appendChild(image);
      field.appendChild(particle);
      return particle;
    });

    const sparkleCount = isMobile ? 18 : 36;
    const sparkles = Array.from({ length: sparkleCount }, () => {
      const sparkle = document.createElement("span");
      sparkle.className = "profile-sparkle";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 5.5}s`;
      sparkle.style.animationDuration = `${2.4 + Math.random() * 3.8}s`;
      sparkle.style.opacity = `${0.3 + Math.random() * 0.5}`;
      field.appendChild(sparkle);
      return sparkle;
    });

    let rafId = 0;
    const repel = (event: PointerEvent) => {
      if (isMobile) return;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const rect = page.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;
        particles.forEach((particle) => {
          const pr = particle.getBoundingClientRect();
          const px = pr.left - rect.left + pr.width / 2;
          const py = pr.top - rect.top + pr.height / 2;
          const dx = px - pointerX;
          const dy = py - pointerY;
          const dist = Math.max(Math.hypot(dx, dy), 1);
          const radius = 240;
          if (dist > radius) {
            particle.style.setProperty("--tx", "0px");
            particle.style.setProperty("--ty", "0px");
            return;
          }
          const depth = Number(particle.dataset.depth ?? 1);
          const force = (1 - dist / radius) * 48 * depth;
          particle.style.setProperty("--tx", `${(dx / dist) * force}px`);
          particle.style.setProperty("--ty", `${(dy / dist) * force}px`);
        });
      });
    };

    const reset = () => {
      particles.forEach((particle) => {
        particle.style.setProperty("--tx", "0px");
        particle.style.setProperty("--ty", "0px");
      });
    };

    if (!isMobile) {
      page.addEventListener("pointermove", repel);
      page.addEventListener("pointerleave", reset);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      page.removeEventListener("pointermove", repel);
      page.removeEventListener("pointerleave", reset);
      particles.forEach((particle) => particle.remove());
      sparkles.forEach((sparkle) => sparkle.remove());
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    var cleanup = (function () {
      var signoutEl = document.querySelector("[data-velvet-signout]") as HTMLAnchorElement | null;
      if (signoutEl) {
        signoutEl.addEventListener("click", function (e) {
          e.preventDefault();
          (window as any)._signOut?.();
          return false;
        });
      }

      var TIERS = [
        { key: "vault", tier: "Velvet Vault", subtitle: "SUV Comfort", models: "BMW iX1 / Audi Q3" },
        { key: "premier", tier: "Velvet Premier", subtitle: "Business Class", models: "Mercedes C-Class / BMW 330Li" },
        { key: "elite", tier: "Velvet Elite", subtitle: "The Flagship", models: "Mercedes E-Class / BMW 5 Series" },
      ];
      var P2P_RATES = { vault: 100, premier: 125, elite: 175 };
      var HOURLY_PKGS = [
        { key: "4h40km", prices: { vault: 5000, premier: 6250, elite: 8500 } },
        { key: "6h60km", prices: { vault: 7500, premier: 9000, elite: 12000 } },
        { key: "8h80km", prices: { vault: 9000, premier: 12000, elite: 16000 } },
      ];

      var phoneValue = "";
      var otpDigits = ["", "", "", "", "", ""];
      var otpSent = false;
      var otpVerified = false;
      var otpResendAvailableAt = 0;
      var nameNeeded = false;
      var nameValue = "";
      var historyFilter = "all";
      var otpCooldownTicker: number | null = null;

      var PAST_RIDES = [
        { id: 1, type: "airport", pickup: "Cyber Hub, Gurugram", drop: "Terminal 3, IGI Airport", date: "18 Apr 2025", time: "06:30", tier: "elite", price: 2870, status: "completed" },
        { id: 2, type: "airport", pickup: "Terminal 1, IGI Airport", drop: "Connaught Place, New Delhi", date: "02 Apr 2025", time: "21:15", tier: "premier", price: 1920, status: "completed" },
        { id: 3, type: "airport", pickup: "DLF Phase 5, Gurugram", drop: "Terminal 3, IGI Airport", date: "14 Feb 2025", time: "08:00", tier: "vault", price: 1450, status: "completed" },
        { id: 4, type: "p2p", pickup: "The Leela Palace, New Delhi", drop: "Golf Course Road, Gurugram", date: "22 Mar 2025", time: "19:00", tier: "elite", price: 2100, status: "completed" },
        { id: 5, type: "p2p", pickup: "India Gate, New Delhi", drop: "HUDA Market, Sector 29, Gurugram", date: "11 Jan 2025", time: "16:45", tier: "premier", price: 1680, status: "completed" },
        { id: 6, type: "p2p", pickup: "Saket, New Delhi", drop: "Ambience Mall, Gurugram", date: "29 Dec 2024", time: "12:30", tier: "vault", price: 980, status: "completed" },
        { id: 7, type: "rental", pickup: "Taj Palace Hotel, New Delhi", drop: "(4 hrs / 40 km)", date: "05 Mar 2025", time: "10:00", tier: "elite", price: 8500, status: "completed" },
        { id: 8, type: "rental", pickup: "JW Marriott, Aerocity", drop: "(6 hrs / 60 km)", date: "19 Feb 2025", time: "14:00", tier: "premier", price: 9000, status: "completed" },
        { id: 9, type: "rental", pickup: "IGI Airport T3", drop: "(4 hrs / 40 km)", date: "01 Jan 2025", time: "09:00", tier: "vault", price: 5000, status: "completed" },
      ];

      var CONFIRMED_RIDE = {
        pickup: "The Leela Palace, New Delhi",
        drop: "Terminal 3, IGI Airport",
        date: "24 May 2025",
        time: "14:30",
        tier: "elite",
        distanceKm: 18,
        duration: "45 min",
        passengers: 2,
        price: 3150,
        carName: "Mercedes E-Class",
        carImg: "/assets/elite%20tier%20mercedes%20e%20class.png",
        chauffeur: "Rajesh Kumar",
        chauffeurImg: "/assets/chauffeur%201.jpg",
        status: "confirmed",
      };

      function fmtPrice(v: number) { return "\u20B9" + v.toLocaleString("en-IN"); }
      function maskPhone(p: string) { if (!p || p.length < 10) return p || ""; return "+91 " + p.slice(0, 2) + "XXXX " + p.slice(6); }
      function tierName(key: string) { var t = TIERS.find(function (t) { return t.key === key; }); return t ? t.tier : key; }
      function serviceLabel(t: string) { if (t === "airport") return "Airport transfer"; if (t === "rental") return "Hourly rental"; return "Point to point"; }
      function whatsappLink(ride: any, label: string) {
        var msg =
          label + " modification request:\n" +
          "Route: " + ride.pickup + " \u2192 " + ride.drop + "\n" +
          "Date: " + ride.date + "\n" +
          "Time: " + ride.time + "\n" +
          "Tier: " + tierName(ride.tier) + "\n" +
          "Fare: " + fmtPrice(ride.price);
        return whatsappSendUrl(msg);
      }
      function getInitials(name: string) {
        var parts = name.trim().split(" ");
        if (parts.length >= 2) return parts[0][0] + parts[1][0];
        return parts[0].slice(0, 2);
      }

      function otpSecondsRemaining() {
        if (!otpResendAvailableAt) return 0;
        return Math.max(0, Math.ceil((otpResendAvailableAt - Date.now()) / 1000));
      }

      function stopOtpCooldownTicker() {
        if (otpCooldownTicker !== null) {
          window.clearInterval(otpCooldownTicker);
          otpCooldownTicker = null;
        }
      }

      function updateOtpCooldownUi() {
        var resendBtn = document.getElementById("otp-resend-btn") as HTMLButtonElement | null;
        var hint = document.getElementById("otp-resend-hint") as HTMLElement | null;
        if (!resendBtn || !hint) return;
        var secs = otpSecondsRemaining();
        var disabled = secs > 0;
        resendBtn.disabled = disabled;
        resendBtn.textContent = disabled ? ("Resend OTP (" + secs + "s)") : "Resend OTP";
        hint.textContent = disabled
          ? ("You can resend OTP in " + secs + " seconds.")
          : "You can resend OTP now.";
      }

      function ensureOtpCooldownTicker() {
        if (otpCooldownTicker !== null) return;
        otpCooldownTicker = window.setInterval(function () {
          if (!otpSent || otpVerified) {
            stopOtpCooldownTicker();
            return;
          }
          updateOtpCooldownUi();
          if (otpSecondsRemaining() <= 0) {
            updateOtpCooldownUi();
            stopOtpCooldownTicker();
          }
        }, 1000);
      }

      function beginOtpCooldown() {
        otpResendAvailableAt = Date.now() + 30000;
        ensureOtpCooldownTicker();
      }

      function initConfirmedMap() {
        requestAnimationFrame(function () {
          var el = document.getElementById("confirmed-map");
          if (!el || !(window as any).VelvetMapsEstimator || !(window as any).VelvetMapsEstimator.initStyledMap) return;
          var cr = CONFIRMED_RIDE;
          (window as any).VelvetMapsEstimator
            .initStyledMap(el, {
              origin: cr.pickup,
              destination: cr.drop,
              travelDate: cr.date,
              travelTime: cr.time,
              durationText: cr.duration || "",
              estimatedDropTime: "",
            })
            .catch(function () { });
        });
      }

      function initRequestedMap() {
        requestAnimationFrame(function () {
          var el = document.getElementById("requested-map") || document.getElementById("requested-map-empty");
          if (!el || !(window as any).VelvetMapsEstimator || !(window as any).VelvetMapsEstimator.initStyledMap) return;
          var S = (window as any).VelvetStore;
          var hasRequestedRoute = Boolean(S && S.pickupLocation && S.dropLocation);
          var origin = hasRequestedRoute ? S.pickupLocation : CONFIRMED_RIDE.pickup;
          var destination = hasRequestedRoute ? S.dropLocation : CONFIRMED_RIDE.drop;
          var travelDate = hasRequestedRoute ? S.travelDate : CONFIRMED_RIDE.date;
          var travelTime = hasRequestedRoute ? S.travelTime : CONFIRMED_RIDE.time;
          (window as any).VelvetMapsEstimator
            .initStyledMap(el, {
              origin: origin,
              destination: destination,
              travelDate: travelDate,
              travelTime: travelTime,
              durationText: hasRequestedRoute ? (S.durationText || "") : (CONFIRMED_RIDE.duration || ""),
              estimatedDropTime: hasRequestedRoute ? (S.estimatedDropTime || "") : "",
            })
            .catch(function () { });
        });
      }

      function getStats() {
        var all = PAST_RIDES;
        var totalRides = all.length + 1;
        var totalKm = 0;
        all.forEach(function (r: any) { totalKm += Math.round(r.price / (((P2P_RATES as any)[r.tier] || 125))) * 1.2; });
        totalKm += 18;
        var tiersUsed: any = {};
        all.forEach(function (r: any) { tiersUsed[r.tier] = true; });
        tiersUsed[(CONFIRMED_RIDE as any).tier] = true;
        var chauffeurs = ["Rajesh Kumar", "Amit Singh", "Pradeep Sharma"];
        return {
          totalRides: totalRides,
          totalKm: Math.round(totalKm),
          tiersUsed: Object.keys(tiersUsed),
          chauffeurs: chauffeurs,
          totalSpent: all.reduce(function (s: any, r: any) { return s + r.price; }, 0) + (CONFIRMED_RIDE as any).price,
        };
      }

      function render() {
        var S = (window as any).VelvetStore;
        var panel = document.getElementById("profile-panel");
        var wrap = document.querySelector(".profile-wrap") as HTMLElement | null;
        if (!panel) return;
        var params = new URLSearchParams(window.location.search);
        var fromBooking = params.get("from") === "booking";
        var otpVerifiedAt = S && S.otpVerifiedAt ? Number(S.otpVerifiedAt) : 0;
        var sessionValid = Boolean(
          S &&
          S.otpVerified &&
          S.phone &&
          Number.isFinite(otpVerifiedAt) &&
          Date.now() - otpVerifiedAt < PROFILE_SESSION_TTL_MS
        );
        if (S && S.otpVerified && !sessionValid) {
          S.otpVerified = false;
          S.otpVerifiedAt = 0;
          S.save();
        }
        var isVerified = sessionValid;
        if (fromBooking && isVerified) { otpVerified = true; phoneValue = S.phone; }
        if (isVerified) { otpVerified = true; phoneValue = S.phone; }
        if (!otpVerified) {
          if (wrap) {
            wrap.classList.add("profile-auth-view");
            wrap.classList.remove("profile-main-view");
          }
          panel.className = "profile-grid-otp";
          panel.innerHTML = renderOtp();
          bindOtpEvents();
          updateOtpCooldownUi();
          document.title = "Verify - Velvet Experience";
          return;
        }
        if (nameNeeded && !(S && S.userName)) {
          if (wrap) {
            wrap.classList.add("profile-auth-view");
            wrap.classList.remove("profile-main-view");
          }
          panel.className = "profile-grid-otp";
          panel.innerHTML = renderName();
          bindNameEvents();
          document.title = "Your Name - Velvet Experience";
          return;
        }
        if (wrap) {
          wrap.classList.remove("profile-auth-view");
          wrap.classList.add("profile-main-view");
        }
        panel.className = "profile-grid";
        panel.innerHTML = renderProfile(S);
        initConfirmedMap();
        initRequestedMap();
        document.title = "Your Rides - Velvet Experience";
      }

      function renderOtp() {
        var resendSecs = otpSecondsRemaining();
        var resendDisabled = resendSecs > 0;
        var otpInputHtml = otpSent
          ? '<div class="input-group"><label class="input-label">Enter OTP</label><div class="otp-grid" id="otp-grid">' +
          otpDigits
            .map(function (d, i) { return '<input type="text" class="otp-digit" maxlength="1" inputmode="numeric" data-otp-index="' + i + '" value="' + escapeAttr(d) + '">'; })
            .join("") +
          '</div><div class="input-error" id="otp-error">' + escapeHtml(OTP_HINT_TEXT) + '</div>' +
          '<div id="otp-resend-hint" style="font-size:0.72rem;color:var(--text-dim);margin-top:0.45rem">' +
          (resendDisabled ? ("You can resend OTP in " + resendSecs + " seconds.") : "You can resend OTP now.") +
          '</div></div>'
          : "";
        var btnHtml = otpVerified
          ? '<div class="verified-badge">Number verified</div><div class="btn-row"><button class="btn btn-primary" onclick="window._otpContinue()">Continue</button></div>'
          : otpSent
            ? '<div class="btn-row"><button class="btn btn-outline" id="otp-resend-btn" onclick="window._resendOtp()" ' + (resendDisabled ? "disabled" : "") + ">" + (resendDisabled ? ("Resend OTP (" + resendSecs + "s)") : "Resend OTP") + '</button><button class="btn btn-primary" onclick="window._verifyOtp()">Verify</button></div>'
            : '<div class="btn-row"><button class="btn btn-primary" onclick="window._sendOtp()">Send OTP</button></div>';
        return (
          '<div class="otp-card">' +
          "<h1>Verify your number</h1>" +
          "<p>Your rides and booking details are tied to your phone number.</p>" +
          '<div class="input-group" id="phone-group">' +
          '<label class="input-label">Phone number</label>' +
          '<div style="display:flex;gap:0.5rem;align-items:center">' +
          '<span style="font-size:0.94rem;color:var(--text-muted);white-space:nowrap">+91</span>' +
          '<input type="tel" class="input-field" id="phone-input" placeholder="10-digit mobile number" inputmode="numeric" maxlength="10" value="' + phoneValue + '">' +
          "</div>" +
          '<div class="input-error" id="phone-error">Enter a valid 10-digit number</div>' +
          "</div>" +
          otpInputHtml +
          (otpVerified ? '<div class="verified-badge">Number verified</div>' : "") +
          btnHtml +
          "</div>"
        );
      }

      function renderName() {
        return (
          '<div class="otp-card">' +
          "<h1>What should we call you?</h1>" +
          "<p>Your name appears on your rides and chauffeur briefings.</p>" +
          '<div class="input-group">' +
          '<label class="input-label">Your name</label>' +
          '<input type="text" class="input-field" id="name-input" placeholder="First name or full name" value="' + nameValue + '">' +
          "</div>" +
          '<div class="btn-row"><button class="btn btn-primary" onclick="window._submitName()">Continue</button></div>' +
          "</div>"
        );
      }

      function bindNameEvents() {
        var nameInput = document.getElementById("name-input") as HTMLInputElement | null;
        if (nameInput) {
          var nameEl = nameInput;
          nameInput.addEventListener("input", function () { nameValue = nameEl.value; });
          nameInput.addEventListener("keydown", function (e) { if ((e as KeyboardEvent).key === "Enter") (window as any)._submitName(); });
        }
      }

      function renderSidebar(stats: any, displayName: string, phone: string) {
        var html = "<aside class=\"sidebar\">";

        html += "<div class=\"sb-identity\">";
        html += "<div class=\"sb-name\">" + displayName + "</div>";
        if (phone) html += "<div class=\"sb-phone\">+91 " + phone.slice(0, 5) + " " + phone.slice(5) + "</div>";
        html += "</div>";

        html += "<div class=\"sb-stats\">";
        html += "<div class=\"sb-stat\"><div class=\"sb-stat-label\">Total rides</div><div class=\"sb-stat-value\">" + stats.totalRides + "</div></div>";
        html += "<div class=\"sb-stat\"><div class=\"sb-stat-label\">Distance</div><div class=\"sb-stat-value\">" + stats.totalKm.toLocaleString("en-IN") + "<span class=\"unit\">km</span></div></div>";
        html += "<div class=\"sb-stat sb-stat-wide\"><div class=\"sb-stat-label\">On-time arrivals</div><div class=\"sb-stat-value\">100<span class=\"unit\">%</span></div></div>";
        html += "</div>";

        html += "<div class=\"sb-accent\">";
        html += "<div class=\"sb-accent-label\">Member highlight</div>";
        html += "<div class=\"sb-accent-value\">" + stats.totalKm.toLocaleString("en-IN") + " km across Delhi NCR &mdash; enough to circle the Ring Road " + Math.round(stats.totalKm / 48) + " times.</div>";
        html += "</div>";

        html += "<div class=\"sb-section\" style=\"margin-top:1.5rem\">";
        html += "<div class=\"sb-section-label\">Tiers experienced</div>";
        html += "<div class=\"sb-tiers\">";
        stats.tiersUsed.forEach(function (k: any) {
          html += "<div class=\"sb-tier-row\"><span class=\"sb-tier-dot\"></span><span class=\"sb-tier-name\">" + tierName(k) + "</span></div>";
        });
        html += "</div></div>";

        html += "<div class=\"sb-section\">";
        html += "<div class=\"sb-section-label\">Chauffeurs served</div>";
        html += "<div class=\"sb-chauffeurs\">";
        stats.chauffeurs.forEach(function (c: any) {
          html += "<div class=\"sb-chauffeur-row\">";
          html += "<div class=\"sb-chauffeur-initial\">" + getInitials(c) + "</div>";
          html += "<div class=\"sb-chauffeur-name\">" + c + "</div>";
          html += "</div>";
        });
        html += "</div></div>";

        html += "<div class=\"sb-section\">";
        html += "<div class=\"sb-section-label\">Get in touch</div>";
        html += "<div class=\"sb-contacts\">";
        html += "<a class=\"sb-contact-link\" href=\"https://wa.me/" + VELVET_WHATSAPP_PHONE + "\" target=\"_blank\">WhatsApp</a>";
        html += "<a class=\"sb-contact-link\" href=\"tel:+919876543210\">Call us</a>";
        html += "<a class=\"sb-contact-link\" href=\"mailto:hello@velvetexperience.in\">Email</a>";
        html += "<a class=\"sb-contact-link\" href=\"https://instagram.com/velvetexperience\" target=\"_blank\">Instagram</a>";
        html += "</div></div>";

        html += "</aside>";
        return html;
      }

      function renderProfile(S: any) {
        var stats = getStats();
        var phone = S && S.phone ? S.phone : "";
        var userName = S && S.userName ? S.userName : "";
        var displayName = userName || maskPhone(phone);

        var html = renderSidebar(stats, displayName, phone);
        html += "<main class=\"content\">";

        var cr: any = CONFIRMED_RIDE;
        html += "<div class=\"section\">";
        html += "<div class=\"section-eyebrow\">Confirmed</div>";
        html += "<div class=\"confirmed-card\">";
        html += "<div class=\"confirmed-header\">";
        html += "<div class=\"ch-route\">" + cr.pickup + "<span class=\"arrow\">&rarr;</span>" + cr.drop + "</div>";
        html += "</div>";
        html += "<div class=\"confirmed-badges\"><span class=\"c-badge c-tier\">" + tierName(cr.tier) + "</span><span class=\"c-badge c-confirmed\">Confirmed</span></div>";
        html += "<div class=\"confirmed-details\">";
        html += "<div class=\"cd-item\"><span class=\"cdl\">Date</span><span class=\"cdv\">" + cr.date + "</span></div>";
        html += "<div class=\"cd-item\"><span class=\"cdl\">Time</span><span class=\"cdv\">" + cr.time + "</span></div>";
        html += "<div class=\"cd-item\"><span class=\"cdl\">Distance</span><span class=\"cdv\">" + cr.distanceKm + " km</span></div>";
        html += "<div class=\"cd-item\"><span class=\"cdl\">Duration</span><span class=\"cdv\">" + cr.duration + "</span></div>";
        html += "<div class=\"cd-item\"><span class=\"cdl\">Passengers</span><span class=\"cdv\">" + cr.passengers + "</span></div>";
        html += "<div class=\"cd-item\"><span class=\"cdl\">Fare</span><span class=\"cdv\">" + fmtPrice(cr.price) + "</span></div>";
        html += "</div>";
        html += "<div class=\"allocation\">";
        html += "<div class=\"alloc-item alloc-vehicle\"><div class=\"alloc-label\">Allocated vehicle</div><div class=\"alloc-img\"><img src=\"" + cr.carImg + "\" alt=\"" + cr.carName + "\"></div><div class=\"alloc-name\">" + cr.carName + "</div></div>";
        html += "<div class=\"alloc-item alloc-chauffeur\"><div class=\"alloc-label\">Your chauffeur</div><div class=\"alloc-img\"><img src=\"" + cr.chauffeurImg + "\" alt=\"" + cr.chauffeur + "\" onerror=\"this.parentElement.classList.add('is-empty');this.style.display='none'\"></div><div class=\"alloc-name\">" + cr.chauffeur + "</div></div>";
        html += "</div>";
        html += "<div class=\"ride-map\" id=\"confirmed-map\"><div class=\"map-fallback\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"3 11 22 2 13 21 11 13 3 11\"/></svg>Loading route...</div></div>";
        html += "<div class=\"request-actions\"><a class=\"request-btn\" href=\"" + whatsappLink(cr, "Confirmed ride") + "\" target=\"_blank\">Request modification</a><a class=\"request-btn request-btn--whatsapp\" href=\"" + whatsappLink(cr, "Confirmed ride") + "\" target=\"_blank\">WhatsApp</a></div>";
        html += "</div></div>";

        if (S && S.serviceType && S.pickupLocation && S.dropLocation && S.travelDate) {
          var tier = TIERS.find(function (t) { return t.key === S.selectedTier; }) || TIERS[0];
          var price = calcPrice(S);
          html += "<div class=\"divider\"></div>";
          html += "<div class=\"section\">";
          html += "<div class=\"section-eyebrow\">Requested</div>";
          html += "<div class=\"requested-card\">";
          html += "<div class=\"requested-header\"><div class=\"rh-label\"><span class=\"dot\"></span>Requested</div></div>";
          html += "<div class=\"rh-route\">" + S.pickupLocation + "<span class=\"arrow\">&rarr;</span>" + S.dropLocation + "</div>";
          html += "<span class=\"r-tier\">" + tier.tier + "</span>";
          html += "<div class=\"r-detail-grid\">";
          html += "<div class=\"rd\"><span class=\"rdl\">Date</span><span class=\"rdv\">" + S.travelDate + "</span></div>";
          html += "<div class=\"rd\"><span class=\"rdl\">Time</span><span class=\"rdv\">" + S.travelTime + "</span></div>";
          if (S.distanceKm) html += "<div class=\"rd\"><span class=\"rdl\">Distance</span><span class=\"rdv\">" + S.distanceKm + " km</span></div>";
          if (S.durationText) html += "<div class=\"rd\"><span class=\"rdl\">Duration</span><span class=\"rdv\">" + S.durationText + "</span></div>";
          var pax = S.passengerCount || 1;
          if (pax > 1) html += "<div class=\"rd\"><span class=\"rdl\">Passengers</span><span class=\"rdv\">" + pax + "</span></div>";
          html += "<div class=\"rd\"><span class=\"rdl\">Fare</span><span class=\"rdv rdv-price\">" + fmtPrice(price) + "</span></div>";
          html += "</div>";
          html += "<div class=\"ride-map\" id=\"requested-map\"><div class=\"map-fallback\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"3 11 22 2 13 21 11 13 3 11\"/></svg>Loading route...</div></div>";
          var reqTier = S.selectedTier || "vault";
          html += "<div class=\"request-actions\"><a class=\"request-btn\" href=\"" + whatsappLink({ pickup: S.pickupLocation, drop: S.dropLocation, date: S.travelDate, time: S.travelTime, tier: reqTier, price: price }, "Requested ride") + "\" target=\"_blank\">Request modification</a><a class=\"request-btn request-btn--whatsapp\" href=\"" + whatsappLink({ pickup: S.pickupLocation, drop: S.dropLocation, date: S.travelDate, time: S.travelTime, tier: reqTier, price: price }, "Requested ride") + "\" target=\"_blank\">WhatsApp</a></div>";
          html += "</div></div>";
        } else {
          html += "<div class=\"divider\"></div>";
          html += "<div class=\"section\">";
          html += "<div class=\"section-eyebrow\">Requested</div>";
          html += "<div class=\"no-rides\"><p>No upcoming ride requests.</p></div>";
          html += "<div class=\"ride-map\" id=\"requested-map-empty\"><div class=\"map-fallback\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"3 11 22 2 13 21 11 13 3 11\"/></svg>Loading route preview...</div></div>";
          html += "</div>";
        }

        html += "<div class=\"divider\"></div>";
        html += "<div class=\"section\">";
        html += "<div class=\"section-eyebrow\">History</div>";
        html += "<div class=\"filter-bar\" id=\"history-filter\">";
        html += "<button class=\"filter-btn is-active\" data-filter=\"all\" onclick=\"window._setFilter('all')\">All</button>";
        html += "<button class=\"filter-btn\" data-filter=\"airport\" onclick=\"window._setFilter('airport')\">Airport</button>";
        html += "<button class=\"filter-btn\" data-filter=\"p2p\" onclick=\"window._setFilter('p2p')\">Point to point</button>";
        html += "<button class=\"filter-btn\" data-filter=\"rental\" onclick=\"window._setFilter('rental')\">Hourly</button>";
        html += "</div>";

        var filtered = historyFilter === "all" ? PAST_RIDES : PAST_RIDES.filter(function (r: any) { return r.type === historyFilter; });
        if (filtered.length === 0) {
          html += "<div class=\"no-rides\"><p>No rides in this category.</p></div>";
        } else {
          filtered.forEach(function (r: any) {
            html += "<div class=\"h-ride\">";
            html += "<div class=\"h-dot dot-completed\"></div>";
            html += "<div class=\"h-body\">";
            html += "<div class=\"h-route\">" + r.pickup + "<span class=\"arrow\">&rarr;</span>" + r.drop + "</div>";
            html += "<div class=\"h-meta\"><span class=\"hm-tier\">" + tierName(r.tier) + "</span><span>" + serviceLabel(r.type) + "</span><span>" + r.date + "</span><span>" + r.time + "</span></div>";
            html += "</div>";
            html += "<div class=\"h-fare\">" + fmtPrice(r.price) + "</div>";
            html += "</div>";
          });
        }
        html += "</div></main>";
        return html;
      }

      function calcPrice(S: any) {
        if (!S) return 0;
        var tierKey = S.selectedTier || "vault";
        if (S.serviceType === "hourly-rental" && S.hourlyPackage) {
          var pkg = HOURLY_PKGS.find(function (p) { return p.key === S.hourlyPackage; });
          if (pkg) return (pkg as any).prices[tierKey] || 0;
        }
        var km = Math.max(S.distanceKm || 0, 12);
        return Math.ceil((km * (P2P_RATES as any)[tierKey]) / 100) * 100;
      }

      function bindOtpEvents() {
        var phoneInput = document.getElementById("phone-input") as HTMLInputElement | null;
        if (phoneInput) {
          var phoneEl = phoneInput;
          phoneInput.addEventListener("input", function () {
            phoneValue = phoneEl.value.replace(/\D/g, "").slice(0, 10);
            phoneEl.value = phoneValue;
          });
        }
        document.querySelectorAll(".otp-digit").forEach(function (el) {
          el.addEventListener("input", function () {
            var idx = parseInt((el as HTMLElement).getAttribute("data-otp-index") || "0", 10);
            var input = el as HTMLInputElement;
            otpDigits[idx] = input.value.slice(0, 1);
            if (input.value && idx < 5) {
              var next = (el as HTMLElement).nextElementSibling as HTMLElement | null;
              if (next) next.focus();
            }
          });
          el.addEventListener("keydown", function (e) {
            var idx = parseInt((el as HTMLElement).getAttribute("data-otp-index") || "0", 10);
            var input = el as HTMLInputElement;
            if ((e as KeyboardEvent).key === "Backspace" && !input.value && idx > 0) {
              otpDigits[idx - 1] = "";
              var prev = (el as HTMLElement).previousElementSibling as HTMLElement | null;
              if (prev) prev.focus();
              render();
            }
          });
        });
      }

      (window as any)._sendOtp = function () {
        var phone = phoneValue.replace(/\D/g, "");
        if (phone.length !== 10) { var g = document.getElementById("phone-group"); if (g) g.classList.add("has-error"); return; }
        var g2 = document.getElementById("phone-group"); if (g2) g2.classList.remove("has-error");
        otpSent = true; otpDigits = ["", "", "", "", "", ""]; beginOtpCooldown(); render(); setTimeout(function () { var first = document.querySelector(".otp-digit") as HTMLElement | null; if (first) first.focus(); }, 50);
      };
      (window as any)._verifyOtp = function () {
        var code = otpDigits.join("");
        if (code !== MOCK_OTP) { var err = document.getElementById("otp-error") as HTMLElement | null; if (err) err.style.display = "block"; return; }
        otpVerified = true; var S = (window as any).VelvetStore; if (S) { S.phone = phoneValue.replace(/\D/g, ""); S.otpVerified = true; S.otpVerifiedAt = Date.now(); S.save(); }
        if (!S || !S.userName) nameNeeded = true;
        render();
      };
      (window as any)._resendOtp = function () {
        if (otpSecondsRemaining() > 0) return;
        otpDigits = ["", "", "", "", "", ""];
        beginOtpCooldown();
        render();
        setTimeout(function () { var first = document.querySelector(".otp-digit") as HTMLElement | null; if (first) first.focus(); }, 50);
      };
      (window as any)._otpContinue = function () { render(); };
      (window as any)._submitName = function () {
        var name = nameValue.trim();
        if (!name) { var inp = document.getElementById("name-input") as HTMLInputElement | null; if (inp) inp.style.borderColor = "#ef4444"; return; }
        var S = (window as any).VelvetStore; if (S) { S.userName = name; S.save(); }
        nameNeeded = false; render();
      };
      (window as any)._signOut = function () {
        var S = (window as any).VelvetStore; if (S) { S.otpVerified = false; S.otpVerifiedAt = 0; S.phone = ""; S.save(); }
        otpVerified = false; otpSent = false; phoneValue = ""; otpDigits = ["", "", "", "", "", ""]; otpResendAvailableAt = 0; stopOtpCooldownTicker(); nameNeeded = false; nameValue = ""; render();
      };
      (window as any)._setFilter = function (f: string) {
        historyFilter = f;
        document.querySelectorAll(".filter-btn").forEach(function (b) { (b as HTMLElement).classList.toggle("is-active", (b as HTMLElement).getAttribute("data-filter") === f); });
        render();
      };

      render();
      return function () {
        stopOtpCooldownTicker();
      };
    })();
    return cleanup;
  }, []);

  return null;
}

