"use client";

import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(InertiaPlugin, ScrollTrigger);

const PHASE_TEXTS = [
  "Daily wear that feels light and breathable.",
  "Work outfits that stay comfortable all day.",
  "Simple, minimal wardrobes built around ease.",
  "Travel, where comfort matters most.",
  "It's easy, effortless, and real.",
];

export default function MotionCards() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const phaseTextRef = useRef(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const isAnimating = useRef(false);

  // Advance to next phase text on click
  const handleTextClick = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const el = phaseTextRef.current;
    if (!el) return;

    gsap.to(el, {
      opacity: 0,
      y: -16,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        setPhaseIndex((prev) => (prev + 1) % PHASE_TEXTS.length);
        gsap.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            ease: "power2.out",
            onComplete: () => { isAnimating.current = false; },
          },
        );
      },
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Inertia on cards
      const cards = document.querySelectorAll(".motion-card__card");
      cards.forEach((card) => {
        let lastX = 0;
        let lastY = 0;
        let speedX = 0;
        let speedY = 0;

        const startRotation = gsap.getProperty(card, "rotation");
        const startX = gsap.getProperty(card, "x");
        const startY = gsap.getProperty(card, "y");

        const onMove = (e) => {
          speedX = e.clientX - lastX;
          speedY = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
        };
        const onEnter = (e) => {
          speedX = 0;
          speedY = 0;
          lastX = e.clientX;
          lastY = e.clientY;
        };
        const onLeave = () => {
          gsap.to(card, {
            inertia: {
              x: { velocity: speedX * 20, end: startX },
              y: { velocity: speedY * 20, end: startY },
              rotation: { velocity: speedX * 1.5, end: startRotation },
            },
          });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
      });

      // ── Pattern rotate + scale on scroll ──
      const pattern = sectionRef.current.querySelector(".mc-pattern");
      if (pattern) {
        gsap.fromTo(
          pattern,
          { rotation: 0, scale: 0.7, opacity: 0 },
          {
            rotation: 120,
            scale: 1.3,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          },
        );
      }

      // ── Pin section ──
      const PIN = 3500;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${PIN}`,
        pin: true,
        pinSpacing: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="motion-card-section"
      id="motion-card-section"
    >
      {/* ─── Logo ─── */}
      <div className="mc-logo">
        <img src="/assets/logo.svg" alt="सम् Clothico" />
      </div>

      <div className="horizontal-words__corner-right">म</div>

      {/* ─── Section heading ─── */}
      <h2 className="mc-heading">Where Khadi Fits in Your Life</h2>

      {/* ─── Click-to-cycle Text ─── */}
      <div
        className="mc-texts mc-texts--clickable"
        onClick={handleTextClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleTextClick()}
        aria-label="Click to see next use case"
        title="Click to see more"
      >
        <p ref={phaseTextRef} className="mc-phase-text mc-phase-text--active">
          {PHASE_TEXTS[phaseIndex]}
        </p>
        <span className="mc-click-hint">this text should change with every click</span>
      </div>

      {/* ─── Cards ─── */}
      <div className="motion-card__cards-area">
        <div ref={containerRef} className="motion-card__cards">
          <div className="motion-card__card motion-card__card--1">
            <div className="motion-card__card-image">
              <img src="/assets/img/13.png" loading="lazy" alt="" className="cover-image" />
            </div>
          </div>
          <div className="motion-card__card motion-card__card--2">
            <div className="motion-card__card-image">
              <img src="/assets/img/14.png" loading="lazy" alt="" className="cover-image" />
            </div>
          </div>
          <div className="motion-card__card motion-card__card--3">
            <div className="motion-card__card-image">
              <img src="/assets/img/15.png" loading="lazy" alt="" className="cover-image" />
            </div>
          </div>
          <div className="motion-card__card motion-card__card--4">
            <div className="motion-card__card-image">
              <img src="/assets/img/16.png" loading="lazy" alt="" className="cover-image" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Pattern Decoration ─── */}
      <img src="/assets/pat1.svg" alt="" className="mc-pattern" />
    </section>
  );
}
