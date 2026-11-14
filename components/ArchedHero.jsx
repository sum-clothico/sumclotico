"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiVolume2, FiVolumeX, FiMaximize2, FiX } from "react-icons/fi";
import "@/app/styles/arched-hero.css";

const YT_HERO_ID = "mLpKoIVzNys";

export default function ArchedHero() {
  const containerRef = useRef(null);
  const videoPortalRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Entrance Animation
  useEffect(() => {
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

  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const openModal = (e) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section ref={containerRef} className="arched-hero">
      {/* Subtle Parchment Texture & Noise */}
      <div className="arched-hero__noise" />

      {/* Right-aligned Background Image Watermark */}
      <img src="/assets/751.jpg" alt="" className="arched-hero__bg-right" aria-hidden="true" />

      <div className="arched-hero__inner">
        {/* Center Video Portal */}
        <div
          ref={videoPortalRef}
          className={`arched-hero__portal ${isMobile ? "arched-hero__portal--vertical" : "arched-hero__portal--landscape"}`}
        >
          <div className="arched-hero__mask">
            {/* Embedded YouTube Direct Background Player — single mount, zero double-loading */}
            <div className="arched-hero__yt-wrap">
              <iframe
                className="arched-hero__yt-iframe"
                src={`https://www.youtube-nocookie.com/embed/${YT_HERO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${YT_HERO_ID}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`}
                title="From Cotton to Clothing | The Story, People & Philosophy Behind Sum Clothico"
                allow="autoplay; encrypted-media"
                tabIndex={-1}
                onLoad={() => {
                  // Reveal video once loaded
                  setTimeout(() => setIsVideoReady(true), 600);
                }}
              />
            </div>

            {/* Poster thumbnail placeholder before video is ready */}
            <img
              src={`https://i.ytimg.com/vi/${YT_HERO_ID}/maxresdefault.jpg`}
              alt="From Cotton to Clothing | The Story, People & Philosophy Behind Sum Clothico"
              className={`arched-hero__poster ${isVideoReady ? "arched-hero__poster--hidden" : ""}`}
            />

            <div className="arched-hero__vignette" />

            {/* Click shield intercepting taps/clicks to open enlarged video */}
            <div
              className="arched-hero__click-shield"
              onClick={openModal}
              title="Click to enlarge video with sound"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openModal(e); }}
              aria-label="Enlarge video player"
            />

            {/* Video Controls Overlay (Sound + Enlarge) */}
            <div className="hero-video-controls-row">
              {/* Sound / Watch button */}
              <button
                type="button"
                onClick={openModal}
                className="hero-video-sound-btn"
                aria-label="Watch with sound"
                title="Watch with sound"
              >
                <FiVolume2 size={15} />
                <span className="hero-video-btn-text">Watch with Sound</span>
              </button>

              {/* Enlarge / Fullscreen Modal Trigger */}
              <button
                type="button"
                onClick={openModal}
                className="hero-video-enlarge-btn"
                aria-label="Enlarge video modal"
              >
                <FiMaximize2 size={15} />
                <span className="hero-video-btn-text">Enlarge</span>
              </button>
            </div>
          </div>
          <div className="arched-hero__border" />
        </div>

        {/* Hero Narrative: Airy Earthy Fluid & CTAs */}
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

      {/* ─── Video Enlarge Modal ─── */}
      {isModalOpen && (
        <div
          className="hero-video-modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged video viewer"
        >
          {/* Close button in top right */}
          <button
            type="button"
            className="hero-video-modal-close"
            onClick={closeModal}
            aria-label="Close enlarged video"
          >
            <FiX size={22} />
            <span>Close</span>
          </button>

          {/* Modal Container */}
          <div
            className="hero-video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="hero-video-modal-player"
              src={`https://www.youtube-nocookie.com/embed/${YT_HERO_ID}?autoplay=1&mute=0&controls=1&rel=0&playsinline=1`}
              title="From Cotton to Clothing | The Story, People & Philosophy Behind Sum Clothico"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
