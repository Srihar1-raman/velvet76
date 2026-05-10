"use client";

import { useEffect } from "react";
import { whatsappSendUrl } from "@/lib/whatsapp";

export default function TrackClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    (function () {
      function fmt(v: any, f: any) { return v || f; }
      var lastEstimateKey = "";
      function render() {
        var S = (window as any).VelvetStore;
        var root = document.getElementById("root");
        if (!root) return;
        if (!S || !S.bookingId) {
          root.innerHTML = '<div class="empty"><p>No active booking found to track.</p><a class="btn btn-gold" href="/">Start booking</a></div>';
          return;
        }
        var waMsg = "Hello Velvet, I want an update on booking " + (S.bookingId || "VLT") + ".";
        var barPickup = document.getElementById("bar-pickup");
        var barDrop = document.getElementById("bar-drop");
        var barDate = document.getElementById("bar-date");
        var barTime = document.getElementById("bar-time");
        if (barPickup) barPickup.textContent = fmt(S.pickupLocation, "Pickup not set");
        if (barDrop) barDrop.textContent = fmt(S.dropLocation, "Drop not set");
        if (barDate) barDate.textContent = fmt(S.travelDate, "--");
        if (barTime) barTime.textContent = fmt(S.travelTime, "--:--");
        var html = '<div class="main">' +
          '<h1 class="title">Track your ride.</h1>' +
          '<div class="grid">' +
          '<section class="map-card"><div class="map-frame" id="track-map"><div class="map-fallback">Google map will appear here after API key setup.</div></div></section>' +
          '<aside class="side">' +
          '<div class="hero-top"><div><p class="mono">Your chauffeur</p><h2 class="hero-name">Rajesh K.</h2><p class="sub">DL 01 AB 1234</p></div><span class="status-pill">En route</span></div>' +
          '<div class="vehicle-chip"><p>Assigned vehicle</p><p>Velvet Elite · Mercedes E-Class</p></div>' +
          '<div class="route">' +
          '<div class="line"><span class="label">Booking ID</span><span class="val">' + fmt(S.bookingId, "VLT") + "</span></div>" +
          '<div class="line"><span class="label">Service</span><span class="val">' + fmt((S.serviceType || "").replace(/-/g, " "), "N/A") + "</span></div>" +
          '<div class="line"><span class="label">Pickup</span><span class="val">' + fmt(S.pickupLocation, "Not set") + "</span></div>" +
          '<div class="line"><span class="label">Drop-off</span><span class="val">' + fmt(S.dropLocation, "Not set") + "</span></div>" +
          '<div class="line"><span class="label">When</span><span class="val">' + fmt(S.travelDate, "--") + " " + fmt(S.travelTime, "--:--") + "</span></div>" +
          '<div class="line"><span class="label">Distance</span><span class="val">' + (S.distanceText || ((S.distanceKm || 0) ? (S.distanceKm + " km") : "--")) + "</span></div>" +
          '<div class="line"><span class="label">Journey</span><span class="val">' + (S.durationText || "--") + "</span></div>" +
          '<div class="line"><span class="label">Estimated drop</span><span class="val">' + (S.estimatedDropTime || "--:--") + "</span></div>" +
          "</div>" +
          '<div class="timeline">' +
          '<div class="timeline-row"><span class="dot"></span><span>Chauffeur assigned</span></div>' +
          '<div class="timeline-row"><span class="dot live"></span><span>On the way to pickup</span></div>' +
          '<div class="timeline-row"><span class="dot"></span><span>Ride in progress</span></div>' +
          '<div class="timeline-row"><span class="dot"></span><span>Drop-off complete</span></div>' +
          "</div>" +
          '<div class="actions">' +
          '<a class="btn btn-gold" href="/confirmation">View confirmation</a>' +
          '<a class="btn btn-glass" href="' + whatsappSendUrl(waMsg).replace(/&/g, "&amp;") + '" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.8 11.8 0 0 0 12.06 0C5.57 0 .29 5.29.29 11.77c0 2.08.54 4.11 1.57 5.91L0 24l6.5-1.84a11.72 11.72 0 0 0 5.56 1.42h.01c6.49 0 11.77-5.29 11.77-11.77 0-3.15-1.23-6.1-3.32-8.33Z"/></svg>Message support on WhatsApp</a>' +
          "</div>" +
          "</aside>" +
          "</div>" +
          "</div>";
        root.innerHTML = html;
        if ((window as any).VelvetMapsEstimator) {
          (window as any).VelvetMapsEstimator.initStyledMap(document.getElementById("track-map"), {
            origin: S.pickupLocation || "",
            destination: S.dropLocation || "",
            travelDate: S.travelDate || "",
            travelTime: S.travelTime || "",
            durationText: S.durationText || "",
            estimatedDropTime: S.estimatedDropTime || "",
          });
        }
        var currentEstimateKey = [S.pickupLocation || "", S.dropLocation || "", S.travelDate || "", S.travelTime || ""].join("|");
        if (currentEstimateKey !== lastEstimateKey) {
          lastEstimateKey = currentEstimateKey;
          if ((window as any).VelvetMapsEstimator && S.pickupLocation && S.dropLocation) {
            (window as any).VelvetMapsEstimator.estimateAndStore(S).then(function (changed: any) {
              if (changed) render();
            });
          }
        }
      }
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

