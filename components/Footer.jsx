"use client";

import React from "react";
import Link from "next/link";
import { SOCIAL_ICONS } from "@/lib/data";

export default function Footer() {
  return (
    <div
      className="footer-inner"
      style={{
        backgroundColor: "#FAF6F0",
        borderRadius: 0,
        borderTop: "1.5px solid rgba(44, 32, 22, 0.16)",
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        padding: "64px 32px 32px",
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ─── Top Brand Wordmark & Tagline ─── */}
      <div style={{ textAlign: "center", marginBottom: "32px", width: "100%" }}>
        <div style={{ display: "inline-block", marginBottom: "10px" }}>
          <span
            style={{
              fontFamily: "var(--font-epilogue, 'Epilogue', serif)",
              fontWeight: 800,
              fontSize: "clamp(2.8rem, 8vw, 6.2rem)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#2C2016",
              lineHeight: 1,
              display: "block",
            }}
          >
            सम् CLOTHICO
          </span>
        </div>
        <p
          style={{
            fontSize: "14px",
            letterSpacing: "3px",
            fontWeight: 700,
            color: "#660608",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Made with time. Made for living.
        </p>
      </div>

      {/* Traditional Indian Border Pattern Divider — Stretched 100% Edge-to-Edge */}
      <div
        className="footer-pattern-divider"
        style={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          height: "26px",
          backgroundImage: 'url("/assets/footerpattern-accent.png")',
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center",
          backgroundSize: "auto 24px",
          opacity: 0.9,
          marginBottom: "40px",
        }}
        aria-hidden="true"
      />

      {/* ─── 4 Unified Luxury Categorized Columns (Centered Container) ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          paddingBottom: "40px",
          borderBottom: "1px solid rgba(44, 32, 22, 0.12)",
          boxSizing: "border-box",
        }}
      >
        {/* Column 1: HERITAGE & SUM */}
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: "#660608",
              marginBottom: "14px",
            }}
          >
            Heritage & Craft
          </div>
          <p
            style={{
              fontSize: "13.5px",
              lineHeight: 1.6,
              color: "#4A3E36",
              margin: "0 0 14px",
            }}
          >
            Khadi weaving cluster
            <br />
            Madhya Pradesh & Kolkata, India
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px" }}>
            <Link
              href="/our-story"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Our Story
            </Link>
            <Link
              href="/fabric"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Fabric & Origin
            </Link>
            <Link
              href="/journal"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Journal & Field Notes
            </Link>
            <span style={{ fontSize: "12px", color: "#8C7868", fontWeight: 600 }}>
              Artisan positions opening soon
            </span>
          </div>
        </div>

        {/* Column 2: SHOP */}
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: "#660608",
              marginBottom: "14px",
            }}
          >
            Shop Silhouettes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px" }}>
            <Link
              href="/shop"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              All Pieces
            </Link>
            <Link
              href="/size-guide"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Size Guide
            </Link>
            <Link
              href="/fabric#care"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Fabric Care
            </Link>
            <Link
              href="/track-order"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Track Order
            </Link>
          </div>
        </div>

        {/* Column 3: HELP & POLICIES */}
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: "#660608",
              marginBottom: "14px",
            }}
          >
            Care & Policies
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px" }}>
            <Link
              href="/policies/shipping"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Shipping & Delivery
            </Link>
            <Link
              href="/policies/returns"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Returns & Exchange
            </Link>
            <Link
              href="/policies/privacy"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Privacy Policy
            </Link>
            <Link
              href="/policies/terms"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Terms & Conditions
            </Link>
            <Link
              href="/faq"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              FAQs
            </Link>
          </div>
        </div>

        {/* Column 4: STUDIO & CONNECT */}
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: "#660608",
              marginBottom: "14px",
            }}
          >
            Studio & Inquiries
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px" }}>
            <Link
              href="/contact"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              Contact & Inquiries
            </Link>
            <a
              href="mailto:support@sumclothico.com"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              support@sumclothico.com
            </a>
            <a
              href="https://wa.me/919329587707"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4A3E36", textDecoration: "none", transition: "color 0.2s", fontWeight: 600 }}
              onMouseEnter={(e) => (e.target.style.color = "#660608")}
              onMouseLeave={(e) => (e.target.style.color = "#4A3E36")}
            >
              WhatsApp: +91 9329587707
            </a>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "18px", alignItems: "center" }}>
            {SOCIAL_ICONS.map(({ href, label, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="single-social w-inline-block"
                aria-label={label}
                style={{
                  width: "34px",
                  height: "34px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2C2016",
                  transition: "transform 0.2s ease",
                }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ))}
            <a
              href="https://www.facebook.com/sumclotico"
              target="_blank"
              rel="noopener noreferrer"
              className="single-social w-inline-block"
              aria-label="Facebook"
              style={{
                width: "34px",
                height: "34px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2C2016",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 40 40" fill="none">
                <path
                  d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C28.837 36 36 28.837 36 20C36 11.163 28.837 4 20 4ZM24.5 14H22C21.173 14 21 14.327 21 15.2V17H24.5L24 21H21V33H17V21H15V17H17V15.2C17 12.013 18.513 10 22 10C23.343 10 24.5 10.1 24.5 10.1V14Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Bottom Copyright (Edge-to-Edge Container) ─── */}
      <div
        style={{
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          fontSize: "12.5px",
          color: "#8C7868",
        }}
      >
        <div>
          © {new Date().getFullYear()} Sum Clothico. Handcrafted Khadi & Indian Handwoven Textiles. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/policies/privacy" style={{ color: "inherit", textDecoration: "none" }}>
            Privacy
          </Link>
          <span>·</span>
          <Link href="/policies/terms" style={{ color: "inherit", textDecoration: "none" }}>
            Terms
          </Link>
          <span>·</span>
          <Link href="/policies/shipping" style={{ color: "inherit", textDecoration: "none" }}>
            Shipping
          </Link>
        </div>
      </div>
    </div>
  );
}
