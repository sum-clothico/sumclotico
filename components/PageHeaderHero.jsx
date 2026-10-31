"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import IndianArchBadge from "./IndianArchBadge";

/**
 * PageHeaderHero
 * Architectural royal header for sub-pages (/our-story, /fabric, /journal, /contact):
 * - Authentic warm luxury palette: Rich Espresso (#221811) with golden & burgundy undertones
 * - Genuine crisp vector Indian cusped arch cartouche (no distorted raster rotations)
 * - Luminous serif typography in #FAF6F0 with delicate micro-badges
 * - Traditional Indian block-print border divider along the lower boundary
 */
export default function PageHeaderHero({
  badgeText = "SUM ATELIER",
  title = "Our Story",
  subtitle = "Handwoven beginnings. Easy silhouettes. Clothes made for real days.",
}) {
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".ph-bg-image",
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 0.22, duration: 1.1 }
      );

      tl.fromTo(
        ".ph-arch-frame",
        { scale: 0.94, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 1.0, ease: "back.out(1.3)" },
        "-=0.8"
      );

      tl.fromTo(
        ".ph-badge-wrap",
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.6"
      );

      tl.fromTo(
        ".ph-title",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.45"
      );

      tl.fromTo(
        ".ph-subtitle",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.35"
      );
    }, headerRef);

    return () => ctx.revert();
  }, [title]);

  return (
    <section
      ref={headerRef}
      className="page-header-hero"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "clamp(260px, 30vw, 360px)",
        background: "linear-gradient(180deg, #1F1610 0%, #2A1F16 55%, #1C130D 100%)",
        color: "#FAF6F0",
        padding: "clamp(92px, 11vh, 120px) 20px clamp(40px, 6vh, 60px)",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        zIndex: 5,
      }}
    >
      {/* ─── 1. Authentic Khadi / Handloom Texture Background ─── */}
      <div
        className="ph-bg-image"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: 'url("/assets/1.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "grayscale(60%) contrast(115%) brightness(0.7)",
          opacity: 0.22,
          pointerEvents: "none",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* ─── 2. Warm Radial Light Glow behind Cartouche ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(102, 6, 8, 0.28) 0%, rgba(34, 24, 17, 0.6) 50%, rgba(20, 13, 8, 0.95) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden="true"
      />

      {/* ─── 3. Subtle Cloth Weave Grain ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: 'url("/assets/herobg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden="true"
      />

      {/* ─── 4. Architectural Content Cartouche ─── */}
      <div
        className="ph-arch-frame"
        style={{
          position: "relative",
          zIndex: 4,
          maxWidth: 820,
          width: "100%",
          margin: "0 auto",
          padding: "clamp(24px, 3.5vw, 42px) clamp(20px, 4vw, 56px)",
          boxSizing: "border-box",
          borderRadius: 24,
          background: "rgba(38, 26, 18, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(212, 175, 55, 0.28)", // Subtle antique gold line
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Subtle decorative Indian Arch corners in vector */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 12,
            right: 12,
            bottom: 8,
            border: "1px dashed rgba(250, 246, 240, 0.12)",
            borderRadius: 18,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />

        {/* Badge */}
        {badgeText && (
          <div className="ph-badge-wrap" style={{ marginBottom: 12 }}>
            <IndianArchBadge
              color="#660608"
              textColor="#FAF6F0"
              height={26}
              widthRatio={14}
              style={{
                boxShadow: "0 3px 12px rgba(102, 6, 8, 0.4)",
                border: "1px solid rgba(250, 246, 240, 0.25)",
              }}
            >
              <span style={{ fontSize: "10px", letterSpacing: "2.4px", fontWeight: 800 }}>
                {badgeText}
              </span>
            </IndianArchBadge>
          </div>
        )}

        {/* Headline */}
        <h1
          className="ph-title"
          style={{
            fontFamily: "var(--font-epilogue, 'Epilogue', serif)",
            fontSize: "clamp(1.75rem, 3.8vw, 2.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            lineHeight: 1.18,
            color: "#FAF6F0",
            margin: "0 0 10px 0",
            textShadow: "0 2px 14px rgba(0, 0, 0, 0.6)",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="ph-subtitle"
            style={{
              fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
              fontSize: "clamp(0.88rem, 1.25vw, 1.05rem)",
              color: "#E2D8C8",
              lineHeight: 1.6,
              maxWidth: 640,
              margin: 0,
              fontWeight: 400,
              textShadow: "0 1px 6px rgba(0, 0, 0, 0.4)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* ─── 5. Bottom Indian Ornamental Border Transition ─── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 14,
          backgroundImage: 'url("/assets/footerpattern-accent.png")',
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center bottom",
          backgroundSize: "auto 14px",
          opacity: 0.85,
          zIndex: 5,
        }}
        aria-hidden="true"
      />
    </section>
  );
}
