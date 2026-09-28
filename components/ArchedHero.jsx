"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

export default function ArchedHero() {
  const containerRef = useRef(null);
  const videoPortalRef = useRef(null);
  const taglineRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Entrance Animation
    gsap.fromTo(
      videoPortalRef.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.6, ease: "power3.out" },
    );

    gsap.fromTo(
      taglineRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.6, ease: "power3.out" },
    );

    gsap.fromTo(
      descRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.8, ease: "power3.out" },
    );

    gsap.fromTo(
      ctaRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 1.0, ease: "power3.out" },
    );
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section ref={containerRef} className="arched-hero">
      {/* Texture */}
      <div className="arched-hero__noise" />

      {/* Right-aligned Background Image (Watermark illustration) */}
      <img src="/assets/chakra.jpg" alt="" className="arched-hero__bg-right" />

      {/* Brand Name — Left Side (Restored earlier design) */}
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
          We make clothes rooted in handwoven textiles, thoughtful design and
          the everyday lives of the women who wear them. Starting with Khadi
          cotton from Madhya Pradesh.
        </p>
        <div ref={ctaRef} className="arched-hero__cta-row">
          <a
            href="/shop"
            className="arched-hero__cta arched-hero__cta--primary"
          >
            Shop Collection
          </a>
          <a
            href="/our-story"
            className="arched-hero__cta arched-hero__cta--secondary"
          >
            Explore the Story
          </a>
        </div>
      </div>

      {/* Center Video — Redesigned into Landscape in Our Style */}
      <div
        ref={videoPortalRef}
        className="arched-hero__portal arched-hero__portal--landscape"
      >
        <div className="arched-hero__mask">
          <video
            ref={videoRef}
            className="arched-hero__video"
            src="/assets/videos/vid1.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="arched-hero__vignette" />

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="hero-video-sound-btn"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
            <span>{isMuted ? "Sound Off" : "Sound On"}</span>
          </button>
        </div>
        <div className="arched-hero__border" />
      </div>
    </section>
  );
}
