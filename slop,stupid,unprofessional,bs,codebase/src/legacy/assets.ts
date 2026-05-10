const ASSET_BASE = `${import.meta.env.BASE_URL}assets/`;

export const services = [
  {
    name: "Point to Point",
    scope: "Gurugram, Central Delhi, South Delhi",
    line: "A precise private ride between the places that matter.",
    image: `${ASSET_BASE}new-night-front.png`
  },
  {
    name: "Airport",
    scope: "IGI T1, T2, T3, Private Terminal",
    line: "Pickup and drop-off planned around terminal movement.",
    image: `${ASSET_BASE}fleet-line.jpg`
  },
  {
    name: "Hourly Rental",
    scope: "Gurugram and Delhi NCR",
    line: "Keep the car and chauffeur with you across the day.",
    image: `${ASSET_BASE}steering.jpg`
  }
];

export const fleet = [
  {
    model: "Audi Q3",
    image: `${ASSET_BASE}vault%20tier%20audi%20q3.png`,
    className: "Velvet Vault"
  },
  {
    model: "BMW iX1",
    image: `${ASSET_BASE}vault%20tierbmw%20ix1.png`,
    className: "Velvet Vault"
  },
  {
    model: "Mercedes C-Class",
    image: `${ASSET_BASE}premier%20tier%20c%20class%20mercedes.png`,
    className: "Velvet Premier"
  },
  {
    model: "BMW 330Li",
    image: `${ASSET_BASE}premier%20tier%20bmw%20330%20li.png`,
    className: "Velvet Premier"
  },
  {
    model: "Mercedes E-Class",
    image: `${ASSET_BASE}elite%20tier%20mercedes%20e%20class.png`,
    className: "Velvet Elite"
  },
  {
    model: "BMW 5 Series",
    image: `${ASSET_BASE}elite%20tier%20bmw%205%20series.png`,
    className: "Velvet Elite"
  }
];

export const tiers = [
  {
    name: "Velvet Vault",
    eyebrow: "SUV Comfort",
    image: `${ASSET_BASE}vault%20tier%20bmw%20ix1%20bg%20removed.png`,
    models: "BMW iX1 / Audi Q3 or similar",
    capacity: "2-3 passengers",
    luggage: "3 medium or 2 large",
    points: ["Extra luggage space", "All-terrain ready", "Family-friendly"]
  },
  {
    name: "Velvet Premier",
    eyebrow: "Business Class",
    image: `${ASSET_BASE}premier%20tier%20c%20class%20mercedes%20bg%20removed.png`,
    models: "Mercedes C-Class / BMW 330Li or similar",
    capacity: "2-3 passengers",
    luggage: "3 medium or 2 large",
    points: ["Business-class comfort", "On-time guarantee", "Wi-Fi onboard"]
  },
  {
    name: "Velvet Elite",
    eyebrow: "The Flagship",
    image: `${ASSET_BASE}elite%20tier%20bmw%205%20series%20bg%20removed.png.png`,
    models: "Mercedes E-Class / BMW 5 Series or similar",
    capacity: "3 passengers",
    luggage: "3 medium or 2 large",
    points: ["Meet and greet included", "Flight tracking", "Priority support"]
  }
];

export const detailRows = [
  "Super-trained chauffeurs",
  "Meet and greet available",
  "Flight tracking for airport rides",
  "Priority support",
  "Wi-Fi onboard where available",
  "On-time guarantee"
];
