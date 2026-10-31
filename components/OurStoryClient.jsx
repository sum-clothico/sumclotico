"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/app/styles/our-story.css";
import IndianArchBadge from "./IndianArchBadge";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

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

const PEOPLE_IMAGES = [
  { src: "/assets/bharatpur-spinners.jpg", label: "Village Spinners", location: "Bharatpur" },
  { src: "/assets/bharatpur-weaver.png", label: "Master Weavers", location: "Madhya Pradesh" },
  { src: "/assets/chakra.jpg", label: "Charkha Spinning", location: "Handcrafted" },
  { src: "/assets/wev.jpg", label: "Pit Loom Weaving", location: "Human Pace" },
];

export default function OurStoryClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-triggered blocks
      const blocks = containerRef.current?.querySelectorAll(".os-anim-block");
      blocks?.forEach((block) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: block, start: "top 83%" },
        });
        const badge = block.querySelector(".os-block-badge");
        if (badge) {
          tl.fromTo(
            badge,
            { opacity: 0, y: -14, scale: 0.88 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.5)" },
          );
        }
        const titleWords = block.querySelectorAll(".os-block-title .os-anim-word");
        if (titleWords.length > 0) {
          tl.fromTo(
            titleWords,
            { y: "120%", rotate: 2, opacity: 0 },
            { y: "0%", rotate: 0, opacity: 1, duration: 0.85, stagger: 0.04, ease: "power4.out" },
            "-=0.3",
          );
        }
        const items = block.querySelectorAll(".os-text-item");
        if (items.length > 0) {
          tl.fromTo(
            items,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
            "-=0.5",
          );
        }
        const images = block.querySelectorAll(".os-image-box");
        if (images.length > 0) {
          tl.fromTo(
            images,
            { opacity: 0, scale: 0.95, y: 24 },
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
      className="our-story-page"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        backgroundColor: "#EDE8DC",
        fontFamily: "'Epilogue', sans-serif",
      }}
    >
      {/* Background Indian ornamental side strips */}
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

      {/* ─── 1. OPENING MANIFESTO WITH ARTISAN IMAGES ─── */}
      <section
        className="os-anim-block"
        style={{
          padding: "60px 20px 70px",
          maxWidth: 1120,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 840, margin: "0 auto 40px" }}>
          <div className="os-block-badge" style={{ display: "inline-block", marginBottom: 16 }}>
            <IndianArchBadge>The Beginning</IndianArchBadge>
          </div>
          <h1
            className="os-block-title"
            style={{
              fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
              fontWeight: 600,
              color: "#1a140e",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              margin: "0 0 16px",
            }}
          >
            <AnimatedWords text="Sum is a sum of people, ideas, skills, places and techniques." />
          </h1>
          <p
            className="os-text-item"
            style={{
              margin: "0 auto 24px",
              fontWeight: 700,
              color: "#660608",
              fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
            }}
          >
            And eventually, you.
          </p>
          <Link
            href="#why-sum-exists"
            className="os-text-item"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#660608",
              color: "#EDE8DC",
              padding: "13px 26px",
              borderRadius: 99,
              fontWeight: 700,
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(102, 6, 8, 0.22)",
            }}
          >
            Discover Our Story <FiArrowRight />
          </Link>
        </div>

        {/* Visual Pair: Village Weavers & Raw Cotton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginTop: 20,
          }}
        >
          <div
            className="os-image-box"
            style={{
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              aspectRatio: "16/10",
              boxShadow: "0 14px 30px rgba(44, 32, 22, 0.12)",
              border: "1px solid rgba(44, 32, 22, 0.14)",
            }}
          >
            <img
              src="/assets/bharatpur-spinners.jpg"
              alt="Artisan women hand-spinning cotton on charkhas"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(26,20,14,0.7) 0%, transparent 55%)",
              }}
            />
            <div style={{ position: "absolute", left: 20, bottom: 16, color: "#EDE8DC" }}>
              <span style={{ fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: "#D4C4A8", fontWeight: 800 }}>
                Bharatpur Craft Cluster
              </span>
              <h4 style={{ margin: "4px 0 0", fontSize: "1rem", fontWeight: 700 }}>
                Women Spinners of Madhya Pradesh
              </h4>
            </div>
          </div>

          <div
            className="os-image-box"
            style={{
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              aspectRatio: "16/10",
              boxShadow: "0 14px 30px rgba(44, 32, 22, 0.12)",
              border: "1px solid rgba(44, 32, 22, 0.14)",
            }}
          >
            <img
              src="/assets/bharatpur-weaver.png"
              alt="Traditional pit loom weaving"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(26,20,14,0.7) 0%, transparent 55%)",
              }}
            />
            <div style={{ position: "absolute", left: 20, bottom: 16, color: "#EDE8DC" }}>
              <span style={{ fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: "#D4C4A8", fontWeight: 800 }}>
                Handloom Precision
              </span>
              <h4 style={{ margin: "4px 0 0", fontSize: "1rem", fontWeight: 700 }}>
                Wooden Frame Loom Mastery
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. WHY SUM EXISTS — PAIRED SPLIT WITH GARMENT & CLOTH ─── */}
      <section
        id="why-sum-exists"
        className="os-anim-block"
        style={{
          maxWidth: 1120,
          margin: "0 auto 100px",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 60,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Left: Text Ethos */}
          <div>
            <div className="os-block-badge" style={{ marginBottom: 14 }}>
              <IndianArchBadge>Why Sum Exists</IndianArchBadge>
            </div>
            <h2
              className="os-block-title"
              style={{
                fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
                fontWeight: 600,
                color: "#1a140e",
                margin: "0 0 20px",
                lineHeight: 1.25,
              }}
            >
              <AnimatedWords text="We wanted more room in our clothes." />
            </h2>
            <div style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "#3f3329" }}>
              <p className="os-text-item" style={{ margin: "0 0 16px" }}>
                Room for changing bodies, different personalities, and days that don&apos;t always go as planned.
              </p>
              <p className="os-text-item" style={{ margin: "0 0 20px" }}>
                So we started creating easy, functional clothing that moves between work, weekends, and everything in between.
              </p>
              <div
                className="os-text-item"
                style={{
                  padding: "16px 20px",
                  background: "rgba(102, 6, 8, 0.05)",
                  borderLeft: "3px solid #660608",
                  borderRadius: "0 8px 8px 0",
                  marginBottom: 20,
                }}
              >
                <p style={{ margin: 0, fontWeight: 700, color: "#660608", fontSize: "1.08rem" }}>
                  Simple. Easy. Made for real days.
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.92rem", color: "#55483d" }}>
                  No synthetic stiffness. Pure cotton that relaxes and softens with every wash.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Rich Garment & Fabric Visual Duo */}
          <div
            className="os-image-box"
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.16)",
                boxShadow: "0 16px 36px rgba(44, 32, 22, 0.14)",
                aspectRatio: "3/4",
                transform: "translateY(-14px)",
              }}
            >
              <img
                src="/assets/img/14.png"
                alt="Sum Clothico handcrafted silhouette"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.16)",
                boxShadow: "0 16px 36px rgba(44, 32, 22, 0.14)",
                aspectRatio: "3/4",
                transform: "translateY(14px)",
              }}
            >
              <img
                src="/assets/cloth.png"
                alt="Sum handcrafted Khadi textile weave"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. THE PEOPLE — 4 ARTISAN TILES ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1120,
          margin: "0 auto 100px",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 60,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 36px" }}>
          <div className="os-block-badge" style={{ display: "inline-block", marginBottom: 14 }}>
            <IndianArchBadge>The People</IndianArchBadge>
          </div>
          <h2
            className="os-block-title"
            style={{
              fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
              fontWeight: 600,
              color: "#1a140e",
              margin: "0 0 16px",
              lineHeight: 1.25,
            }}
          >
            <AnimatedWords text="Before there's a garment, there are people." />
          </h2>
          <p
            className="os-text-item"
            style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "#3f3329", margin: 0 }}
          >
            Spinners, weavers, designers and tailors — different hands and skills come together
            to create every Sum piece.
          </p>
        </div>

        <div
          className="os-people-strip"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          {PEOPLE_IMAGES.map((img) => (
            <div
              key={img.label}
              className="os-image-box"
              style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(44, 32, 22, 0.16)",
                boxShadow: "0 10px 25px rgba(44, 32, 22, 0.1)",
                aspectRatio: "3/4",
              }}
            >
              <img
                src={img.src}
                alt={img.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "24px 14px 12px",
                  background: "linear-gradient(to top, rgba(26,20,14,0.85) 0%, transparent 100%)",
                  color: "#EDE8DC",
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#D4C4A8",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 3,
                  }}
                >
                  <FiMapPin size={10} />
                  <span>{img.location}</span>
                </div>
                <div style={{ fontSize: "0.98rem", fontWeight: 700 }}>
                  {img.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. THE CRAFT CLUSTER & THE MAKERS ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1120,
          margin: "0 auto 100px",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 60,
        }}
      >
        <div
          className="os-editorial-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.88fr 1.12fr",
            gap: "clamp(32px, 5vw, 60px)",
            alignItems: "center",
          }}
        >
          <div
            className="os-image-box"
            style={{
              position: "relative",
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(44, 32, 22, 0.16)",
              boxShadow: "0 18px 40px -16px rgba(44, 32, 22, 0.22)",
              aspectRatio: "4/5",
            }}
          >
            <img
              src="/assets/751.jpg"
              alt="Aditi Singh — founder, Sum Clothico"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(26,20,14,0.65) 0%, transparent 50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 20,
                bottom: 18,
                color: "#EDE8DC",
              }}
            >
              <div
                style={{
                  fontSize: "0.66rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 800,
                  color: "#D4C4A8",
                  marginBottom: 4,
                }}
              >
                Rewa, Madhya Pradesh
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>Aditi Singh — Founder</div>
            </div>
          </div>

          <div>
            <div className="os-block-badge" style={{ marginBottom: 14 }}>
              <IndianArchBadge>The Founder & The Makers</IndianArchBadge>
            </div>
            <h2
              className="os-block-title"
              style={{
                fontSize: "clamp(1.7rem, 2.8vw, 2.3rem)",
                fontWeight: 600,
                color: "#1a140e",
                margin: "0 0 20px",
                lineHeight: 1.25,
              }}
            >
              <AnimatedWords text="An idea, brought to life by many hands." />
            </h2>
            <div style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "#3f3329" }}>
              <p className="os-text-item" style={{ margin: "0 0 16px" }}>
                What started in Rewa with a simple question — could everyday clothing feel more
                like the women wearing it? — grew into Sum Clothico.
              </p>
              <p className="os-text-item" style={{ margin: "0 0 16px" }}>
                We partnered directly with artisan spinners and handloom weavers across Bharatpur and surrounding Madhya Pradesh clusters, bypassing industrial intermediaries.
              </p>
              <p
                className="os-text-item"
                style={{ margin: 0, fontWeight: 600, color: "#1a140e", fontSize: "1.05rem" }}
              >
                Today, our women tailors bring these ideas to life, one thoughtfully made piece at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. CLOSING MANIFESTO WITH RICH VISUAL BANNER ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 960,
          margin: "0 auto 80px",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 60,
          textAlign: "center",
        }}
      >
        <div className="os-block-badge" style={{ display: "inline-block", marginBottom: 14 }}>
          <IndianArchBadge>Closing</IndianArchBadge>
        </div>
        <h2
          className="os-block-title"
          style={{
            fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
            fontWeight: 600,
            color: "#1a140e",
            margin: "0 0 20px",
            lineHeight: 1.25,
          }}
        >
          <AnimatedWords text="Thought by us. Shaped by many hands. Lived in by you." />
        </h2>
        <p
          className="os-text-item"
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.75,
            color: "#3f3329",
            margin: "0 auto 32px",
            maxWidth: 680,
          }}
        >
          Khadi is where we began. As we explore more Indian textiles and techniques, the idea
          stays the same — clothes that become part of your everyday life.
        </p>

        {/* Action CTAs */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          <Link
            href="/fabric"
            className="os-text-item"
            style={{
              padding: "14px 28px",
              borderRadius: 99,
              background: "transparent",
              color: "#1a140e",
              border: "1.5px solid #1a140e",
              fontWeight: 800,
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Explore the Fabric
          </Link>
          <Link
            href="/shop"
            className="os-text-item"
            style={{
              padding: "14px 28px",
              borderRadius: 99,
              background: "#660608",
              color: "#EDE8DC",
              fontWeight: 800,
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(102, 6, 8, 0.22)",
            }}
          >
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
