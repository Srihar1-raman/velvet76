window.VELVET_MAPS_CONFIG = window.VELVET_MAPS_CONFIG || {
  // Add your Google Maps JavaScript API key here.
  // Example: "AIzaSy...."
  apiKey: "",
  region: "IN",
  language: "en",
  defaultCenter: { lat: 28.6139, lng: 77.2090 }, // Central Delhi
  defaultZoom: 10.2,
  delhiNcrBounds: {
    north: 29.10,
    south: 28.23,
    west: 76.78,
    east: 77.60
  },
  hotspots: [
    { title: "IGI Airport T3", lat: 28.5562, lng: 77.1000 },
    { title: "IGI Airport T2", lat: 28.5632, lng: 77.1194 },
    { title: "IGI Airport T1", lat: 28.5845, lng: 77.0909 },
    { title: "Private Jet Terminal", lat: 28.5706, lng: 77.0942 },
    { title: "Aerocity", lat: 28.5485, lng: 77.1222 },
    { title: "Cyber Hub Gurugram", lat: 28.4959, lng: 77.0892 },
    { title: "DLF Phase 5", lat: 28.4740, lng: 77.0930 },
    { title: "Udyog Vihar", lat: 28.4977, lng: 77.0825 },
    { title: "Connaught Place", lat: 28.6315, lng: 77.2167 },
    { title: "Chanakyapuri Diplomatic Enclave", lat: 28.5921, lng: 77.1886 },
    { title: "Noida Sector 18", lat: 28.5708, lng: 77.3260 },
    { title: "Greater Noida Pari Chowk", lat: 28.4635, lng: 77.5087 }
  ],
  mapStyle: [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }, { visibility: "off" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "administrative.neighborhood", stylers: [{ visibility: "off" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
  ]
};

if (!window.VELVET_MAPS_CONFIG.apiKey && window.__VELVET_GOOGLE_MAPS_API_KEY) {
  window.VELVET_MAPS_CONFIG.apiKey = window.__VELVET_GOOGLE_MAPS_API_KEY;
}
