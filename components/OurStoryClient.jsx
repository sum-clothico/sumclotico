"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/app/styles/our-story.css";
import IndianArchBadge from "./IndianArchBadge";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

function AnimatedWords({ text, className = "os-anim-word" }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
            marginRight: i === words.length - 1 ? 0 : "0.26em",
          }}
        >
          <span className={className} style={{ display: "inline-block" }}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

function AstakaCardSvg({ fill = "#EDE8DC" }) {
  return (
    <svg
      viewBox="0 0 280 290"
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
      <path
        d="M 24,0 L 256,0 L 256,4 A 20 20 0 0 0 276 24 L 280 24 L 280 274 A 16 16 0 0 1 264 290 L 16 290 A 16 16 0 0 1 0 274 L 0 24 L 4 24 A 20 20 0 0 0 24 4 L 24 0 Z"
        fill={fill}
        stroke="rgba(44, 32, 22, 0.18)"
        strokeWidth="1.5"
      />
      <path
        d="M 28,8 L 252,8 L 252,10 A 16 16 0 0 0 268 26 L 272 26 L 272 270 A 12 12 0 0 1 260 282 L 20 282 A 12 12 0 0 1 8 270 L 8 26 L 12 26 A 16 16 0 0 0 28 10 L 28 8 Z"
        fill="none"
        stroke="#660608"
        strokeWidth="1"
        strokeOpacity="0.32"
      />
    </svg>
  );
}

const WHY_SUM_PILLARS = [
  {
    step: "01",
    title: "Easy Silhouettes",
    desc: "Unrestricted cuts that drape gracefully and let you move naturally through any day.",
  },
  {
    step: "02",
    title: "Useful Details",
    desc: "Functional deep pockets, reinforced stitches, and thoughtful buttons built for purpose.",
  },
  {
    step: "03",
    title: "Comfortable Shapes",
    desc: "Designed to breathe on your skin, never pinch or constrict, with gentle ease.",
  },
  {
    step: "04",
    title: "Living Colours",
    desc: "Subtle, earth-inspired hues that age beautifully and blend effortlessly into your wardrobe.",
  },
  {
    step: "05",
    title: "Wear It Your Way",
    desc: "Versatile staples that leave room for your own identity and adapt across seasons.",
  },
];

const BELIEFS = [
  {
    num: "01",
    title: "Clothes Should Be Lived In",
    desc: "A beautiful garment that stays hung in a wardrobe isn't doing much. We design for repeat wears, real days, and the pieces you reach for instinctively.",
  },
  {
    num: "02",
    title: "Comfort Is Not a Compromise",
    desc: "You shouldn't have to choose between feeling comfortable and looking put together. We create both in every single seam and silhouette.",
  },
  {
    num: "03",
    title: "Good Design Doesn't Need to Shout",
    desc: "We prioritize thoughtful details over loud trends. A pocket where your hand naturally rests. A sleeve that moves. Silhouettes that give you breathing room.",
  },
  {
    num: "04",
    title: "Know Where It Begins",
    desc: "A garment has a rich life before it reaches you. We honor that provenance — the artisan, the loom, the community, and the slow, honest craft.",
  },
];

const WOMEN_ARCHETYPES = [
  {
    title: "Ambitious & Tired",
    subtitle: "Focus by day, pure ease by evening",
    desc: "Pushing boundaries in whatever they do, wanting clothes that look sharp yet offer soft sanctuary when the long day ends.",
  },
  {
    title: "Minimal & Colourful",
    subtitle: "Clean cuts, intentional soul",
    desc: "Unfussy silhouettes paired with deliberate, rich textile personality and natural handwoven depth.",
  },
  {
    title: "Serious & Ridiculous",
    subtitle: "Commanding in meetings, free with friends",
    desc: "Poised and articulate in demanding rooms, completely uninhibited, warm, and laughing loudly with their closest people.",
  },
];

