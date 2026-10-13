"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/app/styles/our-story.css";
import IndianArchBadge from "./IndianArchBadge";
import { FiArrowRight } from "react-icons/fi";

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

const BELIEF_PAIRS = [
  { left: "Room", right: "Restriction" },
  { left: "Function", right: "Fuss" },
  { left: "Personality", right: "Template" },
  { left: "Repeat", right: "Replace" },
];

const JOURNEY = [
  {
    label: "SPUN",
    image: "/assets/homepage/14887305-5caf-4e77-b3fa-c79443ced34b.png",
    caption: "Yarn by hand on the charkha.",
  },
  {
    label: "WOVEN",
    image: "/assets/khadi.jpg",
    caption: "Pit loom. Human rhythm.",
  },
  {
    label: "SOURCED",
    image: "/assets/homepage/IMG_3721.JPG",
    caption: "Cloth chosen with care.",
  },
  {
    label: "DESIGNED",
    image: "/assets/homepage/IMG_5069%20(1).JPG",
    caption: "Easy silhouettes, honest cuts.",
  },
  {
    label: "CUT",
    image: "/assets/homepage/c6aa1e50-2390-4fe4-b79e-fcf044fe17ca.jpg",
    caption: "Measured and shaped by hand.",
  },
  {
    label: "STITCHED",
    image: "/assets/homepage/IMG_7669.JPG",
    caption: "Women tailors, piece by piece.",
  },
  {
    label: "WORN",
    image: "/assets/homepage/IMG_1046.JPG",
    caption: "Then it becomes yours.",
  },
];

