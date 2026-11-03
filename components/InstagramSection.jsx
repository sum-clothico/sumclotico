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
        padding: "clamp(50px, 8vh, 85px) clamp(20px, 5vw, 60px) clamp(30px, 5vh, 50px)",
        position: "relative",
        zIndex: 5,
        overflow: "visible",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
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

        {/* Elfsight Instagram Feed: Side padding & expanded horizontal clip to preserve slider arrows */}
        <div
          className="elfsight-crop-wrapper"
          style={{
            position: "relative",
            padding: "0 28px",
            clipPath: "inset(0px -60px 52px -60px)",
            marginBottom: "-48px",
          }}
        >
          <Script
            src="https://elfsightcdn.com/platform.js"
            strategy="lazyOnload"
          />
          <div
            className="elfsight-app-3d7c7d5d-a1ac-4c12-8000-957ef48b134b"
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  );
}