export default function OurStoryClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─── HERO CINEMATIC ANIMATIONS ───
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Badge pop
      heroTl.fromTo(
        ".os-hero-badge",
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.8)" }
      );

      // Headline masked words roll-in
      heroTl.fromTo(
        ".os-hero-title .os-anim-word",
        { y: "135%", rotate: 4, opacity: 0 },
        { y: "0%", rotate: 0, opacity: 1, duration: 1.1, stagger: 0.05 },
        "-=0.4"
      );

      // Quote border draw and quote text reveal
      heroTl.fromTo(
        ".os-quote-border",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 0.75, ease: "power2.out" },
        "-=0.5"
      );
      heroTl.fromTo(
        ".os-quote-text .os-anim-word",
        { y: "125%", rotate: 3, opacity: 0 },
        { y: "0%", rotate: 0, opacity: 1, duration: 0.95, stagger: 0.035 },
        "-=0.6"
      );

      // Paragraph lines staggered reveal
      heroTl.fromTo(
        ".os-hero-para",
        { opacity: 0, y: 28, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.12 },
        "-=0.5"
      );

      // Dual buttons
      heroTl.fromTo(
        ".os-hero-cta",
        { opacity: 0, y: 20, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.4)" },
        "-=0.5"
      );

      // Hero Right Framed Visual
      heroTl.fromTo(
        ".os-hero-visual",
        { opacity: 0, scale: 0.9, y: 45, rotateY: 5 },
        { opacity: 1, scale: 1, y: 0, rotateY: 0, duration: 1.3, ease: "power3.out" },
        "-=1.0"
      );

      // ─── SCROLLTRIGGER ANIMATION FOR EACH STORY SECTION ───
      const blocks = containerRef.current?.querySelectorAll(".os-anim-block");
      blocks?.forEach((block) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 83%",
          },
        });

        // Badge
        const badge = block.querySelector(".os-block-badge");
        if (badge) {
          tl.fromTo(
            badge,
            { opacity: 0, y: -16, scale: 0.85 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.6)" }
          );
        }

        // Section Title Words
        const titleWords = block.querySelectorAll(".os-block-title .os-anim-word");
        if (titleWords.length > 0) {
          tl.fromTo(
            titleWords,
            { y: "130%", rotate: 3, opacity: 0 },
            { y: "0%", rotate: 0, opacity: 1, duration: 0.95, stagger: 0.04, ease: "power4.out" },
            "-=0.3"
          );
        }

        // Narrative text items
        const textItems = block.querySelectorAll(".os-text-item");
        if (textItems.length > 0) {
          tl.fromTo(
            textItems,
            { opacity: 0, y: 26, filter: "blur(3px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, stagger: 0.1, ease: "power3.out" },
            "-=0.4"
          );
        }

        // ASTAKA Cards Stagger Entrance with slight tilt
        const cards = block.querySelectorAll(".os-astaka-card");
        if (cards.length > 0) {
          tl.fromTo(
            cards,
            { opacity: 0, y: 40, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.08, ease: "power3.out" },
            "-=0.5"
          );
        }

        // Imagery
        const imageBoxes = block.querySelectorAll(".os-image-box");
        if (imageBoxes.length > 0) {
          tl.fromTo(
            imageBoxes,
            { opacity: 0, scale: 0.92, y: 35 },
            { opacity: 1, scale: 1, y: 0, duration: 1.0, stagger: 0.12, ease: "power3.out" },
            "-=0.6"
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="our-story-page"
      style={{
        position: "relative",
        backgroundColor: "#EDE8DC",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div className="os-noise" />

      {/* ─── SIDE REPEATING BORDERS (BOUNDED WITHIN CONTENT, NEVER RUNNING INTO FOOTER) ─── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "48px",
          backgroundImage: 'url("/assets/bgele2.png")',
          backgroundRepeat: "repeat-y",
          backgroundPosition: "left top",
          backgroundSize: "48px auto",
          opacity: 0.28,
          pointerEvents: "none",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "48px",
          backgroundImage: 'url("/assets/bgele2.png")',
          backgroundRepeat: "repeat-y",
          backgroundPosition: "left top",
          backgroundSize: "48px auto",
          transform: "scaleX(-1)",
          opacity: 0.28,
          pointerEvents: "none",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* ─── HERO SECTION: EDITORIAL TWO-COLUMN ─── */}
      <section
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "clamp(120px, 14vw, 150px) clamp(24px, 4vw, 48px) 80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="os-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "clamp(40px, 6vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Left Column: Headline & Manifesto */}
          <div>
            <div className="os-hero-badge">
              <IndianArchBadge style={{ marginBottom: "20px" }}>
                Our Story
              </IndianArchBadge>
            </div>

            <h1
              className="os-hero-title"
              style={{
                fontSize: "clamp(2.3rem, 4vw, 3.5rem)",
                lineHeight: 1.16,
                fontWeight: 500,
                fontFamily: "serif",
                color: "#1a140e",
                margin: "0 0 20px",
              }}
            >
              <AnimatedWords text="We started with a simple question:" />
            </h1>

            <div
              style={{
                position: "relative",
                paddingLeft: "20px",
                margin: "0 0 24px",
              }}
            >
              <div
                className="os-quote-border"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  backgroundColor: "#660608",
                }}
              />
              <div
                className="os-quote-text"
                style={{
                  fontFamily: "serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
                  lineHeight: 1.45,
                  color: "#660608",
                }}
              >
                <AnimatedWords text="Why can't everyday clothes feel as flowy as air, as warm as earth and as easy as water?" />
              </div>
            </div>

            <div
              style={{
                fontSize: "1.06rem",
                lineHeight: 1.85,
                color: "#4a3c30",
                marginBottom: "32px",
              }}
            >
              <p className="os-hero-para" style={{ margin: "0 0 6px", fontWeight: 600, color: "#2a1f14" }}>
                Not louder. Not trendier. Just more considered.
              </p>
              <p className="os-hero-para" style={{ margin: "0 0 16px" }}>
                Clothes that feel good on your skin, make sense in your wardrobe and carry a little more thought in every detail.
              </p>
              <p className="os-hero-para" style={{ margin: 0, fontWeight: 700, color: "#1a140e", fontSize: "1.12rem" }}>
                That&apos;s where Sum Clothico began.
              </p>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a
                href="#where-it-started"
                className="os-hero-cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#660608",
                  color: "#EDE8DC",
                  padding: "14px 28px",
                  borderRadius: 99,
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(102, 6, 8, 0.25)",
                }}
              >
                Read Our Journey <FiArrowRight />
              </a>
              <Link
                href="/fabric"
                className="os-hero-cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "transparent",
                  color: "#1a140e",
                  border: "1.5px solid rgba(26, 20, 14, 0.35)",
                  padding: "14px 28px",
                  borderRadius: 99,
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                The Fabric
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Frame */}
          <div className="os-hero-visual" style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                maxWidth: 440,
                margin: "0 auto",
                borderRadius: 20,
                padding: "12px",
                background: "rgba(255, 255, 255, 0.45)",
                border: "1px solid rgba(102, 6, 8, 0.15)",
                boxShadow: "0 22px 48px -18px rgba(44, 32, 22, 0.16)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/5",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <img
                  src="/assets/khadi.jpg"
                  alt="Sum Clothico Handwoven Textile"
                  className="os-image-hover"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(26, 20, 14, 0.72) 0%, rgba(26, 20, 14, 0.1) 45%, transparent 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 22,
                    left: 22,
                    right: 22,
                    color: "#EDE8DC",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#D4C4A8",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Handcrafted in India
                  </span>
                  <p
                    style={{
                      fontFamily: "serif",
                      fontSize: "1.12rem",
                      fontStyle: "italic",
                      margin: 0,
                      lineHeight: 1.35,
                    }}
                  >
                    Where every thread carries human patience and purpose.
                  </p>
                </div>
              </div>

              {/* Floating Pill Badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: -16,
                  right: -10,
                  background: "#EDE8DC",
                  border: "1.5px solid rgba(102, 6, 8, 0.28)",
                  borderRadius: 12,
                  padding: "10px 18px",
                  boxShadow: "0 10px 24px rgba(44, 32, 22, 0.14)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#660608",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "serif",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    color: "#1a140e",
                  }}
                >
                  100% Handspun Khadi
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHERE IT STARTED (TWO-COLUMN EDITORIAL) ─── */}
      <section
        id="where-it-started"
        className="os-anim-block"
        style={{
          maxWidth: 1140,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="os-editorial-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: "clamp(36px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Left: Artisan Hands Loom Image */}
          <div className="os-image-box" style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.16)",
                boxShadow: "0 18px 40px -12px rgba(44, 32, 22, 0.12)",
                aspectRatio: "4/3",
              }}
            >
              <img
                src="/assets/han.jpg"
                alt="Artisan hands weaving textile on handloom"
                className="os-image-hover"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            {/* Caption Card */}
            <div
              style={{
                marginTop: 14,
                padding: "12px 18px",
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: 12,
                border: "1px solid rgba(102, 6, 8, 0.12)",
                fontSize: "0.88rem",
                color: "#55483d",
                fontStyle: "italic",
                fontFamily: "serif",
                textAlign: "center",
              }}
            >
              “Before the cloth, there is the spinner, the weaver, the dyer, the maker.”
            </div>
          </div>

          {/* Right: Narrative */}
          <div>
            <div className="os-block-badge">
              <IndianArchBadge style={{ marginBottom: "16px" }}>
                Where It Started
              </IndianArchBadge>
            </div>
            <h2
              className="os-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(2rem, 3.2vw, 2.7rem)",
                fontWeight: 600,
                color: "#1a140e",
                margin: "0 0 20px",
                lineHeight: 1.22,
              }}
            >
              <AnimatedWords text="Made by Humans. For real lives." />
            </h2>
            <div style={{ fontSize: "1.04rem", lineHeight: 1.85, color: "#3f3329" }}>
              <p className="os-text-item" style={{ marginBottom: 14 }}>
                There was always something fascinating about the things we wear.
              </p>
              <div
                className="os-text-item"
                style={{
                  borderLeft: "2.5px solid #660608",
                  paddingLeft: 18,
                  margin: "18px 0",
                  color: "#2a1f14",
                  fontWeight: 500,
                }}
              >
                <p style={{ margin: "4px 0" }}>How a piece of cloth becomes a shirt.</p>
                <p style={{ margin: "4px 0" }}>How a thread becomes a textile.</p>
                <p style={{ margin: "4px 0" }}>
                  How something made by someone&apos;s hands eventually becomes part of someone else&apos;s everyday life.
                </p>
              </div>
              <p className="os-text-item" style={{ marginBottom: 14 }}>
                We wanted to get closer to that process. To understand where our textiles come from, who makes them, and what happens when we slow down enough to care about every step.
              </p>
              <p
                className="os-text-item"
                style={{
                  fontStyle: "italic",
                  fontFamily: "serif",
                  fontSize: "1.32rem",
                  color: "#660608",
                  margin: "24px 0 0",
                  fontWeight: 500,
                }}
              >
                And so, Sum began.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY SUM (5 PILLARS IN ASTAKA FRAMES) ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1140,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 44px" }}>
          <div className="os-block-badge">
            <IndianArchBadge style={{ marginBottom: "14px" }}>
              Why Sum
            </IndianArchBadge>
          </div>
          <h2
            className="os-block-title"
            style={{
              fontFamily: "serif",
              fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)",
              color: "#1a140e",
              margin: "0 0 16px",
              lineHeight: 1.25,
            }}
          >
            <AnimatedWords text="We wanted to make clothes differently. Not dramatically. Just thoughtfully." />
          </h2>
          <p
            className="os-text-item"
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              color: "#660608",
              fontStyle: "italic",
              fontFamily: "serif",
              margin: 0,
            }}
          >
            SUM is the coming together of heritage, modernity, functionality and individuality — just as every woman is the sum of many identities, experiences and possibilities.
          </p>
        </div>

        {/* 5 Thoughtful Pillars in ASTAKA Cards */}
        <div
          className="os-pillars-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {WHY_SUM_PILLARS.map((pillar) => (
            <div
              key={pillar.step}
              className="os-astaka-card"
              style={{
                position: "relative",
                padding: "28px 22px 24px",
                display: "flex",
                flexDirection: "column",
                minHeight: 210,
              }}
            >
              <AstakaCardSvg fill="#EDE8DC" />
              <div style={{ position: "relative", zIndex: 1 }}>
                <span
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 800,
                    color: "#660608",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  PILLAR {pillar.step}
                </span>
                <h3
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.18rem",
                    color: "#1a140e",
                    margin: "0 0 8px",
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    color: "#55483d",
                    margin: 0,
                  }}
                >
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          className="os-text-item"
          style={{
            fontWeight: 600,
            color: "#1a140e",
            fontSize: "1.08rem",
            textAlign: "center",
            margin: "24px 0 0",
          }}
        >
          Because the best clothes don&apos;t take over your life. They become part of it.
        </p>
      </section>

      {/* ─── WHAT WE BELIEVE (PHILOSOPHY — 4 COLUMNS) ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1140,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div className="os-block-badge">
            <IndianArchBadge style={{ marginBottom: "14px" }}>
              Philosophy
            </IndianArchBadge>
          </div>
          <h2
            className="os-block-title"
            style={{
              fontFamily: "serif",
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              color: "#1a140e",
              margin: 0,
            }}
          >
            <AnimatedWords text="What We Believe" />
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 28,
          }}
        >
          {BELIEFS.map((belief) => (
            <div
              key={belief.num}
              className="os-text-item"
              style={{
                borderTop: "2px solid #660608",
                paddingTop: 18,
                transition: "transform 0.3s ease",
              }}
            >
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  color: "#660608",
                  letterSpacing: "0.15em",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                {belief.num}
              </span>
              <h3
                style={{
                  fontFamily: "serif",
                  fontSize: "1.28rem",
                  color: "#1a140e",
                  margin: "0 0 10px",
                }}
              >
                {belief.title}
              </h3>
              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.68,
                  color: "#55483d",
                  margin: 0,
                }}
              >
                {belief.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE SOURCE: OUR RELATIONSHIP WITH TEXTILES ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1140,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="os-editorial-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <div className="os-block-badge">
              <IndianArchBadge style={{ marginBottom: "14px" }}>
                The Source
              </IndianArchBadge>
            </div>
            <h2
              className="os-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)",
                color: "#1a140e",
                margin: "0 0 18px",
                lineHeight: 1.22,
              }}
            >
              <AnimatedWords text="The garment is only one part of the story." />
            </h2>
            <div style={{ fontSize: "1.04rem", lineHeight: 1.8, color: "#443528" }}>
              <p className="os-text-item" style={{ marginBottom: 12 }}>
                We are building Sum around a deeper relationship with handwoven textiles.
              </p>
              <p className="os-text-item" style={{ marginBottom: 12 }}>
                Not because they&apos;re fashionable.
              </p>
              <p className="os-text-item" style={{ marginBottom: 18 }}>
                Because they carry something that mass production often leaves behind — time, place, skill and character.
              </p>
              <p className="os-text-item" style={{ fontWeight: 600, color: "#1a140e", marginBottom: 20 }}>
                We&apos;re starting with Khadi cotton from Madhya Pradesh.
              </p>
              <div
                className="os-text-item"
                style={{
                  borderLeft: "2.5px solid #660608",
                  paddingLeft: 14,
                  marginBottom: 24,
                  fontSize: "0.88rem",
                  color: "#6e5d4e",
                }}
              >
                <span>Official Documentation & Archive: </span>
                <a
                  href="https://sidhi.nic.in/en/document/bharatpur-handicrafts-success-story/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#660608",
                    fontWeight: 700,
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  Bharatpur Handicrafts Success Story <FiExternalLink size={12} />
                </a>
              </div>
              <p
                className="os-text-item"
                style={{
                  fontStyle: "italic",
                  fontFamily: "serif",
                  fontSize: "1.25rem",
                  color: "#660608",
                  marginBottom: 26,
                }}
              >
                And this is only the beginning.
              </p>
              <Link
                href="/fabric"
                className="os-text-item"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#1a140e",
                  color: "#EDE8DC",
                  padding: "14px 28px",
                  borderRadius: 99,
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "background 0.2s ease",
                }}
              >
                Explore Our Fabric <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Handloom Visual Collage */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="os-image-box" style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(44, 32, 22, 0.14)" }}>
              <img
                src="/assets/fabric.jpg"
                alt="Khadi Cotton Textile"
                className="os-image-hover"
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div className="os-image-box" style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(44, 32, 22, 0.14)" }}>
              <img
                src="/assets/wev.jpg"
                alt="Artisan Weaving on Handloom"
                className="os-image-hover"
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div
              className="os-image-box"
              style={{
                gridColumn: "span 2",
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.14)",
              }}
            >
              <img
                src="/assets/clt.jpg"
                alt="Khadi Garment Tailoring"
                className="os-image-hover"
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE WOMEN OF SUM ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1140,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ borderTop: "1px solid rgba(44, 32, 22, 0.14)", paddingTop: 48 }}>
          <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto 36px" }}>
            <div className="os-block-badge">
              <IndianArchBadge style={{ marginBottom: "14px" }}>
                Community
              </IndianArchBadge>
            </div>
            <h2
              className="os-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)",
                color: "#1a140e",
                margin: "0 0 16px",
              }}
            >
              <AnimatedWords text="Made for women. Shaped by women." />
            </h2>
            <p
              className="os-text-item"
              style={{
                fontSize: "1.06rem",
                lineHeight: 1.85,
                color: "#3f3329",
                margin: "0 0 12px",
              }}
            >
              Sum brings together different hands, experiences, skills and perspectives to create clothes that feel like they belong to the women who wear them.
            </p>
            <p
              className="os-text-item"
              style={{
                fontSize: "1.06rem",
                lineHeight: 1.85,
                color: "#3f3329",
                margin: 0,
              }}
            >
              We don&apos;t believe there is one version of the modern woman.
            </p>
          </div>

          {/* 3 Archetype Cards in ASTAKA Frames */}
          <div
            className="os-archetype-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              margin: "36px 0",
            }}
          >
            {WOMEN_ARCHETYPES.map((arch) => (
              <div
                key={arch.title}
                className="os-astaka-card"
                style={{
                  position: "relative",
                  padding: "32px 26px 26px",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 220,
                }}
              >
                <AstakaCardSvg fill="#EDE8DC" />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      color: "#660608",
                      letterSpacing: "0.14em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    THE SUM WOMAN
                  </span>
                  <h3
                    style={{
                      fontFamily: "serif",
                      fontSize: "1.32rem",
                      color: "#1a140e",
                      margin: "0 0 6px",
                    }}
                  >
                    {arch.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                      color: "#660608",
                      marginBottom: 10,
                      fontFamily: "serif",
                    }}
                  >
                    {arch.subtitle}
                  </div>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      lineHeight: 1.65,
                      color: "#55483d",
                      margin: 0,
                    }}
                  >
                    {arch.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p
            className="os-text-item"
            style={{
              fontWeight: 600,
              color: "#1a140e",
              fontSize: "1.15rem",
              textAlign: "center",
              margin: "32px 0 0",
              fontFamily: "serif",
              fontStyle: "italic",
            }}
          >
            Her clothes should have room for all of it.
          </p>
        </div>
      </section>

      {/* ─── WHAT WE'RE BUILDING (VISION & SHOP CTA) ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 880,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="os-block-badge">
          <IndianArchBadge style={{ marginBottom: "14px" }}>
            Vision
          </IndianArchBadge>
        </div>
        <h2
          className="os-block-title"
          style={{
            fontFamily: "serif",
            fontSize: "clamp(2.1rem, 3.8vw, 3.1rem)",
            color: "#1a140e",
            margin: "0 0 20px",
            lineHeight: 1.2,
          }}
        >
          <AnimatedWords text="This is bigger than a collection." />
        </h2>
        <div
          style={{
            fontSize: "1.06rem",
            lineHeight: 1.85,
            color: "#4a3c30",
            maxWidth: 700,
            margin: "0 auto 36px",
          }}
        >
          <p className="os-text-item" style={{ marginBottom: 10 }}>
            We&apos;re slowly building a brand around clothing, textiles, people and stories.
          </p>
          <p className="os-text-item" style={{ marginBottom: 10 }}>
            We want to discover handwoven textiles from different parts of India.
          </p>
          <p className="os-text-item" style={{ marginBottom: 10 }}>
            Meet the people behind them.
          </p>
          <p className="os-text-item" style={{ marginBottom: 10 }}>
            Bring those textiles into contemporary wardrobes.
          </p>
          <p className="os-text-item" style={{ marginBottom: 24 }}>
            And create a space where the conversation around clothing goes beyond what is trending.
          </p>
          <div
            className="os-text-item"
            style={{
              borderTop: "1px solid rgba(44, 32, 22, 0.14)",
              paddingTop: 24,
              fontStyle: "italic",
              fontFamily: "serif",
              fontSize: "1.28rem",
              color: "#1a140e",
            }}
          >
            <p style={{ margin: "4px 0" }}>We&apos;re still figuring it out.</p>
            <p style={{ margin: "4px 0" }}>But we know how we want it to feel.</p>
            <p style={{ margin: "8px 0", fontWeight: 700, color: "#660608" }}>
              Thoughtful. Human. Easy. And entirely Sum.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/fabric"
            className="os-text-item"
            style={{
              padding: "14px 30px",
              borderRadius: 99,
              background: "transparent",
              color: "#1a140e",
              border: "1.5px solid #1a140e",
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.25s ease",
            }}
          >
            Explore the Fabric
          </Link>
          <Link
            href="/shop"
            className="os-text-item"
            style={{
              padding: "14px 30px",
              borderRadius: 99,
              background: "#660608",
              color: "#EDE8DC",
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(102, 6, 8, 0.25)",
              transition: "all 0.25s ease",
            }}
          >
            Shop the Pieces
          </Link>
        </div>
      </section>
    </div>
  );
}
