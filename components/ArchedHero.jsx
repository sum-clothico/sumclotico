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
  const ytContainerRef = useRef(null);
  const playerObjRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
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

  // Initialize YouTube Player
  useEffect(() => {
    if (!window.YT && !document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (!ytContainerRef.current) return;
      if (playerObjRef.current) return;

      playerObjRef.current = new window.YT.Player(ytContainerRef.current, {
        videoId: YT_HERO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: YT_HERO_ID,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        },
        events: {
          onReady: (e) => {
            try {
              e.target.mute();
              e.target.playVideo();
            } catch (_) {}
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              try {
                e.target.playVideo();
              } catch (_) {}
            }
            if (e.data === window.YT.PlayerState.PLAYING) {
              // Delay revealing video until YouTube's initial center HUD has naturally hidden
              setTimeout(() => {
                setIsVideoReady(true);
              }, 2800);
            }
          },
        },
      });
    };

    let pollTimer;
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === "function") prevCallback();
        initPlayer();
      };
      pollTimer = setInterval(() => {
        if (window.YT && window.YT.Player && !playerObjRef.current) {
          clearInterval(pollTimer);
          initPlayer();
        }
      }, 200);
    }

    return () => {
      if (pollTimer) clearInterval(pollTimer);
      if (playerObjRef.current && typeof playerObjRef.current.destroy === "function") {
        playerObjRef.current.destroy();
        playerObjRef.current = null;
      }
    };
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

  const toggleSound = (e) => {
    e.stopPropagation();
    if (playerObjRef.current && typeof playerObjRef.current.isMuted === "function") {
      const muted = playerObjRef.current.isMuted();
      if (muted) {
        playerObjRef.current.unMute();
        playerObjRef.current.setVolume(100);
        setIsMuted(false);
      } else {
        playerObjRef.current.mute();
        setIsMuted(true);
      }
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  const openModal = (e) => {
    e.stopPropagation();
    try {
      playerObjRef.current?.pauseVideo();
    } catch (_) {}
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    try {
      playerObjRef.current?.playVideo();
    } catch (_) {}
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
            {/* Embedded YouTube Player */}
            <div className="arched-hero__yt-wrap">
              <div ref={ytContainerRef} className="arched-hero__yt-player" />
            </div>

            {/* Poster thumbnail placeholder before video is ready */}
            <img
              src={`https://i.ytimg.com/vi/${YT_HERO_ID}/maxresdefault.jpg`}
              alt="From Cotton to Clothing | The Story, People & Philosophy Behind Sum Clothico"
              className={`arched-hero__poster ${isVideoReady ? "arched-hero__poster--hidden" : ""}`}
            />

            <div className="arched-hero__vignette" />

            {/* Shield intercepting taps/clicks to suppress YouTube initial controls */}
            <div
              className="arched-hero__click-shield"
              onClick={openModal}
              title="Click to enlarge video"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openModal(e); }}
              aria-label="Enlarge video player"
            />

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
