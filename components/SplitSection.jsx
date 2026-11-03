"use client";

import React, { useState, useEffect, useRef } from "react";
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
    label: ["PRINCIPLE", "EASY"],
    model: "/assets/model.png",
    mobileModel: "/assets/img/15.png",
  },
  {
    reversed: true,
    title: ["Thoughtful", "Every Detail"],
    why: "Every detail has a clear reason to be there.",
    how: "Thoughtful silhouettes, functional deep pockets, and cuts designed for real days and spontaneous plans.",
    label: ["PRINCIPLE", "THOUGHTFUL"],
    model: "/assets/m2.png",
    mobileModel: "/assets/img/13.png",
  },
  {
    reversed: false,
    title: ["Rooted", "In Place"],
    why: "Textiles with an authentic story, artisan hands, and a place.",
    how: "Starting with pure Khadi cotton sourced from Madhya Pradesh, woven at human pace on wooden looms.",
    label: ["PRINCIPLE", "ROOTED"],
    model: "/assets/m3.png",
    mobileModel: "/assets/img/24.png",
  },
  {
    reversed: true,
    title: ["Long-Wearing", "Beyond Seasons"],
    why: "Made to stay in your wardrobe beyond a single fleeting trend.",
    how: "Pieces you can wear more than one way, softening and relaxing naturally with every wash.",
    label: ["PRINCIPLE", "LONG-WEARING"],
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

      gsap.fromTo(
        modelRef.current,
        { scale: 0.96, y: isDesktop ? 80 : 25, opacity: 0 },
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

      if (isDesktop) {
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
      }

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

/* ─── MOBILE STICKY SCROLL WITH ANIMATED WEAVING THREAD SVG ─── */
function MobileStickyPrinciples() {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [threadOffset, setThreadOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalDist = el.offsetHeight - windowH;
      if (totalDist <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / totalDist));
      const idx = Math.min(PANELS.length - 1, Math.floor(progress * PANELS.length));
      setActiveIdx(idx);
      setThreadOffset(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const current = PANELS[activeIdx];

  return (
    <div
      ref={trackRef}
      className="split-mobile-sticky-track"
      style={{
        position: "relative",
        height: "360vh",
        backgroundColor: "var(--bg-color, #EDE8DC)",
      }}
    >
      <div
        className="split-mobile-sticky-viewport"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "85px 20px 30px",
          boxSizing: "border-box",
        }}
      >
        {/* Animated Background Thread SVG with curves and loops */}
        <svg
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "90px",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
            opacity: 0.38,
          }}
          viewBox="0 0 90 700"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 45 0 C 85 90, 5 180, 45 270 C 85 360, 5 450, 45 540 C 85 630, 10 680, 45 720"
            stroke="#881A1C"
            strokeWidth="2.5"
            strokeDasharray="600"
            strokeDashoffset={600 - threadOffset * 550}
            strokeLinecap="round"
          />
          {/* Looping Thread Rings */}
          <circle
            cx="45"
            cy={150 + threadOffset * 380}
            r="16"
            stroke="#881A1C"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <circle
            cx="45"
            cy={150 + threadOffset * 380}
            r="6"
            fill="#881A1C"
            opacity="0.5"
          />
        </svg>

        {/* Top Text Content */}
        <div style={{ position: "relative", zIndex: 5, maxWidth: "88%" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#881A1C",
              marginBottom: 6,
            }}
          >
            PRINCIPLE {activeIdx + 1} OF 4 · {current.label[1]}
          </div>

          <h2
            key={`title-${activeIdx}`}
            style={{
              fontSize: "clamp(24px, 6.5vw, 32px)",
              fontWeight: 800,
              color: "#1c1917",
              margin: "0 0 12px",
              lineHeight: 1.15,
              animation: "splitFadeIn 0.4s ease-out",
            }}
          >
            {current.title[0]} {current.title[1]}
          </h2>

          <div
            key={`body-${activeIdx}`}
            style={{
              fontSize: "13px",
              lineHeight: 1.55,
              color: "#44403c",
              animation: "splitFadeIn 0.45s ease-out",
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 800, color: "#881A1C", fontSize: "10px", letterSpacing: 1, display: "block" }}>
                WHY IT MATTERS
              </span>
              {current.why}
            </div>
            <div>
              <span style={{ fontWeight: 800, color: "#881A1C", fontSize: "10px", letterSpacing: 1, display: "block" }}>
                HOW IT FEELS
              </span>
              {current.how}
            </div>
          </div>
        </div>

        {/* Center / Bottom Model Image Frame */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            width: "100%",
            maxHeight: "44vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <div
            key={`img-${activeIdx}`}
            style={{
              width: "100%",
              maxWidth: "280px",
              height: "42vh",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.06)",
              backgroundColor: "#fff",
              animation: "splitImageIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <img
              src={current.mobileModel || current.model}
              alt={current.title.join(" ")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* Bottom Progress Indicator Dots */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingTop: 8,
            zIndex: 5,
          }}
        >
          {PANELS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeIdx ? 24 : 8,
                height: 4,
                borderRadius: 4,
                backgroundColor: i === activeIdx ? "#881A1C" : "rgba(0,0,0,0.18)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SplitSection() {
  return (
    <>
      {/* Desktop view (min-width: 901px) */}
      <div className="split-desktop-wrapper">
        {PANELS.map((p, i) => (
          <SplitPanel key={i} isLast={i === PANELS.length - 1} {...p} />
        ))}
      </div>

      {/* Mobile view (max-width: 900px) */}
      <div className="split-mobile-sticky-wrapper">
        <MobileStickyPrinciples />
      </div>
    </>
  );
}
