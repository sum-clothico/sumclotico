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
const SplitPanel = ({
  reversed,
  title,
  why,
  how,
  label,
  model,
  mobileModel,
  isLast,
}) => {
  const sectionRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const xTarget = 0;

    const ctx = gsap.context(() => {
      const isDesktop =
        typeof window !== "undefined" && window.innerWidth > 900;
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
          <img src="/assets/img/17.png" alt="Long-Wearing Red Linen Shirt" />
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
                      style={{
                        display: "inline-block",
                        transformOrigin: "bottom left",
                      }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="split-section__why">
            <span
              style={{
                fontWeight: 700,
                color: "#5C4033",
                display: "block",
                marginBottom: "4px",
              }}
            >
              WHY IT MATTERS
            </span>
            {why}
          </div>
          <div className="split-section__how">
            <span
              style={{
                fontWeight: 700,
                color: "#5C4033",
                display: "block",
                marginBottom: "4px",
              }}
            >
              HOW IT FEELS
            </span>
            {how}
          </div>
        </div>
      </div>

      <div className="split-section__right" />

      <div ref={modelRef} className="split-section__model">
        <picture>
          {mobileModel && (
            <source media="(max-width: 900px)" srcSet={mobileModel} />
          )}
          <img src={model} alt="Khadi Model" />
        </picture>
      </div>
    </section>
  );
};

/* ─── MOBILE STICKY SCROLL SECTION WITH ANIMATED SVG THREAD COILS & CIRCULAR SLIDING IMAGE ANIMATION ─── */
const MobileStickyPrinciplesSection = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const slideRefs = useRef([]);
  const textRefs = useRef([]);
  const imgRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add("(max-width: 900px)", () => {
      const slides = slideRefs.current.filter(Boolean);
      const texts = textRefs.current.filter(Boolean);
      const imgs = imgRefs.current.filter(Boolean);
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

      // Initialize slide states with circular arc positioning:
      slides.forEach((slide, i) => {
        if (i === 0) {
          gsap.set(slide, { opacity: 1, pointerEvents: "auto" });
          gsap.set(texts[i], { opacity: 1, y: 0, filter: "blur(0px)" });
          gsap.set(imgs[i], { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1 });
        } else {
          gsap.set(slide, { opacity: 0, pointerEvents: "none" });
          gsap.set(texts[i], { opacity: 0, y: 26, filter: "blur(4px)" });
          // Incoming images start primed on the right arc
          gsap.set(imgs[i], {
            opacity: 0,
            x: 130,
            y: 28,
            rotation: 12,
            scale: 0.92,
          });
        }
      });

      // Master ScrollTrigger timeline pinned for 4 slides
      const totalSteps = slides.length - 1; // 3 transitions
      const scrollDistance = totalSteps * 900; // smooth luxury scroll distance

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.65,
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
          0,
        );
      }

      // 2. Separate, staggered transitions with Circular Sliding for Images
      for (let i = 0; i < totalSteps; i++) {
        const curSlide = slides[i];
        const nextSlide = slides[i + 1];
        const curText = texts[i];
        const nextText = texts[i + 1];
        const curImg = imgs[i];
        const nextImg = imgs[i + 1];
        const stepTime = i;

        // --- Current Slide Exit ---
        // Text exits with upward drift and blur
        if (curText) {
          tl.to(
            curText,
            {
              opacity: 0,
              y: -22,
              filter: "blur(4px)",
              duration: 0.38,
              ease: "power2.in",
            },
            stepTime + 0.5,
          );
        }

        // Image exits along circular sliding curve to the left (x, y, rotation arc)
        if (curImg) {
          tl.to(
            curImg,
            {
              opacity: 0,
              x: -130,
              y: 28,
              rotation: -12,
              scale: 0.92,
              duration: 0.46,
              ease: "power2.inOut",
            },
            stepTime + 0.52,
          );
        }

        // Container pointer events switch
        tl.set(curSlide, { pointerEvents: "none" }, stepTime + 0.88);
        tl.set(
          nextSlide,
          { opacity: 1, pointerEvents: "auto" },
          stepTime + 0.56,
        );

        // --- Next Slide Entrance ---
        // Next image enters along circular sliding arc from the right into center
        if (nextImg) {
          tl.fromTo(
            nextImg,
            { opacity: 0, x: 130, y: 28, rotation: 12, scale: 0.92 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 0.48,
              ease: "power3.out",
            },
            stepTime + 0.58,
          );
        }

        // Text enters with crisp elevation & unblur
        if (nextText) {
          tl.fromTo(
            nextText,
            { opacity: 0, y: 26, filter: "blur(4px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.44,
              ease: "power3.out",
            },
            stepTime + 0.65,
          );
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
            {/* Soft guide */}
            <path
              d={coilPathD}
              stroke="rgba(136, 26, 28, 0.12)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Main animated thread line */}
            <path
              ref={pathRef}
              className="split-mobile-thread-path"
              d={coilPathD}
              stroke="#881A1C"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ─── Stacked Principle Slides with Separate Text & Circular Sliding Image Layers ─── */}
        <div className="split-mobile-stage">
          {PANELS.map((p, idx) => (
            <div
              key={idx}
              ref={(el) => (slideRefs.current[idx] = el)}
              className="split-mobile-panel"
            >
              {/* Top Text Layer */}
              <div
                ref={(el) => (textRefs.current[idx] = el)}
                className="split-mobile-text-layer"
              >
                <div className="split-section__left">
                  <div className="split-section__content">
                    <div className="split-section__title">
                      {p.title.map((line, lIdx) => (
                        <div key={lIdx}>{line}</div>
                      ))}
                    </div>
                    <div className="split-section__why">
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#5C4033",
                          display: "block",
                          marginBottom: "3px",
                        }}
                      >
                        WHY IT MATTERS
                      </span>
                      {p.why}
                    </div>
                    <div className="split-section__how">
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#5C4033",
                          display: "block",
                          marginBottom: "3px",
                        }}
                      >
                        HOW IT FEELS
                      </span>
                      {p.how}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Circular Sliding Image Layer */}
              <div
                ref={(el) => (imgRefs.current[idx] = el)}
                className="split-mobile-image-layer"
              >
                <div className="split-section__model">
                  <picture>
                    {p.mobileModel && (
                      <source
                        media="(max-width: 900px)"
                        srcSet={p.mobileModel}
                      />
                    )}
                    <img src={p.model} alt="Khadi Model" />
                  </picture>
                </div>
              </div>
            </div>
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
