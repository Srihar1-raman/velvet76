import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Promise from "@/components/sections/Promise";
import Services from "@/components/sections/Services";
import Fleet from "@/components/sections/Fleet";
import HumanLayer from "@/components/sections/HumanLayer";
import Footer from "@/components/sections/Footer";
import Animations from "@/components/Animations";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export default function HomePage() {
  return (
    <>
      {/* Cursor glow element */}
      <div className="cursor-glow" aria-hidden="true" />
      <Header variant="home" />
      <main>
        <Hero mapsApiKey={MAPS_API_KEY} />
        <Promise />
        <Services />
        <Fleet />
        <HumanLayer />
      </main>
      <Footer />
      <Animations />
    </>
  );
}
