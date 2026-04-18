"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import SvgSymbols from "@/components/SvgSymbols";
import Navbar from "@/components/Navbar";
import ArchedHero from "@/components/ArchedHero";
import ServiceCards from "@/components/ServiceCards";
import MotionCards from "@/components/MotionCards";
import Showreel from "@/components/Showreel";
import DoubleMarquee from "@/components/DoubleMarquee";
import Footer from "@/components/Footer";
import TransitionScribble from "@/components/TransitionScribble";
import CursorBubble from "@/components/CursorBubble";
import SmoothScroll from "@/components/SmoothScroll";
import HorizontalWords from "@/components/HorizontalWords";
import StorySection from "@/components/StorySection";
import SplitSection from "@/components/SplitSection";
import TravelingImage from "@/components/TravelingImage";
import AboutSection from "@/components/AboutSection";

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
        <Showreel />
        <div className="content-section service-cards-wrapper">
          <ServiceCards />
        </div>
        <AboutSection />
      </main>
      <section className="Double-marquee">
        <DoubleMarquee />
      </section>
      <footer className="main-footer">
        <Footer />
      </footer>
      {/* <TransitionScribble /> */}
    </>
  );
}
