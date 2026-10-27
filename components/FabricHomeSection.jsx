"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowRight } from "react-icons/fi";
import IndianArchBadge from "@/components/IndianArchBadge";

gsap.registerPlugin(ScrollTrigger);

export default function FabricHomeSection() {
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

  const steps = [
    {
      num: "01",
      title: "Raw Cotton",
      desc: "Locally farmed organic cotton pods, gently hand-separated and cleaned.",
      img: "/assets/ctn.jpg",
    },
    {
      num: "02",
      title: "Charkha Spinning",
      desc: "Drawn into single ply thread on traditional wooden spinning wheels.",
      img: "/assets/han.jpg",
    },
    {
      num: "03",
      title: "Handloom Weaving",
      desc: "Interlaced on pit looms with rhythm and touch — no power, pure patience.",
      img: "/assets/wev.jpg",
    },
    {
      num: "04",
      title: "The Finished Cloth",
      desc: "A living fabric that breathes, softens, and ages gracefully with you.",
      img: "/assets/cloth.png",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="fabric-story"
      style={{
        background: "#FAF6F0", // Warm cream contrast
        padding: "100px 24px 95px",
        position: "relative",
        borderTop: "1px solid rgba(44, 32, 22, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 54px" }} className="fade-up">
          <IndianArchBadge style={{ marginBottom: "16px" }}>The Craft Behind The Cloth</IndianArchBadge>
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
            Rooted in Indian textiles.
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.8vw, 17px)",
              color: "#5C4A3E",
              lineHeight: 1.7,
              margin: "0 auto 28px",
            }}
          >
            Our journey begins with Khadi, a fabric shaped by skilled hands and generations of
            knowledge. We bring it into contemporary silhouettes designed for everyday wear.
          </p>
          <Link
            href="/fabric"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
              background: "#660608",
              color: "#ffffff",
              boxShadow: "0 6px 20px rgba(102, 6, 8, 0.22)",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.background = "#4d0406";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "#660608";
            }}
          >
            <span>Explore Our Fabrics</span>
            <FiArrowRight size={16} />
          </Link>
        </div>

        {/* Single hero visual — process details moved to /fabric per PDF spec */}
        <div
          className="fade-up"
          style={{
            maxWidth: 980,
            margin: "0 auto",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(44, 32, 22, 0.14)",
            aspectRatio: "16 / 7",
            boxShadow: "0 18px 40px -16px rgba(44, 32, 22, 0.18)",
          }}
        >
          <img
            src="/assets/khadi.jpg"
            alt="Handwoven khadi textile"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
