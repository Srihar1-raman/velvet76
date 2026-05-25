import type { Metadata } from "next";
import { Suspense } from "react";
import BookPageClient from "./BookPageClient";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export const metadata: Metadata = {
  title: "Book Your Ride | Velvet Experience",
  description:
    "Complete your Velvet chauffeur booking - select your tier and confirm your private ride.",
};

export default function BookPage() {
  return (
    <Suspense>
      <BookPageClient mapsApiKey={MAPS_API_KEY} />
    </Suspense>
  );
}
