import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://velvetexperience.in"),
  title: "Velvet Experience - Your Time Deserves Better",
  description:
    "Velvet Experience is a concierge chauffeur service for Gurugram and Delhi NCR, with luxury point-to-point, airport, and hourly rides.",
  applicationName: "Velvet Experience",
  manifest: "/manifest.json",
  openGraph: {
    title: "Velvet Experience - Your Time Deserves Better",
    description:
      "Concierge chauffeur service across Gurugram and Delhi NCR for airport, point-to-point, and hourly rides.",
    url: "https://velvetexperience.in",
    siteName: "Velvet Experience",
    type: "website",
    images: [{ url: "/assets/new-night-front.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velvet Experience - Your Time Deserves Better",
    description:
      "Concierge chauffeur service across Gurugram and Delhi NCR for airport, point-to-point, and hourly rides.",
    images: ["/assets/new-night-front.png"],
  },
  icons: {
    icon: [{ url: "/assets/monogram-gold.svg", type: "image/svg+xml" }],
    shortcut: ["/assets/monogram-gold.svg"],
    apple: [{ url: "/assets/monogram-gold.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08070b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* Google Fonts — loaded at runtime by the browser, not at build time */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Outfit:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
