"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  generate30MinSlots,
  formatTimeDisplay,
  getMinTime,
} from "@/lib/utils";

interface TimePickerProps {
  label?: string;
  value: string;
  date: string;
  onChange: (time: string) => void;
  disabled?: boolean;
}

export default function TimePicker({
  label = "Pickup time",
  value,
  date,
  onChange,
  disabled,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const minTime = getMinTime(date);
  const slots = generate30MinSlots(minTime);

  return (
    <div className="booking-field" style={{ position: "relative" }}>
      {label && <label className="booking-field-label">{label}</label>}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className="booking-input flex items-center justify-between text-left cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={open}
          style={{ height: "2.75rem" }}
        >
          <span style={{ color: value ? "var(--text)" : "var(--text-soft)" }}>
            {value ? formatTimeDisplay(value) : "Select time"}
          </span>
          <ChevronDown
            size={14}
            style={{
              color: "var(--text-soft)",
              transition: "transform 200ms ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              flexShrink: 0,
            }}
          />
        </button>

        {open && (
          <div
            className="autocomplete-dropdown"
            role="listbox"
            aria-label="Select pickup time"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {slots.length === 0 && (
              <div
                className="autocomplete-item"
                style={{ color: "var(--text-soft)", cursor: "default" }}
              >
                No available slots
              </div>
            )}
            {slots.map((slot) => (
              <div
                key={slot}
                role="option"
                aria-selected={slot === value}
                className={`autocomplete-item ${slot === value ? "is-focused" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(slot);
                  setOpen(false);
                }}
              >
                {formatTimeDisplay(slot)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
