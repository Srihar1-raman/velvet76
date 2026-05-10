export const services = [
  {
    name: "Point to Point",
    scope: "Gurugram, Central Delhi, South Delhi",
    line: "A precise private ride between the places that matter.",
    image: "/assets/new-night-front.png",
  },
  {
    name: "Airport",
    scope: "IGI T1, T2, T3, Private Terminal",
    line: "Pickup and drop-off planned around terminal movement.",
    image: "/assets/fleet-line.jpg",
  },
  {
    name: "Hourly Rental",
    scope: "Gurugram and Delhi NCR",
    line: "Keep the car and chauffeur with you across the day.",
    image: "/assets/steering.jpg",
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
        image: "/assets/vault%20tier%20bmw%20ix1%20bg%20removed.png",
        gallery: "/assets/vault%20tierbmw%20ix1.png",
      },
      {
        model: "Audi Q3",
        image: "/assets/audi%20q3%20vault%20tier.png",
        gallery: "/assets/audi%20q3%20vault%20tier.png",
      },
    ],
    capacity: "2-3 passengers",
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
        image: "/assets/premier%20tier%20c%20class%20mercedes%20bg%20removed.png",
        gallery: "/assets/premier%20tier%20c%20class%20mercedes.png",
      },
      {
        model: "BMW 330Li",
        image: "/assets/bmw%20330%20li%20premier%20tier.png",
        gallery: "/assets/bmw%20330%20li%20premier%20tier.png",
      },
    ],
    capacity: "2-3 passengers",
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
        image: "/assets/elite%20tier%20bmw%205%20series%20bg%20removed.png.png",
        gallery: "/assets/elite%20tier%20bmw%205%20series.png",
      },
      {
        model: "Mercedes E-Class",
        image: "/assets/mercedes%20e%20class%20elite.png",
        gallery: "/assets/mercedes%20e%20class%20elite.png",
      },
    ],
    capacity: "3 passengers",
    luggage: "3 medium or 2 large",
    points: ["Meet and greet included", "Flight tracking", "Priority support"],
  },
];

export const detailRows = [
  "Super-trained chauffeurs",
  "Meet and greet available",
  "Flight tracking for airport rides",
  "Priority support",
  "Wi-Fi onboard where available",
  "On-time guarantee",
];