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
import Footer from "@/components/Footer";
import CursorBubble from "@/components/CursorBubble";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <SvgSymbols />
      <SmoothScroll />
      <CursorBubble />
      <header className="main-header">
        <Navbar />
        <ArchedHero />
      </header>
      <FeaturedProductsSection />
      <HorizontalWords />
      <StorySection />
      <SplitSection />
      <TravelingImage />
      <img
        src="/assets/footer-dip.png"
        alt=""
        className="motion-card__dip-img"
      />
      <main>
        <div className="content-section motion-cards-wrapper">
          <MotionCards />
        </div>
        <AboutSection />
        <JournalPreviewSection />
      </main>
      <footer className="main-footer">
        <Footer />
      </footer>
    </>
  );
}
