"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

export default function ArchedHero() {
  const containerRef = useRef(null);
  const videoPortalRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
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
      logoRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.45, ease: "power3.out" },
    );

    gsap.fromTo(
      taglineRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.6, ease: "power3.out" },
    );

    gsap.fromTo(
      ctaRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.85, ease: "power3.out" },
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
      <img src="/assets/751.jpg" alt="" className="arched-hero__bg-right" />

      {/* Hero Left Content — Logo + Airy Earthy Fluid + CTAs */}
      <div className="arched-hero__brand-wrap">
        <div ref={logoRef} className="arched-hero__logo-wrap">
          <img
            src="/assets/logo.svg"
            alt="सम् CLOTHICO"
            className="arched-hero__logo"
          />
        </div>
        <div ref={taglineRef} className="arched-hero__trio-tagline">
          AIRY, EARTHY, FLUID
        </div>
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

      {/* Center Video — Rectangular Landscape */}
      <div
        ref={videoPortalRef}
        className="arched-hero__portal arched-hero__portal--landscape"
      >
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

      {/* Brand line at center bottom */}
      <div className="arched-hero__brandline-bottom">
        Airy. Earthy. Fluid.
      </div>
    </section>
  );
}
