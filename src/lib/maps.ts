export const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#09080d" }] },
  { elementType: "labels", stylers: [{ visibility: "off" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1525" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#14101e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1525" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1e1830" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#251e38" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0d0b16" }],
  },
];

export const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };
export const DEFAULT_ZOOM = 10.2;

export const DELHI_NCR_BOUNDS = {
  north: 29.1,
  south: 28.23,
  west: 76.78,
  east: 77.6,
} as const;

export const MAPS_LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];
