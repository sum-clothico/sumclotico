"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowRight } from "react-icons/fi";
import IndianArchBadge from "@/components/IndianArchBadge";

gsap.registerPlugin(ScrollTrigger);

export default function PeopleHomeSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = sectionRef.current;
      if (!el) return;

      const fades = el.querySelectorAll(".fade-up");
      fades.forEach((target) => {
        gsap.fromTo(
          target,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: target,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="people-story"
      style={{
        background: "var(--bg-color, #EDE8DC)",
        padding: "100px 24px 100px",
        position: "relative",
        borderTop: "1px solid rgba(44, 32, 22, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 50,
            alignItems: "center",
          }}
        >
          {/* Left: Text & CTA */}
          <div className="fade-up">
            <IndianArchBadge style={{ marginBottom: "16px" }}>The Human Hands</IndianArchBadge>
            <h2
              style={{
                fontSize: "clamp(30px, 4.4vw, 48px)",
                fontFamily: "var(--font-serif, 'Epilogue', sans-serif)",
                fontWeight: 700,
                color: "#2C2016",
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
                margin: "0 0 20px",
              }}
            >
              Made by people, for people.
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 1.6vw, 16px)",
                color: "#5C4A3E",
                lineHeight: 1.7,
                margin: "0 0 28px",
              }}
            >
              Behind every Sum piece are the hands, skills and decisions that bring it to life.
              From sourcing to stitching, every step is part of the story.
            </p>

            <Link
              href="/our-story#people"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: "none",
                background: "#2C2016",
                color: "#FAF6F0",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.background = "#660608";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#2C2016";
              }}
            >
              <span>Meet the People</span>
              <FiArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Artisanal Photo Showcase Collage */}
          <div
            className="fade-up"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              position: "relative",
            }}
          >
            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                aspectRatio: "3 / 4",
                boxShadow: "0 8px 24px rgba(44, 32, 22, 0.08)",
                border: "1px solid rgba(44, 32, 22, 0.1)",
              }}
            >
              <img
                src="/assets/bharatpur-spinners.jpg"
                alt="Charkha Spinners of Bharatpur"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                aspectRatio: "3 / 4",
                marginTop: 32,
                boxShadow: "0 8px 24px rgba(44, 32, 22, 0.08)",
                border: "1px solid rgba(44, 32, 22, 0.1)",
              }}
            >
              <img
                src="/assets/bharatpur-weaver.png"
                alt="Master Weaver on Traditional Loom"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Indian Border Pattern Divider Band (Full-Bleed Across Screen) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "28px",
          backgroundImage: 'url("/assets/footerpattern-accent.png")',
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center",
          backgroundSize: "auto 26px",
          opacity: 0.85,
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden="true"
      />
    </section>
  );
}
