/** E.164-style digits only, no + — for wa.me / api.whatsapp.com (+91 9217595615) */
export const VELVET_WHATSAPP_PHONE = "919217595615";

export function whatsappSendUrl(text: string): string {
  return `https://wa.me/${VELVET_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
