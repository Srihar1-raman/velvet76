import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import ThemeInitClient from "@/components/ThemeInitClient";
import AnalyticsProvider from "@/components/AnalyticsProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://velvet-nextjs.vercel.app"),
  title: "Velvet Experience - Your Time Deserves Better",
  description:
    "Velvet Experience is a concierge chauffeur service for Gurugram and Delhi NCR, with luxury point-to-point, airport, and hourly rides.",
  applicationName: "Velvet Experience",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/assets/monogram-gold.svg", type: "image/svg+xml" }],
    shortcut: ["/assets/monogram-gold.svg"],
    apple: [{ url: "/assets/monogram-gold.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Velvet Experience - Your Time Deserves Better",
    description:
      "Concierge chauffeur service across Gurugram and Delhi NCR for airport, point-to-point, and hourly rides.",
    url: "https://velvet-nextjs.vercel.app",
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
  other: {
    "theme-color": "#09080d",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09080d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Outfit:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400;500&family=Montserrat:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeInitClient />
        <AnalyticsProvider />
        {/* Shared scripts (source loads these in body end) */}
        <Script
          id="maps-runtime-env"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__VELVET_GOOGLE_MAPS_API_KEY = ${JSON.stringify(mapsApiKey)};`,
          }}
        />
        <Script src="/src/maps-env.js" strategy="beforeInteractive" />
        <Script src="/src/maps-config.js" strategy="beforeInteractive" />
        <Script src="/src/maps-estimates.js" strategy="beforeInteractive" />
        <Script src="/src/store.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}