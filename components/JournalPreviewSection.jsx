"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowRight, FiBookOpen, FiMessageCircle, FiClock } from "react-icons/fi";
import IndianArchBadge from "@/components/IndianArchBadge";

gsap.registerPlugin(ScrollTrigger);

const FEATURED_STORIES = [
  {
    id: "bharatpur-weavers",
    category: "PLACES",
    title: "The Handlooms of Bharatpur: Walking Through Madhya Pradesh's Weaving Villages",
    excerpt:
      "A morning spent among wooden frame looms, listening to the rhythm of shuttles and the artisans who turn raw cotton into living cloth.",
    image: "/assets/wev.jpg",
    readTime: "4 min read",
    author: "Sum Field Notes",
    tagColor: "#B85741", // Rich terracotta from client swatch
  },
  {
    id: "khadi-museum",
    category: "CLOTH",
    title: "Inside The Khadi Museum: Living Archives of Slow Time",
    excerpt:
      "From charkha revolutions to contemporary wardrobes — why the simplest textile in human history remains our most radical act of living.",
    image: "/assets/chakra.jpg",
    readTime: "5 min read",
    author: "Textile Archives",
    tagColor: "#6A6E4F", // Olive / Sage from client swatch
  },
  {
    id: "everyday-women",
    category: "PEOPLE",
    title: "Real Living: How Women Wear Sum from Morning Coffee to Slow Evenings",
    excerpt:
      "Conversations with architects, ceramicists, and writers on why clothes should feel lighter, softer, and more honest with every passing season.",
    image: "/assets/img/20.png",
    readTime: "6 min read",
    author: "Community Stories",
    tagColor: "#BD793A", // Warm Ochre from client swatch
  },
];

