"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

// 11 images from /assets/img/
const IMAGES = Array.from({ length: 11 }, (_, i) => ({
  src: `/assets/img/${i + 1}.png`,
  alt: `SUM CLOTHICO ${i + 1}`,
}));

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function DoubleMarquee() {
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const rafRef = useRef(null);

  // Apply arc rotation based on mathematical position (avoiding transform read/write feedback loop)
  const updateArc = useCallback(() => {
    if (!trackRef.current || !wrapperRef.current) return;
    const track = trackRef.current;
    const cards = track.querySelectorAll(".arc-marquee__item");

    // Get base position of the track
    const trackRect = track.getBoundingClientRect();
    const viewportCenter = window.innerWidth / 2;
    // Tweak stringency of the curve
    const curveRadius = window.innerWidth * 0.45;

    cards.forEach((card) => {
      // Store original offsetLeft to calculate un-transformed screen X
      if (!card.hasAttribute("data-left")) {
        card.setAttribute("data-left", card.offsetLeft);
      }
      const initialLeft = parseFloat(card.getAttribute("data-left"));

      // Calculate true center of the card relative to viewport window
      const cardCenter = trackRect.left + initialLeft + card.offsetWidth / 2;

      // Distance from viewport center, normalized
      const distFromCenter = (cardCenter - viewportCenter) / curveRadius;

      // Use a cubic polynomial so the center cards stay flat, but the edge cards ramp up sharply
      const cubicDist = Math.pow(distFromCenter, 3);
      const clampedCubic = Math.max(-1.8, Math.min(1.8, cubicDist));

      // Corrected 3D inward "framing" polarity:
      // Left cards (- dist) -> positive rotateY -> left edge swings out toward camera.
      // Right cards (+ dist) -> negative rotateY -> right edge swings out toward camera.
      const rotateY = clampedCubic * -28;

      // PULL TOWARDS CAMERA: Outer cards sweep inward and grow massive like the reference
      const translateZ = Math.pow(Math.abs(distFromCenter), 2.5) * 200;

      // Slight scale variation: cards actively grow as they move to the edges
      const scale = 1 + Math.pow(Math.abs(distFromCenter), 2) * 0.005;

      // Pull aggressively inwards to stitch the floating cards together and prevent V-shape gaps
      // Left card (-dist) pushed right (+X). Right card (+dist) pushed left (-X).
      const translateX =
        Math.pow(Math.abs(distFromCenter), 2) * (distFromCenter < 0 ? 60 : -60);

      card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    });

    rafRef.current = requestAnimationFrame(updateArc);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const items = track.querySelectorAll(".arc-marquee__item");
    if (!items.length) return;

    // Calculate total width of one set (first half)
    let singleSetWidth = 0;
    const halfCount = items.length / 2;
    items.forEach((item, i) => {
      if (i < halfCount) {
        singleSetWidth += item.offsetWidth + 20; // 20px gap
      }
    });

    // GSAP infinite horizontal scroll
    const tween = gsap.to(track, {
      x: -singleSetWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % singleSetWidth),
      },
    });

    // Start the arc update loop
    rafRef.current = requestAnimationFrame(updateArc);

    return () => {
      tween.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateArc]);

  // Duplicate images for seamless loop
  const allImages = [...shuffleArray(IMAGES), ...shuffleArray(IMAGES)];

  return (
    <div className="arc-marquee-section">
      {/* ─── Text content at top ─── */}
      <div className="arc-marquee__text-block">
        <p className="arc-marquee__label">Our Collection</p>
        <h2 className="arc-marquee__heading">
          Curious What We've
          <br />
          <em>Crafted?</em>
        </h2>
        <p className="arc-marquee__desc">
          Explore our handwoven khadi textiles, sustainable fashion, and
          artisanal home collections.
        </p>
        <a
          href="https://www.instagram.com/sumclothico/"
          target="_blank"
          rel="noopener noreferrer"
          className="arc-marquee__btn"
        >
          Visit Instagram
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>
      </div>

      {/* ─── Single curved marquee ─── */}
      <div className="arc-marquee__wrapper" ref={wrapperRef}>
        <div className="arc-marquee__track" ref={trackRef}>
          {allImages.map((item, i) => (
            <div key={`card-${i}`} className="arc-marquee__item">
              <img src={item.src} loading="lazy" alt={item.alt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
