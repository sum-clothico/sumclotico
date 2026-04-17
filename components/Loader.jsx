"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../app/styles/loader.css";

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const panelTopRef = useRef(null);
  const panelBotRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.8 });
    tl.to([panelTopRef.current, panelBotRef.current], {
      yPercent: (i) => (i === 0 ? -100 : 100),
      duration: 1,
      ease: "power4.inOut",
    }).to(loaderRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => onComplete?.(),
    });
  }, []);

  return (
    <div ref={loaderRef} className="loader">
      <div ref={panelTopRef} className="loader__panel loader__panel--top">
        <div className="loader__logo loader__logo--top">
          <img src="/assets/logo.svg" alt="Sum Clothico" />
        </div>
      </div>
      <div ref={panelBotRef} className="loader__panel loader__panel--bot" />
    </div>
  );
}
