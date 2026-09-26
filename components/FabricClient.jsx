"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/fabric.css";
import Footer from "./Footer";
import { 
  FiArrowRight, 
  FiMapPin, 
  FiFeather, 
  FiWind, 
  FiDroplet, 
  FiHeart, 
  FiSun, 
  FiCompass, 
  FiCheck,
  FiShoppingBag,
  FiBookOpen
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function FabricClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fab-fade-up",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fab-hero",
            start: "top 75%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fabric-page">
      <div className="os-noise" />

      {/* ─── HERO ─── */}
      <section className="fab-hero" style={{ textAlign: "center", padding: "140px 24px 70px", maxWidth: 900, margin: "0 auto" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 12 }}>
          Our Textile Ambition
        </span>
        <h1 className="fab-fade-up" style={{ fontFamily: "serif", fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", fontWeight: 500, lineHeight: 1.18, color: "#1a140e", margin: "0 0 24px" }}>
          Every garment begins somewhere.
        </h1>
        <div className="fab-fade-up" style={{ fontSize: "1.15rem", lineHeight: 1.85, color: "#4a3c30", maxWidth: 680, margin: "0 auto" }}>
          <p style={{ margin: "0 0 6px" }}>Before the cut.</p>
          <p style={{ margin: "0 0 6px" }}>Before the stitch.</p>
          <p style={{ margin: "0 0 16px" }}>Before it becomes something you wear.</p>
          <p style={{ margin: "0 0 12px", fontWeight: 600, color: "#1a140e" }}>
            There is the textile.
          </p>
          <p style={{ margin: 0, fontStyle: "italic" }}>
            And behind the textile, there is a place, a process and a whole lot of human work.
          </p>
        </div>
      </section>

      {/* ─── OUR STARTING POINT ─── */}
      <section style={{ maxWidth: 1040, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ background: "#ffffff", borderRadius: 24, padding: "clamp(36px, 5vw, 56px)", border: "1px solid rgba(42,31,20,0.1)", boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 10 }}>
                Our Starting Point
              </span>
              <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, color: "#1a140e", margin: "0 0 18px" }}>
                We&apos;re starting with Khadi.
              </h2>
              <div style={{ fontSize: "1.04rem", lineHeight: 1.8, color: "#4a3c30" }}>
                <p style={{ marginBottom: 14 }}>
                  Khadi has been part of India&apos;s textile story for generations.
                </p>
                <p style={{ marginBottom: 14 }}>
                  What draws us to it isn&apos;t simply its history. It&apos;s the way it is made.
                </p>
                <div style={{ padding: "14px 20px", background: "#FAF6F0", borderRadius: 12, margin: "18px 0", color: "#2a1f14", fontWeight: 600 }}>
                  <p style={{ margin: "4px 0" }}>· The irregularity.</p>
                  <p style={{ margin: "4px 0" }}>· The texture.</p>
                  <p style={{ margin: "4px 0" }}>· The airiness.</p>
                  <p style={{ margin: "4px 0" }}>· The feeling of something made slowly by hands.</p>
                </div>
                <p style={{ fontStyle: "italic", fontFamily: "serif", fontSize: "1.2rem", color: "#1a140e", margin: "18px 0 24px" }}>
                  For Sum, Khadi cotton is where this journey begins.
                </p>
                
                {/* Location Marker */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#1a140e", color: "#FAF6F0", padding: "10px 20px", borderRadius: 99, fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  <FiMapPin size={16} color="#d89b6c" />
                  <span>KHADI COTTON · MADHYA PRADESH, INDIA</span>
                </div>
              </div>
            </div>

            <div style={{ borderRadius: 18, overflow: "hidden", aspectRatio: "4/3", background: "#e8dfd0", border: "1px solid rgba(42,31,20,0.08)" }}>
              <img
                src="/assets/fabric.jpg"
                alt="Khadi Handspun Cotton Weave"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FROM COTTON TO CLOTH ─── */}
      <section style={{ maxWidth: 1080, margin: "0 auto 90px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
            The Process
          </span>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: "#1a140e", margin: 0 }}>
            A lot happens before you put it on.
          </h2>
        </div>

        {/* What is Khadi */}
        <div style={{ background: "#2a1f14", color: "#FAF6F0", padding: "clamp(32px, 5vw, 48px)", borderRadius: 24, marginBottom: 40 }}>
          <h3 style={{ fontFamily: "serif", fontSize: "1.6rem", color: "#FAF6F0", margin: "0 0 16px" }}>
            What is Khadi?
          </h3>
          <p style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "rgba(250, 246, 240, 0.9)", marginBottom: 18 }}>
            Khadi is a fabric made from natural fibers like cotton, but what makes it special is how it is made.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, margin: "20px 0" }}>
            <div style={{ background: "rgba(255,255,255,0.08)", padding: 20, borderRadius: 14 }}>
              <strong style={{ color: "#d89b6c", display: "block", marginBottom: 6, fontSize: "1rem" }}>Hand-spun</strong>
              <span style={{ fontSize: "0.92rem", color: "rgba(250,246,240,0.8)" }}>Thread made by hand using the traditional charkha.</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", padding: 20, borderRadius: 14 }}>
              <strong style={{ color: "#d89b6c", display: "block", marginBottom: 6, fontSize: "1rem" }}>Handwoven</strong>
              <span style={{ fontSize: "0.92rem", color: "rgba(250,246,240,0.8)" }}>Fabric made on wooden looms, never high-speed machines.</span>
            </div>
          </div>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(250, 246, 240, 0.85)", fontStyle: "italic", margin: "16px 0 0" }}>
            This means every thread has slight variations, and every fabric has its own character. It&apos;s not perfect and that&apos;s exactly the point.
          </p>
        </div>

        {/* 4 Steps: How Khadi Is Made */}
        <div style={{ textAlign: "center", margin: "50px 0 28px" }}>
          <h3 style={{ fontFamily: "serif", fontSize: "1.8rem", color: "#1a140e", margin: 0 }}>
            How Khadi Is Made (And Why That Changes Everything)
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 70 }}>
          <div style={{ background: "#ffffff", padding: 30, borderRadius: 20, border: "1px solid rgba(42,31,20,0.08)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#b36338", letterSpacing: "0.12em", display: "block", marginBottom: 8 }}>STEP 01</span>
            <h4 style={{ fontFamily: "serif", fontSize: "1.3rem", color: "#1a140e", margin: "0 0 12px" }}>Cotton</h4>
            <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", margin: 0 }}>
              Raw cotton is gently cleaned, untangled and prepared by hand for spinning.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: 30, borderRadius: 20, border: "1px solid rgba(42,31,20,0.08)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#b36338", letterSpacing: "0.12em", display: "block", marginBottom: 8 }}>STEP 02</span>
            <h4 style={{ fontFamily: "serif", fontSize: "1.3rem", color: "#1a140e", margin: "0 0 12px" }}>Spinning by Hand</h4>
            <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", marginBottom: 10 }}>
              The cotton is turned into yarn using a charkha.
            </p>
            <div style={{ borderTop: "1px solid rgba(42,31,20,0.08)", paddingTop: 10, fontSize: "0.85rem", color: "#7a6c5f" }}>
              <strong style={{ color: "#1a140e", display: "block" }}>Why it matters:</strong>
              Hand spinning creates tiny irregular gaps that allow air to pass freely through the weave.
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: 30, borderRadius: 20, border: "1px solid rgba(42,31,20,0.08)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#b36338", letterSpacing: "0.12em", display: "block", marginBottom: 8 }}>STEP 03</span>
            <h4 style={{ fontFamily: "serif", fontSize: "1.3rem", color: "#1a140e", margin: "0 0 12px" }}>Hand Weaving</h4>
            <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", marginBottom: 10 }}>
              The yarn is woven on a pit loom by skilled artisans.
            </p>
            <div style={{ borderTop: "1px solid rgba(42,31,20,0.08)", paddingTop: 10, fontSize: "0.85rem", color: "#7a6c5f" }}>
              <strong style={{ color: "#1a140e", display: "block" }}>Why it matters:</strong>
              No uniform machine pressure. The fabric feels softer, more flexible, and less stiff.
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: 30, borderRadius: 20, border: "1px solid rgba(42,31,20,0.08)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#b36338", letterSpacing: "0.12em", display: "block", marginBottom: 8 }}>STEP 04</span>
            <h4 style={{ fontFamily: "serif", fontSize: "1.3rem", color: "#1a140e", margin: "0 0 12px" }}>The Final Fabric</h4>
            <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", margin: "0 0 8px" }}>
              What you get is a fabric that is:
            </p>
            <div style={{ fontSize: "0.88rem", color: "#1a140e", fontWeight: 600 }}>
              <p style={{ margin: "2px 0" }}>· Alive with texture</p>
              <p style={{ margin: "2px 0" }}>· Light on the skin</p>
              <p style={{ margin: "2px 0" }}>· Made slowly, not in bulk</p>
            </div>
          </div>
        </div>

        {/* ─── WHY CHOOSE KHADI OVER COTTON OR LINEN? ─── */}
        <div style={{ background: "#ffffff", padding: "clamp(36px, 5vw, 56px)", borderRadius: 24, border: "1px solid rgba(42,31,20,0.1)", marginBottom: 70 }}>
          <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 36px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
              Comparison
            </span>
            <h3 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, color: "#1a140e", margin: "0 0 12px" }}>
              Why Choose Khadi Over Cotton or Linen?
            </h3>
            <p style={{ fontSize: "1.05rem", color: "#6b5d52", fontStyle: "italic", margin: 0 }}>
              Most people think: &quot;Isn&apos;t this just cotton?&quot; Not really.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {/* Khadi vs Regular Cotton */}
            <div style={{ background: "#FAF6F0", padding: 28, borderRadius: 18 }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#b36338", display: "block", marginBottom: 8 }}>
                Khadi vs Regular Cotton
              </span>
              <h4 style={{ fontFamily: "serif", fontSize: "1.25rem", color: "#1a140e", margin: "0 0 10px" }}>
                Why Khadi feels cooler:
              </h4>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#55483d", marginBottom: 14 }}>
                Machine-made cotton is tightly packed and dense. Hand-spun yarn creates continuous airflow → keeps you cooler for longer.
              </p>
              <h4 style={{ fontFamily: "serif", fontSize: "1.25rem", color: "#1a140e", margin: "0 0 10px" }}>
                Why Khadi feels softer over time:
              </h4>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#55483d", margin: 0 }}>
                Regular cotton can stay the same or wear out. Khadi becomes softer with every wash because the fibers relax naturally without chemical degradation.
              </p>
            </div>

            {/* Khadi vs Linen */}
            <div style={{ background: "#FAF6F0", padding: 28, borderRadius: 18 }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#b36338", display: "block", marginBottom: 8 }}>
                Khadi vs Linen
              </span>
              <h4 style={{ fontFamily: "serif", fontSize: "1.25rem", color: "#1a140e", margin: "0 0 10px" }}>
                Why linen can feel rough:
              </h4>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#55483d", marginBottom: 14 }}>
                Linen fibers are naturally stiff and take weeks to break in. Khadi is softer from the very start and adapts fluidly to daily wear.
              </p>
              <h4 style={{ fontFamily: "serif", fontSize: "1.25rem", color: "#1a140e", margin: "0 0 10px" }}>
                Why Khadi is easier to wear daily:
              </h4>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#55483d", margin: 0 }}>
                Linen wrinkles sharply and requires constant ironing. Khadi&apos;s natural slub texture makes wrinkles look relaxed, organic, and effortlessly beautiful.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 28, borderTop: "1px solid rgba(42,31,20,0.1)", paddingTop: 20 }}>
            <p style={{ fontFamily: "serif", fontSize: "1.15rem", fontStyle: "italic", color: "#1a140e", margin: 0 }}>
              Simple truth: Khadi is not just about fiber. It&apos;s about the process, and that changes how it feels on your body.
            </p>
          </div>
        </div>

        {/* ─── WHY KHADI STILL MATTERS IN A FAST FASHION WORLD ─── */}
        <div style={{ background: "#FAF6F0", padding: "clamp(36px, 5vw, 56px)", borderRadius: 24, border: "1px solid rgba(42,31,20,0.1)", marginBottom: 70 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
            Reclaiming Pace
          </span>
          <h3 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, color: "#1a140e", margin: "0 0 20px" }}>
            Why Khadi Still Matters in a Fast Fashion World
          </h3>
          <p style={{ fontSize: "1.04rem", lineHeight: 1.8, color: "#4a3c30", marginBottom: 20 }}>
            Fast fashion is built on: <strong>Speed · Mass production · Uniformity</strong>. Khadi stands in complete contrast.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, margin: "24px 0" }}>
            <div style={{ background: "#ffffff", padding: 22, borderRadius: 14 }}>
              <strong style={{ color: "#1a140e", display: "block", marginBottom: 6 }}>Because it cannot be rushed</strong>
              <span style={{ fontSize: "0.9rem", color: "#6b5d52" }}>Each piece takes time, which means less waste, intentional making, and lasting value.</span>
            </div>
            <div style={{ background: "#ffffff", padding: 22, borderRadius: 14 }}>
              <strong style={{ color: "#1a140e", display: "block", marginBottom: 6 }}>Because it involves people, not just machines</strong>
              <span style={{ fontSize: "0.9rem", color: "#6b5d52" }}>Every step directly supports handloom artisan families and preserves living traditions.</span>
            </div>
            <div style={{ background: "#ffffff", padding: 22, borderRadius: 14 }}>
              <strong style={{ color: "#1a140e", display: "block", marginBottom: 6 }}>Because it is made in small quantities</strong>
              <span style={{ fontSize: "0.9rem", color: "#6b5d52" }}>Not thousands of identical pieces, but limited, thoughtful, small-batch production.</span>
            </div>
          </div>
          <p style={{ fontWeight: 600, color: "#1a140e", fontSize: "1.05rem", margin: "16px 0 0" }}>
            When you wear Khadi, you are choosing: Fewer, better clothes · Something that lasts · Something that has meaning.
          </p>
        </div>

        {/* ─── HOW KHADI IS SUSTAINABLE (IN A REAL WAY) ─── */}
        <div style={{ background: "#2a1f14", color: "#FAF6F0", padding: "clamp(36px, 5vw, 56px)", borderRadius: 24, marginBottom: 70 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d89b6c", display: "block", marginBottom: 8 }}>
            Conscious Making
          </span>
          <h3 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", margin: "0 0 24px", color: "#FAF6F0" }}>
            How Khadi Is Sustainable (In a Real Way)
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            <div style={{ background: "rgba(255,255,255,0.06)", padding: 24, borderRadius: 16 }}>
              <h4 style={{ fontFamily: "serif", fontSize: "1.2rem", color: "#d89b6c", margin: "0 0 8px" }}>Low Energy</h4>
              <p style={{ fontSize: "0.9rem", color: "rgba(250,246,240,0.85)", margin: "0 0 8px" }}><strong>Why:</strong> No heavy industrial machinery.</p>
              <p style={{ fontSize: "0.9rem", color: "rgba(250,246,240,0.75)", margin: 0 }}><strong>How it helps:</strong> Less electricity, zero fossil fuel looms, lower carbon impact.</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", padding: 24, borderRadius: 16 }}>
              <h4 style={{ fontFamily: "serif", fontSize: "1.2rem", color: "#d89b6c", margin: "0 0 8px" }}>Minimal Processing</h4>
              <p style={{ fontSize: "0.9rem", color: "rgba(250,246,240,0.85)", margin: "0 0 8px" }}><strong>Why:</strong> Fewer harsh industrial chemicals.</p>
              <p style={{ fontSize: "0.9rem", color: "rgba(250,246,240,0.75)", margin: 0 }}><strong>How it helps:</strong> Better for your skin and kind to local groundwater.</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", padding: 24, borderRadius: 16 }}>
              <h4 style={{ fontFamily: "serif", fontSize: "1.2rem", color: "#d89b6c", margin: "0 0 8px" }}>Human-Centered</h4>
              <p style={{ fontSize: "0.9rem", color: "rgba(250,246,240,0.85)", margin: "0 0 8px" }}><strong>Why:</strong> Made by rural artisans.</p>
              <p style={{ fontSize: "0.9rem", color: "rgba(250,246,240,0.75)", margin: 0 }}><strong>How it helps:</strong> Generates dignified rural livelihood and preserves heritage craft.</p>
            </div>
          </div>
          <p style={{ fontStyle: "italic", fontFamily: "serif", fontSize: "1.15rem", color: "rgba(250,246,240,0.9)", marginTop: 24, textAlign: "center" }}>
            Sustainability here is not a trend. It&apos;s how the fabric has always been made.
          </p>
        </div>

        {/* ─── HOW KHADI IS EVOLVING TODAY & WHY PEOPLE CHOOSE IT ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 30, marginBottom: 70 }}>
          <div style={{ background: "#ffffff", padding: 36, borderRadius: 20, border: "1px solid rgba(42,31,20,0.08)" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
              Modern Direction
            </span>
            <h3 style={{ fontFamily: "serif", fontSize: "1.6rem", color: "#1a140e", margin: "0 0 16px" }}>
              How Khadi Is Evolving Today
            </h3>
            <p style={{ fontSize: "0.96rem", lineHeight: 1.7, color: "#55483d", marginBottom: 14 }}>
              Khadi is no longer limited to traditional ceremonial wear. It is changing — quietly:
            </p>
            <div style={{ fontSize: "0.92rem", lineHeight: 1.8, color: "#1a140e", fontWeight: 600, marginBottom: 18 }}>
              <p style={{ margin: "4px 0" }}>· Lighter weaves for everyday comfort</p>
              <p style={{ margin: "4px 0" }}>· Softer finishes for modern use</p>
              <p style={{ margin: "4px 0" }}>· Contemporary silhouettes and cuts</p>
              <p style={{ margin: "4px 0" }}>· Neutral tones and minimal aesthetics</p>
            </div>
            <div style={{ borderTop: "1px solid rgba(42,31,20,0.08)", paddingTop: 14, fontSize: "0.96rem", color: "#443528" }}>
              At Sum Clothico, this is where we come in. We take a fabric with history and design it for how women live today. Not heavy. Not complicated. Just easy to wear, every day.
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: 36, borderRadius: 20, border: "1px solid rgba(42,31,20,0.08)" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
              Everyday Relevance
            </span>
            <h3 style={{ fontFamily: "serif", fontSize: "1.6rem", color: "#1a140e", margin: "0 0 16px" }}>
              Why People Choose Khadi Today
            </h3>
            <p style={{ fontSize: "0.96rem", lineHeight: 1.7, color: "#55483d", marginBottom: 14 }}>
              Not because it is traditional. But because it feels right:
            </p>
            <div style={{ padding: "12px 16px", background: "#FAF6F0", borderRadius: 12, marginBottom: 14, fontWeight: 600, color: "#1a140e", fontSize: "0.9rem" }}>
              <p style={{ margin: "3px 0" }}>✓ On your skin</p>
              <p style={{ margin: "3px 0" }}>✓ In your lifestyle</p>
              <p style={{ margin: "3px 0" }}>✓ In your conscious choices</p>
            </div>
            <div style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "#55483d" }}>
              <p style={{ margin: "0 0 8px" }}>· A conscious choice towards nature — processing does not require litres of industrial water.</p>
              <p style={{ margin: "0 0 8px" }}>· Used for centuries, originated and proudly Indian.</p>
              <p style={{ margin: 0 }}>· Made to be rough and tough — it will never make you feel guilty of not giving too much attention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HANDWOVEN IS A JOURNEY, NOT A LABEL ─── */}
      <section style={{ maxWidth: 960, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ background: "#ffffff", padding: "clamp(36px, 5vw, 56px)", borderRadius: 24, border: "1px solid rgba(42,31,20,0.1)" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
            Authenticity
          </span>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1a140e", margin: "0 0 18px" }}>
            We care about what happens behind the label.
          </h2>
          <div style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "#443528" }}>
            <p style={{ marginBottom: 14 }}>
              &quot;Handwoven&quot; tells you something about how a textile is made. But we want to know more.
            </p>
            <div style={{ padding: "16px 22px", background: "#FAF6F0", borderRadius: 14, margin: "16px 0", color: "#1a140e", fontWeight: 600 }}>
              <p style={{ margin: "4px 0" }}>· Where did it come from?</p>
              <p style={{ margin: "4px 0" }}>· Who made it?</p>
              <p style={{ margin: "4px 0" }}>· What kind of loom was used?</p>
              <p style={{ margin: "4px 0" }}>· What does the region do differently?</p>
              <p style={{ margin: "4px 0" }}>· What can we learn from it?</p>
            </div>
            <p style={{ fontStyle: "italic", fontFamily: "serif", fontSize: "1.2rem", color: "#1a140e", margin: "18px 0 0" }}>
              That&apos;s the journey Sum is beginning.
            </p>
          </div>
        </div>
      </section>

      {/* ─── BEYOND KHADI ─── */}
      <section style={{ maxWidth: 960, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ background: "#2a1f14", color: "#FAF6F0", padding: "clamp(36px, 5vw, 56px)", borderRadius: 24 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d89b6c", display: "block", marginBottom: 8 }}>
            Expansion
          </span>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#FAF6F0", margin: "0 0 18px" }}>
            This is our first chapter, not the whole story.
          </h2>
          <div style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "rgba(250, 246, 240, 0.88)" }}>
            <p style={{ marginBottom: 14 }}>
              We&apos;re exploring handwoven textiles across India.
            </p>
            <p style={{ marginBottom: 14 }}>
              Different regions. Different fibres. Different techniques. Different stories.
            </p>
            <p style={{ marginBottom: 18 }}>
              We don&apos;t want to collect textiles simply to add more names to a product description. We want to understand them first.
            </p>
            <p style={{ fontWeight: 600, color: "#d89b6c", margin: 0 }}>
              And when we find something worth bringing home, we&apos;ll tell you where it came from.
            </p>
          </div>
        </div>
      </section>

      {/* ─── OUR APPROACH TO SOURCING ─── */}
      <section style={{ maxWidth: 960, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ background: "#ffffff", padding: "clamp(36px, 5vw, 56px)", borderRadius: 24, border: "1px solid rgba(42,31,20,0.1)", textAlign: "center" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
            Ground Truth
          </span>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", color: "#1a140e", margin: "0 0 20px" }}>
            Go there. Look closely. Ask questions.
          </h2>
          <div style={{ fontSize: "1.06rem", lineHeight: 1.85, color: "#443528", maxWidth: 680, margin: "0 auto 30px" }}>
            <p style={{ marginBottom: 12 }}>
              Whenever possible, we want our sourcing journey to begin with curiosity rather than a catalogue.
            </p>
            <p style={{ marginBottom: 12 }}>
              To visit places. Meet makers. Understand the textile. Learn what makes it special.
            </p>
            <p style={{ fontWeight: 600, color: "#1a140e", margin: 0 }}>
              And build relationships that go beyond a transaction.
            </p>
          </div>
          <Link
            href="/journal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#1a140e",
              color: "#FAF6F0",
              padding: "14px 32px",
              borderRadius: 99,
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <span>Follow Our Journey</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ─── FINAL SECTION ─── */}
      <section style={{ maxWidth: 860, margin: "0 auto 120px", padding: "0 24px", textAlign: "center" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
          Closing
        </span>
        <h2 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 3.8vw, 3rem)", color: "#1a140e", margin: "0 0 28px" }}>
          The cloth has a story.
          <br />
          We want you to know it.
        </h2>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "15px 30px",
              borderRadius: 99,
              background: "#1a140e",
              color: "#FAF6F0",
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <FiShoppingBag size={16} />
            <span>Explore Pieces Made From It</span>
          </Link>
          <Link
            href="/journal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "15px 30px",
              borderRadius: 99,
              background: "transparent",
              color: "#1a140e",
              border: "1.5px solid #1a140e",
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <FiBookOpen size={16} />
            <span>Read The Journal</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
