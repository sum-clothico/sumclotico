"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/horizontal-words.css";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_PIN_DISTANCE = 1300;

export default function HorizontalWords() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = sectionRef.current;
      const content = contentRef.current;

      // Pin the section while the story and traveling image reveal
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${TOTAL_PIN_DISTANCE}`,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        refreshPriority: 2,
      });

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

      // Content elements smooth stagger entrance
      if (content) {
        gsap.fromTo(
          content.querySelectorAll(".hw-editorial-item"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 60%",
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

      {/* ─── Elegant Editorial Content ─── */}
      <div
        ref={contentRef}
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
        {/* Top Header */}
        <div
          style={{ textAlign: "center", maxWidth: "800px", marginBottom: "8px" }}
          className="hw-editorial-item"
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#f35c27",
              display: "inline-block",
              marginBottom: "8px",
            }}
          >
            The Beginning of the Journey
          </span>
          <h2
            style={{
              fontSize: "clamp(24px, 3.8vw, 42px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#111827",
              margin: 0,
            }}
          >
            Rooted in handwoven textiles.
          </h2>
        </div>

        {/* Flanking Story Columns (Left & Right of the Central Portrait Frame) */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 280px 1fr",
            gap: "24px",
            alignItems: "center",
            margin: "auto 0",
          }}
        >
          {/* Left Column Narrative */}
          <div
            className="hw-editorial-item"
            style={{
              textAlign: "right",
              paddingRight: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <p
              style={{
                fontSize: "clamp(14px, 1.4vw, 17px)",
                lineHeight: 1.65,
                color: "#374151",
                margin: 0,
                fontWeight: 500,
              }}
            >
              We start with the cloth.
            </p>
            <p
              style={{
                fontSize: "clamp(13px, 1.2vw, 15px)",
                lineHeight: 1.6,
                color: "#6b7280",
                margin: 0,
              }}
            >
              We're exploring handwoven textiles from across India — beginning
              close to home.
            </p>
          </div>

          {/* Center spacer — dedicated for the SVG Frame & Traveling Image */}
          <div style={{ minHeight: "330px" }} aria-hidden="true" />

          {/* Right Column Narrative */}
          <div
            className="hw-editorial-item"
            style={{
              textAlign: "left",
              paddingLeft: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* <p
              style={{
                fontSize: "clamp(14px, 1.4vw, 17px)",
                lineHeight: 1.65,
                color: "#374151",
                margin: 0,
                fontWeight: 500,
              }}
            >
              The way the yarn is spun. The way the loom moves at human rhythm.
            </p> */}
            <p
              style={{
                fontSize: "clamp(13px, 1.2vw, 15px)",
                lineHeight: 1.6,
                color: "#111827",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Currently: Khadi Cotton · Madhya Pradesh
            </p>
          </div>
        </div>

        {/* Bottom Location & Action CTA */}
        <div
          className="hw-editorial-item"
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
