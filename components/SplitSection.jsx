"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/split-section.css";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    reversed: false,
    title: ["Easy", "Moves With You"],
    why: "Clothes that move with you wherever your day wanders.",
    how: "Comfort that doesn't ask you to compromise on looking good — easy shapes with effortless attitude.",
    label: ["PRINCIPLE 01 / 04", "EASY"],
    model: "/assets/model.png",
    mobileModel: "/assets/img/15.png",
  },
  {
    reversed: true,
    title: ["Thoughtful", "Every Detail"],
    why: "Every detail has a clear reason to be there.",
    how: "Thoughtful silhouettes, functional deep pockets, and cuts designed for real days and spontaneous plans.",
    label: ["PRINCIPLE 02 / 04", "THOUGHTFUL"],
    model: "/assets/m2.png",
    mobileModel: "/assets/img/13.png",
  },
  {
    reversed: false,
    title: ["Rooted", "In Place"],
    why: "Textiles with an authentic story, artisan hands, and a place.",
    how: "Starting with pure Khadi cotton sourced from Madhya Pradesh, woven at human pace on wooden looms.",
    label: ["PRINCIPLE 03 / 04", "ROOTED"],
    model: "/assets/m3.png",
    mobileModel: "/assets/img/24.png",
  },
  {
    reversed: true,
    title: ["Long-Wearing", "Beyond Seasons"],
    why: "Made to stay in your wardrobe beyond a single fleeting trend.",
    how: "Pieces you can wear more than one way, softening and relaxing naturally with every wash.",
    label: ["PRINCIPLE 04 / 04", "LONG-WEARING"],
    model: "/assets/m1.png",
    mobileModel: "/assets/img/26.png",
  },
];

