"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/horizontal-words.css";
import { FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_PIN_DISTANCE = 950;

export default function HorizontalWords() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = sectionRef.current;
      const content = contentRef.current;

      const isDesktop = typeof window !== "undefined" && window.innerWidth > 900;

      // Pin the section while the story reveals on desktop
      if (isDesktop) {
        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: () => `+=${TOTAL_PIN_DISTANCE}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 0,
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true,
          refreshPriority: 2,
        });

        // Fade out editorial content & frame cleanly before unpinning to avoid collision with next section
        if (content) {
          gsap.to(content, {
            opacity: 0,
            y: -25,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: container,
              start: () => `top+=${TOTAL_PIN_DISTANCE - 180} top`,
              end: () => `top+=${TOTAL_PIN_DISTANCE} top`,
              scrub: 0.4,
            },
          });
        }
      }

      const hFrameSvg = container.querySelector(".horizontal-words__frame");
      if (hFrameSvg) {
        gsap.to(hFrameSvg, {
          opacity: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: container,
            start: () => `top+=${TOTAL_PIN_DISTANCE - 180} top`,
            end: () => `top+=${TOTAL_PIN_DISTANCE} top`,
            scrub: 0.4,
          },
        });
      }

      // Frame stroke animation
      const hFrame = container.querySelector(".section-frame-path");
      if (hFrame) {
        const len = hFrame.getTotalLength ? hFrame.getTotalLength() : 1100;
        gsap.set(hFrame, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(hFrame, {
          strokeDashoffset: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: `+=${TOTAL_PIN_DISTANCE}`,
            scrub: 1,
          },
        });
      }

      // Corner botanical wipe-up reveal
      gsap.to(".horizontal-words__corner-left", {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 30%",
          end: "top top",
          scrub: 1,
        },
      });

      // Subtle parallax on watermark character
      gsap.to(".horizontal-words__corner-right", {
        y: 60,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: `+=${TOTAL_PIN_DISTANCE}`,
          scrub: 1,
        },
      });

      // Content elements smooth kinetic word-by-word reveal & linear stagger entrance
      if (content) {
        const titleWords = content.querySelectorAll(".hw-title-word");
        if (titleWords.length > 0) {
          gsap.fromTo(
            titleWords,
            { y: "115%", rotate: 2.5, opacity: 0 },
            {
              y: "0%",
              rotate: 0,
              opacity: 1,
              duration: 1.05,
              stagger: 0.05,
              ease: "power4.out",
              scrollTrigger: {
                trigger: content,
                start: "top 75%",
              },
            }
          );
        }

        gsap.fromTo(
          content.querySelectorAll(".hw-portrait-card, .hw-action-cta"),
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: content,
              start: "top 65%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleWords = ["Rooted", "in", "handwoven", "textiles."];

  return (
    <section
      ref={sectionRef}
      className="horizontal-words-section content-section"
    >
      {/* ─── Preserved Background Ornaments ─── */}
      <div className="horizontal-words__corner-left">
        <img src="/assets/Asset 1.svg" alt="Botanical Line Art" />
      </div>
      <div className="horizontal-words__corner-right">स</div>

      {/* ─── Preserved SVG Frame for Traveling Image ─── */}
      <svg className="horizontal-words__frame" viewBox="0 0 240 330">
        <rect
          className="section-frame-path"
          x="5"
          y="5"
          width="230"
          height="320"
          rx="8"
          fill="none"
          stroke="#3d2b1f"
          strokeWidth="1.5"
        />
      </svg>

      {/* ─── Elegant Editorial Content with Text Linearity ─── */}
      <div
        ref={contentRef}
        className="hw-content-wrapper"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1200px",
          height: "100%",
          margin: "0 auto",
          padding: "36px 24px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header with Kinetic Word Animation */}
        <div
          style={{ textAlign: "center", maxWidth: "800px", marginBottom: "4px" }}
          className="hw-editorial-item"
        >
          <h2
            style={{
              fontSize: "clamp(24px, 3.8vw, 42px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#111827",
              margin: 0,
              overflow: "hidden",
            }}
          >
            {titleWords.map((word, wIdx) => (
              <span
                key={wIdx}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "top",
                  marginRight: "0.26em",
                }}
              >
                <span
                  className="hw-title-word"
                  style={{ display: "inline-block", transformOrigin: "bottom left" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* Center Slot for Traveling Image & Mobile Portrait Card */}
        <div className="hw-story-grid">
          <div className="hw-center-slot" aria-hidden="true">
            {/* Center Static Portrait Card (MOBILE ONLY) */}
            <div className="hw-portrait-card">
              <img
                src="/assets/homepage/14887305-5caf-4e77-b3fa-c79443ced34b.png"
                alt="Artisan Handspinning Pure Khadi"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action CTA */}
        <div
          className="hw-editorial-item hw-action-cta"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            textAlign: "center",
          }}
        >
          <Link
            href="/fabric"
            style={{
              background: "#111827",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "99px",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.5px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              transition: "transform 0.15s ease",
            }}
          >
            <span>Meet the Fabric</span>
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
