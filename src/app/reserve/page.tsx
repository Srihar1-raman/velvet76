import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import ReserveClient from "./ReserveClient";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export const metadata: Metadata = {
  title: "Reserve a Ride | Velvet Experience",
  description:
    "Reserve a private chauffeur ride across Gurugram and Delhi NCR. Airport transfers, point-to-point, and hourly rides available.",
};

export default function ReservePage() {
  return (
    <>
      <Header variant="home" />
      <ReserveClient mapsApiKey={MAPS_API_KEY} />
    </>
  );
}
