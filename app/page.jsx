"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import SvgSymbols from "@/components/SvgSymbols";
import Navbar from "@/components/Navbar";
import ArchedHero from "@/components/ArchedHero";
import HorizontalWords from "@/components/HorizontalWords";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import StorySection from "@/components/StorySection";
import SplitSection from "@/components/SplitSection";
import TravelingImage from "@/components/TravelingImage";
import AboutSection from "@/components/AboutSection";
import MotionCards from "@/components/MotionCards";
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
      <FeaturedProductsSection />
      <HorizontalWords />
      <StorySection />
      <SplitSection />
      <TravelingImage />
      {/* Traditional Indian Border Pattern Divider */}
      <div
        className="section-pattern-divider"
        style={{
          width: "100%",
          height: "28px",
          backgroundColor: "var(--bg-color, #EDE8DC)",
          backgroundImage: 'url("/assets/footerpattern-accent.png")',
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center",
          backgroundSize: "auto 26px",
          opacity: 0.85,
          position: "relative",
          zIndex: 10,
        }}
        aria-hidden="true"
      />
      <main>
        <div className="motion-cards-wrapper">
          <MotionCards />
        </div>
        <AboutSection />
        <JournalPreviewSection />
      </main>
    </>
  );
}
