import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/story-section.css";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    text: "A thread spun by hand. A loom moving at its own rhythm.",
    position: "right",
  },
  {
    text: "A garment cut, stitched and finished with care.",
    position: "left",
  },
  {
    text: "There is something different about clothes that don't begin with a race against time. They feel lighter. They move differently. And somehow, they become more yours.",
    position: "right",
  },
];

const StorySection = () => {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      // Heading Word-by-Word Kinetic Reveal
      const headingWords = section.querySelectorAll(".story-heading-word");
      if (headingWords.length > 0) {
        gsap.fromTo(
          headingWords,
          { y: "130%", rotate: 3, opacity: 0 },
          {
            y: "0%",
            rotate: 0,
            opacity: 1,
            duration: 1.15,
            stagger: 0.07,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          },
        );
      }

      // Frame stroke-draw on enter
      const framePath = frameRef.current;
      if (framePath) {
        const len = framePath.getTotalLength ? framePath.getTotalLength() : 1100;
        gsap.set(framePath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(framePath, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        });
      }

      // Side cloth animation on enter
      const clothEl = section.querySelector(".story-section__cloth");
      if (clothEl) {
        gsap.fromTo(
          clothEl,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          },
        );
      }

      // Static Center Portrait Card entrance
      const portraitEl = section.querySelector(".story-section__portrait");
      if (portraitEl) {
        gsap.fromTo(
          portraitEl,
          { opacity: 0, scale: 0.94, y: 35 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            },
          },
        );
      }

      // Phase story texts reveal
      const phaseEls = section.querySelectorAll(".story-phase-text");
      if (phaseEls.length > 0) {
        gsap.fromTo(
          phaseEls,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const storyHeadingWords = [
    "Some",
    "things",
    "are",
    "better",
    "when",
    "they",
    "take",
    "time.",
  ];
  const storySubline = "Handwoven beginnings. Easy silhouettes. Clothes made for real days.";

  return (
    <section ref={sectionRef} className="story-section" id="story">
      {/* Centered Heading + Subtitle Header Block */}
      <div className="story-section__header">
        <h2 className="story-section__heading">
          {storyHeadingWords.map((word, idx) => (
            <span
              key={idx}
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "top",
                paddingBottom: "4px",
              }}
            >
              <span
                className="story-heading-word"
                style={{
                  display: "inline-block",
                  transformOrigin: "bottom left",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>
        <p className="story-section__subline">{storySubline}</p>
      </div>

      {/* Static Center Portrait Card with Integrated Frame & 3 Cross-Fading Images */}
      <div className="story-section__portrait">
        <svg className="story-portrait-frame" viewBox="0 0 240 330" aria-hidden="true">
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
        <div className="story-images-stack">
          <img
            className="story-img story-img--0"
            src="/assets/homepage/IMG_1048.JPG"
            alt="Handcrafted Thread Spun by Hand"
          />
          <img
            className="story-img story-img--1"
            src="/assets/homepage/14887305-5caf-4e77-b3fa-c79443ced34b.png"
            alt="Handcrafted Garment Cut and Stitched"
          />
          <img
            className="story-img story-img--2"
            src="/assets/homepage/IMG_0110.jpg"
            alt="Finished Natural Khadi Clothing"
          />
        </div>
      </div>

      {/* Phase texts */}
      {phases.map((phase, i) => (
        <div
          key={i}
          className={`story-phase-text story-phase-text--${phase.position}`}
        >
          <p>{phase.text}</p>
        </div>
      ))}

      {/* Link to Fabric Story */}
      <a href="/fabric" className="story-section__link">
        Discover Sum →
      </a>

      {/* Cloth image */}
      <div className="story-section__cloth">
        <img src="/assets/cloth.png" alt="Handcrafted Khadi Cloth" />
      </div>

      {/* Background */}
      <div className="story-section__bg">
        <img src="/assets/homepage/IMG_8945.jpg" alt="Fabric Texture Background" />
      </div>
    </section>
  );
};

export default StorySection;
