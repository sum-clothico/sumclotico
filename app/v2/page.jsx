"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import SvgSymbols from "@/components/SvgSymbols";
import Navbar from "@/components/Navbar";
import ArchedHero from "@/components/ArchedHero";
import HomeSections from "@/components/HomeSections";
import Footer from "@/components/Footer";
import CursorBubble from "@/components/CursorBubble";
import SmoothScroll from "@/components/SmoothScroll";

export default function HomeV2() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <SvgSymbols />
      <SmoothScroll />
      <CursorBubble />
      <header className="main-header">
        <Navbar />
        {/* 01. HERO — Kept with rounded rectangular video and aligned text */}
        <ArchedHero />
      </header>
      <main>
        {/* 02. THE FEELING through 10. FINAL SHOPPING MOMENT */}
        <HomeSections />
      </main>
      <footer className="main-footer">
        {/* 11. FOOTER */}
        <Footer />
      </footer>
    </>
  );
}
