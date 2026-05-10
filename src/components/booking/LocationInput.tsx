"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin } from "lucide-react";
import { DELHI_NCR_BOUNDS } from "@/lib/maps";

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
}

interface LocationInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onSelect: (result: PlaceResult) => void;
  disabled?: boolean;
  apiKey: string;
}

interface PredictionItem {
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text?: string;
  };
  description: string;
}

export default function LocationInput({
  label,
  placeholder = "Address, hotel, landmark…",
  value,
  onSelect,
  disabled,
  apiKey,
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesRef = useRef<google.maps.places.PlacesService | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Initialize Google Places services when maps is ready
  useEffect(() => {
    if (!apiKey) return;

    const initServices = () => {
      if (window.google?.maps?.places) {
        autocompleteRef.current =
          new window.google.maps.places.AutocompleteService();
        // PlacesService needs a DOM element or map
        const div = document.createElement("div");
        placesRef.current = new window.google.maps.places.PlacesService(div);
      }
    };

    if (window.google?.maps?.places) {
      initServices();
    } else {
      window.addEventListener("velvet:maps-ready", initServices, {
        once: true,
      });
    }

    return () => {
      window.removeEventListener("velvet:maps-ready", initServices);
    };
  }, [apiKey]);

  const fetchPredictions = useCallback(
    (query: string) => {
      if (!autocompleteRef.current || query.length < 2) {
        setPredictions([]);
        setIsOpen(false);
        return;
      }

      autocompleteRef.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "in" },
          locationRestriction: new window.google.maps.LatLngBounds(
            { lat: DELHI_NCR_BOUNDS.south, lng: DELHI_NCR_BOUNDS.west },
            { lat: DELHI_NCR_BOUNDS.north, lng: DELHI_NCR_BOUNDS.east }
          ),
        },
        (results, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            setPredictions(results.slice(0, 5) as unknown as PredictionItem[]);
            setIsOpen(true);
          } else {
            setPredictions([]);
            setIsOpen(false);
          }
        }
      );
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setFocusedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(val), 280);
  };

  const handleSelect = (prediction: PredictionItem) => {
    if (!placesRef.current) return;

    placesRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["place_id", "name", "formatted_address", "geometry"],
      },
      (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          const name = prediction.structured_formatting.main_text || place.name || "";
          const address = place.formatted_address || name;
          setInputValue(name);
          setPredictions([]);
          setIsOpen(false);
          onSelect({
            placeId: place.place_id || prediction.place_id,
            name,
            address,
          });
        }
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, predictions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSelect(predictions[focusedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={containerRef} className="booking-field" style={{ position: "relative" }}>
      <label className="booking-field-label">{label}</label>
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (predictions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="booking-input"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          style={{ paddingLeft: "2.25rem" }}
        />
        <MapPin
          size={14}
          style={{
            position: "absolute",
            left: "0.7rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--gold)",
            opacity: 0.7,
            pointerEvents: "none",
          }}
        />

        {isOpen && predictions.length > 0 && (
          <div
            className="autocomplete-dropdown"
            role="listbox"
            aria-label={`${label} suggestions`}
          >
            {predictions.map((pred, i) => (
              <div
                key={pred.place_id}
                role="option"
                aria-selected={i === focusedIndex}
                className={`autocomplete-item ${i === focusedIndex ? "is-focused" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(pred);
                }}
              >
                <MapPin
                  size={12}
                  style={{
                    color: "var(--gold)",
                    opacity: 0.6,
                    flexShrink: 0,
                    marginTop: "0.2rem",
                  }}
                />
                <div>
                  <div className="autocomplete-item-main">
                    {pred.structured_formatting.main_text}
                  </div>
                  {pred.structured_formatting.secondary_text && (
                    <div className="autocomplete-item-secondary">
                      {pred.structured_formatting.secondary_text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
