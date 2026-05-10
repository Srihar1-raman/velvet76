const STORAGE_KEY = 'velvet-booking-v1';

const VEHICLE_TIERS = [
  { key: 'vault', tier: 'Velvet Vault', subtitle: 'SUV Comfort', models: 'BMW iX1 / Audi Q3', capacity: 'Up to 3 passengers', luggage: '3 medium or 2 large' },
  { key: 'premier', tier: 'Velvet Premier', subtitle: 'Business Class', models: 'Mercedes C-Class / BMW 330Li', capacity: 'Up to 3 passengers', luggage: '3 medium or 2 large' },
  { key: 'elite', tier: 'Velvet Elite', subtitle: 'The Flagship', models: 'Mercedes E-Class / BMW 5 Series', capacity: 'Up to 3 passengers', luggage: '3 medium or 2 large' },
];

const IGI_TERMINALS = [
  { label: 'T1', value: 'Terminal 1 (T1), IGI Airport, New Delhi' },
  { label: 'T2', value: 'Terminal 2 (T2), IGI Airport, New Delhi' },
  { label: 'T3', value: 'Terminal 3 (T3), IGI Airport, New Delhi' },
  { label: 'Private Jet', value: 'Private Jet Terminal, IGI Airport, New Delhi' },
];

const TIER_CONSTRAINTS = {
  vault: { maxPassengers: 3, maxLuggage: 3 },
  premier: { maxPassengers: 2, maxLuggage: 2 },
  elite: { maxPassengers: 2, maxLuggage: 2 },
};

const POINT_TO_POINT_RATES = { vault: 100, premier: 125, elite: 175 };
const HOURLY_PACKAGES = [
  { key: '4h40km', label: '4 hrs / 40 km', hours: 4, km: 40, prices: { vault: 5000, premier: 6250, elite: 8500 } },
  { key: '6h60km', label: '6 hrs / 60 km', hours: 6, km: 60, prices: { vault: 7500, premier: 9000, elite: 12000 } },
  { key: '8h80km', label: '8 hrs / 80 km', hours: 8, km: 80, prices: { vault: 9000, premier: 12000, elite: 16000 } },
];
const MARKUP_FACTOR = 1.35;

function getPointToPointPrice(tier, km) {
  const rate = POINT_TO_POINT_RATES[tier];
  const minKm = Math.max(km || 0, 12);
  return Math.ceil((minKm * rate) / 100) * 100;
}

function getHourlyPackagePrice(tier, packageKey) {
  const pkg = HOURLY_PACKAGES.find(function(p) { return p.key === packageKey; });
  return pkg ? pkg.prices[tier] : 0;
}

function getStrikethroughPrice(actualPrice) {
  return Math.ceil(actualPrice * MARKUP_FACTOR / 100) * 100;
}

function formatPrice(price) {
  return '\u20B9' + price.toLocaleString('en-IN');
}

function getParkingCharge(terminalValue) {
  if (!terminalValue) return 0;
  if (terminalValue.includes('T3')) return 270;
  if (terminalValue.includes('T1') || terminalValue.includes('T2') || terminalValue.includes('Hindon') || terminalValue.includes('Jewar')) return 200;
  return 0;
}

var _state = null;
function _load() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    _state = stored ? JSON.parse(stored) : null;
  } catch (e) { _state = null; }
  if (!_state || typeof _state !== 'object') _state = {};
  return _state;
}

function _save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_state)); } catch (e) {}
}

var VelvetStore = {
  serviceType: '',
  airportSubType: '',
  pickupLocation: '',
  dropLocation: '',
  travelDate: '',
  travelTime: '',
  flightNumber: '',
  hourlyPackage: '',
  passengerCount: 1,
  luggageCount: 0,
  bookingFor: 'me',
  guestPhone: '',
  guestName: '',
  phone: '',
  userName: '',
  email: '',
  otpVerified: false,
  selectedTier: '',
  distanceKm: 0,
  distanceText: '',
  durationMinutes: 0,
  durationText: '',
  estimatedDropTime: '',
  bookingId: '',

  load: function() {
    var s = _load();
    for (var k in this) {
      if (typeof this[k] !== 'function' && k in s) {
        this[k] = s[k];
      }
    }
    return this;
  },

  save: function() {
    var data = {};
    for (var k in this) {
      if (typeof this[k] !== 'function') {
        data[k] = this[k];
      }
    }
    _state = data;
    _save();
    return this;
  },

  reset: function() {
    var defaults = {
      serviceType: '', airportSubType: '', pickupLocation: '', dropLocation: '',
      travelDate: '', travelTime: '', flightNumber: '', hourlyPackage: '',
      passengerCount: 1, luggageCount: 0, bookingFor: 'me', guestPhone: '',
      guestName: '', phone: '', userName: '', email: '', otpVerified: false,
      selectedTier: '', distanceKm: 0, distanceText: '', durationMinutes: 0,
      durationText: '', estimatedDropTime: '', bookingId: ''
    };
    for (var k in defaults) { this[k] = defaults[k]; }
    _state = defaults;
    _save();
    return this;
  }
};

VelvetStore.load();

window.VelvetStore = VelvetStore;
window.VEHICLE_TIERS = VEHICLE_TIERS;
window.IGI_TERMINALS = IGI_TERMINALS;
window.TIER_CONSTRAINTS = TIER_CONSTRAINTS;
window.HOURLY_PACKAGES = HOURLY_PACKAGES;
window.getPointToPointPrice = getPointToPointPrice;
window.getHourlyPackagePrice = getHourlyPackagePrice;
window.getStrikethroughPrice = getStrikethroughPrice;
window.formatPrice = formatPrice;
window.getParkingCharge = getParkingCharge;
