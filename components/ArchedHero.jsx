"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ArchedHero() {
  const containerRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Entrance Animation
    gsap.fromTo(
      containerRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: "power3.out" },
    );

    gsap.fromTo(
      taglineRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, delay: 1, ease: "power3.out" },
    );

    gsap.fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, delay: 1.4, ease: "power3.out" },
    );
  }, []);

  return (
    <section className="arched-hero">
      {/* Texture */}
      <div className="arched-hero__noise" />

      {/* Right-aligned Background Image */}
      <img
        src="/assets/herobgright.png"
        alt=""
        className="arched-hero__bg-right"
      />

      {/* Brand Name — Left Side */}
      <div className="arched-hero__brand-wrap">
        <div className="arched-hero__brand-left">
          {/* सम् — with chandrabindu/anusvara to match logo */}
          <span className="arched-hero__hindi">सम्</span>
          <span className="arched-hero__latin">CLOTHICO</span>
        </div>
        <div ref={taglineRef} className="arched-hero__tagline">
          Made by hands. Worn with ease.
        </div>
        <div ref={ctaRef} className="arched-hero__cta-row">
          <a href="#story" className="arched-hero__cta arched-hero__cta--secondary">
            Explore the Story
          </a>
        </div>
      </div>

      {/* Arch — replace /assets/videos/vid1.mp4 with charkha/weaving footage */}
      <div ref={containerRef} className="arched-hero__portal">
        <div className="arched-hero__mask">
          <video
            className="arched-hero__video"
            src="/assets/videos/vid1.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        {/* Border SVG */}
        <div className="arched-hero__border">
          <svg viewBox="0 0 1242.74 2284.6" className="arched-hero__frame-svg">
            <path
              d="M1242.74,549.68V2284.6H0V549.68C0,387.3,156.23,407.79,156.23,407.79c0-140.45,122.43-111.17,122.43-111.17,0-23.4,9.68-120,132.1-120,131.86,0,208.61-168,210.61-176.65,2,8.68,78.75,176.65,210.61,176.65,122.42,0,132.1,96.57,132.1,120,0,0,122.43-29.28,122.43,111.17C1086.51,407.79,1242.74,387.3,1242.74,549.68Z"
              fill="none"
              stroke="white"
              strokeWidth="4"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>

      {/* SVG ClipPath Definition */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="arch-mask-id" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.00080467, 0.00043771)"
              d="M1242.74,549.68V2284.6H0V549.68C0,387.3,156.23,407.79,156.23,407.79c0-140.45,122.43-111.17,122.43-111.17,0-23.4,9.68-120,132.1-120,131.86,0,208.61-168,210.61-176.65,2,8.68,78.75,176.65,210.61,176.65,122.42,0,132.1,96.57,132.1,120,0,0,122.43-29.28,122.43,111.17C1086.51,407.79,1242.74,387.3,1242.74,549.68Z"
            />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
}
