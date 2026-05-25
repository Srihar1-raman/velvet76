"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { toDateInputString, smartDayLabel } from "@/lib/utils";

interface DatePickerProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  disabled?: boolean;
  minDate?: string;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function DatePicker({
  label = "Date",
  value,
  onChange,
  disabled,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const todayStr = toDateInputString(today);
  const effectiveMin = minDate || todayStr;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelect = (day: number) => {
    const d = String(day).padStart(2, "0");
    const m = String(viewMonth + 1).padStart(2, "0");
    const dateStr = `${viewYear}-${m}-${d}`;
    if (dateStr < effectiveMin) return;
    onChange(dateStr);
    setOpen(false);
  };

  const displayLabel = value ? smartDayLabel(value) || value : "Select date";

  return (
    <div className="booking-field" style={{ position: "relative" }}>
      {label && <label className="booking-field-label">{label}</label>}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className="booking-input flex items-center justify-between text-left cursor-pointer"
          aria-haspopup="dialog"
          aria-expanded={open}
          style={{ height: "2.75rem" }}
        >
          <span style={{ color: value ? "var(--text)" : "var(--text-soft)" }}>
            {displayLabel}
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
            role="dialog"
            aria-label="Select date"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 60,
              marginTop: "0.25rem",
              background: "rgba(12, 11, 18, 0.98)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "10px",
              padding: "1rem",
              backdropFilter: "blur(16px)",
              minWidth: "260px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Month nav */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
              }}
            >
              <button
                type="button"
                onClick={handlePrevMonth}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/8 transition-colors"
                style={{ color: "var(--text-muted)" }}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span
                style={{
                  color: "var(--text)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                }}
              >
                {monthNames[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/8 transition-colors"
                style={{ color: "var(--text-muted)" }}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day of week headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "2px",
                marginBottom: "0.35rem",
              }}
            >
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: "0.68rem",
                    color: "var(--text-soft)",
                    padding: "0.25rem 0",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "2px",
              }}
            >
              {/* Empty cells for offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const d = String(day).padStart(2, "0");
                const m = String(viewMonth + 1).padStart(2, "0");
                const dateStr = `${viewYear}-${m}-${d}`;
                const isPast = dateStr < effectiveMin;
                const isSelected = dateStr === value;
                const isToday = dateStr === todayStr;

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleSelect(day)}
                    style={{
                      height: "2rem",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: isSelected ? 700 : 400,
                      border: isToday && !isSelected
                        ? "1px solid rgba(216,184,90,0.35)"
                        : "1px solid transparent",
                      background: isSelected
                        ? "var(--gold)"
                        : "transparent",
                      color: isSelected
                        ? "#09080d"
                        : isPast
                        ? "var(--text-soft)"
                        : "var(--text)",
                      cursor: isPast ? "not-allowed" : "pointer",
                      opacity: isPast ? 0.35 : 1,
                      transition: "background 150ms ease",
                    }}
                    className={!isPast && !isSelected ? "hover:bg-white/8" : ""}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                marginTop: "0.75rem",
                marginLeft: "auto",
                fontSize: "0.78rem",
                color: "var(--text-soft)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem 0.5rem",
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