export default function JournalPreviewSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // Dynamic Word-by-word Reveal for Main Heading
      const words = section.querySelectorAll(".jp-heading-word");
      if (words.length > 0) {
        gsap.fromTo(
          words,
          { y: "120%", rotate: 3, opacity: 0 },
          {
            y: "0%",
            rotate: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          }
        );
      }

      // Subtitle Reveal
      const desc = section.querySelector(".jp-desc");
      if (desc) {
        gsap.fromTo(
          desc,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            delay: 0.25,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          }
        );
      }

      // Staggered Cards Reveal with subtle scale and spring
      const cards = section.querySelectorAll(".jp-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 45, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.0,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section.querySelector(".jp-cards-container"),
              start: "top 80%",
            },
          }
        );
      }

      // Bottom Banner Reveal
      const banner = section.querySelector(".jp-banner");
      if (banner) {
        gsap.fromTo(
          banner,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: banner,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headingWords = ["Things", "worth", "talking", "about."];

  return (
    <section
      ref={sectionRef}
      id="home-journal"
      style={{
        background: "var(--bg-color, #EDE8DC)",
        padding: "100px 24px 110px",
        position: "relative",
        borderTop: "1px solid rgba(44, 32, 22, 0.08)",
        borderBottom: "1px solid rgba(44, 32, 22, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto 56px" }}>
          <IndianArchBadge style={{ marginBottom: 18 }}>
            <FiBookOpen size={13} color="#ffffff" />
            <span>The Sum Journal</span>
          </IndianArchBadge>

          {/* Expressive Masked Word Reveal Heading */}
          <h2
            style={{
              fontSize: "clamp(30px, 4.5vw, 48px)",
              fontWeight: 800,
              color: "#1A1714",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "0 0 16px",
              fontFamily: "var(--font-serif, inherit)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.28em",
            }}
          >
            {headingWords.map((word, idx) => (
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
                  className="jp-heading-word"
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

          <p
            className="jp-desc"
            style={{
              fontSize: "clamp(15px, 1.4vw, 17px)",
              color: "#5C554E",
              lineHeight: 1.65,
              margin: "0 auto",
              maxWidth: 640,
            }}
          >
            Clothes are rarely just clothes. They carry memories. They tell us where we&apos;ve been.
            They introduce us to people and places. And sometimes, they make us feel like ourselves again.
          </p>
        </div>

        {/* Stories Container — ASTAKA Scalloped Corner Cards */}
        <div
          className="jp-cards-container"
          style={{
            display: "flex",
            gap: 24,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 16,
            marginBottom: 48,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {FEATURED_STORIES.map((story) => (
            <Link
              key={story.id}
              href="/journal"
              className="jp-card"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                flex: "1 1 320px",
                minWidth: 290,
                scrollSnapAlign: "start",
                position: "relative",
                padding: "10px 10px 18px",
                background: "transparent",
                borderRadius: "0",
                boxShadow: "none",
                transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* SVG ASTAKA Scalloped Corner Card Framing with Inner Accent Hairline */}
              <svg
                viewBox="0 0 380 520"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                aria-hidden="true"
              >
                {/* Outer Silhouette — Top Scalloped Ears, Bottom Smooth Rounded Corners */}
                <path
                  d="M 34,0 L 346,0 L 346,6 A 28 28 0 0 0 374 34 L 380 34 L 380 498 A 22 22 0 0 1 358 520 L 22 520 A 22 22 0 0 1 0 498 L 0 34 L 6 34 A 28 28 0 0 0 34 6 L 34 0 Z"
                  fill="#FAF6F0"
                  stroke="rgba(44, 32, 22, 0.18)"
                  strokeWidth="1.5"
                />
                {/* Inner Accent Hairline — Matching Rounded Bottom */}
                <path
                  d="M 38,10 L 342,10 L 342,14 A 24 24 0 0 0 366 38 L 370 38 L 370 494 A 16 16 0 0 1 354 510 L 26 510 A 16 16 0 0 1 10 494 L 10 38 L 14 38 A 24 24 0 0 0 38 14 L 38 10 Z"
                  fill="none"
                  stroke="#660608"
                  strokeWidth="1"
                  strokeOpacity="0.32"
                />
              </svg>

              {/* Card Image Banner — Mounted plate look */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  background: "#EBE5D9",
                  overflow: "hidden",
                  borderRadius: "4px",
                  zIndex: 1,
                }}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transition: "transform 0.5s ease",
                    filter: "sepia(0.04) contrast(1.02)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />

                {/* Category Pill */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "rgba(250, 246, 240, 0.94)",
                    backdropFilter: "blur(6px)",
                    color: story.tagColor,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(44, 32, 22, 0.1)",
                  }}
                >
                  {story.category}
                </div>
              </div>

              {/* Card Content */}
              <div
                style={{
                  padding: "16px 14px 10px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 12,
                      color: "#8C7868",
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    <span>{story.author}</span>
                    <span>•</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <FiClock size={12} />
                      {story.readTime}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#2C2016",
                      lineHeight: 1.35,
                      margin: "0 0 8px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {story.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 13.5,
                      color: "#6B5A4E",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {story.excerpt}
                  </p>
                </div>

                {/* Read Link */}
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(44, 32, 22, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#2C2016",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <span>Read Article</span>
                  <FiArrowRight size={15} color="#660608" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Section Bottom Actions / Community Hook — ASTAKA Royal Placard Frame */}
        <div
          className="jp-banner"
          style={{
            position: "relative",
            padding: "36px 44px",
            background: "transparent",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            boxShadow: "none",
          }}
        >
          {/* SVG Placard with Stepped Scalloped Corners and Inner Hairline Border */}
          <svg
            viewBox="0 0 1192 200"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 0,
            }}
            aria-hidden="true"
          >
            {/* Outer Silhouette */}
            <path
              d="M 32,0 L 1160,0 L 1160,6 A 26 26 0 0 0 1186 32 L 1192 32 L 1192 168 L 1186 168 A 26 26 0 0 0 1160 194 L 1160 200 L 32 200 L 32 194 A 26 26 0 0 0 6 168 L 0 168 L 0 32 L 6 32 A 26 26 0 0 0 32 6 L 32 0 Z"
              fill="#FAF6F0"
              stroke="rgba(44, 32, 22, 0.2)"
              strokeWidth="1.5"
            />
            {/* Inner Accent Hairline */}
            <path
              d="M 36,10 L 1156,10 L 1156,14 A 22 22 0 0 0 1178 36 L 1182 36 L 1182 164 L 1178 164 A 22 22 0 0 0 1156 186 L 1156 190 L 36 190 L 36 186 A 22 22 0 0 0 14 164 L 10 164 L 10 36 L 14 36 A 22 22 0 0 0 36 14 L 36 10 Z"
              fill="none"
              stroke="#660608"
              strokeWidth="1"
              strokeOpacity="0.38"
            />
          </svg>

          <div style={{ maxWidth: 580, position: "relative", zIndex: 1 }}>
            <IndianArchBadge style={{ marginBottom: 12 }}>
              <span>Clothes have stories. We&apos;d like to hear yours.</span>
            </IndianArchBadge>
            <h4
              style={{
                fontSize: "clamp(20px, 2.5vw, 26px)",
                fontWeight: 800,
                color: "#2C2016",
                margin: "0 0 10px",
                letterSpacing: "-0.02em",
              }}
            >
              Before it becomes your clothes, it passes through many hands.
            </h4>
            <p style={{ fontSize: 14, color: "#6B5A4E", margin: 0, lineHeight: 1.65 }}>
              A textile from your hometown. A garment you still remember. A place
              we should visit. Or simply something you&apos;d like to tell us.
            </p>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", position: "relative", zIndex: 1 }}>
            <Link
              href="/journal"
              style={{
                background: "#660608", // Accent #660608 CTA button
                color: "#FAF6F0",
                padding: "14px 28px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "background 0.2s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4d0406";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#660608";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span>Enter The Journal</span>
              <FiArrowRight size={15} />
            </Link>

            <Link
              href="/contact"
              style={{
                background: "#EBE5D9",
                color: "#2C2016",
                padding: "14px 24px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid rgba(44, 32, 22, 0.15)",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#DFD7C8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#EBE5D9")}
            >
              <FiMessageCircle size={15} />
              <span>Share Something</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
