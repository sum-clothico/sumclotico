import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/about-section.css";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Clothes should leave room for you.",
  "For changing bodies. Changing plans.",
  "Different moods. Different versions of yourself.",
  "NO TEMPLATE. JUST CLOTHES YOU CAN MAKE YOUR OWN.",
];

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const lines = section.querySelectorAll(".about-line");
      const subLabel = section.querySelector(".about-section__sub");
      const card = section.querySelector(".about-section__card");
      const cta = section.querySelector(".about-cta");
      const ctaWords = section.querySelectorAll(".about-cta-word");
      const ctaDesc = section.querySelector(".about-cta__desc");
      const ctaBtns = section.querySelectorAll(".about-cta__btn");

      // Card entrance on scroll
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          },
        );
      }

      // ─── Step 1: Reveal card manifesto lines ───
      lines.forEach((line, idx) => {
        gsap.fromTo(
          line,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2 + idx * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          },
        );
      });

      if (subLabel) {
        gsap.fromTo(
          subLabel,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          },
        );
      }

      // Closing CTA reveal
      if (cta) {
        cta.classList.add("is-active");
        gsap.fromTo(
          cta,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cta,
              start: "top 85%",
            },
          },
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const ctaWordsLine1 = ["Made", "with", "time."];
  const ctaWordsLine2 = ["Made", "for", "living."];

  return (
    <section ref={sectionRef} className="about-section">
      {/* Earthy textured background */}
      <div className="about-section__bg" />

      {/* Philosophy card — Indian Cusped Arch Portal Shape */}
      <div className="about-section__card">
        {/* SVG Scalloped Notched Corner Placard — Inspired by royal Indian stationery / ASTAKA frame */}
        <svg
          viewBox="0 0 580 620"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <defs>
            <clipPath id="about-placard-clip">
              <path d="M 44,0 L 536,0 L 536,8 A 36 36 0 0 0 572 44 L 580 44 L 580 576 L 572 576 A 36 36 0 0 0 536 612 L 536 620 L 44 620 L 44 612 A 36 36 0 0 0 8 576 L 0 576 L 0 44 L 8 44 A 36 36 0 0 0 44 8 L 44 0 Z" />
            </clipPath>
          </defs>
          {/* Main Card Silhouette with Stepped Scalloped Corners */}
          <path
            d="M 44,0 L 536,0 L 536,8 A 36 36 0 0 0 572 44 L 580 44 L 580 576 L 572 576 A 36 36 0 0 0 536 612 L 536 620 L 44 620 L 44 612 A 36 36 0 0 0 8 576 L 0 576 L 0 44 L 8 44 A 36 36 0 0 0 44 8 L 44 0 Z"
            fill="#FAF6F0"
            stroke="rgba(44, 32, 22, 0.22)"
            strokeWidth="1.5"
          />
          {/* Subtle 751.jpg background pattern overlay at low opacity */}
          <image
            href="/assets/751.jpg"
            x="0"
            y="0"
            width="580"
            height="620"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#about-placard-clip)"
            opacity="0.09"
            style={{ mixBlendMode: "multiply" }}
          />
          {/* Inner Accent Hairline Border */}
          <path
            d="M 50,14 L 530,14 L 530,20 A 30 30 0 0 0 560 50 L 566 50 L 566 570 L 560 570 A 30 30 0 0 0 530 600 L 530 606 L 50 606 L 50 600 A 30 30 0 0 0 20 570 L 14 570 L 14 50 L 20 50 A 30 30 0 0 0 50 20 L 50 14 Z"
            fill="none"
            stroke="#660608"
            strokeWidth="1"
            strokeOpacity="0.45"
          />
        </svg>

        <div className="about-section__inner" style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <img className="about-section__logo" src="/assets/logo.svg" alt="Sum Clothico" />

          {/* Divider */}
          <div className="about-section__divider" />

          {/* Lines */}
          <div className="about-section__lines">
            {LINES.map((line, i) => (
              <p key={i} className="about-line">
                {line}
              </p>
            ))}
          </div>

          {/* Sub-label */}
          <p className="about-section__sub">
            A brand rooted in handwoven textiles. Designed for how women live today.
          </p>

          <Link
            href="/our-story#why-sum-exists"
            className="about-section__cta-inline"
          >
            Why Sum Exists →
          </Link>
        </div>
      </div>

      {/* Brand Ethos CTA Section */}
      <div className="about-cta">
        <h2
          className="about-cta__title"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.2em",
            margin: "0 0 16px",
          }}
        >
          <div style={{ display: "flex", gap: "0.26em" }}>
            {ctaWordsLine1.map((word, idx) => (
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
                  className="about-cta-word"
                  style={{ display: "inline-block", transformOrigin: "bottom left" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.26em" }}>
            {ctaWordsLine2.map((word, idx) => (
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
                  className="about-cta-word"
                  style={{ display: "inline-block", transformOrigin: "bottom left" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </div>
        </h2>

        <p
          className="about-cta__desc"
          style={{
            fontSize: "clamp(0.95rem, 1.4vw, 1.12rem)",
            color: "#4a3c30",
            maxWidth: "520px",
            margin: "0 auto 28px",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Thoughtful everyday clothing rooted in handwoven textiles.
        </p>

        <div className="about-cta__buttons">
          <Link href="/our-story" className="about-cta__btn about-cta__btn--primary">
            Our Story
          </Link>
          <Link href="/shop" className="about-cta__btn about-cta__btn--secondary">
            Shop Now
          </Link>
          <a
            href="https://www.instagram.com/sumclothico"
            target="_blank"
            rel="noopener noreferrer"
            className="about-cta__btn about-cta__btn--secondary"
          >
            Socials
          </a>
        </div>
      </div>
    </section>
  );
}
