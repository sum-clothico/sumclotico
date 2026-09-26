"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ArchedHero() {
  const containerRef = useRef(null);
  const taglineRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Entrance Animation
    gsap.fromTo(
      containerRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.8, ease: "power3.out" },
    );

    gsap.fromTo(
      taglineRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.8, ease: "power3.out" },
    );

    gsap.fromTo(
      descRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 1.0, ease: "power3.out" },
    );

    gsap.fromTo(
      ctaRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 1.3, ease: "power3.out" },
    );
  }, []);

  return (
    <section className="arched-hero">
      {/* Texture */}
      <div className="arched-hero__noise" />

      {/* Right-aligned Background Image */}
      <img
        src="/assets/chakra.jpg"
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
          Made with time. Made for living.
        </div>
        <p ref={descRef} className="arched-hero__desc">
          We make clothes rooted in handwoven textiles, thoughtful design and the everyday lives of the women who wear them. Starting with Khadi cotton from Madhya Pradesh.
        </p>
        <div ref={ctaRef} className="arched-hero__cta-row">
          <a href="/shop" className="arched-hero__cta arched-hero__cta--primary">
            Shop Collection
          </a>
          <a href="/our-story" className="arched-hero__cta arched-hero__cta--secondary">
            Explore the Story
          </a>
        </div>
      </div>

      {/* Center Video — Rounded Rectangular Frame */}
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
        <div className="arched-hero__border" />
      </div>
    </section>
  );
}
