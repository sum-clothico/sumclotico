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
        {/* 01. HERO — Rounded Rectangular Video with Aligned Content */}
        <ArchedHero />
      </header>
      <main>
        {/* 02. The Feeling through 10. Final Shopping Moment */}
        <HomeSections />
      </main>
      <footer className="main-footer">
        {/* 11. FOOTER */}
        <Footer />
      </footer>
    </>
  );
}
