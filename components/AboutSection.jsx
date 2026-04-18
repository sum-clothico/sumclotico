"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/about-section.css";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Sum Clothico is built on one idea",
  "to bring handmade Khadi into everyday wardrobes.",
  "We work with a fabric that already has meaning,",
  "and we design it in a way that feels relevant today.",
  "Simple. Thoughtful. Honest.",
];

const PIN_DISTANCE = 600 * LINES.length;

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = sectionRef.current.querySelectorAll(".about-line");

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${PIN_DISTANCE}`,
        pin: true,
        pinSpacing: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${PIN_DISTANCE}`,
          scrub: 1.5,
        },
      });

      const seg = 1 / LINES.length;

      lines.forEach((line, i) => {
        const start = i * seg;
        tl.fromTo(
          line,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: seg * 0.5, ease: "power3.out" },
          start,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="about-section">
      {/* BG */}
      <div className="about-section__bg" />

      {/* Center card over about.svg */}
      <div className="about-section__card">
        <img className="about-section__svg" src="/assets/about.svg" alt="" />

        <div className="about-section__inner">
          {/* Logo */}
          <img className="about-section__logo" src="/assets/logo.svg" alt="Sum Clothico" />

          {/* Lines */}
          <div className="about-section__lines">
            {LINES.map((line, i) => (
              <p key={i} className="about-line">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
