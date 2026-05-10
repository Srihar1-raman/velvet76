"use client";

import { useEffect, useState, type FormEvent } from "react";
import { whatsappSendUrl } from "@/lib/whatsapp";

const BUSINESS_FORM_STORAGE_KEY = "velvet-business-form-draft";

type BusinessFormDraft = {
  company: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  requirement: string;
  requirementOther: string;
  startTimeline: string;
  notes: string;
};

const defaultDraft: BusinessFormDraft = {
  company: "",
  name: "",
  email: "",
  countryCode: "+91",
  phone: "",
  requirement: "corporate-account",
  requirementOther: "",
  startTimeline: "within-2-weeks",
  notes: "",
};

const requirementLabels: Record<string, string> = {
  "corporate-account": "Corporate account setup",
  "leadership-mobility": "Leadership mobility",
  "employee-transport": "Employee airport/city transfers",
  "guest-vip-rides": "Guest and VIP rides",
  "event-logistics": "Event mobility logistics",
  other: "Other",
};

const timelineLabels: Record<string, string> = {
  immediate: "Immediate (within 48 hours)",
  "within-2-weeks": "Within 2 weeks",
  "this-month": "Within this month",
  planning: "Planning for next quarter",
};

const COUNTRY_DIAL_CODES: Array<{ country: string; dialCode: string }> = [
  { country: "India", dialCode: "+91" },
  { country: "Afghanistan", dialCode: "+93" },
  { country: "Albania", dialCode: "+355" },
  { country: "Algeria", dialCode: "+213" },
  { country: "Andorra", dialCode: "+376" },
  { country: "Angola", dialCode: "+244" },
  { country: "Antigua and Barbuda", dialCode: "+1-268" },
  { country: "Argentina", dialCode: "+54" },
  { country: "Armenia", dialCode: "+374" },
  { country: "Australia", dialCode: "+61" },
  { country: "Austria", dialCode: "+43" },
  { country: "Azerbaijan", dialCode: "+994" },
  { country: "Bahamas", dialCode: "+1-242" },
  { country: "Bahrain", dialCode: "+973" },
  { country: "Bangladesh", dialCode: "+880" },
  { country: "Barbados", dialCode: "+1-246" },
  { country: "Belarus", dialCode: "+375" },
  { country: "Belgium", dialCode: "+32" },
  { country: "Belize", dialCode: "+501" },
  { country: "Benin", dialCode: "+229" },
  { country: "Bhutan", dialCode: "+975" },
  { country: "Bolivia", dialCode: "+591" },
  { country: "Bosnia and Herzegovina", dialCode: "+387" },
  { country: "Botswana", dialCode: "+267" },
  { country: "Brazil", dialCode: "+55" },
  { country: "Brunei", dialCode: "+673" },
  { country: "Bulgaria", dialCode: "+359" },
  { country: "Burkina Faso", dialCode: "+226" },
  { country: "Burundi", dialCode: "+257" },
  { country: "Cabo Verde", dialCode: "+238" },
  { country: "Cambodia", dialCode: "+855" },
  { country: "Cameroon", dialCode: "+237" },
  { country: "Canada", dialCode: "+1" },
  { country: "Central African Republic", dialCode: "+236" },
  { country: "Chad", dialCode: "+235" },
  { country: "Chile", dialCode: "+56" },
  { country: "China", dialCode: "+86" },
  { country: "Colombia", dialCode: "+57" },
  { country: "Comoros", dialCode: "+269" },
  { country: "Congo (Congo-Brazzaville)", dialCode: "+242" },
  { country: "Costa Rica", dialCode: "+506" },
  { country: "Croatia", dialCode: "+385" },
  { country: "Cuba", dialCode: "+53" },
  { country: "Cyprus", dialCode: "+357" },
  { country: "Czechia", dialCode: "+420" },
  { country: "Democratic Republic of the Congo", dialCode: "+243" },
  { country: "Denmark", dialCode: "+45" },
  { country: "Djibouti", dialCode: "+253" },
  { country: "Dominica", dialCode: "+1-767" },
  { country: "Dominican Republic", dialCode: "+1-809" },
  { country: "Ecuador", dialCode: "+593" },
  { country: "Egypt", dialCode: "+20" },
  { country: "El Salvador", dialCode: "+503" },
  { country: "Equatorial Guinea", dialCode: "+240" },
  { country: "Eritrea", dialCode: "+291" },
  { country: "Estonia", dialCode: "+372" },
  { country: "Eswatini", dialCode: "+268" },
  { country: "Ethiopia", dialCode: "+251" },
  { country: "Fiji", dialCode: "+679" },
  { country: "Finland", dialCode: "+358" },
  { country: "France", dialCode: "+33" },
  { country: "Gabon", dialCode: "+241" },
  { country: "Gambia", dialCode: "+220" },
  { country: "Georgia", dialCode: "+995" },
  { country: "Germany", dialCode: "+49" },
  { country: "Ghana", dialCode: "+233" },
  { country: "Greece", dialCode: "+30" },
  { country: "Grenada", dialCode: "+1-473" },
  { country: "Guatemala", dialCode: "+502" },
  { country: "Guinea", dialCode: "+224" },
  { country: "Guinea-Bissau", dialCode: "+245" },
  { country: "Guyana", dialCode: "+592" },
  { country: "Haiti", dialCode: "+509" },
  { country: "Honduras", dialCode: "+504" },
  { country: "Hungary", dialCode: "+36" },
  { country: "Iceland", dialCode: "+354" },
  { country: "Indonesia", dialCode: "+62" },
  { country: "Iran", dialCode: "+98" },
  { country: "Iraq", dialCode: "+964" },
  { country: "Ireland", dialCode: "+353" },
  { country: "Israel", dialCode: "+972" },
  { country: "Italy", dialCode: "+39" },
  { country: "Jamaica", dialCode: "+1-876" },
  { country: "Japan", dialCode: "+81" },
  { country: "Jordan", dialCode: "+962" },
  { country: "Kazakhstan", dialCode: "+7" },
  { country: "Kenya", dialCode: "+254" },
  { country: "Kiribati", dialCode: "+686" },
  { country: "Kuwait", dialCode: "+965" },
  { country: "Kyrgyzstan", dialCode: "+996" },
  { country: "Laos", dialCode: "+856" },
  { country: "Latvia", dialCode: "+371" },
  { country: "Lebanon", dialCode: "+961" },
  { country: "Lesotho", dialCode: "+266" },
  { country: "Liberia", dialCode: "+231" },
  { country: "Libya", dialCode: "+218" },
  { country: "Liechtenstein", dialCode: "+423" },
  { country: "Lithuania", dialCode: "+370" },
  { country: "Luxembourg", dialCode: "+352" },
  { country: "Madagascar", dialCode: "+261" },
  { country: "Malawi", dialCode: "+265" },
  { country: "Malaysia", dialCode: "+60" },
  { country: "Maldives", dialCode: "+960" },
  { country: "Mali", dialCode: "+223" },
  { country: "Malta", dialCode: "+356" },
  { country: "Marshall Islands", dialCode: "+692" },
  { country: "Mauritania", dialCode: "+222" },
  { country: "Mauritius", dialCode: "+230" },
  { country: "Mexico", dialCode: "+52" },
  { country: "Micronesia", dialCode: "+691" },
  { country: "Moldova", dialCode: "+373" },
  { country: "Monaco", dialCode: "+377" },
  { country: "Mongolia", dialCode: "+976" },
  { country: "Montenegro", dialCode: "+382" },
  { country: "Morocco", dialCode: "+212" },
  { country: "Mozambique", dialCode: "+258" },
  { country: "Myanmar", dialCode: "+95" },
  { country: "Namibia", dialCode: "+264" },
  { country: "Nauru", dialCode: "+674" },
  { country: "Nepal", dialCode: "+977" },
  { country: "Netherlands", dialCode: "+31" },
  { country: "New Zealand", dialCode: "+64" },
  { country: "Nicaragua", dialCode: "+505" },
  { country: "Niger", dialCode: "+227" },
  { country: "Nigeria", dialCode: "+234" },
  { country: "North Korea", dialCode: "+850" },
  { country: "North Macedonia", dialCode: "+389" },
  { country: "Norway", dialCode: "+47" },
  { country: "Oman", dialCode: "+968" },
  { country: "Pakistan", dialCode: "+92" },
  { country: "Palau", dialCode: "+680" },
  { country: "Palestine", dialCode: "+970" },
  { country: "Panama", dialCode: "+507" },
  { country: "Papua New Guinea", dialCode: "+675" },
  { country: "Paraguay", dialCode: "+595" },
  { country: "Peru", dialCode: "+51" },
  { country: "Philippines", dialCode: "+63" },
  { country: "Poland", dialCode: "+48" },
  { country: "Portugal", dialCode: "+351" },
  { country: "Qatar", dialCode: "+974" },
  { country: "Romania", dialCode: "+40" },
  { country: "Russia", dialCode: "+7" },
  { country: "Rwanda", dialCode: "+250" },
  { country: "Saint Kitts and Nevis", dialCode: "+1-869" },
  { country: "Saint Lucia", dialCode: "+1-758" },
  { country: "Saint Vincent and the Grenadines", dialCode: "+1-784" },
  { country: "Samoa", dialCode: "+685" },
  { country: "San Marino", dialCode: "+378" },
  { country: "Sao Tome and Principe", dialCode: "+239" },
  { country: "Saudi Arabia", dialCode: "+966" },
  { country: "Senegal", dialCode: "+221" },
  { country: "Serbia", dialCode: "+381" },
  { country: "Seychelles", dialCode: "+248" },
  { country: "Sierra Leone", dialCode: "+232" },
  { country: "Singapore", dialCode: "+65" },
  { country: "Slovakia", dialCode: "+421" },
  { country: "Slovenia", dialCode: "+386" },
  { country: "Solomon Islands", dialCode: "+677" },
  { country: "Somalia", dialCode: "+252" },
  { country: "South Africa", dialCode: "+27" },
  { country: "South Korea", dialCode: "+82" },
  { country: "South Sudan", dialCode: "+211" },
  { country: "Spain", dialCode: "+34" },
  { country: "Sri Lanka", dialCode: "+94" },
  { country: "Sudan", dialCode: "+249" },
  { country: "Suriname", dialCode: "+597" },
  { country: "Sweden", dialCode: "+46" },
  { country: "Switzerland", dialCode: "+41" },
  { country: "Syria", dialCode: "+963" },
  { country: "Taiwan", dialCode: "+886" },
  { country: "Tajikistan", dialCode: "+992" },
  { country: "Tanzania", dialCode: "+255" },
  { country: "Thailand", dialCode: "+66" },
  { country: "Timor-Leste", dialCode: "+670" },
  { country: "Togo", dialCode: "+228" },
  { country: "Tonga", dialCode: "+676" },
  { country: "Trinidad and Tobago", dialCode: "+1-868" },
  { country: "Tunisia", dialCode: "+216" },
  { country: "Turkey", dialCode: "+90" },
  { country: "Turkmenistan", dialCode: "+993" },
  { country: "Tuvalu", dialCode: "+688" },
  { country: "Uganda", dialCode: "+256" },
  { country: "Ukraine", dialCode: "+380" },
  { country: "United Arab Emirates", dialCode: "+971" },
  { country: "United Kingdom", dialCode: "+44" },
  { country: "United States", dialCode: "+1" },
  { country: "Uruguay", dialCode: "+598" },
  { country: "Uzbekistan", dialCode: "+998" },
  { country: "Vanuatu", dialCode: "+678" },
  { country: "Vatican City", dialCode: "+379" },
  { country: "Venezuela", dialCode: "+58" },
  { country: "Vietnam", dialCode: "+84" },
  { country: "Yemen", dialCode: "+967" },
  { country: "Zambia", dialCode: "+260" },
  { country: "Zimbabwe", dialCode: "+263" },
  { country: "Kosovo", dialCode: "+383" },
];

