import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Velvet Experience",
    short_name: "Velvet",
    description:
      "Concierge chauffeur service for Gurugram and Delhi NCR with airport, point-to-point, and hourly rides.",
    start_url: "/",
    display: "standalone",
    background_color: "#09080d",
    theme_color: "#09080d",
    icons: [
      {
        src: "/assets/monogram-gold.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
