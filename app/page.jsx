"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import SvgSymbols from "@/components/SvgSymbols";
import Navbar from "@/components/Navbar";
import ArchedHero from "@/components/ArchedHero";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import WhySumHomeSection from "@/components/WhySumHomeSection";
import FabricHomeSection from "@/components/FabricHomeSection";
import PeopleHomeSection from "@/components/PeopleHomeSection";
import JournalPreviewSection from "@/components/JournalPreviewSection";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <SvgSymbols />
      <SmoothScroll />
      <header
        className="main-header"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.35s ease",
          pointerEvents: loaded ? "auto" : "none",
        }}
      >
        <Navbar />
        <ArchedHero />
      </header>
      {/* PDF flow: Hero → Collection → Why Sum (+IG) → Fabric → People → Journal → Footer */}
      <main>
        <FeaturedProductsSection />
        <WhySumHomeSection />
        <FabricHomeSection />
        <PeopleHomeSection />
        <JournalPreviewSection />
      </main>
    </>
  );
}
