"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import "@/app/styles/arched-hero.css";

export default function ArchedHero() {
  const containerRef = useRef(null);
  const videoPortalRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Entrance Animation
    gsap.fromTo(
      videoPortalRef.current,
      { scale: 0.96, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 1.4, ease: "power3.out" },
    );

    gsap.fromTo(
      taglineRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, delay: 0.35, ease: "power3.out" },
    );

    gsap.fromTo(
      ctaRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, delay: 0.55, ease: "power3.out" },
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
      {/* Subtle Parchment Texture & Noise */}
      <div className="arched-hero__noise" />

      {/* Right-aligned Background Image Watermark */}
      <img src="/assets/751.jpg" alt="" className="arched-hero__bg-right" aria-hidden="true" />

      <div className="arched-hero__inner">
        {/* Center Video — Prominent, Wide Cinematic Banner (Aditi's Marker & Video Comes First) */}
        <div ref={videoPortalRef} className="arched-hero__portal arched-hero__portal--landscape">
          <div className="arched-hero__mask">
            <video
              ref={videoRef}
              className="arched-hero__video"
              src="/assets/homepage/Homepage%20vid.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/assets/homepage/Homepage%20vid.mp4" type="video/mp4" />
              <source src="/assets/homepage/Homepage vid.mp4" type="video/mp4" />
            </video>
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

        {/* Hero Narrative: Airy Earthy Fluid & CTAs (Logo removed as requested) */}
        <div className="arched-hero__narrative">
          <h1 ref={taglineRef} className="arched-hero__trio-tagline">
            AIRY, EARTHY, FLUID
          </h1>
          <div ref={ctaRef} className="arched-hero__cta-row">
            <a
              href="/shop"
              className="arched-hero__cta arched-hero__cta--primary"
            >
              Shop Sum
            </a>
            <a
              href="/our-story"
              className="arched-hero__cta arched-hero__cta--secondary"
            >
              Our Story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
