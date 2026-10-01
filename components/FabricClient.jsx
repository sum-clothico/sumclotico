"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/fabric.css";
import IndianArchBadge from "./IndianArchBadge";
import {
  FiArrowRight,
  FiMapPin,
  FiShoppingBag,
  FiBookOpen,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

function AnimatedWords({ text, className = "fab-anim-word" }) {
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

export default function FabricClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─── 1. HERO CINEMATIC ANIMATIONS ───
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTl.fromTo(
        ".fab-hero-badge",
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.8)" }
      );

      heroTl.fromTo(
        ".fab-hero-title .fab-anim-word",
        { y: "135%", rotate: 4, opacity: 0 },
        { y: "0%", rotate: 0, opacity: 1, duration: 1.1, stagger: 0.05 },
        "-=0.4"
      );

      heroTl.fromTo(
        ".fab-hero-sub .fab-anim-word",
        { y: "125%", rotate: 3, opacity: 0 },
        { y: "0%", rotate: 0, opacity: 1, duration: 0.95, stagger: 0.035 },
        "-=0.6"
      );

      // ─── 2. SCROLL-TRIGGERED ANIMATIONS FOR ALL SUBSEQUENT SECTIONS ───
      const animBlocks = containerRef.current?.querySelectorAll(".fab-anim-block");
      animBlocks?.forEach((block) => {
        // Badges pop-in
        const badges = block.querySelectorAll(".fab-block-badge");
        badges.forEach((badge) => {
          gsap.fromTo(
            badge,
            { opacity: 0, y: -16, scale: 0.85 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              ease: "back.out(1.8)",
              scrollTrigger: {
                trigger: badge,
                start: "top 88%",
              },
            }
          );
        });

        // Block Titles: Word-by-word roll up
        const titles = block.querySelectorAll(".fab-block-title");
        titles.forEach((title) => {
          const words = title.querySelectorAll(".fab-anim-word");
          if (words.length > 0) {
            gsap.fromTo(
              words,
              { y: "130%", rotate: 3, opacity: 0 },
              {
                y: "0%",
                rotate: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.04,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: title,
                  start: "top 88%",
                },
              }
            );
          }
        });

        // Text Items: Smooth fade-up + de-blur
        const textItems = block.querySelectorAll(".fab-text-item");
        textItems.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 24, filter: "blur(3px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
              },
            }
          );
        });

        // Image Reveals: Scale up + fade in + crisp settling
        const imageReveals = block.querySelectorAll(".fab-image-reveal");
        imageReveals.forEach((imgWrap) => {
          gsap.fromTo(
            imgWrap,
            { opacity: 0, scale: 0.92, y: 32 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.05,
              ease: "power3.out",
              scrollTrigger: {
                trigger: imgWrap,
                start: "top 86%",
              },
            }
          );
        });

        // Astaka Step Cards: Staggered sequence
        const astakaCards = block.querySelectorAll(".fab-astaka-card");
        if (astakaCards.length > 0) {
          gsap.fromTo(
            astakaCards,
            { opacity: 0, y: 45, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.15,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: astakaCards[0],
                start: "top 85%",
              },
            }
          );
        }

        // Compare & Feature & Sustainability & Evolve Columns
        const cols = block.querySelectorAll(
          ".fab-compare-col, .fab-feature-col, .fab-sus-col, .fab-evolve-col"
        );
        if (cols.length > 0) {
          gsap.fromTo(
            cols,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cols[0],
                start: "top 85%",
              },
            }
          );
        }

        // Pills & CTA buttons
        const pills = block.querySelectorAll(".fab-pill-anim");
        pills.forEach((pill) => {
          gsap.fromTo(
            pill,
            { opacity: 0, scale: 0.88, y: 16 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.7,
              ease: "back.out(1.6)",
              scrollTrigger: {
                trigger: pill,
                start: "top 90%",
              },
            }
          );
        });

        // Placard Outer Frame
        const placards = block.querySelectorAll(".fab-placard-anim");
        placards.forEach((placard) => {
          gsap.fromTo(
            placard,
            { opacity: 0, scale: 0.94, y: 30 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: placard,
                start: "top 86%",
              },
            }
          );
        });
      });

      // Recalculate positions after DOM paints
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => clearTimeout(timer);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#EDE8DC",
      }}
    >
      <div
        className="fabric-page"
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          backgroundColor: "#EDE8DC",
        }}
      >
        {/* ─── LEFT SIDE REPEATING PATTERN IMAGE (bgele2.png) ─── */}
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

        {/* ─── RIGHT SIDE REPEATING PATTERN IMAGE (bgele2.png, MIRRORED) ─── */}
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

        {/* ─── HERO = THE SOURCE ─── */}
        <section
          className="fab-hero"
          style={{
            padding: "120px 24px 72px",
            maxWidth: 1200,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            className="fab-hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              gap: "clamp(32px, 5vw, 56px)",
              alignItems: "center",
            }}
          >
            <div>
              <div className="fab-hero-badge">
                <IndianArchBadge style={{ marginBottom: "18px" }}>
                  The Source
                </IndianArchBadge>
              </div>
              <h1
                className="fab-hero-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                  fontWeight: 500,
                  lineHeight: 1.18,
                  color: "#1a140e",
                  margin: "0 0 24px",
                }}
              >
                <AnimatedWords text="The garment is only one part of the story." />
              </h1>
              <div
                className="fab-hero-sub"
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  color: "#4a3c30",
                }}
              >
                <p style={{ margin: "0 0 12px" }}>
                  <AnimatedWords text="We are building Sum around a deeper relationship with handwoven textiles." />
                </p>
                <p style={{ margin: "0 0 12px" }}>
                  <AnimatedWords text="Not because they're fashionable." />
                </p>
                <p style={{ margin: "0 0 18px" }}>
                  <AnimatedWords text="Because they carry something that mass production often leaves behind — time, place, skill and character." />
                </p>
                <p
                  style={{
                    margin: 0,
                    fontStyle: "italic",
                    fontFamily: "serif",
                    fontSize: "1.15rem",
                    color: "#660608",
                  }}
                >
                  <AnimatedWords text="And behind the textile, there is a place, a process and a whole lot of human work." />
                </p>
              </div>
            </div>

            <div
              className="fab-hero-visual"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                className="fab-image-reveal"
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                  boxShadow: "0 18px 40px -14px rgba(44, 32, 22, 0.18)",
                }}
              >
                <img
                  src="/assets/chakra.jpg"
                  alt="Woman spinning yarn on charkha"
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div
                className="fab-image-reveal"
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                  boxShadow: "0 18px 40px -14px rgba(44, 32, 22, 0.18)",
                }}
              >
                <img
                  src="/assets/han.jpg"
                  alt="Hands weaving khadi on loom"
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── OUR STARTING POINT (SEAMLESS EDITORIAL) ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 1080,
            margin: "0 auto 80px",
            padding: "0 clamp(24px, 4vw, 56px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 50,
              alignItems: "center",
            }}
          >
            <div>
              <div className="fab-block-badge">
                <IndianArchBadge style={{ marginBottom: "14px" }}>
                  Our Starting Point
                </IndianArchBadge>
              </div>
              <h2
                className="fab-block-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)",
                  fontWeight: 600,
                  color: "#1a140e",
                  margin: "0 0 18px",
                }}
              >
                <AnimatedWords text="We're starting with Khadi." />
              </h2>
              <div
                style={{
                  fontSize: "1.04rem",
                  lineHeight: 1.8,
                  color: "#4a3c30",
                }}
              >
                <div className="fab-text-item">
                  <p style={{ marginBottom: 14 }}>
                    Khadi has been part of India&apos;s textile story for
                    generations.
                  </p>
                  <p style={{ marginBottom: 16 }}>
                    What draws us to it isn&apos;t simply its history. It&apos;s
                    the way it is made.
                  </p>
                </div>
                <div
                  className="fab-text-item"
                  style={{
                    borderLeft: "2.5px solid #660608",
                    paddingLeft: 18,
                    margin: "20px 0",
                    color: "#2a1f14",
                    fontSize: "0.98rem",
                  }}
                >
                  <p style={{ margin: "6px 0" }}>✦ The irregularity.</p>
                  <p style={{ margin: "6px 0" }}>✦ The texture.</p>
                  <p style={{ margin: "6px 0" }}>✦ The airiness.</p>
                  <p style={{ margin: "6px 0" }}>
                    ✦ The feeling of something made slowly by hands.
                  </p>
                </div>
                <div className="fab-text-item">
                  <p
                    style={{
                      fontStyle: "italic",
                      fontFamily: "serif",
                      fontSize: "1.2rem",
                      color: "#1a140e",
                      margin: "20px 0 24px",
                    }}
                  >
                    For Sum, Khadi cotton is where this journey begins.
                  </p>
                </div>

                {/* Location Marker */}
                <div className="fab-pill-anim" style={{ display: "inline-block" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      background: "#1a140e",
                      color: "#FAF6F0",
                      padding: "10px 22px",
                      borderRadius: 99,
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    <FiMapPin size={15} color="#e8a87c" />
                    <span>KHADI COTTON · MADHYA PRADESH, INDIA</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="fab-image-reveal"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "4/3",
                background: "#e8dfd0",
                border: "1px solid rgba(44, 32, 22, 0.12)",
              }}
            >
              <img
                src="/assets/fabric.jpg"
                alt="Khadi Handspun Cotton Weave"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </section>

        {/* ─── WHAT MAKES IT DIFFERENT ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 1080,
            margin: "0 auto 80px",
            padding: "0 clamp(24px, 4vw, 56px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="fab-block-badge">
              <IndianArchBadge style={{ marginBottom: "14px" }}>
                What Makes It Different
              </IndianArchBadge>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                title: "Hand-Spun",
                desc: "Tiny variations leave room between the threads.",
              },
              {
                title: "Handwoven",
                desc: "No two metres behave exactly alike.",
              },
              {
                title: "Breathable",
                desc: "Airy enough for everyday movement.",
              },
              {
                title: "Gets Better",
                desc: "The fabric softens as you live in it.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="fab-text-item"
                style={{
                  borderTop: "2px solid #660608",
                  paddingTop: 16,
                }}
              >
                <h3
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#660608",
                    margin: "0 0 10px",
                    fontWeight: 800,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.98rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FROM COTTON TO CLOTH (PROCESS) ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 1080,
            margin: "0 auto 80px",
            padding: "0 clamp(24px, 4vw, 56px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="fab-block-badge">
              <IndianArchBadge style={{ marginBottom: "14px" }}>
                The Process
              </IndianArchBadge>
            </div>
            <h2
              className="fab-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 600,
                color: "#1a140e",
                margin: 0,
              }}
            >
              <AnimatedWords text="A lot happens before you put it on." />
            </h2>
          </div>

          {/* What is Khadi — Clean Editorial */}
          <div
            className="fab-text-item"
            style={{
              borderTop: "1.5px solid #660608",
              borderBottom: "1px solid rgba(44, 32, 22, 0.12)",
              padding: "32px 0",
              marginBottom: 50,
            }}
          >
            <span
              style={{
                fontSize: "0.74rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#660608",
                display: "block",
                marginBottom: 8,
              }}
            >
              Foundation
            </span>
            <h3
              className="fab-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                color: "#1a140e",
                margin: "0 0 14px",
              }}
            >
              <AnimatedWords text="What is Khadi?" />
            </h3>
            <p
              style={{
                fontSize: "1.08rem",
                lineHeight: 1.8,
                color: "#443528",
                marginBottom: 20,
              }}
            >
              Khadi is a fabric made from natural fibers like cotton, but what
              makes it special is how it is made.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 28,
                margin: "24px 0",
              }}
            >
              <div
                className="fab-compare-col"
                style={{ borderLeft: "2.5px solid #660608", paddingLeft: 18 }}
              >
                <strong
                  style={{
                    color: "#660608",
                    display: "block",
                    marginBottom: 6,
                    fontSize: "1.05rem",
                    fontFamily: "serif",
                  }}
                >
                  ✦ Hand-spun
                </strong>
                <span
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: "#55483D",
                  }}
                >
                  Thread made by hand using the traditional charkha.
                </span>
              </div>
              <div
                className="fab-compare-col"
                style={{ borderLeft: "2.5px solid #660608", paddingLeft: 18 }}
              >
                <strong
                  style={{
                    color: "#660608",
                    display: "block",
                    marginBottom: 6,
                    fontSize: "1.05rem",
                    fontFamily: "serif",
                  }}
                >
                  ✦ Handwoven
                </strong>
                <span
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: "#55483D",
                  }}
                >
                  Fabric made on wooden pit looms, never high-speed mass
                  machines.
                </span>
              </div>
            </div>
            <p
              style={{
                fontSize: "1.02rem",
                lineHeight: 1.7,
                color: "#660608",
                fontStyle: "italic",
                margin: "20px 0 0",
              }}
            >
              This means every thread has slight variations, and every fabric
              has its own character. It&apos;s not perfect and that&apos;s
              exactly the point.
            </p>
          </div>

          {/* 4 Steps: How Khadi Is Made — ASTAKA Scalloped Cards */}
          <div style={{ textAlign: "center", margin: "40px 0 30px" }}>
            <h3
              className="fab-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)",
                color: "#1a140e",
                margin: 0,
              }}
            >
              <AnimatedWords text="How Khadi Is Made (And Why That Changes Everything)" />
            </h3>
            <p
              className="fab-text-item"
              style={{
                fontFamily: "serif",
                fontSize: "1.12rem",
                fontWeight: 700,
                color: "#1a140e",
                margin: "16px 0 0",
                lineHeight: 1.5,
              }}
            >
              The irregularity isn&apos;t a flaw.
              <br />
              It&apos;s the hand in handwoven.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
              marginBottom: 70,
            }}
          >
            {/* Step 1 */}
            <div
              className="fab-astaka-card"
              style={{
                position: "relative",
                padding: "24px 20px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
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
                  fill="#FAF6F0"
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
              <div style={{ position: "relative", zIndex: 1 }}>
                <span
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    color: "#660608",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  STEP 01
                </span>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#1a140e",
                    margin: "0 0 10px",
                  }}
                >
                  Cotton
                </h4>
                <p
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                    margin: 0,
                  }}
                >
                  Raw cotton is gently cleaned, untangled and prepared by hand
                  for spinning.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className="fab-astaka-card"
              style={{
                position: "relative",
                padding: "24px 20px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
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
                  fill="#FAF6F0"
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
              <div style={{ position: "relative", zIndex: 1 }}>
                <span
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    color: "#660608",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  STEP 02
                </span>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#1a140e",
                    margin: "0 0 10px",
                  }}
                >
                  Spinning by Hand
                </h4>
                <p
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                    marginBottom: 10,
                  }}
                >
                  The cotton is turned into yarn using a charkha.
                </p>
                <div
                  style={{
                    borderTop: "1px solid rgba(44,32,22,0.1)",
                    paddingTop: 8,
                    fontSize: "0.84rem",
                    color: "#6e5d4e",
                  }}
                >
                  <strong style={{ color: "#1a140e", display: "block" }}>
                    Why it matters:
                  </strong>
                  Hand spinning creates tiny irregular gaps that allow air to
                  pass freely through the weave.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className="fab-astaka-card"
              style={{
                position: "relative",
                padding: "24px 20px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
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
                  fill="#FAF6F0"
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
              <div style={{ position: "relative", zIndex: 1 }}>
                <span
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    color: "#660608",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  STEP 03
                </span>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#1a140e",
                    margin: "0 0 10px",
                  }}
                >
                  Hand Weaving
                </h4>
                <p
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                    marginBottom: 10,
                  }}
                >
                  The yarn is woven on a pit loom by skilled artisans.
                </p>
                <div
                  style={{
                    borderTop: "1px solid rgba(44,32,22,0.1)",
                    paddingTop: 8,
                    fontSize: "0.84rem",
                    color: "#6e5d4e",
                  }}
                >
                  <strong style={{ color: "#1a140e", display: "block" }}>
                    Why it matters:
                  </strong>
                  No uniform machine pressure. The fabric feels softer, more
                  flexible, and less stiff.
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div
              className="fab-astaka-card"
              style={{
                position: "relative",
                padding: "24px 20px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
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
                  fill="#FAF6F0"
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
              <div style={{ position: "relative", zIndex: 1 }}>
                <span
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    color: "#660608",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  STEP 04
                </span>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#1a140e",
                    margin: "0 0 10px",
                  }}
                >
                  The Final Fabric
                </h4>
                <p
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                    margin: "0 0 8px",
                  }}
                >
                  What you get is a fabric that is:
                </p>
                <div
                  style={{
                    fontSize: "0.88rem",
                    color: "#1a140e",
                    fontWeight: 600,
                  }}
                >
                  <p style={{ margin: "3px 0" }}>✦ Alive with texture</p>
                  <p style={{ margin: "3px 0" }}>✦ Light on the skin</p>
                  <p style={{ margin: "3px 0" }}>✦ Made slowly, not in bulk</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── WHY CHOOSE KHADI OVER COTTON OR LINEN? ─── */}
          <div
            style={{
              borderTop: "1px solid rgba(44, 32, 22, 0.14)",
              paddingTop: 48,
              marginBottom: 70,
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: 680,
                margin: "0 auto 36px",
              }}
            >
              <div className="fab-block-badge">
                <IndianArchBadge style={{ marginBottom: "14px" }}>
                  Comparison
                </IndianArchBadge>
              </div>
              <h3
                className="fab-block-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 600,
                  color: "#1a140e",
                  margin: "0 0 12px",
                }}
              >
                <AnimatedWords text="Why Choose Khadi Over Cotton or Linen?" />
              </h3>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#6b5d52",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Most people think: &quot;Isn&apos;t this just cotton?&quot; Not
                really.
              </p>
            </div>

            <div
              className="fab-image-reveal fab-compare-strip"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                margin: "0 0 36px",
              }}
            >
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                }}
              >
                <img
                  src="/assets/fabric.jpg"
                  alt="Khadi weave"
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                }}
              >
                <img
                  src="/assets/ctn.jpg"
                  alt="Cotton weave"
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                }}
              >
                <img
                  src="/assets/khadi.jpg"
                  alt="Khadi texture"
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 36,
              }}
            >
              {/* Khadi vs Regular Cotton */}
              <div
                className="fab-compare-col"
                style={{ borderLeft: "2.5px solid #660608", paddingLeft: 22 }}
              >
                <span
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#660608",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Khadi vs Regular Cotton
                </span>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#1a140e",
                    margin: "0 0 8px",
                  }}
                >
                  Why Khadi feels cooler:
                </h4>
                <p
                  style={{
                    fontSize: "0.94rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                    marginBottom: 16,
                  }}
                >
                  Machine-made cotton is tightly packed and dense. Hand-spun
                  yarn creates continuous airflow → keeps you cooler for longer.
                </p>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#1a140e",
                    margin: "0 0 8px",
                  }}
                >
                  Why Khadi feels softer over time:
                </h4>
                <p
                  style={{
                    fontSize: "0.94rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                    margin: 0,
                  }}
                >
                  Regular cotton can stay the same or wear out. Khadi becomes
                  softer with every wash because the fibers relax naturally
                  without chemical degradation.
                </p>
              </div>

              {/* Khadi vs Linen */}
              <div
                className="fab-compare-col"
                style={{ borderLeft: "2.5px solid #660608", paddingLeft: 22 }}
              >
                <span
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#660608",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Khadi vs Linen
                </span>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#1a140e",
                    margin: "0 0 8px",
                  }}
                >
                  Why linen can feel rough:
                </h4>
                <p
                  style={{
                    fontSize: "0.94rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                    marginBottom: 16,
                  }}
                >
                  Linen fibers are naturally stiff and take weeks to break in.
                  Khadi is softer from the very start and adapts fluidly to
                  daily wear.
                </p>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#1a140e",
                    margin: "0 0 8px",
                  }}
                >
                  Why Khadi is easier to wear daily:
                </h4>
                <p
                  style={{
                    fontSize: "0.94rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                    margin: 0,
                  }}
                >
                  Linen wrinkles sharply and requires constant ironing.
                  Khadi&apos;s natural slub texture makes wrinkles look relaxed,
                  organic, and effortlessly beautiful.
                </p>
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: 36,
                borderTop: "1px solid rgba(44,32,22,0.1)",
                paddingTop: 22,
              }}
            >
              <p
                style={{
                  fontFamily: "serif",
                  fontSize: "1.15rem",
                  fontStyle: "italic",
                  color: "#660608",
                  margin: 0,
                }}
              >
                Simple truth: Khadi is not just about fiber. It&apos;s about the
                process, and that changes how it feels on your body.
              </p>
            </div>
          </div>

          {/* ─── WHY WE CHOSE IT ─── */}
          <div
            className="fab-anim-block"
            style={{
              borderTop: "1px solid rgba(44, 32, 22, 0.14)",
              paddingTop: 48,
              marginBottom: 70,
            }}
          >
            <div
              className="fab-why-we-chose-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "0.9fr 1.1fr",
                gap: "clamp(28px, 4vw, 48px)",
                alignItems: "center",
              }}
            >
              <div
                className="fab-image-reveal"
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                  boxShadow: "0 18px 40px -14px rgba(44, 32, 22, 0.18)",
                }}
              >
                <img
                  src="/assets/khadi.jpg"
                  alt="Khadi fabric close-up"
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div>
                <div className="fab-block-badge">
                  <IndianArchBadge style={{ marginBottom: "14px" }}>
                    Why We Chose It
                  </IndianArchBadge>
                </div>
                <h3
                  className="fab-block-title"
                  style={{
                    fontFamily: "serif",
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    fontWeight: 700,
                    color: "#660608",
                    margin: "0 0 24px",
                    lineHeight: 1.3,
                  }}
                >
                  <AnimatedWords text="Because you can feel the difference." />
                </h3>
                <div
                  style={{
                    fontSize: "1.06rem",
                    lineHeight: 1.85,
                    color: "#3f3329",
                  }}
                >
                  <p
                    className="fab-text-item"
                    style={{
                      margin: "0 0 14px",
                      fontFamily: "serif",
                      fontStyle: "italic",
                      color: "#1a140e",
                      fontSize: "1.15rem",
                    }}
                  >
                    Airy. Textured. Easy against the skin.
                  </p>
                  <p className="fab-text-item" style={{ margin: "0 0 10px" }}>
                    Khadi doesn&apos;t need to be perfectly uniform to be
                    beautiful.
                  </p>
                  <p
                    className="fab-text-item"
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      color: "#660608",
                      fontFamily: "serif",
                      fontSize: "1.2rem",
                    }}
                  >
                    Neither do we.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── WHY KHADI STILL MATTERS IN A FAST FASHION WORLD ─── */}
          <div
            style={{
              borderTop: "1px solid rgba(44, 32, 22, 0.14)",
              paddingTop: 48,
              marginBottom: 70,
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: 700,
                margin: "0 auto 30px",
              }}
            >
              <div className="fab-block-badge">
                <IndianArchBadge style={{ marginBottom: "14px" }}>
                  Reclaiming Pace
                </IndianArchBadge>
              </div>
              <h3
                className="fab-block-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 600,
                  color: "#1a140e",
                  margin: "0 0 14px",
                }}
              >
                <AnimatedWords text="Why Khadi Still Matters in a Fast Fashion World" />
              </h3>
              <p
                style={{
                  fontSize: "1.04rem",
                  lineHeight: 1.8,
                  color: "#4a3c30",
                  margin: 0,
                }}
              >
                Fast fashion is built on:{" "}
                <strong>Speed · Mass production · Uniformity</strong>. Khadi
                stands in complete contrast.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 28,
                margin: "30px 0",
              }}
            >
              <div className="fab-feature-col" style={{ borderTop: "1.5px solid #660608", paddingTop: 16 }}>
                <strong
                  style={{
                    color: "#1a140e",
                    display: "block",
                    marginBottom: 6,
                    fontSize: "1.05rem",
                    fontFamily: "serif",
                  }}
                >
                  ✦ Because it cannot be rushed
                </strong>
                <span
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                  }}
                >
                  Each piece takes time, which means less waste, intentional
                  making, and lasting value.
                </span>
              </div>
              <div className="fab-feature-col" style={{ borderTop: "1.5px solid #660608", paddingTop: 16 }}>
                <strong
                  style={{
                    color: "#1a140e",
                    display: "block",
                    marginBottom: 6,
                    fontSize: "1.05rem",
                    fontFamily: "serif",
                  }}
                >
                  ✦ People, not just machines
                </strong>
                <span
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                  }}
                >
                  Every step directly supports handloom artisan families and
                  preserves living traditions.
                </span>
              </div>
              <div className="fab-feature-col" style={{ borderTop: "1.5px solid #660608", paddingTop: 16 }}>
                <strong
                  style={{
                    color: "#1a140e",
                    display: "block",
                    marginBottom: 6,
                    fontSize: "1.05rem",
                    fontFamily: "serif",
                  }}
                >
                  ✦ Made in small quantities
                </strong>
                <span
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                    color: "#55483d",
                  }}
                >
                  Not thousands of identical pieces, but limited, thoughtful,
                  small-batch production.
                </span>
              </div>
            </div>
            <p
              style={{
                fontWeight: 600,
                color: "#1a140e",
                fontSize: "1.05rem",
                textAlign: "center",
                margin: "24px 0 0",
              }}
            >
              When you wear Khadi, you are choosing: Fewer, better clothes ·
              Something that lasts · Something that has meaning.
            </p>
          </div>

          {/* ─── HOW KHADI IS SUSTAINABLE (IN A REAL WAY) ─── */}
          <div
            style={{
              borderTop: "1px solid rgba(44, 32, 22, 0.14)",
              paddingTop: 48,
              marginBottom: 70,
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: 700,
                margin: "0 auto 32px",
              }}
            >
              <div className="fab-block-badge">
                <IndianArchBadge style={{ marginBottom: "14px" }}>
                  Conscious Making
                </IndianArchBadge>
              </div>
              <h3
                className="fab-block-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  margin: "0 0 16px",
                  color: "#1a140e",
                }}
              >
                <AnimatedWords text="How Khadi Is Sustainable (In a Real Way)" />
              </h3>
            </div>
            <div
              className="fab-image-reveal"
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.14)",
                marginBottom: 36,
                aspectRatio: "16/5",
                boxShadow: "0 18px 40px -16px rgba(44, 32, 22, 0.18)",
              }}
            >
              <img
                src="/assets/wev.jpg"
                alt="Artisan at wooden loom"
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
                    "linear-gradient(to right, rgba(26,20,14,0.55) 0%, rgba(26,20,14,0.1) 55%, transparent 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  bottom: 20,
                  color: "#EDE8DC",
                  fontFamily: "serif",
                  fontStyle: "italic",
                  fontSize: "clamp(0.95rem, 1.6vw, 1.2rem)",
                  maxWidth: "60%",
                }}
              >
                Wooden looms. Hand power. No fossil fuel.
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 28,
              }}
            >
              <div className="fab-sus-col" style={{ borderTop: "1.5px solid #660608", paddingTop: 16 }}>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#660608",
                    margin: "0 0 8px",
                  }}
                >
                  Low Energy
                </h4>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "#443528",
                    margin: "0 0 6px",
                  }}
                >
                  <strong>Why:</strong> No heavy industrial machinery.
                </p>
                <p style={{ fontSize: "0.92rem", color: "#6e5d4e", margin: 0 }}>
                  <strong>How it helps:</strong> Less electricity, zero fossil
                  fuel looms, lower carbon impact.
                </p>
              </div>
              <div className="fab-sus-col" style={{ borderTop: "1.5px solid #660608", paddingTop: 16 }}>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#660608",
                    margin: "0 0 8px",
                  }}
                >
                  Minimal Processing
                </h4>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "#443528",
                    margin: "0 0 6px",
                  }}
                >
                  <strong>Why:</strong> Fewer harsh industrial chemicals.
                </p>
                <p style={{ fontSize: "0.92rem", color: "#6e5d4e", margin: 0 }}>
                  <strong>How it helps:</strong> Better for your skin and kind
                  to local groundwater.
                </p>
              </div>
              <div className="fab-sus-col" style={{ borderTop: "1.5px solid #660608", paddingTop: 16 }}>
                <h4
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.25rem",
                    color: "#660608",
                    margin: "0 0 8px",
                  }}
                >
                  Human-Centered
                </h4>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "#443528",
                    margin: "0 0 6px",
                  }}
                >
                  <strong>Why:</strong> Made by rural artisans.
                </p>
                <p style={{ fontSize: "0.92rem", color: "#6e5d4e", margin: 0 }}>
                  <strong>How it helps:</strong> Generates dignified rural
                  livelihood and preserves heritage craft.
                </p>
              </div>
            </div>
            <p
              style={{
                fontStyle: "italic",
                fontFamily: "serif",
                fontSize: "1.15rem",
                color: "#660608",
                marginTop: 28,
                textAlign: "center",
              }}
            >
              Sustainability here is not a trend. It&apos;s how the fabric has
              always been made.
            </p>
          </div>

          {/* ─── HOW KHADI IS EVOLVING TODAY & WHY PEOPLE CHOOSE IT ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 40,
              borderTop: "1px solid rgba(44, 32, 22, 0.14)",
              paddingTop: 48,
              marginBottom: 70,
            }}
          >
            <div className="fab-evolve-col" style={{ borderLeft: "2.5px solid #660608", paddingLeft: 22 }}>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                  marginBottom: 16,
                  aspectRatio: "16/9",
                }}
              >
                <img
                  src="/assets/clt.jpg"
                  alt="Contemporary khadi garment"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#660608",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Modern Direction
              </span>
              <h3
                className="fab-block-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "1.5rem",
                  color: "#1a140e",
                  margin: "0 0 14px",
                }}
              >
                <AnimatedWords text="How Khadi Is Evolving Today" />
              </h3>
              <p
                style={{
                  fontSize: "0.96rem",
                  lineHeight: 1.7,
                  color: "#55483d",
                  marginBottom: 14,
                }}
              >
                Khadi is no longer limited to traditional ceremonial wear. It is
                changing — quietly:
              </p>
              <div
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.8,
                  color: "#1a140e",
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                <p style={{ margin: "4px 0" }}>
                  ✦ Lighter weaves for everyday comfort
                </p>
                <p style={{ margin: "4px 0" }}>
                  ✦ Softer finishes for modern use
                </p>
                <p style={{ margin: "4px 0" }}>
                  ✦ Contemporary silhouettes and cuts
                </p>
                <p style={{ margin: "4px 0" }}>
                  ✦ Neutral tones and minimal aesthetics
                </p>
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(44,32,22,0.1)",
                  paddingTop: 14,
                  fontSize: "0.94rem",
                  color: "#443528",
                  lineHeight: 1.65,
                }}
              >
                At Sum Clothico, this is where we come in. We take a fabric with
                history and design it for how women live today. Not heavy. Not
                complicated. Just easy to wear, every day.
              </div>
            </div>

            <div className="fab-evolve-col" style={{ borderLeft: "2.5px solid #660608", paddingLeft: 22 }}>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                  marginBottom: 16,
                  aspectRatio: "16/9",
                }}
              >
                <img
                  src="/assets/chakra.jpg"
                  alt="Khadi being worn in everyday life"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#660608",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Everyday Relevance
              </span>
              <h3
                className="fab-block-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "1.5rem",
                  color: "#1a140e",
                  margin: "0 0 14px",
                }}
              >
                <AnimatedWords text="Why People Choose Khadi Today" />
              </h3>
              <p
                style={{
                  fontSize: "0.96rem",
                  lineHeight: 1.7,
                  color: "#55483d",
                  marginBottom: 14,
                }}
              >
                Not because it is traditional. But because it feels right:
              </p>
              <div
                style={{
                  padding: "10px 0",
                  marginBottom: 12,
                  fontWeight: 600,
                  color: "#660608",
                  fontSize: "0.92rem",
                }}
              >
                <p style={{ margin: "3px 0" }}>✓ On your skin</p>
                <p style={{ margin: "3px 0" }}>✓ In your lifestyle</p>
                <p style={{ margin: "3px 0" }}>✓ In your conscious choices</p>
              </div>
              <div
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.7,
                  color: "#55483d",
                }}
              >
                <p style={{ margin: "0 0 6px" }}>
                  ✦ A conscious choice towards nature — processing does not
                  require litres of industrial water.
                </p>
                <p style={{ margin: "0 0 6px" }}>
                  ✦ Used for centuries, originated and proudly Indian.
                </p>
                <p style={{ margin: 0 }}>
                  ✦ Made to be rough and tough — it will never make you feel
                  guilty of not giving too much attention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── AUTHENTICITY + IMAGE (Left text, Right image) ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 1080,
            margin: "0 auto 80px",
            padding: "0 clamp(24px, 4vw, 56px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <div className="fab-block-badge">
                <IndianArchBadge style={{ marginBottom: "14px" }}>
                  Authenticity
                </IndianArchBadge>
              </div>
              <h2
                className="fab-block-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)",
                  color: "#1a140e",
                  margin: "0 0 18px",
                }}
              >
                <AnimatedWords text="We care about what happens behind the label." />
              </h2>
              <div
                style={{
                  fontSize: "1.03rem",
                  lineHeight: 1.85,
                  color: "#443528",
                }}
              >
                <div className="fab-text-item">
                  <p style={{ marginBottom: 14 }}>
                    &quot;Handwoven&quot; tells you something about how a textile
                    is made. But we want to know more.
                  </p>
                </div>
                <div
                  className="fab-text-item"
                  style={{
                    borderLeft: "2.5px solid #660608",
                    paddingLeft: 18,
                    margin: "18px 0",
                    color: "#1a140e",
                    fontWeight: 600,
                  }}
                >
                  <p style={{ margin: "5px 0" }}>✦ Where did it come from?</p>
                  <p style={{ margin: "5px 0" }}>✦ Who made it?</p>
                  <p style={{ margin: "5px 0" }}>
                    ✦ What kind of loom was used?
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    ✦ What does the region do differently?
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    ✦ What can we learn from it?
                  </p>
                </div>
                <div className="fab-text-item">
                  <p
                    style={{
                      fontStyle: "italic",
                      fontFamily: "serif",
                      fontSize: "1.18rem",
                      color: "#660608",
                      margin: "20px 0 0",
                    }}
                  >
                    That&apos;s the journey Sum is beginning.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="fab-image-reveal"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "4/3",
                background: "#e8dfd0",
                border: "1px solid rgba(44, 32, 22, 0.12)",
              }}
            >
              <img
                src="/assets/wev.jpg"
                alt="Handloom weavers at work"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </section>

        {/* ─── BEYOND KHADI + IMAGE (Right text, Left image) ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 1080,
            margin: "0 auto 80px",
            padding: "0 clamp(24px, 4vw, 56px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 56,
              alignItems: "center",
            }}
          >
            {/* Image first on desktop */}
            <div
              className="fab-image-reveal"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "4/3",
                background: "#e8dfd0",
                border: "1px solid rgba(44, 32, 22, 0.12)",
                order: 0,
              }}
            >
              <img
                src="/assets/han.jpg"
                alt="Indian handloom textile traditions"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ order: 0 }}>
              <div className="fab-block-badge">
                <IndianArchBadge style={{ marginBottom: "14px" }}>
                  Expansion
                </IndianArchBadge>
              </div>
              <h2
                className="fab-block-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  color: "#1a140e",
                  margin: "0 0 18px",
                }}
              >
                <AnimatedWords text="This is our first chapter, not the whole story." />
              </h2>
              <div
                style={{
                  fontSize: "1.03rem",
                  lineHeight: 1.85,
                  color: "#443528",
                }}
              >
                <div className="fab-text-item">
                  <p style={{ marginBottom: 12 }}>
                    We&apos;re exploring handwoven textiles across India.
                  </p>
                  <p style={{ marginBottom: 12 }}>
                    Different regions. Different fibres. Different techniques.
                    Different stories.
                  </p>
                </div>
                <div className="fab-text-item">
                  <p style={{ marginBottom: 20 }}>
                    We don&apos;t want to collect textiles simply to add more
                    names to a product description. We want to understand them
                    first.
                  </p>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#660608",
                      margin: 0,
                      fontStyle: "italic",
                      fontFamily: "serif",
                      fontSize: "1.18rem",
                    }}
                  >
                    And when we find something worth bringing home, we&apos;ll
                    tell you where it came from.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SOURCING APPROACH — Full-width editorial with background strip + image ─── */}
        <section
          className="fab-anim-block"
          style={{ position: "relative", zIndex: 2, marginBottom: 80 }}
        >
          <div
            style={{
              maxWidth: 1080,
              margin: "0 auto",
              padding: "0 clamp(24px, 4vw, 56px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <div className="fab-block-badge">
                <IndianArchBadge style={{ marginBottom: "14px" }}>
                  Ground Truth
                </IndianArchBadge>
              </div>
              <h2
                className="fab-block-title"
                style={{
                  fontFamily: "serif",
                  fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)",
                  color: "#1a140e",
                  margin: "0 0 18px",
                }}
              >
                <AnimatedWords text="Go there. Look closely. Ask questions." />
              </h2>
              <div
                style={{
                  fontSize: "1.03rem",
                  lineHeight: 1.85,
                  color: "#443528",
                  marginBottom: 28,
                }}
              >
                <div className="fab-text-item">
                  <p style={{ marginBottom: 10 }}>
                    Whenever possible, we want our sourcing journey to begin with
                    curiosity rather than a catalogue.
                  </p>
                  <p style={{ marginBottom: 10 }}>
                    To visit places. Meet makers. Understand the textile. Learn
                    what makes it special.
                  </p>
                </div>
                <div className="fab-text-item">
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#1a140e",
                      margin: "0 0 28px",
                    }}
                  >
                    And build relationships that go beyond a transaction.
                  </p>
                </div>
              </div>
              <div className="fab-pill-anim" style={{ display: "inline-block" }}>
                <Link
                  href="/journal"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#1a140e",
                    color: "#FAF6F0",
                    padding: "14px 30px",
                    borderRadius: 99,
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  <span>Follow Our Journey</span>
                  <FiArrowRight />
                </Link>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                className="fab-image-reveal"
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  aspectRatio: "16/9",
                  background: "#e8dfd0",
                  border: "1px solid rgba(44, 32, 22, 0.12)",
                }}
              >
                <img
                  src="/assets/chakra.jpg"
                  alt="Charkha spinning wheel — the heart of Khadi"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div
                className="fab-image-reveal"
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  aspectRatio: "16/7",
                  background: "#e8dfd0",
                  border: "1px solid rgba(44, 32, 22, 0.12)",
                }}
              >
                <img
                  src="/assets/ctn.jpg"
                  alt="Raw cotton ready for spinning"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL SECTION (ASTAKA PLACARD FRAMED BANNER) ─── */}
        <section
          className="fab-anim-block fab-placard-anim"
          style={{
            maxWidth: 920,
            margin: "0 auto 80px",
            position: "relative",
            padding: "clamp(36px, 5vw, 56px)",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          {/* SVG ASTAKA Placard Outer Frame for Closing Banner */}
          <svg
            viewBox="0 0 920 280"
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
              d="M 32,0 L 888,0 L 888,6 A 26 26 0 0 0 914 32 L 920 32 L 920 248 L 914 248 A 26 26 0 0 0 888 274 L 888 280 L 32 280 L 32 274 A 26 26 0 0 0 6 248 L 0 248 L 0 32 L 6 32 A 26 26 0 0 0 32 6 L 32 0 Z"
              fill="#FAF6F0"
              stroke="rgba(44, 32, 22, 0.22)"
              strokeWidth="1.5"
            />
            <path
              d="M 36,10 L 884,10 L 884,14 A 22 22 0 0 0 906 36 L 910 36 L 910 244 L 906 244 A 22 22 0 0 0 884 266 L 884 270 L 36 270 L 36 266 A 22 22 0 0 0 14 244 L 10 244 L 10 36 L 14 36 A 22 22 0 0 0 36 14 L 36 10 Z"
              fill="none"
              stroke="#660608"
              strokeWidth="1"
              strokeOpacity="0.35"
            />
          </svg>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="fab-block-badge">
              <IndianArchBadge style={{ marginBottom: "14px" }}>
                Closing
              </IndianArchBadge>
            </div>
            <h2
              className="fab-block-title"
              style={{
                fontFamily: "serif",
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                color: "#1a140e",
                margin: "0 0 24px",
              }}
            >
              <AnimatedWords text="The cloth has a story. We want you to know it." />
            </h2>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div className="fab-pill-anim">
                <Link
                  href="/shop"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "15px 30px",
                    borderRadius: 99,
                    background: "#660608",
                    color: "#FAF6F0",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  <FiShoppingBag size={16} />
                  <span>Explore Pieces Made From It</span>
                </Link>
              </div>
              <div className="fab-pill-anim">
                <Link
                  href="/journal"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "15px 30px",
                    borderRadius: 99,
                    background: "transparent",
                    color: "#1a140e",
                    border: "1.5px solid #1a140e",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  <FiBookOpen size={16} />
                  <span>Read The Journal</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
