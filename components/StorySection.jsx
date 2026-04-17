import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/story-section.css";

gsap.registerPlugin(ScrollTrigger);

const PIN_DURATION = 4500;

const phases = [
  {
    text: "There was a time when fabric was not made in factories. It was made at home. Slowly. Carefully. By hand.",
    position: "right",
  },
  {
    text: "It begins with cotton: soft, raw, untouched. It is spun into yarn on a simple wheel, one thread at a time.",
    position: "left",
  },
  {
    text: "At Sum Clothico, we didn\u2019t want to change this story. We just wanted to continue it in a way that fits today\u2019s women.",
    position: "right",
  },
];

const StorySection = () => {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const textEls = section.querySelectorAll(".story-phase-text");

      // Pin the section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${PIN_DURATION}`,
        pin: true,
        pinSpacing: true,
      });

      // Frame stroke-draw
      const framePath = frameRef.current;
      if (framePath) {
        const len = framePath.getTotalLength();
        gsap.set(framePath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(framePath, {
          strokeDashoffset: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 30%",
            end: "top top",
            scrub: 1,
          },
        });
      }

      // Single master timeline for all 3 text phases, scrubbed to pin range
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${PIN_DURATION}`,
          scrub: 1,
        },
      });

      // Each phase: fade in (10%) → hold (23%) → fade out (10%) → gap (7%) ≈ 33% each
      textEls.forEach((el) => {
        masterTl
          .fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" })
          .to({}, { duration: 0.15 }) // hold
          .to(el, { opacity: 0, y: -30, duration: 0.08, ease: "power2.in" });
      });

      // Cloth slide animation
      const clothEl = section.querySelector(".story-section__cloth");
      if (clothEl) {
        gsap.to(clothEl, {
          xPercent: -80,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${PIN_DURATION}`,
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="story-section">
      {/* SVG Frame */}
      <svg className="story-section__frame" viewBox="0 0 240 330">
        <rect
          ref={frameRef}
          className="section-frame-path"
          x="5"
          y="5"
          width="230"
          height="320"
          rx="8"
          fill="none"
          stroke="#3d2b1f"
          strokeWidth="1.5"
        />
      </svg>

      {/* Phase texts */}
      {phases.map((phase, i) => (
        <div
          key={i}
          className={`story-phase-text story-phase-text--${phase.position}`}
        >
          <p>{phase.text}</p>
        </div>
      ))}

      {/* Cloth image */}
      <div className="story-section__cloth">
        <img src="/assets/cloth.png" alt="Handcrafted Khadi Cloth" />
      </div>

      {/* Background */}
      <div className="story-section__bg">
        <img src="/assets/bgiamge.png" alt="Landscape Background" />
      </div>
    </section>
  );
};

export default StorySection;