export default function BusinessClient() {
  const [draft, setDraft] = useState<BusinessFormDraft>(defaultDraft);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BUSINESS_FORM_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<BusinessFormDraft>;
      setDraft((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore storage parse failures
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(BUSINESS_FORM_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore storage failures
    }
  }, [draft]);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".business-nav");
    const openBtn = document.getElementById("business-nav-open") as HTMLButtonElement | null;
    const closeBtn = document.getElementById("business-nav-close") as HTMLButtonElement | null;
    const overlay = document.getElementById("business-mobile-overlay") as HTMLDivElement | null;
    const menu = document.getElementById("business-mobile-menu") as HTMLElement | null;

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

    const onScroll = () => {
      nav?.classList.toggle("is-compact", window.scrollY > 16);
    };

    openBtn?.addEventListener("click", openMobile);
    closeBtn?.addEventListener("click", closeMobile);
    overlay?.addEventListener("click", closeMobile);
    menu?.querySelectorAll("a, button").forEach((el) => {
      if ((el as HTMLElement).id === "business-nav-close") return;
      el.addEventListener("click", closeMobile);
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const page = document.querySelector<HTMLElement>(".business-page");
    const field = document.querySelector<HTMLElement>(".business-monogram-field");
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
      particle.className = "business-monogram-particle";
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
    const sparkles = Array.from({ length: sparkleCount }, (_, index) => {
      const sparkle = document.createElement("span");
      sparkle.className = "business-sparkle";
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
      openBtn?.removeEventListener("click", openMobile);
      closeBtn?.removeEventListener("click", closeMobile);
      overlay?.removeEventListener("click", closeMobile);
      window.removeEventListener("scroll", onScroll);
      document.body.style.overflow = "";
      if (rafId) window.cancelAnimationFrame(rafId);
      page.removeEventListener("pointermove", repel);
      page.removeEventListener("pointerleave", reset);
      particles.forEach((particle) => particle.remove());
      sparkles.forEach((sparkle) => sparkle.remove());
    };
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requirementText =
      draft.requirement === "other"
        ? `Other - ${draft.requirementOther.trim() || "Not specified"}`
        : (requirementLabels[draft.requirement] ?? draft.requirement);
    const timelineText = timelineLabels[draft.startTimeline] ?? draft.startTimeline;
    const notesText = draft.notes.trim() || "None";
    const phoneText = `${draft.countryCode} ${draft.phone}`.trim();
    const message = [
      "*New Business Callback Request*",
      "",
      `Company: ${draft.company}`,
      `Contact Person: ${draft.name}`,
      `Email: ${draft.email}`,
      `Phone: ${phoneText}`,
      `Requirement Type: ${requirementText}`,
      `Service Start Timeline: ${timelineText}`,
      `Notes: ${notesText}`,
    ].join("\n");

    window.location.href = whatsappSendUrl(message);
    (window as any).VelvetAnalytics?.track("lead_submit", { source: "business_page" });
  };

  const phonePattern = draft.countryCode === "+91" ? "^[6-9][0-9]{9}$" : "^[0-9]{7,15}$";
  const phoneTitle =
    draft.countryCode === "+91"
      ? "Enter a valid 10-digit Indian mobile number."
      : "Enter a valid phone number (7 to 15 digits).";

  return (
    <form className="business-form" onSubmit={onSubmit}>
      <label>
        <span>Company name</span>
        <input
          name="company"
          required
          value={draft.company}
          onChange={(event) => setDraft((prev) => ({ ...prev, company: event.target.value }))}
        />
      </label>
      <label>
        <span>Contact person</span>
        <input
          name="name"
          required
          value={draft.name}
          onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
        />
      </label>
      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          required
          placeholder="name@company.com"
          autoComplete="email"
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          title="Enter a valid email address."
          value={draft.email}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              email: event.target.value.replace(/\s+/g, ""),
            }))
          }
        />
      </label>
      <label className="business-phone-group">
        <span>Phone</span>
        <div className="business-phone-row">
          <select
            name="countryCode"
            aria-label="Country code"
            value={draft.countryCode}
            onChange={(event) => setDraft((prev) => ({ ...prev, countryCode: event.target.value }))}
          >
            {COUNTRY_DIAL_CODES.map((option) => (
              <option key={`${option.country}-${option.dialCode}`} value={option.dialCode}>
                {option.country} ({option.dialCode})
              </option>
            ))}
          </select>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="10-digit mobile"
            autoComplete="tel-national"
            pattern={phonePattern}
            title={phoneTitle}
            maxLength={draft.countryCode === "+91" ? 10 : 15}
            required
            value={draft.phone}
            onChange={(event) => {
              const digitsOnly = event.target.value.replace(/\D+/g, "");
              const maxLength = draft.countryCode === "+91" ? 10 : 15;
              setDraft((prev) => ({ ...prev, phone: digitsOnly.slice(0, maxLength) }));
            }}
          />
        </div>
      </label>
      <label>
        <span>Requirement type</span>
        <select
          name="requirement"
          value={draft.requirement}
          onChange={(event) => setDraft((prev) => ({ ...prev, requirement: event.target.value }))}
        >
          <option value="corporate-account">Corporate account setup</option>
          <option value="leadership-mobility">Leadership mobility</option>
          <option value="employee-transport">Employee airport/city transfers</option>
          <option value="guest-vip-rides">Guest and VIP rides</option>
          <option value="event-logistics">Event mobility logistics</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        <span>Service start timeline</span>
        <select
          name="startTimeline"
          value={draft.startTimeline}
          onChange={(event) => setDraft((prev) => ({ ...prev, startTimeline: event.target.value }))}
        >
          <option value="immediate">Immediate (within 48 hours)</option>
          <option value="within-2-weeks">Within 2 weeks</option>
          <option value="this-month">Within this month</option>
          <option value="planning">Planning for next quarter</option>
        </select>
      </label>
      {draft.requirement === "other" ? (
        <label className="business-form-full">
          <span>Tell us your requirement</span>
          <input
            name="requirementOther"
            placeholder="Write your specific mobility requirement"
            value={draft.requirementOther}
            onChange={(event) => setDraft((prev) => ({ ...prev, requirementOther: event.target.value }))}
            required
          />
        </label>
      ) : null}
      <label className="business-form-full">
        <span>Notes</span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Pickup patterns, preferred tiers, billing requirements..."
          value={draft.notes}
          onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
        />
      </label>
      <div className="business-form-full">
        <button type="submit" className="business-concierge-btn">Request a callback</button>
      </div>
    </form>
  );
}
