"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../app/styles/loader.css";

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const proxy = { angle: 0 };

    const tl = gsap.timeline();

    // Cartwheel clip reveal — conic sweep 0→360
    tl.to(proxy, {
      angle: 360,
      duration: 1,
      ease: "power2.inOut",
      onUpdate() {
        const a = proxy.angle;
        const mask = `conic-gradient(black 0deg, black ${a}deg, transparent ${a}deg)`;
        logoRef.current.style.webkitMaskImage = mask;
        logoRef.current.style.maskImage = mask;
      },
    })
    // Hold
    .to({}, { duration: 0.5 })
    // Scroll reset + slide loader up
    .call(() => window.scrollTo(0, 0))
    .to(loaderRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      onComplete: () => onComplete?.(),
    });
  }, []);

  return (
    <div ref={loaderRef} className="loader">
      <div className="loader__center">
        <div ref={logoRef} className="loader__logo">
          <img src="/assets/logo.svg" alt="Sum Clothico" />
        </div>
      </div>
    </div>
  );
}
