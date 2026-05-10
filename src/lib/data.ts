export const services = [
  {
    name: "Point to Point",
    scope: "Gurugram, Central Delhi, South Delhi",
    line: "A precise private ride between the places that matter.",
    image: "/assets/new-night-front.png",
    mode: "point-to-point",
  },
  {
    name: "Airport",
    scope: "IGI T1, T2, T3, Private Terminal",
    line: "Pickup and drop-off planned around terminal movement.",
    image: "/assets/fleet-line.jpg",
    mode: "airport",
  },
  {
    name: "Hourly Rental",
    scope: "Gurugram and Delhi NCR",
    line: "Keep the car and chauffeur with you across the day.",
    image: "/assets/steering.jpg",
    mode: "hourly",
  },
];

export const fleetTiers = [
  {
    key: "vault",
    name: "Velvet Vault",
    eyebrow: "SUV Comfort",
    accent: "#4a7c6b",
    accentGlow: "rgba(74, 124, 107, 0.28)",
    cars: [
      {
        model: "BMW iX1",
        image: "/assets/vault tier bmw ix1 bg removed.png",
        gallery: "/assets/vault tierbmw ix1.png",
      },
      {
        model: "Audi Q3",
        image: "/assets/audi q3 vault tier.png",
        gallery: "/assets/audi q3 vault tier.png",
      },
    ],
    capacity: "Up to 3 passengers",
    luggage: "3 medium or 2 large",
    points: ["Extra luggage space", "All-terrain ready", "Family-friendly"],
  },
  {
    key: "premier",
    name: "Velvet Premier",
    eyebrow: "Business Class",
    accent: "#b8922e",
    accentGlow: "rgba(184, 146, 46, 0.28)",
    cars: [
      {
        model: "Mercedes C-Class",
        image: "/assets/premier tier c class mercedes bg removed.png",
        gallery: "/assets/premier tier c class mercedes.png",
      },
      {
        model: "BMW 330Li",
        image: "/assets/bmw 330 li premier tier.png",
        gallery: "/assets/bmw 330 li premier tier.png",
      },
    ],
    capacity: "Up to 3 passengers",
    luggage: "3 medium or 2 large",
    points: ["Business-class comfort", "On-time guarantee", "Wi-Fi onboard"],
  },
  {
    key: "elite",
    name: "Velvet Elite",
    eyebrow: "The Flagship",
    accent: "#d4b06a",
    accentGlow: "rgba(212, 176, 106, 0.32)",
    cars: [
      {
        model: "BMW 5 Series",
        image: "/assets/elite tier bmw 5 series bg removed.png.png",
        gallery: "/assets/elite tier bmw 5 series.png",
      },
      {
        model: "Mercedes E-Class",
        image: "/assets/mercedes e class elite.png",
        gallery: "/assets/mercedes e class elite.png",
      },
    ],
    capacity: "Up to 3 passengers",
    luggage: "3 medium or 2 large",
    points: [
      "Meet and greet included",
      "Flight tracking",
      "Priority support",
    ],
  },
];

export const HOURLY_PACKAGES = [
  {
    key: "4h40km",
    label: "4 hrs / 40 km",
    hours: 4,
    km: 40,
    prices: { vault: 5500, premier: 7000, elite: 9000 },
  },
  {
    key: "6h60km",
    label: "6 hrs / 60 km",
    hours: 6,
    km: 60,
    prices: { vault: 8000, premier: 10500, elite: 13500 },
  },
  {
    key: "8h80km",
    label: "8 hrs / 80 km",
    hours: 8,
    km: 80,
    prices: { vault: 10500, premier: 14000, elite: 18000 },
  },
  {
    key: "10h100km",
    label: "10 hrs / 100 km",
    hours: 10,
    km: 100,
    prices: { vault: 12500, premier: 17500, elite: 22500 },
  },
];

export const P2P_RATES: Record<string, number> = {
  vault: 100,
  premier: 125,
  elite: 175,
};

export const MARKUP_FACTOR = 1.35;

export function getPointToPointPrice(tier: string, km: number): number {
  const rate = P2P_RATES[tier] || 100;
  const minKm = Math.max(km || 0, 12);
  return Math.ceil((minKm * rate) / 100) * 100;
}

export function getHourlyPackagePrice(
  tier: string,
  packageKey: string
): number {
  const pkg = HOURLY_PACKAGES.find((p) => p.key === packageKey);
  if (!pkg) return 0;
  return pkg.prices[tier as keyof typeof pkg.prices] || 0;
}

export function getStrikethroughPrice(actualPrice: number): number {
  return Math.ceil((actualPrice * MARKUP_FACTOR) / 100) * 100;
}

export function getParkingCharge(terminalValue: string): number {
  if (!terminalValue) return 0;
  if (terminalValue.includes("T3")) return 270;
  if (
    terminalValue.includes("T1") ||
    terminalValue.includes("T2") ||
    terminalValue.includes("Private Jet")
  )
    return 200;
  return 0;
}

export const IGI_TERMINALS = [
  { label: "T1", value: "Terminal 1 (T1), IGI Airport, New Delhi" },
  { label: "T2", value: "Terminal 2 (T2), IGI Airport, New Delhi" },
  { label: "T3", value: "Terminal 3 (T3), IGI Airport, New Delhi" },
  {
    label: "Private Jet Terminal",
    value: "Private Jet Terminal (T4), IGI Airport, New Delhi",
  },
];

export const chauffeurFrames = [
  {
    src: "/assets/chauffeur-trunk.jpg",
    alt: "Velvet chauffeur preparing a car",
    caption: "Arrival",
    tag: "Super-trained chauffeurs",
    isVideo: false,
  },
  {
    src: "/assets/chauffeur-door.jpg",
    alt: "Velvet chauffeur holding an umbrella by an open rear door",
    caption: "Door opened",
    tag: "Meet and greet available",
    isVideo: false,
  },
  {
    src: "/assets/interior-seat.jpg",
    alt: "Luxury rear seat interior with Velvet detail",
    caption: "Seated comfort",
    tag: "Wi-Fi onboard where available",
    isVideo: false,
  },
  {
    src: "/assets/cup-handoff.jpg",
    alt: "Velvet branded drink handed to passenger",
    caption: "Refreshments",
    tag: "On-time guarantee",
    isVideo: false,
  },
  {
    src: "/assets/interior-reel.mp4",
    alt: "Smooth departure",
    caption: "Smooth departure",
    tag: "Flight tracking for airport rides",
    isVideo: true,
  },
  {
    src: "/assets/emblem-close.jpg",
    alt: "Velvet emblem close-up detail",
    caption: "Quiet proof",
    tag: "Priority support",
    isVideo: false,
  },
];
