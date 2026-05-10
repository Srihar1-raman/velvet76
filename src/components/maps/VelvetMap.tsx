"use client";

import { useEffect, useRef } from "react";
import { MAP_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM, DELHI_NCR_BOUNDS } from "@/lib/maps";

interface VelvetMapProps {
  apiKey: string;
  origin?: string;
  destination?: string;
  onRouteLoaded?: (distanceKm: number, distanceText: string, durationMinutes: number, durationText: string) => void;
}

export default function VelvetMap({
  apiKey,
  origin,
  destination,
  onRouteLoaded,
}: VelvetMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!apiKey) return;

    const initMap = () => {
      if (!containerRef.current) return;

      const map = new window.google.maps.Map(containerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 9,
        maxZoom: 16,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        restriction: {
          latLngBounds: DELHI_NCR_BOUNDS,
          strictBounds: false,
        },
      });

      mapRef.current = map;
      window.dispatchEvent(new CustomEvent("velvet:maps-ready"));
    };

    if (window.google?.maps) {
      initMap();
    } else {
      // Load Google Maps script
      const existing = document.querySelector('script[src*="maps.googleapis.com"]');
      if (!existing) {
        const callbackName = "__velvetMapsInit";
        (window as unknown as Record<string, unknown>)[callbackName] = initMap;

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places,geometry&region=IN&language=en&callback=${callbackName}`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div style="display:flex;align-items:center;justify-content:center;height:100%;padding:1rem;text-align:center;color:rgba(247,242,232,0.72);font-size:0.82rem;background:rgba(10,9,14,0.6);border-radius:8px;">
                Map unavailable. Booking continues normally.
              </div>
            `;
          }
        };
        document.head.appendChild(script);
        scriptRef.current = script;
      } else {
        // Script is loading, wait for the event
        const handler = () => initMap();
        window.addEventListener("velvet:maps-ready", handler, { once: true });
      }
    }
  }, [apiKey]);

  // Draw route when origin/destination change
  useEffect(() => {
    if (!mapRef.current || !origin || !destination) return;

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map: mapRef.current,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#d8b85a",
          strokeOpacity: 0.9,
          strokeWeight: 5,
        },
      });
    }

    const ds = new window.google.maps.DirectionsService();
    ds.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status !== "OK" || !result?.routes[0]) return;

        directionsRendererRef.current?.setDirections(result);
        mapRef.current?.fitBounds(result.routes[0].bounds);

        const leg = result.routes[0].legs[0];
        if (!leg) return;

        const distanceM = leg.distance?.value ?? 0;
        const distanceKm = Math.round((distanceM / 1000) * 10) / 10;
        const distanceText = leg.distance?.text ?? `${distanceKm} km`;
        const durationS = leg.duration?.value ?? 0;
        const durationMinutes = Math.max(1, Math.round(durationS / 60));
        const h = Math.floor(durationMinutes / 60);
        const m = durationMinutes % 60;
        const durationText = h > 0 ? `${h} hr${m > 0 ? ` ${m} min` : ""}` : `${m} min`;

        onRouteLoaded?.(distanceKm, distanceText, durationMinutes, durationText);

        // Add custom markers
        [
          { pos: leg.start_location, label: "Pickup", addr: origin },
          { pos: leg.end_location, label: "Drop-off", addr: destination },
        ].forEach(({ pos, label }) => {
          new window.google.maps.Marker({
            map: mapRef.current!,
            position: pos,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#d8b85a",
              fillOpacity: 1,
              strokeColor: "#09080d",
              strokeWeight: 2,
            },
            title: label,
          });
        });
      }
    );
  }, [origin, destination, onRouteLoaded]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "20rem",
        borderRadius: "var(--radius)",
        background: "rgba(9, 8, 14, 0.9)",
      }}
      aria-label="Route map"
    />
  );
}
