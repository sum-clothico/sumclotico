"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowRight, FiInstagram } from "react-icons/fi";
import IndianArchBadge from "@/components/IndianArchBadge";

gsap.registerPlugin(ScrollTrigger);

export default function WhySumHomeSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = sectionRef.current;
      if (!el) return;

      const fades = el.querySelectorAll(".fade-up");
      fades.forEach((target) => {
        gsap.fromTo(
          target,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
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

  const instagramPosts = [
    {
      img: "/assets/img/15.png",
      caption: "Mornings in handspun khadi — easy, weightless, grounded.",
    },
    {
      img: "/assets/img/14.png",
      caption: "Natural texture that softens with every gentle wash.",
    },
    {
      img: "/assets/img/24.png",
      caption: "From work hours to slow coffee afternoons.",
    },
    {
      img: "/assets/img/26.png",
      caption: "Room to move, breathe, and simply be.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="why-sum"
      style={{
        background: "var(--bg-color, #EDE8DC)",
        padding: "100px 24px 90px",
        position: "relative",
        borderTop: "1px solid rgba(44, 32, 22, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Core Philosophy Header */}
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 60px" }} className="fade-up">
          <IndianArchBadge style={{ marginBottom: "16px" }}>The Sum Philosophy</IndianArchBadge>
          <h2
            style={{
              fontSize: "clamp(30px, 4.4vw, 48px)",
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontWeight: 700,
              color: "#2C2016",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              margin: "0 0 20px",
            }}
          >
            A little more room to be you.
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.8vw, 17px)",
              color: "#5C4A3E",
              lineHeight: 1.7,
              margin: "0 auto 28px",
            }}
          >
            Clothes shouldn&apos;t feel like an outfit you have to put on; they should feel like an extension of how you
            live. We make thoughtfully designed everyday wear cut from handspun, handwoven khadi — garments that breathe,
            soften with time, and give you room to move, think, and be.
          </p>
          <Link
            href="/our-story"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
              background: "#2C2016",
              color: "#FAF6F0",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.background = "#660608";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "#2C2016";
            }}
          >
            <span>Get to Know Sum</span>
            <FiArrowRight size={16} />
          </Link>
        </div>

        {/* Instagram Community Showcase */}
        <div
          className="fade-up"
          style={{
            background: "#FAF6F0",
            borderRadius: 24,
            padding: "44px 32px",
            border: "1px solid rgba(44, 32, 22, 0.1)",
            boxShadow: "0 10px 30px rgba(44, 32, 22, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 32,
              paddingBottom: 20,
              borderBottom: "1px solid rgba(44, 32, 22, 0.08)",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  color: "#660608",
                  marginBottom: 6,
                }}
              >
                <FiInstagram size={15} />
                <span>@sumclothico • Follow us on Instagram</span>
              </div>
              <p style={{ margin: 0, fontSize: 15, color: "#6B5A4E", fontStyle: "italic" }}>
                &ldquo;Real people living in Sum. Tag us to be featured.&rdquo;
              </p>
            </div>
            <a
              href="https://instagram.com/sumclothico"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: "none",
                background: "transparent",
                color: "#2C2016",
                border: "1.5px solid #2C2016",
                transition: "background 0.2s, color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#2C2016";
                e.currentTarget.style.color = "#FAF6F0";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#2C2016";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span>Check Out Page ↗</span>
            </a>
          </div>

          {/* Grid of Community Photos */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {instagramPosts.map((post, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  aspectRatio: "3 / 4",
                  background: "#EBE5D9",
                  boxShadow: "0 4px 14px rgba(44, 32, 22, 0.06)",
                  cursor: "pointer",
                }}
              >
                <img
                  src={post.img}
                  alt={post.caption}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(44,32,22,0.7) 0%, transparent 60%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 16,
                    opacity: 0.9,
                  }}
                >
                  <p style={{ color: "#FAF6F0", fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                    {post.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
