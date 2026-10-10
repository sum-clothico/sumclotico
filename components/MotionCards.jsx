"use client";

import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import IndianArchBadge from "@/components/IndianArchBadge";

gsap.registerPlugin(InertiaPlugin, ScrollTrigger);

const PHASE_TEXTS = [
  "Human hands, at almost every step.",
  "Made with time, skill and attention before it ever reaches you.",
];

const JOURNEY = [
  { label: "SPUN", image: "/assets/chakra.jpg", caption: "Yarn by hand on the charkha." },
  { label: "WOVEN", image: "/assets/wev.jpg", caption: "Pit loom. Human rhythm." },
  { label: "SOURCED", image: "/assets/fabric.jpg", caption: "Cloth chosen with care." },
  { label: "DESIGNED", image: "/assets/khadi.jpg", caption: "Easy silhouettes, honest cuts." },
  { label: "CUT", image: "/assets/han.jpg", caption: "Measured and shaped by hand." },
  { label: "STITCHED", image: "/assets/clt.jpg", caption: "Women tailors, piece by piece." },
  { label: "WORN", image: "/assets/khadi.jpg", caption: "Then it becomes yours." },
];

export default function MotionCards() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const phaseTextRef = useRef(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [journeyIdx, setJourneyIdx] = useState(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setJourneyIdx((i) => (i + 1) % JOURNEY.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

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
            onComplete: () => {
              isAnimating.current = false;
            },
          },
        );
      },
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading Word-by-Word Reveal
      const mcWords = sectionRef.current.querySelectorAll(".mc-heading-word");
      if (mcWords.length > 0) {
        gsap.fromTo(
          mcWords,
          { y: "125%", rotate: 2.5, opacity: 0 },
          {
            y: "0%",
            rotate: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          },
        );
      }

      // Static Paragraph / Cycling Subtitle Slide-up (like Section 2)
      const mcDesc = sectionRef.current.querySelector(".mc-texts");
      if (mcDesc) {
        gsap.fromTo(
          mcDesc,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            delay: 0.25,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          },
        );
      }

      // Grid Cards Staggered Slide-up Entrance
      const cards = sectionRef.current.querySelectorAll(".motion-card__card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            delay: 0.35,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          },
        );
      }

      // Pattern rotate + scale on scroll
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const mcHeadingWords = ["Many", "hands.", "One", "piece."];

  return (
    <section
      ref={sectionRef}
      className="motion-card-section"
      id="motion-card-section"
    >
      <div className="horizontal-words__corner-right">म</div>

      {/* ─── Indian Arch Subtitle Badge ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <IndianArchBadge>Many hands. One piece.</IndianArchBadge>
      </div>

      {/* ─── Section heading with Masked Words ─── */}
      <h2
        className="mc-heading"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.26em",
        }}
      >
        {mcHeadingWords.map((word, idx) => (
          <span
            key={idx}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
              paddingBottom: "4px",
            }}
          >
            <span
              className="mc-heading-word"
              style={{
                display: "inline-block",
                transformOrigin: "bottom left",
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </h2>

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
        <span className="mc-click-hint">tap to explore stories</span>
      </div>

      {/* ─── Interactive Journey (word pills + swapping image) ─── */}
      <div className="mc-journey">
        <div className="mc-journey__visual">
          {JOURNEY.map((step, i) => (
            <img
              key={step.label}
              src={step.image}
              alt={step.label}
              style={{ opacity: i === journeyIdx ? 1 : 0 }}
            />
          ))}
          <div className="mc-journey__scrim" />
          <div className="mc-journey__caption">
            <span className="mc-journey__step-num">
              {String(journeyIdx + 1).padStart(2, "0")} / {String(JOURNEY.length).padStart(2, "0")}
            </span>
            <p key={journeyIdx}>{JOURNEY[journeyIdx].caption}</p>
          </div>
        </div>
        {/* Flashing single word per slide without arrows */}
        <div className="mc-journey__word-display">
          <div key={journeyIdx} className="mc-journey__flashing-word">
            {JOURNEY[journeyIdx].label}
          </div>
          <div className="mc-journey__dots">
            {JOURNEY.map((step, i) => (
              <button
                key={step.label}
                type="button"
                onClick={() => setJourneyIdx(i)}
                className={
                  "mc-journey__dot" +
                  (i === journeyIdx ? " mc-journey__dot--active" : "")
                }
                aria-label={`Step ${i + 1}: ${step.label}`}
                title={step.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── Cards with authentic artisan craft imagery ─── */}
      <div className="motion-card__cards-area">
        <div ref={containerRef} className="motion-card__cards">
          {/* Card 1: Handspun Charkha Yarn */}
          <div className="motion-card__card motion-card__card--1">
            <div className="motion-card__card-image">
              <img
                src="/assets/chakra.jpg"
                loading="lazy"
                alt="Handspinning raw cotton on Charkha"
                className="cover-image"
              />
              <span className="motion-card__tag">01 • Handspun Charkha</span>
            </div>
          </div>

          {/* Card 2: Traditional Loom Weaving */}
          <div className="motion-card__card motion-card__card--2">
            <div className="motion-card__card-image">
              <img
                src="/assets/wev.jpg"
                loading="lazy"
                alt="Pit loom artisan hand weaving"
                className="cover-image"
              />
              <span className="motion-card__tag">02 • Pit Loom Weaving</span>
            </div>
          </div>

          {/* Card 3: Master Hand Stitching */}
          <div className="motion-card__card motion-card__card--3">
            <div className="motion-card__card-image">
              <img
                src="/assets/han.jpg"
                loading="lazy"
                alt="Master hands cutting and hand tailoring"
                className="cover-image"
              />
              <span className="motion-card__tag">03 • Master Tailoring</span>
            </div>
          </div>

          {/* Card 4: Living Khadi Cloth */}
          <div className="motion-card__card motion-card__card--4">
            <div className="motion-card__card-image">
              <img
                src="/assets/khadi.jpg"
                loading="lazy"
                alt="Finished living handspun Khadi cloth"
                className="cover-image"
              />
              <span className="motion-card__tag">04 • Living Khadi</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Pattern Decoration ─── */}
      <img src="/assets/pat1.svg" alt="" className="mc-pattern" />
    </section>
  );
}
