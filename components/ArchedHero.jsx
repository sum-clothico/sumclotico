"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiVolume2, FiVolumeX, FiMaximize2, FiX } from "react-icons/fi";
import "@/app/styles/arched-hero.css";

const DESKTOP_VIDEO_SRC = "/assets/videos/Hime%20page%20video%20landscape.mp4";
const MOBILE_VIDEO_SRC = "/assets/homepage/Homepage%20vid.mp4";

export default function ArchedHero() {
  const containerRef = useRef(null);
  const videoPortalRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState(DESKTOP_VIDEO_SRC);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateResponsiveVideo = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setVideoSrc(mobile ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC);
    };

    updateResponsiveVideo();
    window.addEventListener("resize", updateResponsiveVideo);
    return () => window.removeEventListener("resize", updateResponsiveVideo);
  }, []);

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

  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const openModal = (e) => {
    e.stopPropagation();
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
        {/* Center Video — Landscape on Desktop, Vertical on Mobile */}
        <div
          ref={videoPortalRef}
          className={`arched-hero__portal ${isMobile ? "arched-hero__portal--vertical" : "arched-hero__portal--landscape"}`}
        >
          <div className="arched-hero__mask">
            <video
              key={videoSrc}
              ref={videoRef}
              className="arched-hero__video"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            <div className="arched-hero__vignette" />

            {/* Video Controls Overlay */}
            <div className="hero-video-controls-row">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className="hero-video-sound-btn"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <FiVolumeX size={15} /> : <FiVolume2 size={15} />}
                <span className="hero-video-btn-text">{isMuted ? "Sound Off" : "Sound On"}</span>
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

      {/* ─── Video Enlarge Modal (Click anywhere to close) ─── */}
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
            className={`hero-video-modal-content ${isMobile ? "hero-video-modal-content--vertical" : ""}`}
            onClick={(e) => {
              // If click is on the content wrapper or backdrop, close modal
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <video
              ref={modalVideoRef}
              className="hero-video-modal-player"
              src={videoSrc}
              autoPlay
              controls
              playsInline
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
