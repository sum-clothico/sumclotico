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
  "No template. Just clothes you can make your own.",
];

const PIN_DISTANCE = 500 * LINES.length;

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = sectionRef.current.querySelectorAll(".about-line");

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${PIN_DISTANCE}`,
        pin: true,
        pinSpacing: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${PIN_DISTANCE}`,
          scrub: 1.5,
        },
      });

      const seg = 1 / LINES.length;

      lines.forEach((line, i) => {
        const start = i * seg;
        tl.fromTo(
          line,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: seg * 0.5, ease: "power3.out" },
          start,
        );
      });

      const subLabel = sectionRef.current.querySelector(".about-section__sub");
      if (subLabel) {
        tl.fromTo(
          subLabel,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.2"
        );
      }

      // Animate CTA fading in at the end
      const cta = sectionRef.current.querySelector(".about-cta");
      const ctaWords = sectionRef.current.querySelectorAll(".about-cta-word");
      const ctaBtns = sectionRef.current.querySelectorAll(".about-cta__btn");
      if (cta) {
        if (ctaWords.length > 0) {
          tl.fromTo(
            ctaWords,
            { y: "130%", rotate: 3, opacity: 0 },
            { y: "0%", rotate: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: "power4.out" },
            "+=0.05"
          );
        }
        if (ctaBtns.length > 0) {
          tl.fromTo(
            ctaBtns,
            { opacity: 0, y: 22, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: "back.out(1.4)" },
            "-=0.5"
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const ctaWords = ["Find", "something", "you'll", "want", "to", "live", "in."];

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
            href="/our-story"
            className="about-section__cta-inline"
          >
            Why Sum Exists →
          </Link>
        </div>
      </div>

      {/* Merged CTA */}
      <div className="about-cta">
        <h2
          className="about-cta__title"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.26em",
          }}
        >
          {ctaWords.map((word, idx) => (
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
        </h2>
        <div className="about-cta__buttons">
          <Link href="/shop" className="about-cta__btn about-cta__btn--primary">
            Shop All Pieces
          </Link>
          <Link href="/our-story" className="about-cta__btn about-cta__btn--secondary">
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
