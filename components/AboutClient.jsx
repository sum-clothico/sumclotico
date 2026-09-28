"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/about.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-fade-up",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-hero",
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".about-approach-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-approach",
            start: "top 60%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="about-page">
      <div className="os-noise" />

      {/* Hero */}
      <section className="about-hero">
        <h1 className="about-fade-up">About Sum Clothico</h1>
        <p className="about-fade-up">Sum Clothico is a contemporary womenswear brand rooted in the ethos of handmade Khadi. We bridge the gap between tradition and modernity, bringing sustainable textiles into everyday fashion.</p>
        
        <div className="about-mission about-fade-up">
          <span className="about-label">Our Mission is Simple</span>
          <h3>To make conscious clothing desirable, accessible, and empowering.</h3>
          <p>We work with a fabric that already has meaning, and we design it in a way that feels relevant today.</p>
        </div>
        <p className="about-fade-up mt-40">Sum Clothico is an initiative that brings women of different genre together gathering their skills, energy and power to curate attires that the modern women feels her own, breathes in and flows into.</p>
      </section>

      {/* Approach */}
      <section className="about-approach">
        <h2 className="text-center mb-40">Our Approach</h2>
        <div className="about-approach-grid">
          <div className="about-approach-card">
            <h4>Contemporary Design Language</h4>
            <p>Clean cuts, fluid silhouettes, and modern tailoring.</p>
          </div>
          <div className="about-approach-card">
            <h4>Functional Fashion</h4>
            <p>Pieces that move with you — from work to leisure.</p>
          </div>
          <div className="about-approach-card">
            <h4>Minimal Yet Expressive</h4>
            <p>Subtle textures, earthy tones, and thoughtful detailing.</p>
          </div>
          <div className="about-approach-card">
            <h4>Empowering Craft</h4>
            <p>Supporting artisan communities while bringing their work to global wardrobes.</p>
          </div>
        </div>
        <p className="about-approach-footer">We don't just create garments — we create experiences of wearing heritage.</p>
      </section>

      {/* Philosophy */}
      <section className="about-philosophy">
        <div className="about-content-box dark-box">
          <h2>Our Philosophy</h2>
          <div className="about-philosophy-grid">
            <div className="about-philosophy-item">
              <h4>Slow Fashion Over Fast Trends</h4>
              <p>We prioritize longevity over mass production.</p>
            </div>
            <div className="about-philosophy-item">
              <h4>Craft Over Machine</h4>
              <p>Every piece carries the imprint of human skill.</p>
            </div>
            <div className="about-philosophy-item">
              <h4>Purpose Over Excess</h4>
              <p>We design intentionally — fewer pieces, better quality.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
