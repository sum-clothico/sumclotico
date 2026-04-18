"use client";

import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(InertiaPlugin, ScrollTrigger);

export default function MotionCards() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Inertia on cards
      const cards = document.querySelectorAll(".motion-card__card");
      cards.forEach((card) => {
        let lastX = 0;
        let lastY = 0;
        let speedX = 0;
        let speedY = 0;

        const startRotation = gsap.getProperty(card, "rotation");
        const startX = gsap.getProperty(card, "x");
        const startY = gsap.getProperty(card, "y");

        const onMove = (e) => {
          speedX = e.clientX - lastX;
          speedY = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
        };

        const onEnter = (e) => {
          speedX = 0;
          speedY = 0;
          lastX = e.clientX;
          lastY = e.clientY;
        };

        const onLeave = () => {
          gsap.to(card, {
            inertia: {
              x: { velocity: speedX * 20, end: startX },
              y: { velocity: speedY * 20, end: startY },
              rotation: { velocity: speedX * 1.5, end: startRotation },
            },
          });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
      });

      // Inertia on floating labels
      const labels = document.querySelectorAll(".motion-card__floating-label");
      labels.forEach((label) => {
        let lastX = 0;
        let lastY = 0;
        let speedX = 0;
        let speedY = 0;

        const startRotation = gsap.getProperty(label, "rotation");
        const startX = gsap.getProperty(label, "x");
        const startY = gsap.getProperty(label, "y");

        const onMove = (e) => {
          speedX = e.clientX - lastX;
          speedY = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
        };

        const onEnter = (e) => {
          speedX = 0;
          speedY = 0;
          lastX = e.clientX;
          lastY = e.clientY;
        };

        const onLeave = () => {
          gsap.to(label, {
            inertia: {
              x: { velocity: speedX * 25, end: startX },
              y: { velocity: speedY * 25, end: startY },
              rotation: { velocity: speedX * 2, end: startRotation },
            },
          });
        };

        label.addEventListener("mousemove", onMove);
        label.addEventListener("mouseenter", onEnter);
        label.addEventListener("mouseleave", onLeave);
      });

      // ── Pattern rotate + scale on scroll ──
      const pattern = sectionRef.current.querySelector(".mc-pattern");
      if (pattern) {
        gsap.fromTo(
          pattern,
          { rotation: 0, scale: 0.7, opacity: 0 },
          {
            rotation: 120,
            scale: 1.3,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          },
        );
      }

      // ── Pin section & cycle text ──
      const PIN = 3500;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${PIN}`,
        pin: true,
        pinSpacing: true,
      });

      const phaseTexts = sectionRef.current.querySelectorAll(".mc-phase-text");
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${PIN}`,
          scrub: 1,
        },
      });
      phaseTexts.forEach((el) => {
        textTl
          .fromTo(
            el,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
          )
          .to({}, { duration: 0.18 })
          .to(el, { opacity: 0, y: -20, duration: 0.06, ease: "power2.in" });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="motion-card-section"
      id="motion-card-section"
    >
      {/* ─── Logo ─── */}
      <div className="mc-logo">
        <img src="/assets/logo.svg" alt="Sum Clothico" />
      </div>

      <div className="horizontal-words__corner-right">म</div>

      {/* ─── Section heading ─── */}
      <p className="mc-heading">Where Khadi Fits in Your Life</p>

      {/* ─── Cycling Text ─── */}
      <div className="mc-texts">
        <p className="mc-phase-text">
          Khadi is not just "traditional wear" anymore. It works for daily wear
          that feels light and breathable.
        </p>
        <p className="mc-phase-text">
          Work outfits that stay comfortable all day. Simple, minimal
          wardrobes built around ease.
        </p>
        <p className="mc-phase-text">
          Travel, where comfort matters most. Easy, effortless, and real.
        </p>
      </div>

      {/* ─── Cards ─── */}
      <div className="motion-card__cards-area">
        <div ref={containerRef} className="motion-card__cards">
          <div className="motion-card__card motion-card__card--1">
            <div className="motion-card__card-image">
              <img
                src="/assets/img/13.png"
                loading="lazy"
                alt=""
                className="cover-image"
              />
            </div>
          </div>

          <div className="motion-card__card motion-card__card--2">
            <div className="motion-card__card-image">
              <img
                src="/assets/img/14.png"
                loading="lazy"
                alt=""
                className="cover-image"
              />
            </div>
          </div>

          <div className="motion-card__card motion-card__card--3">
            <div className="motion-card__card-image">
              <img
                src="/assets/img/15.png"
                loading="lazy"
                alt=""
                className="cover-image"
              />
            </div>
          </div>

          <div className="motion-card__card motion-card__card--4">
            <div className="motion-card__card-image">
              <img
                src="/assets/img/16.png"
                loading="lazy"
                alt=""
                className="cover-image"
              />
            </div>
          </div>
        </div>

        {/* Floating labels — positioned freely over the cards area */}
        {/* <div ref={containerRef} className="motion-card__floating-labels">
          <div className="motion-card__floating-label motion-card__floating-label--pink">
            <p className="motion-card__floating-text">
              every thread tells a story
            </p>
          </div>
          <div className="motion-card__floating-label motion-card__floating-label--orange">
            <p className="motion-card__floating-text">
              khadi is the fabric of freedom
            </p>
          </div>
          <div className="motion-card__floating-label motion-card__floating-label--red">
            <p className="motion-card__floating-text">handmade = timeless</p>
          </div>
        </div> */}
      </div>

      {/* ─── Pattern Decoration ─── */}
      <img src="/assets/pat1.svg" alt="" className="mc-pattern" />

      {/* ─── Part 3: Bottom Paragraph Text ─── */}
      {/* <div className="motion-card__footer-text">
        <p className="motion-card__description">
          From the spinning wheel to your wardrobe, every piece at SUM CLOTHICO
          is crafted by artisan hands. We work the full spectrum — from raw
          khadi fabric to finished garments, home textiles, and bespoke
          collections.
        </p>
      </div> */}
    </section>
  );
}
