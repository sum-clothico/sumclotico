"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/fabric.css";
import IndianArchBadge from "./IndianArchBadge";
import {
  FiArrowRight,
  FiMapPin,
  FiExternalLink,
  FiChevronDown,
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

const PROCESS_STEPS = [
  { label: "Cotton", img: "/assets/ctn.jpg" },
  { label: "Spinning", img: "/assets/chakra.jpg" },
  { label: "Weaving", img: "/assets/wev.jpg" },
  { label: "Fabric", img: "/assets/khadi.jpg" },
];

const COMPARE_COLLAPSIBLES = [
  {
    id: "cotton",
    title: "Khadi vs Regular Cotton",
    body: [
      {
        heading: "Why Khadi feels cooler",
        text: "Machine-made cotton is tightly packed and dense. Hand-spun yarn creates continuous airflow, keeping you cooler for longer.",
      },
      {
        heading: "Why Khadi feels softer over time",
        text: "Regular cotton can stay the same or wear out. Khadi becomes softer with every wash because the fibers relax naturally without chemical degradation.",
      },
    ],
  },
  {
    id: "linen",
    title: "Khadi vs Linen",
    body: [
      {
        heading: "Why linen can feel rough",
        text: "Linen fibers are naturally stiff and take weeks to break in. Khadi is softer from the start and adapts fluidly to daily wear.",
      },
      {
        heading: "Why Khadi is easier daily wear",
        text: "Linen wrinkles sharply and needs ironing. Khadi's natural slub texture makes wrinkles look relaxed, organic, effortlessly beautiful.",
      },
    ],
  },
];

export default function FabricClient() {
  const containerRef = useRef(null);
  const [openCollapse, setOpenCollapse] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl.fromTo(
        ".fab-hero-badge",
        { opacity: 0, scale: 0.85, y: -16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
      );
      heroTl.fromTo(
        ".fab-hero-title .fab-anim-word",
        { y: "130%", rotate: 3, opacity: 0 },
        { y: "0%", rotate: 0, opacity: 1, duration: 0.95, stagger: 0.05 },
        "-=0.3",
      );
      heroTl.fromTo(
        ".fab-hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
        "-=0.4",
      );

      const blocks = containerRef.current?.querySelectorAll(".fab-anim-block");
      blocks?.forEach((block) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: block, start: "top 83%" },
        });
        const badge = block.querySelector(".fab-block-badge");
        if (badge) {
          tl.fromTo(
            badge,
            { opacity: 0, y: -14, scale: 0.88 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.5)" },
          );
        }
        const titleWords = block.querySelectorAll(".fab-block-title .fab-anim-word");
        if (titleWords.length > 0) {
          tl.fromTo(
            titleWords,
            { y: "120%", rotate: 2, opacity: 0 },
            { y: "0%", rotate: 0, opacity: 1, duration: 0.85, stagger: 0.04, ease: "power4.out" },
            "-=0.3",
          );
        }
        const items = block.querySelectorAll(".fab-text-item");
        if (items.length > 0) {
          tl.fromTo(
            items,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
            "-=0.5",
          );
        }
        const images = block.querySelectorAll(".fab-image-reveal");
        if (images.length > 0) {
          tl.fromTo(
            images,
            { opacity: 0, scale: 0.95, y: 26 },
            { opacity: 1, scale: 1, y: 0, duration: 0.85, stagger: 0.1, ease: "power3.out" },
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
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#EDE8DC",
        fontFamily: "'Epilogue', sans-serif",
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
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "32px",
            backgroundImage: 'url("/assets/bgele2.png")',
            backgroundRepeat: "repeat-y",
            backgroundPosition: "left top",
            backgroundSize: "32px auto",
            opacity: 0.22,
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
            width: "32px",
            backgroundImage: 'url("/assets/bgele2.png")',
            backgroundRepeat: "repeat-y",
            backgroundPosition: "left top",
            backgroundSize: "32px auto",
            transform: "scaleX(-1)",
            opacity: 0.22,
            pointerEvents: "none",
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        {/* ─── 1. INTRODUCTION ─── */}
        <section
          className="fab-hero"
          style={{
            padding: "clamp(40px, 6vh, 60px) 20px 60px",
            maxWidth: 1120,
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
              gap: "clamp(28px, 5vw, 56px)",
              alignItems: "center",
            }}
          >
            <div>
              <div className="fab-hero-badge" style={{ display: "inline-block", marginBottom: 16 }}>
                <IndianArchBadge>Introduction</IndianArchBadge>
              </div>
              <h1
                className="fab-hero-title"
                style={{
                  fontSize: "clamp(2rem, 3.6vw, 2.8rem)",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "#1a140e",
                  margin: "0 0 20px",
                }}
              >
                <AnimatedWords text="It begins with the cloth." />
              </h1>
              <div
                className="fab-hero-sub"
                style={{ fontSize: "1rem", lineHeight: 1.75, color: "#4a3c30" }}
              >
                <p style={{ margin: "0 0 14px" }}>
                  Before a Sum piece takes shape, there&apos;s a fabric, a place and the people behind it.
                </p>
                <p style={{ margin: 0 }}>
                  Our journey begins with Khadi cotton from Madhya Pradesh —
                  <strong style={{ color: "#1a140e" }}> handspun, handwoven and full of character.</strong>
                </p>
              </div>
            </div>

            <div
              className="fab-hero-visual"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div
                className="fab-image-reveal"
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                  boxShadow: "0 14px 32px -12px rgba(44, 32, 22, 0.18)",
                }}
              >
                <img
                  src="/assets/chakra.jpg"
                  alt="Spinner at charkha"
                  style={{
                    width: "100%",
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
                  boxShadow: "0 14px 32px -12px rgba(44, 32, 22, 0.18)",
                }}
              >
                <img
                  src="/assets/han.jpg"
                  alt="Hands weaving khadi"
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

        {/* ─── 2. THE SOURCE ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 1080,
            margin: "0 auto 70px",
            padding: "40px clamp(20px, 4vw, 48px) 0",
            borderTop: "1px solid rgba(44, 32, 22, 0.14)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 44,
              alignItems: "center",
            }}
          >
            <div>
              <div className="fab-block-badge" style={{ marginBottom: 12 }}>
                <IndianArchBadge>The Source</IndianArchBadge>
              </div>
              <h2
                className="fab-block-title"
                style={{
                  fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                  fontWeight: 600,
                  color: "#1a140e",
                  margin: "0 0 18px",
                  lineHeight: 1.25,
                }}
              >
                <AnimatedWords text="Rooted in Madhya Pradesh." />
              </h2>
              <p
                className="fab-text-item"
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  color: "#443528",
                  margin: "0 0 20px",
                }}
              >
                We&apos;re beginning our textile journey close to home, exploring the craft,
                people and processes behind Khadi cotton.
              </p>
              <div
                className="fab-text-item"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#1a140e",
                  color: "#FAF6F0",
                  padding: "10px 18px",
                  borderRadius: 99,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                <FiMapPin size={13} color="#e8a87c" />
                <span>Khadi Cotton · Madhya Pradesh, India</span>
              </div>
              <a
                className="fab-text-item"
                href="https://sidhi.nic.in/en/document/bharatpur-handicrafts-success-story/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  color: "#660608",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
              >
                <FiExternalLink size={12} style={{ verticalAlign: "middle" }} />{" "}
                Bharatpur Handicrafts — official source
              </a>
            </div>

            <div
              className="fab-image-reveal"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.14)",
                aspectRatio: "4/3",
                boxShadow: "0 14px 32px -12px rgba(44, 32, 22, 0.18)",
              }}
            >
              <img
                src="/assets/fabric.jpg"
                alt="Khadi cotton weave"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </section>

        {/* ─── 3. WHAT IS KHADI ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 1080,
            margin: "0 auto 70px",
            padding: "40px clamp(20px, 4vw, 48px) 0",
            borderTop: "1px solid rgba(44, 32, 22, 0.14)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 32px" }}>
            <div className="fab-block-badge" style={{ display: "inline-block", marginBottom: 12 }}>
              <IndianArchBadge>What Is Khadi</IndianArchBadge>
            </div>
            <h2
              className="fab-block-title"
              style={{
                fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                fontWeight: 600,
                color: "#1a140e",
                margin: "0 0 16px",
                lineHeight: 1.25,
              }}
            >
              <AnimatedWords text="Made by hand, thread by thread." />
            </h2>
            <p
              className="fab-text-item"
              style={{ fontSize: "1rem", lineHeight: 1.75, color: "#443528", margin: "0 0 10px" }}
            >
              Khadi is a textile made from handspun yarn and handwoven on a loom.
            </p>
            <p
              className="fab-text-item"
              style={{ fontSize: "0.98rem", lineHeight: 1.75, color: "#6e5d4e", margin: 0 }}
            >
              The process gives the fabric its characteristic texture and natural variations —
              small reminders of the human hands behind it.
            </p>
          </div>

          <div
            className="fab-process-flow"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              alignItems: "stretch",
              marginTop: 20,
            }}
          >
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="fab-image-reveal"
                style={{
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.14)",
                  aspectRatio: "3/4",
                }}
              >
                <img
                  src={step.img}
                  alt={step.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "16px 10px 8px",
                    background: "linear-gradient(to top, rgba(26,20,14,0.78), transparent)",
                    color: "#EDE8DC",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  {i + 1}. {step.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4. WHY WE CHOSE IT ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 1080,
            margin: "0 auto 70px",
            padding: "40px clamp(20px, 4vw, 48px) 0",
            borderTop: "1px solid rgba(44, 32, 22, 0.14)",
            position: "relative",
            zIndex: 2,
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
                boxShadow: "0 14px 32px -12px rgba(44, 32, 22, 0.18)",
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
              <div className="fab-block-badge" style={{ marginBottom: 12 }}>
                <IndianArchBadge>Why We Chose It</IndianArchBadge>
              </div>
              <h2
                className="fab-block-title"
                style={{
                  fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                  fontWeight: 700,
                  color: "#660608",
                  margin: "0 0 20px",
                  lineHeight: 1.25,
                }}
              >
                <AnimatedWords text="Comfort you can feel." />
              </h2>
              <p
                className="fab-text-item"
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  color: "#3f3329",
                  margin: "0 0 14px",
                }}
              >
                We love Khadi for its natural texture, breathability and the way cotton Khadi
                can soften with use and washing.
              </p>
              <p
                className="fab-text-item"
                style={{
                  fontSize: "1.02rem",
                  lineHeight: 1.7,
                  color: "#1a140e",
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                It doesn&apos;t have to look perfectly uniform to be beautiful.
                And that&apos;s part of what makes it special.
              </p>

              <div style={{ marginTop: 24 }}>
                {COMPARE_COLLAPSIBLES.map((item) => {
                  const open = openCollapse === item.id;
                  return (
                    <div
                      key={item.id}
                      className="fab-text-item"
                      style={{ borderTop: "1px solid rgba(44,32,22,0.12)" }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenCollapse(open ? null : item.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "14px 0",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#1a140e",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          fontFamily: "inherit",
                        }}
                      >
                        <span>{item.title}</span>
                        <FiChevronDown
                          size={16}
                          style={{
                            transform: open ? "rotate(180deg)" : "rotate(0)",
                            transition: "transform 0.25s ease",
                          }}
                        />
                      </button>
                      {open && (
                        <div style={{ paddingBottom: 18 }}>
                          {item.body.map((row) => (
                            <div key={row.heading} style={{ marginBottom: 12 }}>
                              <div
                                style={{
                                  fontSize: "0.78rem",
                                  fontWeight: 800,
                                  color: "#660608",
                                  marginBottom: 4,
                                  letterSpacing: "0.04em",
                                }}
                              >
                                {row.heading}
                              </div>
                              <p
                                style={{
                                  fontSize: "0.92rem",
                                  lineHeight: 1.65,
                                  color: "#55483d",
                                  margin: 0,
                                }}
                              >
                                {row.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. KHADI FOR TODAY ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 980,
            margin: "0 auto 70px",
            padding: "40px clamp(20px, 4vw, 48px) 0",
            borderTop: "1px solid rgba(44, 32, 22, 0.14)",
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <div className="fab-block-badge" style={{ display: "inline-block", marginBottom: 12 }}>
            <IndianArchBadge>Khadi For Today</IndianArchBadge>
          </div>
          <h2
            className="fab-block-title"
            style={{
              fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
              fontWeight: 600,
              color: "#1a140e",
              margin: "0 0 20px",
              lineHeight: 1.25,
            }}
          >
            <AnimatedWords text="An old craft. A place in today's wardrobe." />
          </h2>
          <p
            className="fab-text-item"
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#443528",
              margin: "0 auto 14px",
              maxWidth: 640,
            }}
          >
            Traditional fabric doesn&apos;t have to mean traditional clothing.
          </p>
          <p
            className="fab-text-item"
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#443528",
              margin: "0 auto 28px",
              maxWidth: 680,
            }}
          >
            At Sum, we bring Khadi into contemporary silhouettes, with practical details and
            easy fits for the lives women lead today.
          </p>
          <div
            className="fab-text-item"
            style={{
              display: "inline-flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "12px 22px",
              background: "#1a140e",
              color: "#EDE8DC",
              borderRadius: 99,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <span>Made slowly</span>
            <span style={{ color: "#D4C4A8" }}>•</span>
            <span>Shaped by hands</span>
            <span style={{ color: "#D4C4A8" }}>•</span>
            <span>Produced thoughtfully</span>
          </div>
        </section>

        {/* ─── 6. CLOSING ─── */}
        <section
          className="fab-anim-block"
          style={{
            maxWidth: 820,
            margin: "0 auto 80px",
            padding: "40px clamp(20px, 4vw, 48px) 0",
            borderTop: "1px solid rgba(44, 32, 22, 0.14)",
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <div className="fab-block-badge" style={{ display: "inline-block", marginBottom: 12 }}>
            <IndianArchBadge>Closing</IndianArchBadge>
          </div>
          <h2
            className="fab-block-title"
            style={{
              fontSize: "clamp(1.7rem, 2.8vw, 2.3rem)",
              fontWeight: 600,
              color: "#1a140e",
              margin: "0 0 18px",
              lineHeight: 1.25,
            }}
          >
            <AnimatedWords text="Know the cloth. Make it yours." />
          </h2>
          <p
            className="fab-text-item"
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#443528",
              margin: "0 auto 28px",
              maxWidth: 620,
            }}
          >
            There&apos;s more to discover behind every textile. Follow our visits, learnings
            and conversations in the Sum Journal.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/journal"
              className="fab-text-item"
              style={{
                padding: "13px 26px",
                borderRadius: 99,
                background: "transparent",
                color: "#1a140e",
                border: "1.5px solid #1a140e",
                fontWeight: 800,
                fontSize: "0.76rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Read the Journal
            </Link>
            <Link
              href="/shop"
              className="fab-text-item"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 26px",
                borderRadius: 99,
                background: "#660608",
                color: "#EDE8DC",
                fontWeight: 800,
                fontSize: "0.76rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(102, 6, 8, 0.22)",
              }}
            >
              Shop Khadi <FiArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