/* ─── DESKTOP SPLIT PANEL COMPONENT ─── */
const SplitPanel = ({ reversed, title, why, how, label, model, mobileModel, isLast }) => {
  const sectionRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const xTarget = 0;

    const ctx = gsap.context(() => {
      const isDesktop = typeof window !== "undefined" && window.innerWidth > 900;
      if (!isDesktop) return;

      gsap.fromTo(
        modelRef.current,
        { scale: 0.96, y: 80, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        },
      );

      gsap.fromTo(
        modelRef.current,
        { x: 0 },
        {
          x: xTarget,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      const contentEl = section.querySelector(".split-section__content");
      const titleWords = section.querySelectorAll(".split-title-word");
      if (titleWords.length > 0) {
        gsap.fromTo(
          titleWords,
          { y: "125%", rotate: 2.5, opacity: 0 },
          {
            y: "0%",
            rotate: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: contentEl || section,
              start: "top 80%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`split-section${reversed ? " split-section--reversed" : ""}`}
    >
      {isLast && (
        <div className="last-split-portrait" aria-hidden="true">
          <img
            src="/assets/img/17.png"
            alt="Long-Wearing Red Linen Shirt"
          />
        </div>
      )}

      <div className="split-section__left">
        <div className="split-section__content">
          <div className="split-section__title">
            {title.map((line, lineIdx) => (
              <div
                key={lineIdx}
                style={{
                  overflow: "hidden",
                  display: "block",
                  paddingBottom: "4px",
                  lineHeight: 1.05,
                }}
              >
                {line.split(" ").map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      verticalAlign: "top",
                      marginRight: "0.26em",
                    }}
                  >
                    <span
                      className="split-title-word"
                      style={{ display: "inline-block", transformOrigin: "bottom left" }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="split-section__why">
            <span style={{ fontWeight: 700, color: "#5C4033", display: "block", marginBottom: "4px" }}>WHY IT MATTERS</span>
            {why}
          </div>
          <div className="split-section__how">
            <span style={{ fontWeight: 700, color: "#5C4033", display: "block", marginBottom: "4px" }}>HOW IT FEELS</span>
            {how}
          </div>
        </div>
      </div>

      <div className="split-section__right" />

      <div ref={modelRef} className="split-section__model">
        <picture>
          {mobileModel && <source media="(max-width: 900px)" srcSet={mobileModel} />}
          <img src={model} alt="Khadi Model" />
        </picture>
      </div>
    </section>
  );
};

/* ─── MOBILE STICKY SCROLL SECTION WITH ANIMATED SVG THREAD COILS ─── */
const MobileStickyPrinciplesSection = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const slideRefs = useRef([]);
  const dotRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add("(max-width: 900px)", () => {
      const slides = slideRefs.current.filter(Boolean);
      const dots = dotRefs.current.filter(Boolean);
      const path = pathRef.current;

      // Calculate path length for thread drawing
      let pathLen = 1400;
      if (path && path.getTotalLength) {
        pathLen = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLen,
          strokeDashoffset: pathLen,
        });
      }

      // Initialize slide states
      slides.forEach((slide, i) => {
        if (i === 0) {
          gsap.set(slide, { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" });
        } else {
          gsap.set(slide, { opacity: 0, y: 36, scale: 0.94, pointerEvents: "none" });
        }
      });

      // Highlight first dot
      if (dots[0]) {
        gsap.set(dots[0], { width: 28, backgroundColor: "#881A1C" });
      }

      // Master ScrollTrigger timeline pinned for 4 slides
      const totalSteps = slides.length - 1; // 3 transitions
      const scrollDistance = totalSteps * 900; // 2700px smooth scrolling

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // 1. Thread draws continuously with curves & coils from top to bottom
      if (path) {
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            ease: "none",
            duration: totalSteps,
          },
          0
        );
      }

      // 2. Cross-fade slides smoothly step-by-step
      for (let i = 0; i < totalSteps; i++) {
        const curSlide = slides[i];
        const nextSlide = slides[i + 1];
        const curDot = dots[i];
        const nextDot = dots[i + 1];
        const stepTime = i;

        // Current slide fades out and rises
        tl.to(
          curSlide,
          {
            opacity: 0,
            y: -32,
            scale: 0.95,
            pointerEvents: "none",
            duration: 0.45,
            ease: "power2.inOut",
          },
          stepTime + 0.55
        );

        // Next slide fades in from below
        tl.to(
          nextSlide,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto",
            duration: 0.45,
            ease: "power2.out",
          },
          stepTime + 0.65
        );

        // Dot transition
        if (curDot && nextDot) {
          tl.to(curDot, { width: 8, backgroundColor: "rgba(61, 43, 31, 0.22)", duration: 0.3 }, stepTime + 0.6);
          tl.to(nextDot, { width: 28, backgroundColor: "#881A1C", duration: 0.3 }, stepTime + 0.6);
        }
      }
    });

    return () => mm.revert();
  }, []);

  // Coiled thread SVG path with 4 complete spinning loops down the viewport
  const coilPathD =
    "M 70 0 " +
    "C 95 60, 115 120, 85 170 " +
    "C 65 210, 20 215, 20 185 " +
    "C 20 155, 80 145, 95 185 " +
    "C 110 220, 85 270, 70 300 " +
    "C 55 340, 25 380, 50 430 " +
    "C 70 470, 120 475, 120 440 " +
    "C 120 405, 55 400, 40 440 " +
    "C 25 480, 55 520, 70 560 " +
    "C 85 600, 115 640, 90 690 " +
    "C 70 730, 20 735, 20 700 " +
    "C 20 665, 85 660, 95 700 " +
    "C 110 740, 85 780, 70 820 " +
    "C 55 860, 30 890, 55 930 " +
    "C 75 960, 115 965, 115 940 " +
    "C 115 915, 65 910, 55 940 " +
    "C 45 970, 65 990, 70 1000";

  return (
    <div ref={containerRef} className="split-mobile-sticky-section">
      <div className="split-mobile-sticky-viewport">
        {/* ─── Animated Side Thread SVG with Curves & Coils ─── */}
        <div className="split-mobile-thread-wrap" aria-hidden="true">
          <svg
            className="split-mobile-thread-svg"
            viewBox="0 0 140 1000"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Soft shadow background guide */}
            <path
              d={coilPathD}
              stroke="rgba(136, 26, 28, 0.12)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Main animated thread line */}
            <path
              ref={pathRef}
              className="split-mobile-thread-path"
              d={coilPathD}
              stroke="#881A1C"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ─── Stacked Principle Slides (Cross-faded by GSAP) ─── */}
        <div className="split-mobile-slides-stage">
          {PANELS.map((p, idx) => (
            <div
              key={idx}
              ref={(el) => (slideRefs.current[idx] = el)}
              className="split-mobile-slide"
            >
              {/* Header Label */}
              <div className="split-mobile-badge">
                <span className="split-mobile-badge-dot" />
                <span>{p.label[0]} · {p.label[1]}</span>
              </div>

              {/* Title */}
              <h2 className="split-mobile-title">
                {p.title[0]} {p.title[1]}
              </h2>

              {/* Editorial Explanations */}
              <div className="split-mobile-details">
                <div className="split-mobile-detail-item">
                  <span className="split-mobile-detail-label">WHY IT MATTERS</span>
                  <p className="split-mobile-detail-text">{p.why}</p>
                </div>
                <div className="split-mobile-detail-item">
                  <span className="split-mobile-detail-label">HOW IT FEELS</span>
                  <p className="split-mobile-detail-text">{p.how}</p>
                </div>
              </div>

              {/* Framed Image Card */}
              <div className="split-mobile-image-card">
                <img
                  src={p.mobileModel || p.model}
                  alt={`${p.title[0]} ${p.title[1]}`}
                  className="split-mobile-img"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ─── Bottom Navigation Progress Pills ─── */}
        <div className="split-mobile-indicators" aria-label="Principles progress">
          {PANELS.map((_, i) => (
            <span
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              className="split-mobile-indicator-pill"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function SplitSection() {
  return (
    <>
      {/* Desktop view (screens > 900px) */}
      <div className="split-desktop-container">
        {PANELS.map((p, i) => (
          <SplitPanel key={i} isLast={i === PANELS.length - 1} {...p} />
        ))}
      </div>

      {/* Mobile Sticky Pin View (screens <= 900px) */}
      <div className="split-mobile-container">
        <MobileStickyPrinciplesSection />
      </div>
    </>
  );
}
