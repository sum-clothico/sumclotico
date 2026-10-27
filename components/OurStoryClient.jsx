"use client";

import React, { useEffect, useRef } from "react";
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

const PEOPLE_IMAGES = [
  { src: "/assets/chakra.jpg", label: "Spinners" },
  { src: "/assets/wev.jpg", label: "Weavers" },
  { src: "/assets/han.jpg", label: "Designers" },
  { src: "/assets/clt.jpg", label: "Tailors" },
];

export default function OurStoryClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl.fromTo(
        ".os-hero-badge",
        { opacity: 0, scale: 0.85, y: -16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
      );
      heroTl.fromTo(
        ".os-hero-title .os-anim-word",
        { y: "130%", rotate: 3, opacity: 0 },
        { y: "0%", rotate: 0, opacity: 1, duration: 0.95, stagger: 0.05 },
        "-=0.3",
      );
      heroTl.fromTo(
        ".os-hero-sub",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4",
      );
      heroTl.fromTo(
        ".os-hero-cta",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
        "-=0.3",
      );

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
            { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: "power3.out" },
            "-=0.5",
          );
        }
        const images = block.querySelectorAll(".os-image-box");
        if (images.length > 0) {
          tl.fromTo(
            images,
            { opacity: 0, scale: 0.95, y: 28 },
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
        background: "var(--bg-color, #EDE8DC)",
        minHeight: "100vh",
        padding: "120px 20px 70px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Epilogue', sans-serif",
      }}
    >
      {/* Side decor */}
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

      {/* ─── 1. OPENING ─── */}
      <section
        style={{
          maxWidth: 980,
          margin: "0 auto 90px",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <div className="os-hero-badge" style={{ display: "inline-block", marginBottom: 18 }}>
          <IndianArchBadge>Our Story</IndianArchBadge>
        </div>
        <h1
          className="os-hero-title"
          style={{
            fontSize: "clamp(2rem, 3.8vw, 3rem)",
            lineHeight: 1.22,
            fontWeight: 600,
            color: "#1a140e",
            margin: "0 auto 18px",
            maxWidth: 820,
          }}
        >
          <AnimatedWords text="Sum is a sum of people, ideas, skills, places and techniques." />
        </h1>
        <p
          className="os-hero-sub"
          style={{
            margin: "0 auto 30px",
            fontWeight: 700,
            color: "#660608",
            fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
          }}
        >
          And eventually, you.
        </p>
        <Link
          href="#why-sum-exists"
          className="os-hero-cta"
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
      </section>

      {/* ─── 2. WHY SUM EXISTS ─── */}
      <section
        id="why-sum-exists"
        className="os-anim-block"
        style={{
          maxWidth: 880,
          margin: "0 auto 90px",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 48,
        }}
      >
        <div className="os-block-badge" style={{ marginBottom: 14 }}>
          <IndianArchBadge>Why Sum Exists</IndianArchBadge>
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
          <AnimatedWords text="We wanted more room in our clothes." />
        </h2>
        <div style={{ fontSize: "1rem", lineHeight: 1.75, color: "#3f3329" }}>
          <p className="os-text-item" style={{ margin: "0 0 16px" }}>
            Room for changing bodies, different personalities and days that don&apos;t always go as planned.
          </p>
          <p className="os-text-item" style={{ margin: "0 0 16px" }}>
            So we started creating easy, functional clothing that moves between work, weekends and everything in between.
          </p>
          <p
            className="os-text-item"
            style={{ margin: 0, fontWeight: 700, color: "#1a140e", fontSize: "1.1rem" }}
          >
            Simple. Easy. Made for real days.
          </p>
        </div>
      </section>

      {/* ─── 3. THE PEOPLE ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1080,
          margin: "0 auto 90px",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 48,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 32px" }}>
          <div className="os-block-badge" style={{ display: "inline-block", marginBottom: 14 }}>
            <IndianArchBadge>The People</IndianArchBadge>
          </div>
          <h2
            className="os-block-title"
            style={{
              fontSize: "clamp(1.7rem, 2.8vw, 2.3rem)",
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
            style={{ fontSize: "1rem", lineHeight: 1.75, color: "#3f3329", margin: 0 }}
          >
            Spinners, weavers, designers and tailors — different hands and skills come together
            to create every Sum piece.
          </p>
        </div>

        <div
          className="os-people-strip"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginTop: 24,
          }}
        >
          {PEOPLE_IMAGES.map((img) => (
            <div
              key={img.label}
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
                alt={img.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "18px 10px 8px",
                  background: "linear-gradient(to top, rgba(26,20,14,0.75), transparent)",
                  color: "#EDE8DC",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {img.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. THE FOUNDER & THE MAKERS ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 1080,
          margin: "0 auto 90px",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 48,
        }}
      >
        <div
          className="os-editorial-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.85fr 1.15fr",
            gap: "clamp(28px, 4vw, 48px)",
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
              boxShadow: "0 18px 40px -16px rgba(44, 32, 22, 0.2)",
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
                background: "linear-gradient(to top, rgba(26,20,14,0.55), transparent 50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 16,
                bottom: 14,
                color: "#EDE8DC",
              }}
            >
              <div
                style={{
                  fontSize: "0.64rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 800,
                  color: "#D4C4A8",
                  marginBottom: 3,
                }}
              >
                Rewa, Madhya Pradesh
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>Aditi Singh — Founder</div>
            </div>
          </div>

          <div>
            <div className="os-block-badge" style={{ marginBottom: 14 }}>
              <IndianArchBadge>The Founder & The Makers</IndianArchBadge>
            </div>
            <h2
              className="os-block-title"
              style={{
                fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                fontWeight: 600,
                color: "#1a140e",
                margin: "0 0 20px",
                lineHeight: 1.25,
              }}
            >
              <AnimatedWords text="An idea, brought to life by many hands." />
            </h2>
            <div style={{ fontSize: "1rem", lineHeight: 1.75, color: "#3f3329" }}>
              <p className="os-text-item" style={{ margin: "0 0 16px" }}>
                What started in Rewa with a simple question — could everyday clothing feel more
                like the women wearing it? — grew into Sum Clothico.
              </p>
              <p
                className="os-text-item"
                style={{ margin: 0, fontWeight: 600, color: "#1a140e", fontSize: "1.02rem" }}
              >
                Today, our women tailors bring these ideas to life, one thoughtfully made piece at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. CLOSING ─── */}
      <section
        className="os-anim-block"
        style={{
          maxWidth: 820,
          margin: "0 auto 60px",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(44, 32, 22, 0.14)",
          paddingTop: 48,
          textAlign: "center",
        }}
      >
        <div className="os-block-badge" style={{ display: "inline-block", marginBottom: 14 }}>
          <IndianArchBadge>Closing</IndianArchBadge>
        </div>
        <h2
          className="os-block-title"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
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
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "#3f3329",
            margin: "0 auto 28px",
            maxWidth: 640,
          }}
        >
          Khadi is where we began. As we explore more Indian textiles and techniques, the idea
          stays the same — clothes that become part of your everyday life.
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
            href="/fabric"
            className="os-text-item"
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
            Explore the Fabric
          </Link>
          <Link
            href="/shop"
            className="os-text-item"
            style={{
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
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