export default function OurStoryClient() {
  const containerRef = useRef(null);
  const [journeyIdx, setJourneyIdx] = useState(0);
  const [beliefIdx, setBeliefIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setJourneyIdx((i) => (i + 1) % JOURNEY.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const bId = setInterval(() => {
      setBeliefIdx((i) => (i + 1) % BELIEF_PAIRS.length);
    }, 2400);
    return () => clearInterval(bId);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTl.fromTo(
        ".os-hero-badge",
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.8)" },
      );

      heroTl.fromTo(
        ".os-hero-title .os-anim-word",
        { y: "135%", rotate: 4, opacity: 0 },
        { y: "0%", rotate: 0, opacity: 1, duration: 1.1, stagger: 0.05 },
        "-=0.4",
      );

      heroTl.fromTo(
        ".os-hero-para",
        { opacity: 0, y: 28, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.12 },
        "-=0.5",
      );

      heroTl.fromTo(
        ".os-hero-cta",
        { opacity: 0, y: 20, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        "-=0.5",
      );

      heroTl.fromTo(
        ".os-hero-visual",
        { opacity: 0, scale: 0.9, y: 45, rotateY: 5 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateY: 0,
          duration: 1.3,
          ease: "power3.out",
        },
        "-=1.0",
      );

      const blocks = containerRef.current?.querySelectorAll(".os-anim-block");
      blocks?.forEach((block) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 83%",
          },
        });

        const badge = block.querySelector(".os-block-badge");
        if (badge) {
          tl.fromTo(
            badge,
            { opacity: 0, y: -16, scale: 0.85 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.6)",
            },
          );
        }

        const titleWords = block.querySelectorAll(
          ".os-block-title .os-anim-word",
        );
        if (titleWords.length > 0) {
          tl.fromTo(
            titleWords,
            { y: "130%", rotate: 3, opacity: 0 },
            {
              y: "0%",
              rotate: 0,
              opacity: 1,
              duration: 0.95,
              stagger: 0.04,
              ease: "power4.out",
            },
            "-=0.3",
          );
        }

        const textItems = block.querySelectorAll(".os-text-item");
        if (textItems.length > 0) {
          tl.fromTo(
            textItems,
            { opacity: 0, y: 26, filter: "blur(3px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.85,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.4",
          );
        }

        const cards = block.querySelectorAll(".os-astaka-card");
        if (cards.length > 0) {
          tl.fromTo(
            cards,
            { opacity: 0, y: 40, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.5",
          );
        }

        const imageBoxes = block.querySelectorAll(".os-image-box");
        if (imageBoxes.length > 0) {
          tl.fromTo(
            imageBoxes,
            { opacity: 0, scale: 0.92, y: 35 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.0,
              stagger: 0.12,
              ease: "power3.out",
            },
            "-=0.6",
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

      {/* ─── LEFT SIDE REPEATING PATTERN IMAGE (bgele2.png, SLIM & LOW OPACITY) ─── */}
      <div
        className="side-pattern-decor"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "24px",
          backgroundImage: 'url("/assets/bgele2.png")',
          backgroundRepeat: "repeat-y",
          backgroundPosition: "left top",
          backgroundSize: "24px auto",
          opacity: 0.12,
          pointerEvents: "none",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* ─── RIGHT SIDE REPEATING PATTERN IMAGE (bgele2.png, MIRRORED, SLIM & LOW OPACITY) ─── */}
      <div
        className="side-pattern-decor"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "24px",
          backgroundImage: 'url("/assets/bgele2.png")',
          backgroundRepeat: "repeat-y",
          backgroundPosition: "left top",
          backgroundSize: "24px auto",
          transform: "scaleX(-1)",
          opacity: 0.12,
          pointerEvents: "none",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* ─── HERO ─── */}
      <section
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "clamp(120px, 14vw, 150px) clamp(24px, 4vw, 48px) 80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Centered Hero Masthead */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 840,
            margin: "0 auto 48px",
          }}
        >
          <div className="os-hero-badge" style={{ display: "inline-block", marginBottom: "18px" }}>
            <IndianArchBadge>
              Why Sum
            </IndianArchBadge>
          </div>

          <h1
            className="os-hero-title"
            style={{
              fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)",
              lineHeight: 1.22,
              fontWeight: 600,
              fontFamily: "serif",
              color: "#1a140e",
              margin: "0 auto 16px",
              maxWidth: 780,
            }}
          >
            <AnimatedWords text="Sum is a sum of people, ideas, skills, places, techniques." />
          </h1>

          <p
            className="os-hero-para"
            style={{
              margin: "0 auto 28px",
              fontWeight: 700,
              fontFamily: "serif",
              color: "#660608",
              fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
            }}
          >
            And eventually, you.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#why-sum-exists"
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

        <div className="os-hero-visual" style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
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
                  src="/assets/homepage/WhatsApp Image 2026-10-05 at 2.13.53 PM.jpeg"
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
        </section>

      {/* ─── SECTION 01 — WHY SUM EXISTS ─── */}
      <section
        id="why-sum-exists"
        className="os-anim-block"
        style={{
          maxWidth: 980,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="os-block-badge">
          <IndianArchBadge style={{ marginBottom: "16px" }}>
            Why Sum Exists
          </IndianArchBadge>
        </div>
        <h2
          className="os-block-title"
          style={{
            fontFamily: "serif",
            fontSize: "clamp(2rem, 3.2vw, 2.7rem)",
            fontWeight: 600,
            color: "#1a140e",
            margin: "0 0 24px",
            lineHeight: 1.22,
          }}
        >
          <AnimatedWords text="We wanted more room in our clothes." />
        </h2>
        <div
          style={{
            fontSize: "1.08rem",
            lineHeight: 1.85,
            color: "#3f3329",
          }}
        >
          <div
            className="os-text-item"
            style={{
              borderLeft: "2.5px solid #660608",
              paddingLeft: 20,
              margin: "0 0 24px",
              color: "#2a1f14",
              fontWeight: 500,
            }}
          >
            <p style={{ margin: "4px 0" }}>Room for bodies to change.</p>
            <p style={{ margin: "4px 0" }}>Room for personalities to show.</p>
            <p style={{ margin: "4px 0" }}>
              Room for work, travel, errands and whatever came after.
            </p>
          </div>
          <p className="os-text-item" style={{ margin: "0 0 18px" }}>
            So instead of making clothes for one kind of woman or one kind of
            day, we started making pieces that could move between them.
          </p>
          <p
            className="os-text-item"
            style={{
              margin: 0,
              fontWeight: 700,
              color: "#1a140e",
              fontSize: "1.15rem",
              fontFamily: "serif",
            }}
          >
            Simple. Easy. Made for real days.
          </p>
        </div>
      </section>

      {/* ─── SECTION 02 — WHERE IT STARTED ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 880,
          margin: "0 auto 90px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 56,
          textAlign: "center",
        }}
      >
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
            margin: "0 0 24px",
            lineHeight: 1.22,
          }}
        >
          <AnimatedWords text="It started with wanting better everyday clothes." />
        </h2>
        <div
          style={{
            fontSize: "1.08rem",
            lineHeight: 1.85,
            color: "#3f3329",
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          <p className="os-text-item" style={{ margin: "0 0 12px" }}>
            Not another trend.
          </p>
          <p className="os-text-item" style={{ margin: "0 0 12px" }}>
            Not another outfit waiting for an occasion.
          </p>
          <p className="os-text-item" style={{ margin: "0 0 20px" }}>
            Just clothes that felt good, worked hard and still left enough room
            for the person wearing them to show through.
          </p>
          <p
            className="os-text-item"
            style={{
              margin: 0,
              fontStyle: "italic",
              fontFamily: "serif",
              fontSize: "1.3rem",
              color: "#1a140e",
              fontWeight: 500,
            }}
          >
            That&apos;s where Sum began.
          </p>
        </div>
      </section>

      {/* ─── THE PEOPLE OF SUM (Highlighted Pattern Background Card) ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1140,
          margin: "0 auto 80px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: 880,
            margin: "0 auto 36px",
            padding: "44px clamp(20px, 4vw, 40px)",
            borderRadius: 24,
            border: "1.5px solid rgba(102, 6, 8, 0.22)",
            backgroundColor: "#FAF6F0",
            backgroundImage: 'url("/assets/751.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 18px 45px -12px rgba(44, 32, 22, 0.12)",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          {/* Subtle translucent parchment overlay for high contrast text readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(250, 246, 240, 0.92)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="os-block-badge">
              <IndianArchBadge style={{ marginBottom: "14px" }}>
                The People of Sum
              </IndianArchBadge>
            </div>
            <h2
              className="os-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)",
                color: "#1a140e",
                margin: "0 0 20px",
                lineHeight: 1.25,
              }}
            >
              <AnimatedWords text="Before there is a garment, there are people." />
            </h2>
            <p
              className="os-text-item"
              style={{
                fontSize: "1.06rem",
                lineHeight: 1.85,
                color: "#3f3329",
                margin: "0 0 20px",
              }}
            >
              A Sum piece passes through human hands at almost every possible
              stage.
            </p>
            <div
              className="os-text-item"
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.9,
                color: "#660608",
                fontFamily: "serif",
                fontStyle: "italic",
              }}
            >
              <p style={{ margin: "4px 0" }}>From fibre to fabric.</p>
              <p style={{ margin: "4px 0" }}>From an idea to a pattern.</p>
              <p style={{ margin: "4px 0" }}>From cutting to stitching.</p>
              <p style={{ margin: "4px 0" }}>From us to you.</p>
            </div>
          </div>
        </div>

        <div
          className="os-people-strip"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginTop: 36,
          }}
        >
          {[
            {
              src: "/assets/homepage/14887305-5caf-4e77-b3fa-c79443ced34b.png",
              tag: "Spinner",
            },
            {
              src: "/assets/homepage/IMG_3720.JPG",
              tag: "Weaver",
            },
            {
              src: "/assets/homepage/c6aa1e50-2390-4fe4-b79e-fcf044fe17ca.jpg",
              tag: "Tailor",
            },
            {
              src: "/assets/homepage/WhatsApp Image 2026-10-05 at 2.13.58 PM (1).jpeg",
              tag: "Wearer",
            },
          ].map((img) => (
            <div
              key={img.tag}
              className="os-image-box"
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.14)",
                aspectRatio: "3/4",
              }}
            >
              <img
                src={img.src}
                alt={img.tag}
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
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "20px 12px 10px",
                  background:
                    "linear-gradient(to top, rgba(26,20,14,0.72), transparent)",
                  color: "#EDE8DC",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {img.tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE ARTISANS ─── */}
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
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "clamp(36px, 5vw, 56px)",
            alignItems: "center",
          }}
        >
          <div>
            <div className="os-block-badge">
              <IndianArchBadge style={{ marginBottom: "14px" }}>
                The Artisans
              </IndianArchBadge>
            </div>
            <h2
              className="os-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)",
                color: "#1a140e",
                margin: "0 0 18px",
                lineHeight: 1.22,
              }}
            >
              <AnimatedWords text="They make the cloth." />
            </h2>
            <div
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.85,
                color: "#3f3329",
              }}
            >
              <p className="os-text-item" style={{ margin: "0 0 14px" }}>
                Spinners and weavers turn fibre into fabric through skill,
                rhythm and time.
              </p>
              <p
                className="os-text-item"
                style={{
                  margin: 0,
                  fontStyle: "italic",
                  fontFamily: "serif",
                  color: "#660608",
                }}
              >
                Every metre carries small variations — traces of the hands that
                made it.
              </p>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div
              className="os-image-box"
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.14)",
              }}
            >
              <img
                src="/assets/homepage/IMG_1046.JPG"
                alt="Spinners and weavers making the cloth"
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
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.14)",
              }}
            >
              <img
                src="/assets/homepage/WhatsApp Image 2026-10-05 at 2.14.11 PM (4).jpeg"
                alt="Weaving rhythm and artisan technique"
                className="os-image-hover"
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE FOUNDER ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1140,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 56,
        }}
      >
        <div
          className="os-editorial-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.85fr 1.15fr",
            gap: "clamp(32px, 5vw, 56px)",
            alignItems: "center",
          }}
        >
          <div className="os-founder-visual" style={{ position: "relative" }}>
            <div
              className="os-image-box"
              style={{
                position: "relative",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.16)",
                boxShadow: "0 22px 48px -18px rgba(44, 32, 22, 0.22)",
                aspectRatio: "4/5",
              }}
            >
              <img
                src="/assets/homepage/WhatsApp Image 2026-03-16 at 2.54.57 PM.jpeg"
                alt="Aditi Singh — founder, Sum Clothico"
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
                    "linear-gradient(to top, rgba(26,20,14,0.55) 0%, transparent 50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  bottom: 16,
                  color: "#EDE8DC",
                  fontFamily: "serif",
                }}
              >
                <div
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    color: "#D4C4A8",
                    marginBottom: 4,
                  }}
                >
                  Rewa, Madhya Pradesh
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700 }}>
                  Aditi Singh
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="os-block-badge">
              <IndianArchBadge style={{ marginBottom: "14px" }}>
                The Founder
              </IndianArchBadge>
            </div>
            <div
              className="os-text-item"
              style={{
                fontFamily: "serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#1a140e",
                margin: "0 0 4px",
              }}
            >
              Aditi Singh
            </div>
            <div
              className="os-text-item"
              style={{
                fontSize: "0.95rem",
                color: "#660608",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 700,
                margin: "0 0 24px",
              }}
            >
              Founder, Sum Clothico
            </div>
            <h2
              className="os-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                color: "#1a140e",
                margin: "0 0 22px",
                lineHeight: 1.25,
              }}
            >
              <AnimatedWords text="She asks what the cloth could become." />
            </h2>
            <div
              style={{
                fontSize: "1.06rem",
                lineHeight: 1.85,
                color: "#3f3329",
              }}
            >
              <p className="os-text-item" style={{ margin: "0 0 14px" }}>
                Years spent in marketing, brand building and understanding how
                people choose eventually turned into building a brand of her
                own.
              </p>
              <p className="os-text-item" style={{ margin: "0 0 18px" }}>
                Started in Rewa, Sum grew from a very personal question:
              </p>
              <p
                className="os-text-item"
                style={{
                  margin: "0 0 18px",
                  fontWeight: 700,
                  color: "#1a140e",
                  fontFamily: "serif",
                  fontSize: "1.15rem",
                }}
              >
                Could everyday clothing feel more like the women actually
                wearing it?
              </p>
              <p className="os-text-item" style={{ margin: "0 0 28px" }}>
                And the search began for better cloth, easier silhouettes and a
                different way of making.
              </p>
              <blockquote
                className="os-text-item"
                style={{
                  borderLeft: "3px solid #660608",
                  paddingLeft: 20,
                  margin: 0,
                  fontStyle: "italic",
                  fontFamily: "serif",
                  fontSize: "1.25rem",
                  color: "#660608",
                  lineHeight: 1.5,
                }}
              >
                “I didn&apos;t want to make more clothes. I wanted to make
                clothes we&apos;d actually want to live in.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE WOMEN WHO MAKE SUM ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1140,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 56,
        }}
      >
        <div
          className="os-editorial-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: "clamp(36px, 5vw, 56px)",
            alignItems: "center",
          }}
        >
          <div className="os-image-box" style={{ maxWidth: 440, margin: "0 auto", width: "100%" }}>
            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.16)",
                boxShadow: "0 20px 45px -14px rgba(44, 32, 22, 0.18)",
                aspectRatio: "4/5",
              }}
            >
              <img
                src="/assets/homepage/c6aa1e50-2390-4fe4-b79e-fcf044fe17ca.jpg"
                alt="Master women tailors crafting Sum garments"
                className="os-image-hover"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>

          <div>
            <div className="os-block-badge">
              <IndianArchBadge style={{ marginBottom: "14px" }}>
                The Women Who Make Sum
              </IndianArchBadge>
            </div>
            <h2
              className="os-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                color: "#1a140e",
                margin: "0 0 20px",
                lineHeight: 1.25,
              }}
            >
              <AnimatedWords text="They turn the idea into something you can wear." />
            </h2>
            <div
              className="os-text-item"
              style={{
                fontFamily: "serif",
                fontSize: "1.08rem",
                color: "#660608",
                margin: "0 0 20px",
                lineHeight: 1.8,
              }}
            >
              <p style={{ margin: "2px 0" }}>Measuring.</p>
              <p style={{ margin: "2px 0" }}>Cutting.</p>
              <p style={{ margin: "2px 0" }}>Pinning.</p>
              <p style={{ margin: "2px 0" }}>Stitching.</p>
              <p style={{ margin: "2px 0" }}>Finishing.</p>
            </div>
            <p
              className="os-text-item"
              style={{
                fontSize: "1.04rem",
                lineHeight: 1.85,
                color: "#3f3329",
                margin: "0 0 18px",
              }}
            >
              Our women tailors bring every silhouette to life with skill,
              precision and the understanding that comes only from making with
              your hands.
            </p>
            <p
              className="os-text-item"
              style={{
                margin: 0,
                fontWeight: 700,
                color: "#1a140e",
                fontFamily: "serif",
                fontSize: "1.15rem",
              }}
            >
              Made by women, for women — one piece at a time.
            </p>
          </div>
        </div>
      </section>

      {/* ─── AND THEN, YOU ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 880,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 56,
          textAlign: "center",
        }}
      >
        <div className="os-block-badge">
          <IndianArchBadge style={{ marginBottom: "14px" }}>
            And Then, You
          </IndianArchBadge>
        </div>

        <div
          className="os-image-box"
          style={{
            position: "relative",
            maxWidth: 520,
            margin: "0 auto 28px",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(44, 32, 22, 0.14)",
            aspectRatio: "4/3",
            boxShadow: "0 18px 40px -14px rgba(44, 32, 22, 0.18)",
          }}
        >
          <img
            src="/assets/homepage/IMG_1040.JPG"
            alt="A Sum garment worn"
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
                "linear-gradient(to top, rgba(26,20,14,0.5) 0%, transparent 55%)",
            }}
          />
        </div>

        <h2
          className="os-block-title"
          style={{
            fontFamily: "serif",
            fontSize: "clamp(2rem, 3.6vw, 3rem)",
            color: "#1a140e",
            margin: 0,
            lineHeight: 1.3,
            maxWidth: 760,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <AnimatedWords text="Thought by us. Shaped by many hands. Lived in by you." />
        </h2>
      </section>

      {/* ─── HUMAN-LED JOURNEY ─── */}
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
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="os-block-badge">
            <IndianArchBadge style={{ marginBottom: "14px" }}>
              Human-Led Journey
            </IndianArchBadge>
          </div>
        </div>
        <div className="mc-journey" style={{ margin: "0 auto 32px" }}>
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
        <p
          className="os-text-item"
          style={{
            textAlign: "center",
            fontWeight: 700,
            color: "#1a140e",
            fontFamily: "serif",
            fontSize: "1.1rem",
            margin: 0,
          }}
        >
          Handled by human hands, at almost every possible step.
        </p>
      </section>

      {/* ─── WHAT WE BELIEVE ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1140,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 56,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div className="os-block-badge">
            <IndianArchBadge style={{ marginBottom: "14px" }}>
              What We Believe
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

        {/* Single line with just the changing words — no buttons */}
        <div
          style={{
            position: "relative",
            maxWidth: 820,
            margin: "0 auto",
            padding: "54px 24px",
            background: "rgba(255, 255, 255, 0.72)",
            border: "1.5px solid rgba(102, 6, 8, 0.22)",
            borderRadius: 24,
            boxShadow: "0 20px 48px -16px rgba(44, 32, 22, 0.12)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(12px, 3.5vw, 40px)",
              flexWrap: "wrap",
            }}
          >
            <span
              key={`left-${beliefIdx}`}
              style={{
                fontFamily: "serif",
                fontSize: "clamp(2.1rem, 4.8vw, 3.8rem)",
                fontWeight: 700,
                color: "#1a140e",
                letterSpacing: "0.02em",
                animation: "osFadeUp 0.45s ease",
              }}
            >
              {BELIEF_PAIRS[beliefIdx].left}
            </span>

            <span
              style={{
                fontFamily: "serif",
                fontSize: "clamp(1.4rem, 2.8vw, 2.3rem)",
                fontWeight: 800,
                fontStyle: "italic",
                color: "#660608",
                background: "rgba(102, 6, 8, 0.08)",
                padding: "8px 22px",
                borderRadius: 99,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px dashed rgba(102, 6, 8, 0.4)",
              }}
            >
              Over
            </span>

            <span
              key={`right-${beliefIdx}`}
              style={{
                fontFamily: "serif",
                fontSize: "clamp(2.1rem, 4.8vw, 3.8rem)",
                fontWeight: 700,
                color: "#1a140e",
                letterSpacing: "0.02em",
                animation: "osFadeUp 0.45s ease",
              }}
            >
              {BELIEF_PAIRS[beliefIdx].right}
            </span>
          </div>
        </div>
      </section>

      {/* ─── WHERE WE'RE GOING ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 880,
          margin: "0 auto 100px",
          padding: "0 clamp(24px, 4vw, 48px)",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <div className="os-block-badge">
          <IndianArchBadge style={{ marginBottom: "14px" }}>
            Where We&apos;re Going
          </IndianArchBadge>
        </div>
        <h2
          className="os-block-title"
          style={{
            fontFamily: "serif",
            fontSize: "clamp(2rem, 3.5vw, 2.7rem)",
            color: "#1a140e",
            margin: "0 0 10px",
            lineHeight: 1.22,
          }}
        >
          <AnimatedWords text="Khadi is where we started." />
        </h2>
        <h3
          className="os-block-title"
          style={{
            fontFamily: "serif",
            fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
            color: "#660608",
            margin: "0 0 28px",
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
          <AnimatedWords text="Not where we're stopping." />
        </h3>
        <div
          style={{
            fontSize: "1.06rem",
            lineHeight: 1.85,
            color: "#4a3c30",
            marginBottom: 32,
          }}
        >
          <p className="os-text-item" style={{ margin: "0 0 14px" }}>
            We&apos;re slowly exploring handwoven textiles, techniques, people
            and places across India.
          </p>
          <p
            className="os-text-item"
            style={{
              margin: "0 0 6px",
              fontFamily: "serif",
              fontStyle: "italic",
              color: "#660608",
            }}
          >
            One textile at a time.
          </p>
          <p
            className="os-text-item"
            style={{
              margin: 0,
              fontFamily: "serif",
              fontStyle: "italic",
              color: "#660608",
            }}
          >
            One story at a time.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 8,
          }}
        >
          <Link
            href="/fabric"
            className="os-text-item"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#660608",
              color: "#EDE8DC",
              padding: "14px 30px",
              borderRadius: 99,
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(102, 6, 8, 0.25)",
            }}
          >
            Follow the Fabric <FiArrowRight />
          </Link>
          <Link
            href="/journal"
            className="os-text-item"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              color: "#1a140e",
              border: "1.5px solid #1a140e",
              padding: "14px 30px",
              borderRadius: 99,
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Read the Journal
          </Link>
        </div>
      </section>

      {/* ─── VISION ─── */}
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
            fontSize: "1.12rem",
            lineHeight: 1.8,
            color: "#4a3c30",
            maxWidth: 680,
            margin: "0 auto 36px",
          }}
        >
          <p className="os-text-item" style={{ marginBottom: 18 }}>
            We&apos;re building a space where textiles, people and everyday
            clothing come together beyond trends.
          </p>
          <p
            className="os-text-item"
            style={{
              margin: "24px 0 0",
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: "1.35rem",
              color: "#660608",
              fontWeight: 600,
            }}
          >
            Thoughtful. Human. Sum.
          </p>
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
