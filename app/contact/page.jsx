"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import IndianArchBadge from "@/components/IndianArchBadge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiMail,
  FiCheckCircle,
  FiSend,
  FiArrowRight,
  FiInstagram,
  FiYoutube,
  FiBookOpen,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { trackLead, trackEvent } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

function AnimatedWords({ text, className = "contact-anim-word" }) {
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

const CATEGORIES = [
  "Order / Product",
  "Collaboration",
  "Wholesale / B2B",
  "General",
  "Other",
];

export default function ContactPage() {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Order / Product",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTl.fromTo(
        ".contact-hero-badge",
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.8)" }
      );

      heroTl.fromTo(
        ".contact-hero__headline .contact-anim-word",
        { y: "135%", rotate: 4, opacity: 0 },
        { y: "0%", rotate: 0, opacity: 1, duration: 1.1, stagger: 0.06 },
        "-=0.4"
      );

      heroTl.fromTo(
        ".contact-hero__copy",
        { opacity: 0, y: 24, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
        "-=0.5"
      );

      heroTl.fromTo(
        ".contact-anim-stat",
        { opacity: 0, y: 30, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.1, ease: "power3.out" },
        "-=0.5"
      );

      gsap.fromTo(
        ".contact-col-card",
        { opacity: 0, y: 45, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-options-grid",
            start: "top 82%",
          },
        }
      );

      gsap.fromTo(
        ".contact-form-section",
        { opacity: 0, y: 45, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-form-section",
            start: "top 85%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const selectCategoryAndScroll = (cat) => {
    setForm((prev) => ({ ...prev, category: cat }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    trackLead("contact_form", {
      name: form.name,
      email: form.email,
      category: form.category,
    });
    trackEvent("contact_form_submit", {
      category: form.category,
      has_message: Boolean(form.message),
    });

    setIsSubmitted(true);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", minHeight: "100vh", backgroundColor: "#EDE8DC" }}>
      <Navbar />

      <style>{`
        .contact-page {
          background-color: #EDE8DC;
          min-height: 100vh;
          padding: 130px 24px 80px;
          color: #1a140e;
          position: relative;
          overflow: hidden;
        }
        .contact-container {
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 56px);
          position: relative;
          z-index: 3;
        }
        .contact-hero {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 40px;
        }
        .contact-hero__headline {
          font-family: serif;
          font-size: clamp(2.4rem, 4.5vw, 3.8rem);
          font-weight: 500;
          line-height: 1.15;
          color: #1a140e;
          margin: 0 0 16px 0;
        }
        .contact-hero__copy {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #4a3c30;
          margin: 0;
        }
        .contact-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 28px;
          margin-bottom: 70px;
        }
        .contact-col-card {
          position: relative;
          padding: 24px 22px 20px;
          background: transparent;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .contact-col-card:hover {
          transform: translateY(-4px);
        }
        .contact-col__title {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #660608;
          display: block;
          margin-bottom: 8px;
        }
        .contact-col__list {
          list-style: none;
          padding: 0;
          margin: 0 0 18px 0;
          flex-grow: 1;
        }
        .contact-col__list li {
          font-size: 0.92rem;
          color: #55483d;
          line-height: 1.6;
          margin-bottom: 4px;
        }
        .contact-col__btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          color: #660608;
          border: none;
          padding: 0;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: gap 0.2s ease;
        }
        .contact-col__btn:hover {
          gap: 10px;
        }
        .contact-main-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .contact-main-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        .contact-field {
          margin-bottom: 20px;
        }
        .contact-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #660608;
          margin-bottom: 8px;
        }
        .contact-input, .contact-textarea {
          width: 100%;
          padding: 13px 16px;
          border-radius: 8px;
          border: 1px solid rgba(44, 32, 22, 0.2);
          background: rgba(255, 255, 255, 0.8);
          color: #1a140e;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .contact-input:focus, .contact-textarea:focus {
          border-color: #660608;
        }
        .contact-radio-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .contact-radio-pill {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1.5px solid rgba(44, 32, 22, 0.2);
          background: transparent;
          color: #443528;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .contact-radio-pill.active {
          background: #660608;
          color: #FAF6F0;
          border-color: #660608;
        }
        .contact-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #660608;
          color: #FAF6F0;
          border: none;
          padding: 15px 32px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .contact-direct-wrap {
          border-left: 1px solid rgba(44, 32, 22, 0.14);
          padding-left: 48px;
        }
        @media (max-width: 768px) {
          .contact-direct-wrap {
            border-left: none;
            border-top: 1px solid rgba(44, 32, 22, 0.14);
            padding-left: 0;
            padding-top: 36px;
          }
        }
        .contact-channel {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }
        .contact-channel__icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(102, 6, 8, 0.08);
          color: #660608;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .contact-channel__label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8a7a6c;
          margin-bottom: 2px;
        }
        .contact-channel__val {
          font-family: serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #1a140e;
          text-decoration: none;
          display: block;
          margin-bottom: 4px;
        }
        .contact-channel__val:hover {
          color: #660608;
        }
        .contact-channel__desc {
          font-size: 0.88rem;
          color: #6e5d4e;
          line-height: 1.5;
        }
      `}</style>

      <div className="contact-page">
        {/* ─── LEFT SIDE REPEATING PATTERN IMAGE (bgele2.png) ─── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "48px",
            backgroundImage: 'url("/assets/bgele2.png")',
            backgroundRepeat: "repeat-y",
            backgroundPosition: "left top",
            backgroundSize: "48px auto",
            opacity: 0.28,
            pointerEvents: "none",
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        {/* ─── RIGHT SIDE REPEATING PATTERN IMAGE (bgele2.png, MIRRORED) ─── */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "48px",
            backgroundImage: 'url("/assets/bgele2.png")',
            backgroundRepeat: "repeat-y",
            backgroundPosition: "left top",
            backgroundSize: "48px auto",
            transform: "scaleX(-1)",
            opacity: 0.28,
            pointerEvents: "none",
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        <div className="contact-container">

          {/* ─── Hero: Two-Column Editorial ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 60,
              alignItems: "center",
              padding: "0 0 64px",
              borderBottom: "1px solid rgba(44,32,22,0.12)",
              marginBottom: 60,
            }}
          >
            {/* Left: heading copy */}
            <div>
              <div className="contact-hero-badge">
                <IndianArchBadge style={{ marginBottom: "18px" }}>
                  Get In Touch
                </IndianArchBadge>
              </div>
              <h1 className="contact-hero__headline" style={{ marginBottom: 20 }}>
                <AnimatedWords text="Come say hello." />
              </h1>
              <p className="contact-hero__copy" style={{ marginBottom: 28 }}>
                Whether you need help finding your size, want to collaborate, or just want to share something — we read every message.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "#55483d" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#660608", flexShrink: 0 }} />
                  We typically reply within 24 hours
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "#55483d" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#660608", flexShrink: 0 }} />
                  Available Mon–Sat, 10 AM – 6 PM IST
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "#55483d" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#660608", flexShrink: 0 }} />
                  All messages are read by a real person
                </div>
              </div>
            </div>

            {/* Right: 3 stat / fact mini-placards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Response Time", value: "Under 24h", note: "on all inquiries" },
                { label: "Reach us directly", value: "hello@sumclothico.com", note: "or WhatsApp us" },
                { label: "Based In", value: "Mumbai, India", note: "Shipping pan-India" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="contact-anim-stat"
                  style={{
                    position: "relative",
                    padding: "18px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <svg
                    viewBox="0 0 480 72"
                    preserveAspectRatio="none"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
                    aria-hidden="true"
                  >
                    <path
                      d="M 16,0 L 464,0 L 464,3 A 13 13 0 0 0 477 16 L 480 16 L 480 56 L 477 56 A 13 13 0 0 0 464 69 L 464 72 L 16 72 L 16 69 A 13 13 0 0 0 3 56 L 0 56 L 0 16 L 3 16 A 13 13 0 0 0 16 3 L 16 0 Z"
                      fill="#EDE8DC"
                      stroke="rgba(44,32,22,0.16)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 20,6 L 460,6 L 460,8 A 10 10 0 0 0 470 18 L 474 18 L 474 54 L 470 54 A 10 10 0 0 0 460 64 L 460 66 L 20 66 L 20 64 A 10 10 0 0 0 10 54 L 6 54 L 6 18 L 10 18 A 10 10 0 0 0 20 8 L 20 6 Z"
                      fill="none"
                      stroke="#660608"
                      strokeWidth="0.8"
                      strokeOpacity="0.28"
                    />
                  </svg>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8a7a6c", display: "block", marginBottom: 2 }}>{item.label}</span>
                    <span style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1a140e", fontFamily: "serif" }}>{item.value}</span>
                  </div>
                  <span style={{ position: "relative", zIndex: 1, fontSize: "0.78rem", color: "#660608", fontStyle: "italic" }}>{item.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Contact Options (ASTAKA Scalloped Corner Cards) ─── */}
          <div className="contact-options-grid">
            
            {/* 1: Order & Product Help */}
            <div className="contact-col-card">
              <svg
                viewBox="0 0 280 290"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                aria-hidden="true"
              >
                <path
                  d="M 24,0 L 256,0 L 256,4 A 20 20 0 0 0 276 24 L 280 24 L 280 274 A 16 16 0 0 1 264 290 L 16 290 A 16 16 0 0 1 0 274 L 0 24 L 4 24 A 20 20 0 0 0 24 4 L 24 0 Z"
                  fill="#EDE8DC"
                  stroke="rgba(44, 32, 22, 0.18)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 28,8 L 252,8 L 252,10 A 16 16 0 0 0 268 26 L 272 26 L 272 270 A 12 12 0 0 1 260 282 L 20 282 A 12 12 0 0 1 8 270 L 8 26 L 12 26 A 16 16 0 0 0 28 10 L 28 8 Z"
                  fill="none"
                  stroke="#660608"
                  strokeWidth="1"
                  strokeOpacity="0.32"
                />
              </svg>
              <div style={{ position: "relative", zIndex: 1 }}>
                <span className="contact-col__title">01 • Order & Product Help</span>
                <p style={{ fontSize: "0.85rem", color: "#8a7a6c", margin: "0 0 10px 0" }}>
                  Questions about:
                </p>
                <ul className="contact-col__list">
                  <li>✦ Your order status</li>
                  <li>✦ Size and fit guidance</li>
                  <li>✦ Product availability</li>
                  <li>✦ Fabric care instructions</li>
                  <li>✦ Shipping & delivery</li>
                </ul>
                <button
                  type="button"
                  onClick={() => selectCategoryAndScroll("Order / Product")}
                  className="contact-col__btn"
                >
                  Get Order Help <FiArrowRight />
                </button>
              </div>
            </div>

            {/* 2: Collaborate With Us */}
            <div className="contact-col-card">
              <svg
                viewBox="0 0 280 290"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                aria-hidden="true"
              >
                <path
                  d="M 24,0 L 256,0 L 256,4 A 20 20 0 0 0 276 24 L 280 24 L 280 274 A 16 16 0 0 1 264 290 L 16 290 A 16 16 0 0 1 0 274 L 0 24 L 4 24 A 20 20 0 0 0 24 4 L 24 0 Z"
                  fill="#EDE8DC"
                  stroke="rgba(44, 32, 22, 0.18)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 28,8 L 252,8 L 252,10 A 16 16 0 0 0 268 26 L 272 26 L 272 270 A 12 12 0 0 1 260 282 L 20 282 A 12 12 0 0 1 8 270 L 8 26 L 12 26 A 16 16 0 0 0 28 10 L 28 8 Z"
                  fill="none"
                  stroke="#660608"
                  strokeWidth="1"
                  strokeOpacity="0.32"
                />
              </svg>
              <div style={{ position: "relative", zIndex: 1 }}>
                <span className="contact-col__title">02 • Collaborate With Us</span>
                <p style={{ fontSize: "0.85rem", color: "#8a7a6c", margin: "0 0 10px 0" }}>
                  For:
                </p>
                <ul className="contact-col__list">
                  <li>✦ Creator collaborations</li>
                  <li>✦ Brand collaborations</li>
                  <li>✦ Creative partnerships</li>
                  <li>✦ Community events</li>
                  <li>✦ Editorial features</li>
                </ul>
                <button
                  type="button"
                  onClick={() => selectCategoryAndScroll("Collaboration")}
                  className="contact-col__btn"
                >
                  Start a Conversation <FiArrowRight />
                </button>
              </div>
            </div>

            {/* 3: Wholesale / B2B */}
            <div className="contact-col-card">
              <svg
                viewBox="0 0 280 290"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                aria-hidden="true"
              >
                <path
                  d="M 24,0 L 256,0 L 256,4 A 20 20 0 0 0 276 24 L 280 24 L 280 274 A 16 16 0 0 1 264 290 L 16 290 A 16 16 0 0 1 0 274 L 0 24 L 4 24 A 20 20 0 0 0 24 4 L 24 0 Z"
                  fill="#EDE8DC"
                  stroke="rgba(44, 32, 22, 0.18)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 28,8 L 252,8 L 252,10 A 16 16 0 0 0 268 26 L 272 26 L 272 270 A 12 12 0 0 1 260 282 L 20 282 A 12 12 0 0 1 8 270 L 8 26 L 12 26 A 16 16 0 0 0 28 10 L 28 8 Z"
                  fill="none"
                  stroke="#660608"
                  strokeWidth="1"
                  strokeOpacity="0.32"
                />
              </svg>
              <div style={{ position: "relative", zIndex: 1 }}>
                <span className="contact-col__title">03 • Wholesale / B2B</span>
                <p style={{ fontSize: "0.85rem", color: "#8a7a6c", margin: "0 0 10px 0" }}>
                  Interested in:
                </p>
                <ul className="contact-col__list">
                  <li>✦ Stocking Sum Clothico</li>
                  <li>✦ Corporate gifting</li>
                  <li>✦ Bulk artisan orders</li>
                  <li>✦ Craft partnerships</li>
                </ul>
                <button
                  type="button"
                  onClick={() => selectCategoryAndScroll("Wholesale / B2B")}
                  className="contact-col__btn"
                >
                  Business Enquiry <FiArrowRight />
                </button>
              </div>
            </div>

            {/* 4: Just Want to Talk? */}
            <div className="contact-col-card">
              <svg
                viewBox="0 0 280 290"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                aria-hidden="true"
              >
                <path
                  d="M 24,0 L 256,0 L 256,4 A 20 20 0 0 0 276 24 L 280 24 L 280 274 A 16 16 0 0 1 264 290 L 16 290 A 16 16 0 0 1 0 274 L 0 24 L 4 24 A 20 20 0 0 0 24 4 L 24 0 Z"
                  fill="#EDE8DC"
                  stroke="rgba(44, 32, 22, 0.18)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 28,8 L 252,8 L 252,10 A 16 16 0 0 0 268 26 L 272 26 L 272 270 A 12 12 0 0 1 260 282 L 20 282 A 12 12 0 0 1 8 270 L 8 26 L 12 26 A 16 16 0 0 0 28 10 L 28 8 Z"
                  fill="none"
                  stroke="#660608"
                  strokeWidth="1"
                  strokeOpacity="0.32"
                />
              </svg>
              <div style={{ position: "relative", zIndex: 1 }}>
                <span className="contact-col__title">04 • Just Want to Talk?</span>
                <h3 style={{ fontFamily: "serif", fontSize: "1.15rem", color: "#1a140e", margin: "0 0 6px 0" }}>
                  We&apos;re open to ideas.
                </h3>
                <p style={{ fontSize: "0.92rem", color: "#55483d", lineHeight: 1.6, margin: "0 0 16px 0" }}>
                  If there&apos;s something we haven&apos;t covered, send us a message.
                </p>
                <button
                  type="button"
                  onClick={() => selectCategoryAndScroll("General")}
                  className="contact-col__btn"
                >
                  Send Us a Message <FiArrowRight />
                </button>
              </div>
            </div>

          </div>

          {/* ─── Contact Form & Direct Contact (ASTAKA Framed Section) ─── */}
          <div
            ref={formRef}
            className="contact-form-section"
            style={{
              position: "relative",
              padding: "clamp(36px, 5vw, 56px)",
              marginBottom: 70,
            }}
          >
            {/* SVG ASTAKA Placard Outer Frame for Form */}
            <svg
              viewBox="0 0 1192 680"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              <path
                d="M 32,0 L 1160,0 L 1160,6 A 26 26 0 0 0 1186 32 L 1192 32 L 1192 648 L 1186 648 A 26 26 0 0 0 1160 674 L 1160 680 L 32 680 L 32 674 A 26 26 0 0 0 6 648 L 0 648 L 0 32 L 6 32 A 26 26 0 0 0 32 6 L 32 0 Z"
                fill="#FAF6F0"
                stroke="rgba(44, 32, 22, 0.22)"
                strokeWidth="1.5"
              />
              <path
                d="M 36,10 L 1156,10 L 1156,14 A 22 22 0 0 0 1178 36 L 1182 36 L 1182 644 L 1178 644 A 22 22 0 0 0 1156 666 L 1156 670 L 36 670 L 36 666 A 22 22 0 0 0 14 644 L 10 644 L 10 36 L 14 36 A 22 22 0 0 0 36 14 L 36 10 Z"
                fill="none"
                stroke="#660608"
                strokeWidth="1"
                strokeOpacity="0.35"
              />
            </svg>

            <div className="contact-main-grid" style={{ position: "relative", zIndex: 1 }}>
              
              {/* Form */}
              <div>
                <IndianArchBadge style={{ marginBottom: "14px" }}>
                  Send A Message
                </IndianArchBadge>
                <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1a140e", margin: "0 0 24px" }}>
                  Tell us what you have in mind.
                </h2>
                
                {isSubmitted ? (
                  <div style={{ textAlign: "center", padding: "40px 10px", border: "1px solid rgba(44, 32, 22, 0.14)", borderRadius: 12 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: "#660608",
                        color: "#FAF6F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <FiCheckCircle size={26} />
                    </div>
                    <h3 style={{ fontFamily: "serif", fontSize: "1.4rem", margin: "0 0 10px" }}>
                      Message Received
                    </h3>
                    <p style={{ color: "#55483d", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 24 }}>
                      Thank you for reaching out, {form.name}. We will get back to you at {form.email} as soon as possible.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setForm({ name: "", email: "", category: "Order / Product", message: "" });
                      }}
                      style={{
                        background: "transparent",
                        border: "1.5px solid #660608",
                        color: "#660608",
                        padding: "10px 24px",
                        borderRadius: 99,
                        fontWeight: 800,
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    
                    {/* Name */}
                    <div className="contact-field">
                      <label className="contact-label">Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="contact-input"
                      />
                    </div>

                    {/* Email */}
                    <div className="contact-field">
                      <label className="contact-label">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="Your email address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="contact-input"
                      />
                    </div>

                    {/* What can we help you with? */}
                    <div className="contact-field">
                      <label className="contact-label">What can we help you with? *</label>
                      <div className="contact-radio-group">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setForm({ ...form, category: cat })}
                            className={`contact-radio-pill ${form.category === cat ? "active" : ""}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="contact-field">
                      <label className="contact-label">Message *</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us what you have in mind..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="contact-textarea"
                      />
                    </div>

                    <button type="submit" className="contact-submit-btn">
                      <FiSend size={14} /> Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Direct Contact Channels */}
              <div className="contact-direct-wrap">
                <IndianArchBadge style={{ marginBottom: "14px" }}>
                  Direct Reach
                </IndianArchBadge>
                <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", color: "#1a140e", margin: "0 0 24px" }}>
                  Direct channels.
                </h2>

                {/* WhatsApp */}
                <div className="contact-channel">
                  <div className="contact-channel__icon" style={{ background: "rgba(22, 163, 74, 0.1)", color: "#16a34a" }}>
                    <FaWhatsapp size={20} />
                  </div>
                  <div>
                    <div className="contact-channel__label">WhatsApp Concierge</div>
                    <a
                      href="https://wa.me/919329587707"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-channel__val"
                    >
                      +91 9329587707
                    </a>
                    <div className="contact-channel__desc">
                      Direct chat with our styling and order support concierge.
                    </div>
                  </div>
                </div>

                {/* Catalogue link */}
                <div className="contact-channel">
                  <div className="contact-channel__icon">
                    <FiBookOpen size={18} />
                  </div>
                  <div>
                    <div className="contact-channel__label">Catalogue</div>
                    <a href="/shop" className="contact-channel__val">
                      View Sum Catalogue
                    </a>
                    <div className="contact-channel__desc">
                      Browse all handcrafted silhouettes and Khadi pieces.
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-channel">
                  <div className="contact-channel__icon">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <div className="contact-channel__label">Email</div>
                    <a href="mailto:support@sumclothico.com" className="contact-channel__val">
                      support@sumclothico.com
                    </a>
                    <div className="contact-channel__desc">
                      Write to us for queries, size consultation or orders.
                    </div>
                  </div>
                </div>

                {/* Instagram */}
                <div className="contact-channel">
                  <div className="contact-channel__icon">
                    <FiInstagram size={18} />
                  </div>
                  <div>
                    <div className="contact-channel__label">Instagram</div>
                    <a
                      href="https://www.instagram.com/sumclothico/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-channel__val"
                    >
                      @sumclothico
                    </a>
                    <div className="contact-channel__desc">
                      Follow our journey of hands, looms and everyday living.
                    </div>
                  </div>
                </div>

                {/* YouTube */}
                <div className="contact-channel">
                  <div className="contact-channel__icon">
                    <FiYoutube size={18} />
                  </div>
                  <div>
                    <div className="contact-channel__label">YouTube</div>
                    <a
                      href="https://youtube.com/@sumclothico"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-channel__val"
                    >
                      @sumclothico
                    </a>
                    <div className="contact-channel__desc">
                      Documentary films on weaving, spinning and making.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ─── Closing Line ─── */}
          <div style={{ textAlign: "center", borderTop: "1px solid rgba(44, 32, 22, 0.12)", paddingTop: 30, marginBottom: 40 }}>
            <p style={{ fontFamily: "serif", fontSize: "1.25rem", fontStyle: "italic", color: "#660608", margin: 0 }}>
              Some of the best things start with a conversation.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
