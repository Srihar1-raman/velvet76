"use client";

import { useEffect } from "react";
import { whatsappSendUrl } from "@/lib/whatsapp";

export default function ConfirmationClient() {
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
        { key: "4h40km", prices: { vault: 5500, premier: 7000, elite: 9000 } },
        { key: "6h60km", prices: { vault: 8000, premier: 10500, elite: 13500 } },
        { key: "8h80km", prices: { vault: 10500, premier: 14000, elite: 18000 } },
        { key: "10h100km", prices: { vault: 12500, premier: 17500, elite: 22500 } },
      ];
      function formatPrice(v: number) { return "\u20B9" + v.toLocaleString("en-IN"); }
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

      function render() {
        var S = (window as any).VelvetStore;
        var root = document.getElementById("root");
        if (!root) return;
        if (!S || !S.bookingId) {
          root.innerHTML = '<div class="center"><p style="color:var(--text-muted);margin-bottom:1.5rem">No booking found.</p><a href="/" class="btn btn-primary">Start Booking</a></div>';
          return;
        }
        var tier = TIERS.find(function (t) { return t.key === S.selectedTier; }) || TIERS[0];
        var basePrice = price(S.selectedTier || "vault");
        var parking = parkingCharge();
        var total = basePrice + parking;
        var guestName = (S.guestName || "").trim();
        var passengerName = guestName || (S.bookingFor === "guest" ? "Guest" : "Self");

        var html = '<div class="center">' +
          '<div class="checkmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>' +
          '<p class="step-label">Booking Confirmed</p>' +
          '<h1 class="page-title">Request received.</h1>' +
          '<p class="page-sub">Our concierge team will reach out shortly to confirm availability and finalise your journey.</p>' +
          '<p class="page-sub2">A booking is confirmed only after vehicle and chauffeur availability is verified.</p>' +
          '<div class="card"><div class="top-row"><span class="booking-id">' + (S.bookingId || "VLT-CONFIRMED") + '</span><span class="service-type">' + S.serviceType.replace(/-/g, " ") + '</span></div>' +
          '<div class="detail"><span class="dlabel">Vehicle</span><span class="dvalue">' + tier.tier + "</span></div>" +
          '<div class="detail"><span class="dlabel">Passenger</span><span class="dvalue">' + passengerName + "</span></div>" +
          '<div class="detail"><span class="dlabel">Route</span><span class="dvalue">' + S.pickupLocation + (S.dropLocation ? " \u2192 " + S.dropLocation : "") + "</span></div>" +
          '<div class="detail"><span class="dlabel">When</span><span class="dvalue">' + S.travelDate + " at " + S.travelTime + "</span></div>" +
          (S.flightNumber ? '<div class="detail"><span class="dlabel">Flight</span><span class="dvalue">' + S.flightNumber + "</span></div>" : "") +
          '<div class="total-row"><span style="font-size:0.82rem;font-weight:500">Total</span><span class="total-price">' + formatPrice(total) + "</span></div>" +
          "</div>" +
          '<div class="special-request"><label>Special Requests</label><textarea id="special-req" placeholder="Child seat, extra luggage, refreshments, accessibility needs..." rows="3"></textarea></div>' +
          '<button class="whatsapp-btn inactive" id="whatsapp-btn" onclick="sendWhatsApp()"><svg class="wa-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.8 11.8 0 0 0 12.06 0C5.57 0 .29 5.29.29 11.77c0 2.08.54 4.11 1.57 5.91L0 24l6.5-1.84a11.72 11.72 0 0 0 5.56 1.42h.01c6.49 0 11.77-5.29 11.77-11.77 0-3.15-1.23-6.1-3.32-8.33Zm-8.46 18.1h-.01a9.75 9.75 0 0 1-4.96-1.36l-.36-.21-3.86 1.09 1.03-3.76-.24-.39a9.73 9.73 0 0 1-1.5-5.2c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.02 6.96 2.88a9.78 9.78 0 0 1 2.87 6.96c0 5.43-4.41 9.84-9.83 9.84Zm5.39-7.38c-.29-.15-1.73-.85-2-.95-.27-.1-.47-.15-.67.15-.19.29-.77.95-.94 1.14-.17.2-.35.22-.64.08-.29-.15-1.25-.46-2.37-1.46-.88-.79-1.47-1.75-1.64-2.05-.17-.29-.02-.45.13-.6.14-.14.29-.34.44-.51.15-.17.2-.29.29-.49.1-.19.05-.37-.02-.51-.08-.14-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.51.07-.77.37-.27.29-1.02.99-1.02 2.42 0 1.42 1.04 2.8 1.18 2.99.15.2 2.04 3.11 4.95 4.37.69.3 1.22.48 1.64.62.69.22 1.32.19 1.81.11.55-.08 1.73-.71 1.97-1.39.24-.69.24-1.27.17-1.39-.07-.12-.26-.2-.55-.34Z"/></svg><span>Send on WhatsApp</span></button>' +
          '<div class="actions">' +
          '<a href="/track" class="btn btn-primary">Track Your Ride</a>' +
          '<button class="btn btn-outline" onclick="downloadInvoice()">Download Invoice</button>' +
          "</div>" +
          '<div style="margin-top:2.5rem"><a href="/" class="btn btn-ghost">Back to Home</a></div>' +
          "</div>";
        root.innerHTML = html;
        var req = document.getElementById("special-req") as HTMLTextAreaElement | null;
        var btn = document.getElementById("whatsapp-btn") as HTMLButtonElement | null;
        if (req && btn) {
          var reqEl = req;
          var btnEl = btn;
          req.addEventListener("input", function () {
            btnEl.className = reqEl.value.trim() ? "whatsapp-btn active" : "whatsapp-btn inactive";
          });
        }
      }

      (window as any).sendWhatsApp = function () {
        var S = (window as any).VelvetStore;
        var req = document.getElementById("special-req") as HTMLTextAreaElement | null;
        var msg = req && req.value.trim()
          ? "Hello Velvet, I have a booking (" + S.bookingId + ").\n\nSpecial request: " + req.value.trim()
          : "Hello Velvet, I have a booking (" + S.bookingId + ") and would like to discuss details.";
        window.open(whatsappSendUrl(msg), "_blank");
      };

      (window as any).downloadInvoice = function () {
        var S = (window as any).VelvetStore;
        var lines = [
          "VELVET EXPERIENCE",
          "──────────────────",
          "Booking ID: " + (S.bookingId || "VLT-CONFIRMED"),
          "Service: " + S.serviceType.replace(/-/g, " "),
          "Vehicle: " + ((TIERS.find(function (t) { return t.key === S.selectedTier; }) || {}) as any).tier || "",
          "Passenger: " + ((S.guestName || "").trim() || "Self"),
          "Phone: +91 " + (S.phone || ""),
          "Pickup: " + S.pickupLocation,
          S.dropLocation ? "Drop: " + S.dropLocation : "",
          "Date: " + S.travelDate + " at " + S.travelTime,
          (S.flightNumber ? "Flight: " + S.flightNumber : ""),
          "──────────────────",
          "Total: " + formatPrice(price(S.selectedTier || "vault") + parkingCharge()),
          "──────────────────",
          "Thank you for choosing Velvet Experience.",
        ].filter(Boolean);
        var blob = new Blob([lines.join("\n")], { type: "text/plain" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "velvet-invoice-" + (S.bookingId || "invoice") + ".txt";
        a.click();
        URL.revokeObjectURL(url);
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

