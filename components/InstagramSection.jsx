"use client";

import React from "react";
import Script from "next/script";
import { FiInstagram } from "react-icons/fi";

export default function InstagramSection() {
  return (
    <section
      className="ig-section"
      style={{
        backgroundColor: "var(--bg-color, #EDE8DC)",
        padding: "clamp(50px, 8vh, 90px) clamp(16px, 4vw, 40px)",
        position: "relative",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#881A1C",
              marginBottom: 10,
            }}
          >
            <FiInstagram size={15} />
            <span>@sumclothico · Follow on Instagram</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(26px, 4vw, 40px)",
              margin: 0,
              color: "#1c1917",
              letterSpacing: "-0.5px",
            }}
          >
            Moments in Living Khadi
          </h2>
          <p
            style={{
              color: "#78716c",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            Real stories, handspun textiles, and mindful daily wear from our community.
          </p>
        </div>

        {/* Elfsight Instagram Feed */}
        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="lazyOnload"
        />
        <div
          className="elfsight-app-3d7c7d5d-a1ac-4c12-8000-957ef48b134b"
          data-elfsight-app-lazy
        />
      </div>
    </section>
  );
}
