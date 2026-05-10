"use client";

import { useEffect } from "react";
import { escapeHtml } from "@/lib/escapeHtml";
import { IS_DEV_MODE, MOCK_OTP, OTP_TOAST_BODY } from "@/lib/devConfig";

export default function CheckoutClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    (function () {
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
      var MARKUP = 1.35;

      function price(tierKey: string) {
        var S = (window as any).VelvetStore;
        if (!S) return 0;
        if (S.serviceType === "hourly-rental" && S.hourlyPackage) {
          var pkg = HOURLY_PKGS.find(function (p) { return p.key === S.hourlyPackage; });
          return pkg ? (pkg as any).prices[tierKey] : 0;
        }
        var km = Math.max(S.distanceKm || 0, 12);
        return Math.ceil((km * (P2P_RATES as any)[tierKey]) / 100) * 100;
      }
      function strikePrice(p: number) { return Math.ceil((p * MARKUP) / 100) * 100; }
      function formatPrice(v: number) { return "\u20B9" + v.toLocaleString("en-IN"); }
      function parkingCharge() {
        var S = (window as any).VelvetStore;
        if (!S) return 0;
        if (S.serviceType === "airport-transfer" && S.airportSubType === "arrival") {
          var loc = S.pickupLocation || "";
          if (loc.includes("T3")) return 270;
          if (loc.includes("T1") || loc.includes("T2")) return 200;
        }
        return 0;
      }

      var otpSent = false; var otpVerified = false; var otpCooldown = 0; var cooldownTimer: any = null;
      var bookingFor = "me"; var firstName = ""; var lastName = ""; var guestFirstName = ""; var guestLastName = ""; var guestPhone = ""; var paying = false;
      var bootstrappedFromStore = false;
      var lastEstimateKey = "";

      function showToast(title: string, msg: string, type: string) {
        var t = document.getElementById("toast");
        if (!t) return;
        var toast = t;
        toast.className = "toast visible " + (type || "");
        toast.innerHTML = "<strong>" + escapeHtml(title) + "</strong>" + (msg ? '<br><span class="toast-msg">' + escapeHtml(msg) + "</span>" : "");
        setTimeout(function () { toast.className = "toast"; }, 4000);
      }

      function render() {
        var S = (window as any).VelvetStore;
        var root = document.getElementById("root");
        var mobileWrapper = document.getElementById("mobile-bottom-bar-wrapper");
        if (!root || !mobileWrapper) return;
        if (!S || !S.selectedTier || !S.serviceType) {
          root.innerHTML = '<div class="no-booking"><p>No booking found. Start from the beginning.</p><a href="/" class="btn btn-primary btn-full" style="max-width:200px;margin:0 auto">Start Booking</a></div>';
          mobileWrapper.innerHTML = "";
          return;
        }
        if (!bootstrappedFromStore) {
          bookingFor = S.bookingFor === "guest" ? "guest" : "me";
          if ((S.guestName || "").trim()) {
            var normalized = (S.guestName || "").trim().replace(/^(Mr\.?|Ms\.?|Mrs\.?)\s+/i, "");
            var parts = normalized.split(/\s+/);
            guestFirstName = parts[0] || "";
            guestLastName = parts.slice(1).join(" ");
          }
          if ((S.guestPhone || "").trim()) guestPhone = (S.guestPhone || "").replace(/\D/g, "").slice(0, 10);
          bootstrappedFromStore = true;
        }
        var tier = TIERS.find(function (t) { return t.key === S.selectedTier; }) || TIERS[0];
        var isElite = S.selectedTier === "elite";
        var basePrice = price(S.selectedTier);
        var parking = parkingCharge();
        var waitSurcharge = 0;
        var lastMinuteSurcharge = 0;
        var total = basePrice + parking + waitSurcharge + lastMinuteSurcharge;
        var strikethrough = strikePrice(total);

        var barPickup = document.getElementById("bar-pickup");
        var barDrop = document.getElementById("bar-drop");
        var barDate = document.getElementById("bar-date");
        var barTime = document.getElementById("bar-time");
        if (barPickup) barPickup.textContent = (S.pickupLocation || "Pickup not set");
        if (barDrop) barDrop.textContent = (S.dropLocation || "Drop not set");
        if (barDate) barDate.textContent = (S.travelDate || "--");
        if (barTime) barTime.textContent = (S.travelTime || "--:--");

        var lineItems = [
          { label: "Service", value: S.serviceType.replace(/-/g, " ") },
          { label: "Route", value: S.pickupLocation + (S.dropLocation ? " \u2192 " + S.dropLocation : "") },
          { label: "When", value: S.travelDate + " at " + S.travelTime },
          { label: "Distance", value: S.distanceText || ((S.distanceKm || 0) ? (S.distanceKm + " km") : "Calculating...") },
          { label: "Journey", value: S.durationText || "Calculating..." },
          { label: "Estimated drop", value: S.estimatedDropTime || "--:--" },
          { label: "Vehicle", value: tier.tier },
        ];
        if (S.flightNumber) lineItems.push({ label: "Flight", value: S.flightNumber });
        var lineItemsHtml = lineItems.map(function (item) {
          return '<div class="line-item"><span class="label">' + item.label + '</span><span class="value" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + item.value + "</span></div>";
        }).join("");

        var verifySection = "";
        if (!otpVerified) {
          verifySection = '<div class="section-title">Verify phone to unlock fare & payment</div>' +
            '<div class="row-2"><div class="field"><label>First name</label><input type="text" id="first-name" placeholder="First name" value="' + firstName + '"></div><div class="field"><label>Last name</label><input type="text" id="last-name" placeholder="Last name" value="' + lastName + '"></div></div>' +
            '<div class="otp-row" style="margin-top:0"><div class="field" style="margin-bottom:0"><label>Phone number</label><input type="tel" id="phone-input" placeholder="10-digit number" inputmode="numeric" maxlength="10" value="' + (S.phone || "") + '"><div class="error">Phone number must be exactly 10 digits.</div></div><button class="btn btn-outline" id="send-otp-btn" onclick="sendOtp()">' + (otpSent ? "Resend OTP" : "Send OTP") + "</button></div>" +
            '<div class="field pre-otp-email"><label>Contact email (optional)</label><input type="email" id="email-input" placeholder="name@example.com" value="' + (S.email || "") + '"><div class="error">Please enter a valid email address.</div></div>' +
            (S.serviceType === "airport-transfer" ? '<div class="field"><label>Flight number (optional)</label><input type="text" id="flight-input" placeholder="e.g. AI203" value="' + (S.flightNumber || "") + '"></div>' : "") +
            (otpSent ? '<div class="otp-section"><div class="field"><label>Enter OTP</label><input type="text" id="otp-input" placeholder="6-digit OTP" inputmode="numeric" maxlength="6"></div><div class="otp-row"><span></span><button class="btn btn-primary" onclick="verifyOtp()">Verify OTP</button></div></div>' : "") +
            '<div id="otp-feedback"></div>';
        } else {
          var hasSavedGuest = Boolean((S.guestName || "").trim() || (S.guestPhone || "").trim());
          var selfNameMissing = bookingFor === "me" && (!firstName.trim() || !lastName.trim());
          var guestNameMissing = bookingFor === "guest" && (!guestFirstName.trim() || !guestLastName.trim());
          verifySection = '<div class="section-title">Booking for</div>' +
            '<div class="pill-group"><button class="pill ' + (bookingFor === "me" ? "active" : "") + '" onclick="setBookingFor(\'me\')">For me</button><button class="pill ' + (bookingFor === "guest" ? "active" : "") + '" onclick="setBookingFor(\'guest\')">For a guest</button></div>' +
            (hasSavedGuest && bookingFor === "guest"
              ? '<div class="saved-guest-card"><div class="saved-info"><p>Saved guest details</p><p>' + (S.guestName || "Guest") + "</p><p>+91 " + (S.guestPhone || "—") + '</p></div><button class="saved-guest-use" onclick="useSavedGuest()">Use this</button></div>'
              : "") +
            (bookingFor === "me"
              ? '<div class="row-2"><div class="field"><label>First name</label><input type="text" id="first-name" placeholder="First name" value="' + firstName + '"></div><div class="field"><label>Last name</label><input type="text" id="last-name" placeholder="Last name" value="' + lastName + '"></div></div>' +
              (selfNameMissing ? '<span style="grid-column:span 2;font-size:0.72rem;color:var(--danger);margin-top:0.25rem">First and last name are required for self booking.</span>' : "")
              : '<div class="row-2"><div class="field"><label>Guest first name</label><input type="text" id="guest-first" placeholder="Guest first name" value="' + guestFirstName + '"></div><div class="field"><label>Guest last name</label><input type="text" id="guest-last" placeholder="Guest last name" value="' + guestLastName + '"></div></div>' +
              '<div class="field"><label>Guest phone</label><input type="tel" id="guest-phone" placeholder="10-digit number" inputmode="numeric" maxlength="10" value="' + guestPhone + '"><div class="error">Guest phone must be exactly 10 digits.</div></div>' +
              (guestNameMissing ? '<span style="font-size:0.72rem;color:var(--danger);margin-top:0.25rem">Guest first and last name are required.</span>' : "")) +
            '<div class="row-2" style="margin-top:1rem"><div class="field"><label>Email (optional)</label><input type="email" id="email-input" placeholder="name@example.com" value="' + (S.email || "") + '"><div class="error">Please enter a valid email address.</div></div>' +
            '<div class="field"><label>Phone (verified)</label><input type="tel" value="' + S.phone + '" readonly style="opacity:0.7"></div></div>';
        }

        var fareBlurClass = otpVerified ? "" : " verify-blur";
        var fareLockOverlay = otpVerified ? "" : '<div class="fare-lock-overlay"><div><p class="fare-lock-title">Verify first to pay</p><p class="fare-lock-sub">Complete OTP verification on the left to unlock payment.</p></div></div>';
        var desktopPayBtn = '<div style="margin-top:auto;padding-top:1rem;display:none" class="desktop-pay-btn"><button class="btn btn-primary btn-full" style="height:2.75rem;border-radius:4px;' + (isElite ? "background:linear-gradient(to right,#9b7a2d,#7b611f);box-shadow:0 10px 28px rgba(185,132,42,0.30)" : "") + '" onclick="handlePay()" ' + (otpVerified ? "" : "disabled") + ">" + (paying ? "Processing Razorpay..." : "Pay via Razorpay (Mock)") + "</button></div>";

        var html = '<div class="main">' +
          '<a href="/book" class="back-link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back</a>' +
          '<div class="checkout-grid">' +
          "<section>" +
          '<p class="checkout-eyebrow">Verify Details</p>' +
          '<h1 class="checkout-title">Confirm reservation.</h1>' +
          '<div class="card">' +
          '<div style="display:flex;flex-direction:column;gap:1.25rem;margin-bottom:1.5rem">' +
          lineItemsHtml +
          "</div>" +
          verifySection +
          "</div>" +
          '<div class="payment-notice"><div class="payment-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="payment-text"><div class="payment-title">Payment via Razorpay</div><div class="payment-sub">Branded checkout flow (mock) — marks booking as paid.</div></div><span class="payment-badge">Razorpay</span></div>' +
          "</section>" +
          '<aside class="checkout-aside">' +
          '<div class="fare-card" style="position:relative;padding:1.5rem;height:100%;display:flex;flex-direction:column;justify-content:space-between">' +
          fareLockOverlay +
          '<div class="' + fareBlurClass + '">' +
          '<div class="fare-core">' +
          '<div class="fare-title">Fare breakdown</div>' +
          '<div class="fare-items">' +
          '<div class="fare-line"><span class="fare-label">Vehicle fare</span><span class="fare-val">' + formatPrice(basePrice) + "</span></div>" +
          (parking
            ? '<div class="fare-line"><span class="fare-label">Airport parking</span><span class="fare-val">' + formatPrice(parking) + "</span></div>"
            : '<div class="fare-line is-free"><span class="fare-label">Airport parking</span><span><span class="fare-val is-strike">' + formatPrice(0) + '</span> <span class="fare-val fare-free">Free</span></span></div>') +
          '<div class="fare-line is-free"><span class="fare-label">Waiting surcharge</span><span><span class="fare-val is-strike">' + formatPrice(waitSurcharge) + '</span> <span class="fare-val fare-free">Free</span></span></div>' +
          '<div class="fare-line is-free"><span class="fare-label">Last-minute surcharge</span><span><span class="fare-val is-strike">' + formatPrice(lastMinuteSurcharge) + '</span> <span class="fare-val fare-free">Free</span></span></div>' +
          '<div class="fare-line"><span class="fare-label">Taxes & fees</span><span class="fare-val">Included</span></div>' +
          "</div>" +
          '<div style="height:1px;background:rgba(255,255,255,0.10);margin:1rem 0 1.05rem"></div>' +
          '<div class="fare-total"><span class="fare-total-label">Total payable</span><div><span class="fare-strike">' + formatPrice(strikethrough) + '</span><span class="fare-total-price">' + formatPrice(total) + "</span></div></div>" +
          '<p style="font-size:0.72rem;color:var(--text-dim);text-align:right;margin-top:0.45rem;line-height:1.35">All charges shown transparently before payment.</p>' +
          "</div>" +
          "</div>" +
          desktopPayBtn +
          "</div>" +
          "</aside>" +
          "</div>" +
          "</div>";

        root.innerHTML = html;
        var payBtnDesktop = document.querySelector(".desktop-pay-btn") as HTMLElement | null;
        if (payBtnDesktop && window.innerWidth >= 1024) payBtnDesktop.style.display = "block";

        var mobileHtml = '<div class="mobile-price-inner">' +
          '<div class="mobile-price-row"><div class="price-info"><p class="price-model">Car assigned</p><p class="price-name">' + ((tier.models.split(" / ")[0] || tier.subtitle)) + '</p></div><div class="price-amount"><p class="price-big">' + formatPrice(total) + '</p><p class="price-strike">' + formatPrice(strikethrough) + "</p></div></div>" +
          '<button class="btn btn-primary btn-full" style="margin-top:0.65rem;height:2.75rem;border-radius:4px;' + (isElite ? "background:linear-gradient(to right,#9b7a2d,#7b611f);box-shadow:0 10px 28px rgba(185,132,42,0.30)" : "") + '" onclick="handlePay()" ' + (otpVerified ? "" : "disabled") + ">" + (paying ? "Processing Razorpay..." : "Pay via Razorpay (Mock)") + "</button>" +
          "</div>";
        mobileWrapper.innerHTML = mobileHtml;

        var currentEstimateKey = [S.pickupLocation || "", S.dropLocation || "", S.travelDate || "", S.travelTime || ""].join("|");
        if (currentEstimateKey !== lastEstimateKey) {
          lastEstimateKey = currentEstimateKey;
          if ((window as any).VelvetMapsEstimator && S.pickupLocation && S.dropLocation) {
            (window as any).VelvetMapsEstimator.estimateAndStore(S).then(function (changed: any) { if (changed) render(); });
          }
        }
      }

      (window as any).sendOtp = function () {
        var S = (window as any).VelvetStore;
        var fn = document.getElementById("first-name") as HTMLInputElement | null;
        var ln = document.getElementById("last-name") as HTMLInputElement | null;
        firstName = fn ? fn.value : "";
        lastName = ln ? ln.value : "";
        if (!firstName.trim() || !lastName.trim()) {
          showToast("Enter your name", "Please provide first and last name before OTP.", "error");
          return;
        }
        var phone = document.getElementById("phone-input") as HTMLInputElement | null;
        var phoneVal = phone ? phone.value.replace(/\D/g, "") : "";
        if (phoneVal.length < 10) {
          showToast("Invalid phone", "Please enter a valid 10-digit mobile number.", "error");
          if (phone && phone.parentElement) phone.parentElement.classList.add("has-error");
          return;
        }
        if (phone && phone.parentElement) phone.parentElement.classList.remove("has-error");
        S.phone = phoneVal; S.save();
        otpSent = true; otpCooldown = 30;
        showToast("OTP sent", OTP_TOAST_BODY, "success");
        if (cooldownTimer) clearInterval(cooldownTimer);
        cooldownTimer = setInterval(function () {
          otpCooldown--;
          var btn = document.getElementById("send-otp-btn") as HTMLButtonElement | null;
          if (btn) { btn.textContent = otpCooldown > 0 ? ("Resend OTP in " + otpCooldown + "s") : "Resend OTP"; btn.disabled = otpCooldown > 0; }
          if (otpCooldown <= 0) clearInterval(cooldownTimer);
        }, 1000);
        render();
        setTimeout(function () {
          var fb = document.getElementById("otp-feedback");
          if (fb) fb.innerHTML = '<div class="feedback success">OTP sent successfully. ' + escapeHtml(OTP_TOAST_BODY) + '</div>';
        }, 50);
      };

      (window as any).verifyOtp = function () {
        var otpEl = document.getElementById("otp-input") as HTMLInputElement | null;
        var otp = otpEl ? otpEl.value.replace(/\D/g, "") : "";
        if (otp !== MOCK_OTP) {
          showToast("Invalid OTP", IS_DEV_MODE ? OTP_TOAST_BODY : "Please double-check the code and try again.", "error");
          var fb = document.getElementById("otp-feedback");
          if (fb) fb.innerHTML = '<div class="feedback error">' + escapeHtml(IS_DEV_MODE ? "Invalid OTP. " + OTP_TOAST_BODY : "Invalid OTP. Please re-enter.") + '</div>';
          return;
        }
        var S = (window as any).VelvetStore; S.otpVerified = true; S.save();
        otpVerified = true;
        showToast("Phone verified", "Payment is now enabled.", "success");
        setTimeout(function () { render(); }, 100);
      };

      (window as any).setBookingFor = function (val: string) { bookingFor = val; render(); };
      (window as any).useSavedGuest = function () {
        var S = (window as any).VelvetStore;
        if (S.guestName) {
          var normalized = S.guestName.trim().replace(/^(Mr\.?|Ms\.?|Mrs\.?)\s+/i, "");
          var parts = normalized.split(/\s+/);
          guestFirstName = parts[0] || "";
          guestLastName = parts.slice(1).join(" ");
          guestPhone = S.guestPhone || "";
        }
        render();
      };

      (window as any).handlePay = function () {
        var S = (window as any).VelvetStore;
        if (!otpVerified) { showToast("Verify phone first", "Please complete OTP verification to continue.", "error"); return; }
        if (!/^\d{10}$/.test(S.phone)) { showToast("Phone number looks incomplete", "Please enter a valid 10-digit mobile number.", "error"); return; }
        var emailEl = document.getElementById("email-input") as HTMLInputElement | null;
        if (emailEl && emailEl.value.trim()) { S.email = emailEl.value.trim(); S.save(); }
        if (S.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.email)) { showToast("Email format is invalid", "Please check your email and try again.", "error"); return; }

        if (bookingFor === "me") {
          var fnEl = document.getElementById("first-name") as HTMLInputElement | null;
          var lnEl = document.getElementById("last-name") as HTMLInputElement | null;
          if (fnEl) firstName = fnEl.value;
          if (lnEl) lastName = lnEl.value;
          if (!firstName.trim() || !lastName.trim()) { showToast("Enter your name", "Please provide first and last name.", "error"); return; }
        } else {
          var gfEl = document.getElementById("guest-first") as HTMLInputElement | null;
          var glEl = document.getElementById("guest-last") as HTMLInputElement | null;
          var gpEl = document.getElementById("guest-phone") as HTMLInputElement | null;
          if (gfEl) guestFirstName = gfEl.value;
          if (glEl) guestLastName = glEl.value;
          if (gpEl) guestPhone = gpEl.value.replace(/\D/g, "").slice(0, 10);
          if (!guestFirstName.trim() || !guestLastName.trim()) { showToast("Enter guest details", "Please provide guest first and last name.", "error"); return; }
          if (!/^\d{10}$/.test(guestPhone)) { showToast("Guest phone is invalid", "Guest phone must be a valid 10-digit number.", "error"); return; }
        }
        var flightEl = document.getElementById("flight-input") as HTMLInputElement | null;
        if (flightEl) { S.flightNumber = flightEl.value.toUpperCase(); S.save(); }
        S.bookingFor = bookingFor;
        S.guestName = bookingFor === "guest" ? (guestFirstName + " " + guestLastName) : "";
        S.guestPhone = bookingFor === "guest" ? guestPhone : "";
        S.bookingId = "VLV-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        S.save();
        paying = true;
        showToast("Processing payment", "Opening Razorpay flow (mock).", "success");
        var overlay = document.createElement("div"); overlay.className = "paying-overlay"; overlay.id = "paying-overlay";
        overlay.innerHTML = '<div class="paying-box"><div class="spinner"></div><p style="color:var(--text);font-size:1rem">Processing payment…</p></div>';
        document.body.appendChild(overlay);
        setTimeout(function () {
          var ov = document.getElementById("paying-overlay");
          if (ov) ov.remove();
          paying = false;
          showToast("Payment successful", "Redirecting to confirmation.", "success");
          window.location.href = "/confirmation";
        }, 1500);
      };

      if (!(window as any).VelvetStore) {
        var s = document.createElement("script");
        s.src = "/src/store.js";
        s.onload = render;
        document.head.appendChild(s);
      } else {
        render();
      }
    })();
  }, []);

  return null;
}

