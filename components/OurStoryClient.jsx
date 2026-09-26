"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/app/styles/our-story.css";
import Footer from "./Footer";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function OurStoryClient() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".os-fade-in",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".os-hero",
            start: "top 80%",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="our-story-page">
      <div className="os-noise" />

      {/* ─── HERO ─── */}
      <section className="os-hero">
        <span className="os-subtitle os-fade-in">Our Story</span>
        <h1 className="os-fade-in" style={{ fontSize: "clamp(2rem, 3.8vw, 3.4rem)", lineHeight: 1.25, fontWeight: 500, fontFamily: "serif" }}>
          We started with a simple question:
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 400, color: "#8B6F47", display: "block", marginTop: 12 }}>
            Why can&apos;t everyday clothes feel as flowy as air, as warm as earth and as easy as water?
          </span>
        </h1>
        <div className="os-fade-in" style={{ maxWidth: 660, margin: "28px auto 0", fontSize: "1.1rem", lineHeight: 1.8, color: "#4a3c30" }}>
          <p style={{ margin: "0 0 8px" }}>Not louder.</p>
          <p style={{ margin: "0 0 8px" }}>Not trendier.</p>
          <p style={{ margin: "0 0 16px" }}>Just more considered.</p>
          <p style={{ margin: "0 0 8px" }}>
            Clothes that feel good on your skin, make sense in your wardrobe and carry a little more thought in every detail.
          </p>
          <p style={{ fontWeight: 600, color: "#1a140e", marginTop: 12 }}>
            That&apos;s where Sum Clothico began.
          </p>
        </div>
      </section>

      {/* ─── WHERE IT STARTED ─── */}
      <section className="os-section" style={{ maxWidth: 960, margin: "0 auto 90px", padding: "0 24px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)", padding: "clamp(32px, 5vw, 56px)", borderRadius: 24, border: "1px solid rgba(42, 31, 20, 0.1)" }}>
          <span className="os-subtitle">Where It Started</span>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1a140e", margin: "8px 0 24px" }}>
            Made by Humans. For real lives.
          </h2>
          <div style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "#3f3329", maxWidth: 780 }}>
            <p style={{ marginBottom: 14 }}>
              There was always something fascinating about the things we wear.
            </p>
            <p style={{ marginBottom: 6 }}>How a piece of cloth becomes a shirt.</p>
            <p style={{ marginBottom: 6 }}>How a thread becomes a textile.</p>
            <p style={{ marginBottom: 16 }}>
              How something made by someone&apos;s hands eventually becomes part of someone else&apos;s everyday life.
            </p>
            <p style={{ marginBottom: 14 }}>
              We wanted to get closer to that process.
            </p>
            <p style={{ marginBottom: 20 }}>
              To understand where our textiles come from, who makes them and what happens when we slow down enough to care about every step.
            </p>
            <p style={{ fontStyle: "italic", fontFamily: "serif", fontSize: "1.25rem", color: "#1a140e", margin: 0 }}>
              And so, Sum began.
            </p>
          </div>
        </div>
      </section>

      {/* ─── WHY SUM ─── */}
      <section className="os-section" style={{ maxWidth: 960, margin: "0 auto 90px", padding: "0 24px" }}>
        <div style={{ background: "#2a1f14", color: "#f5ede3", padding: "clamp(36px, 5vw, 64px)", borderRadius: 24 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d89b6c", display: "block", marginBottom: 10 }}>
            Why Sum
          </span>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "#f5ede3", margin: "0 0 24px", lineHeight: 1.25 }}>
            We wanted to make clothes differently. Not dramatically. Just thoughtfully.
          </h2>
          <p style={{ fontSize: "1.12rem", lineHeight: 1.8, color: "rgba(245, 237, 227, 0.9)", marginBottom: 24, fontStyle: "italic" }}>
            SUM is the coming together of heritage, modernity, functionality and individuality — just as every woman is the sum of many identities, experiences and possibilities.
          </p>
          <div style={{ fontSize: "1.02rem", lineHeight: 1.85, color: "rgba(245, 237, 227, 0.82)" }}>
            <p style={{ marginBottom: 16 }}>
              The fashion world doesn&apos;t need another brand telling women what to wear.
            </p>
            <p style={{ marginBottom: 16 }}>
              We&apos;d rather make pieces that leave room for you to decide.
            </p>
            <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.06)", borderRadius: 14, margin: "20px 0" }}>
              <p style={{ margin: "4px 0" }}>· Easy silhouettes.</p>
              <p style={{ margin: "4px 0" }}>· Useful details.</p>
              <p style={{ margin: "4px 0" }}>· Comfortable shapes.</p>
              <p style={{ margin: "4px 0" }}>· Colours you can live with.</p>
              <p style={{ margin: "4px 0" }}>· Pieces you can wear your way.</p>
            </div>
            <p style={{ fontWeight: 600, color: "#f5ede3", marginTop: 20 }}>
              Because the best clothes don&apos;t take over your life. They become part of it.
            </p>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE BELIEVE ─── */}
      <section className="os-section" style={{ maxWidth: 1080, margin: "0 auto 100px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="os-subtitle">Philosophy</span>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: "#1a140e", margin: "6px 0 0" }}>
            What We Believe
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          <div style={{ background: "rgba(255,255,255,0.75)", padding: 32, borderRadius: 20, border: "1px solid rgba(42,31,20,0.1)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#b36338", letterSpacing: "0.15em", display: "block", marginBottom: 10 }}>01</span>
            <h3 style={{ fontFamily: "serif", fontSize: "1.25rem", color: "#1a140e", margin: "0 0 12px" }}>
              Clothes Should Be Lived In
            </h3>
            <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", margin: 0 }}>
              A beautiful garment that stays in your wardrobe isn&apos;t doing much. We design for repeat wears, real days and the woman who reaches for the same favourite piece again and again.
            </p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.75)", padding: 32, borderRadius: 20, border: "1px solid rgba(42,31,20,0.1)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#b36338", letterSpacing: "0.15em", display: "block", marginBottom: 10 }}>02</span>
            <h3 style={{ fontFamily: "serif", fontSize: "1.25rem", color: "#1a140e", margin: "0 0 12px" }}>
              Comfort Is Not a Compromise
            </h3>
            <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", margin: 0 }}>
              You shouldn&apos;t have to choose between feeling comfortable and looking put together. We want both.
            </p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.75)", padding: 32, borderRadius: 20, border: "1px solid rgba(42,31,20,0.1)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#b36338", letterSpacing: "0.15em", display: "block", marginBottom: 10 }}>03</span>
            <h3 style={{ fontFamily: "serif", fontSize: "1.25rem", color: "#1a140e", margin: "0 0 12px" }}>
              Good Design Doesn&apos;t Need to Shout
            </h3>
            <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", margin: 0 }}>
              We like thoughtful details more than unnecessary ones. A pocket where you need it. A sleeve that moves. A silhouette that gives you room. Small things. Big difference.
            </p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.75)", padding: 32, borderRadius: 20, border: "1px solid rgba(42,31,20,0.1)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#b36338", letterSpacing: "0.15em", display: "block", marginBottom: 10 }}>04</span>
            <h3 style={{ fontFamily: "serif", fontSize: "1.25rem", color: "#1a140e", margin: "0 0 12px" }}>
              Know Where It Begins
            </h3>
            <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", margin: 0 }}>
              A garment has a life before it reaches you. We&apos;re interested in that life — the textile, the place, the people and the making.
            </p>
          </div>
        </div>
      </section>

      {/* ─── OUR RELATIONSHIP WITH TEXTILES ─── */}
      <section className="os-section" style={{ maxWidth: 1080, margin: "0 auto 100px", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 50, alignItems: "center" }}>
          <div>
            <span className="os-subtitle">The Source</span>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)", color: "#1a140e", margin: "8px 0 20px" }}>
              The garment is only one part of the story.
            </h2>
            <div style={{ fontSize: "1.04rem", lineHeight: 1.8, color: "#443528" }}>
              <p style={{ marginBottom: 12 }}>
                We are building Sum around a deeper relationship with handwoven textiles.
              </p>
              <p style={{ marginBottom: 12 }}>
                Not because they&apos;re fashionable.
              </p>
              <p style={{ marginBottom: 18 }}>
                Because they carry something that mass production often leaves behind — time, place, skill and character.
              </p>
              <p style={{ fontWeight: 600, color: "#1a140e", marginBottom: 20 }}>
                We&apos;re starting with Khadi cotton from Madhya Pradesh.
              </p>
              <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.6)", borderRadius: 12, border: "1px solid rgba(42,31,20,0.1)", marginBottom: 24, fontSize: "0.85rem", color: "#6e5d4e" }}>
                <span>Official Documentation & Archive: </span>
                <a
                  href="https://sidhi.nic.in/en/document/bharatpur-handicrafts-success-story/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#b36338", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  Bharatpur Handicrafts Success Story <FiExternalLink size={12} />
                </a>
              </div>
              <p style={{ fontStyle: "italic", fontFamily: "serif", fontSize: "1.2rem", color: "#1a140e", marginBottom: 28 }}>
                And this is only the beginning.
              </p>
              <Link
                href="/fabric"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#1a140e",
                  color: "#f5ede3",
                  padding: "14px 28px",
                  borderRadius: 99,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Explore Our Fabric <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Handloom Visuals */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <img src="/assets/fabric.jpg" alt="Khadi Cotton Textile" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: 16 }} />
            <img src="/assets/wev.jpg" alt="Artisan Weaving on Handloom" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: 16 }} />
            <img src="/assets/han.jpg" alt="Artisan Hands at Loom" style={{ width: "100%", gridColumn: "span 2", aspectRatio: "16/9", objectFit: "cover", borderRadius: 16 }} />
          </div>
        </div>
      </section>

      {/* ─── THE WOMEN OF SUM ─── */}
      <section className="os-section" style={{ maxWidth: 960, margin: "0 auto 100px", padding: "0 24px" }}>
        <div style={{ background: "#f6efe6", padding: "clamp(36px, 5vw, 64px)", borderRadius: 24, border: "1px solid rgba(42, 31, 20, 0.1)" }}>
          <span className="os-subtitle">Community</span>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)", color: "#1a140e", margin: "8px 0 20px" }}>
            Made for women. Shaped by women.
          </h2>
          <p style={{ fontSize: "1.06rem", lineHeight: 1.85, color: "#3f3329", marginBottom: 20 }}>
            Sum brings together different hands, experiences, skills and perspectives to create clothes that feel like they belong to the women who wear them.
          </p>
          <p style={{ fontSize: "1.06rem", lineHeight: 1.85, color: "#3f3329", marginBottom: 16 }}>
            We don&apos;t believe there is one version of the modern woman.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, margin: "24px 0" }}>
            <div style={{ padding: 18, background: "#ffffff", borderRadius: 14 }}>
              <strong style={{ color: "#1a140e", display: "block" }}>Ambitious & Tired</strong>
              <span style={{ fontSize: "0.85rem", color: "#7a6c5f" }}>Pushing boundaries, needing ease at the end of the day.</span>
            </div>
            <div style={{ padding: 18, background: "#ffffff", borderRadius: 14 }}>
              <strong style={{ color: "#1a140e", display: "block" }}>Minimal & Colourful</strong>
              <span style={{ fontSize: "0.85rem", color: "#7a6c5f" }}>Unfussy shapes with intentional pops of character.</span>
            </div>
            <div style={{ padding: 18, background: "#ffffff", borderRadius: 14 }}>
              <strong style={{ color: "#1a140e", display: "block" }}>Serious & Ridiculous</strong>
              <span style={{ fontSize: "0.85rem", color: "#7a6c5f" }}>Sharp at meetings, completely free with closest friends.</span>
            </div>
          </div>
          <p style={{ fontWeight: 600, color: "#1a140e", fontSize: "1.1rem" }}>
            Her clothes should have room for all of it.
          </p>
        </div>
      </section>

      {/* ─── WHAT WE'RE BUILDING ─── */}
      <section className="os-section" style={{ maxWidth: 860, margin: "0 auto 120px", padding: "0 24px", textAlign: "center" }}>
        <span className="os-subtitle">Vision</span>
        <h2 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 3.8vw, 3rem)", color: "#1a140e", margin: "8px 0 24px" }}>
          This is bigger than a collection.
        </h2>
        <div style={{ fontSize: "1.08rem", lineHeight: 1.85, color: "#4a3c30", maxWidth: 680, margin: "0 auto 36px" }}>
          <p style={{ marginBottom: 12 }}>
            We&apos;re slowly building a brand around clothing, textiles, people and stories.
          </p>
          <p style={{ marginBottom: 12 }}>
            We want to discover handwoven textiles from different parts of India.
          </p>
          <p style={{ marginBottom: 12 }}>
            Meet the people behind them.
          </p>
          <p style={{ marginBottom: 12 }}>
            Bring those textiles into contemporary wardrobes.
          </p>
          <p style={{ marginBottom: 28 }}>
            And create a space where the conversation around clothing goes beyond what is trending.
          </p>
          <div style={{ borderTop: "1px solid rgba(42,31,20,0.15)", paddingTop: 28, fontStyle: "italic", fontFamily: "serif", fontSize: "1.3rem", color: "#1a140e" }}>
            <p style={{ margin: "4px 0" }}>We&apos;re still figuring it out.</p>
            <p style={{ margin: "4px 0" }}>But we know how we want it to feel.</p>
            <p style={{ margin: "8px 0", fontWeight: 700, color: "#b36338" }}>
              Thoughtful. Human. Easy. And entirely Sum.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/fabric"
            style={{
              padding: "14px 28px",
              borderRadius: 99,
              background: "transparent",
              color: "#1a140e",
              border: "1.5px solid rgba(26,20,14,0.4)",
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Explore the Fabric
          </Link>
          <Link
            href="/shop"
            style={{
              padding: "14px 28px",
              borderRadius: 99,
              background: "#1a140e",
              color: "#f5ede3",
              border: "1.5px solid #1a140e",
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Shop the Pieces
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
