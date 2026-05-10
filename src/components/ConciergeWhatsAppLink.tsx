"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { whatsappSendUrl } from "@/lib/whatsapp";

function buildConciergeMessage(): string {
  const ta = document.getElementById("closing-concierge-query") as HTMLTextAreaElement | null;
  const raw = ta?.value?.trim() ?? "";
  const footer = "\n\n— Sent from velvetexperience.com";
  if (raw) {
    return "Concierge request — Velvet Experience\n\n" + raw + footer;
  }
  return (
    "Concierge request — Velvet Experience\n\n" +
    "I'd like to speak with the Velvet Experience concierge. Please assist me with my request." +
    footer
  );
}

export type ConciergeWhatsAppLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href">;

export function ConciergeWhatsAppLink({ onClick, ...rest }: ConciergeWhatsAppLinkProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onClick?.(e);
    window.open(whatsappSendUrl(buildConciergeMessage()), "_blank", "noopener,noreferrer");
  }

  return <a href="#" {...rest} onClick={handleClick} />;
}
