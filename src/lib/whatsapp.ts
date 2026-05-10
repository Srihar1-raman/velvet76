export const VELVET_WHATSAPP_PHONE = "919217595615";

export function whatsappSendUrl(text: string): string {
  return `https://wa.me/${VELVET_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsappMessage(params: {
  serviceType: string;
  airportSubType?: string;
  pickupName?: string;
  pickupAddress?: string;
  dropName?: string;
  dropAddress?: string;
  travelDate: string;
  travelTime: string;
  selectedTier: string;
  distanceText?: string;
  durationText?: string;
  hourlyPackage?: string;
  flightNumber?: string;
  userName?: string;
  phone?: string;
}): string {
  const {
    serviceType,
    airportSubType,
    pickupName,
    pickupAddress,
    dropName,
    dropAddress,
    travelDate,
    travelTime,
    selectedTier,
    distanceText,
    durationText,
    hourlyPackage,
    flightNumber,
    userName,
    phone,
  } = params;

  const pickup = pickupName || pickupAddress || "—";
  const drop = dropName || dropAddress || "—";

  const tierLabels: Record<string, string> = {
    elite: "Velvet Elite (The Flagship)",
    premier: "Velvet Premier (Business Class)",
    vault: "Velvet Vault (SUV Comfort)",
  };

  const serviceLabels: Record<string, string> = {
    "point-to-point": "Point to Point",
    airport: "Airport Transfer",
    hourly: "Hourly Rental",
  };

  let msg = `Hi Velvet, I'd like to book a ride.\n\n`;
  msg += `*Service:* ${serviceLabels[serviceType] || serviceType}\n`;
  if (serviceType === "airport" && airportSubType) {
    msg += `*Transfer Type:* ${airportSubType === "arrival" ? "Arrival (Airport to Destination)" : "Departure (Destination to Airport)"}\n`;
  }
  msg += `*Pickup:* ${pickup}\n`;
  msg += `*Drop-off:* ${drop}\n`;
  msg += `*Date:* ${travelDate}\n`;
  msg += `*Time:* ${travelTime}\n`;
  if (flightNumber) msg += `*Flight:* ${flightNumber}\n`;
  if (hourlyPackage) msg += `*Package:* ${hourlyPackage.replace("h", " hrs / ").replace("km", " km")}\n`;
  msg += `*Tier:* ${tierLabels[selectedTier] || selectedTier}\n`;
  if (distanceText) msg += `*Estimated Distance:* ${distanceText}\n`;
  if (durationText) msg += `*Estimated Duration:* ${durationText}\n`;
  if (userName) msg += `*Name:* ${userName}\n`;
  if (phone) msg += `*Phone:* ${phone}\n`;

  return msg;
}
