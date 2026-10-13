import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/story-section.css";

gsap.registerPlugin(ScrollTrigger);

const PIN_DURATION = 1000;

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
      const textEls = section.querySelectorAll(".story-phase-text");

      const isDesktop =
        typeof window !== "undefined" && window.innerWidth > 900;
      const PIN = isDesktop ? PIN_DURATION : 800;

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

      // Single Unified Master Timeline: Pins section & drives all synchronized animations
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${PIN}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Frame stroke-draw in early stage of pin
      const framePath = frameRef.current;
      if (framePath) {
        const len = framePath.getTotalLength ? framePath.getTotalLength() : 1100;
        gsap.set(framePath, { strokeDasharray: len, strokeDashoffset: len });
        masterTl.to(
          framePath,
          {
            strokeDashoffset: 0,
            duration: 0.15,
            ease: "power2.inOut",
          },
          0,
        );
      }

      // Side cloth animation on scroll (moves smoothly while background stays locked)
      const clothEl = section.querySelector(".story-section__cloth");
      if (clothEl) {
        masterTl.to(
          clothEl,
          {
            xPercent: -70,
            duration: 1,
            ease: "none",
          },
          0,
        );
      }

      // 3 Text Phases timed evenly across the pin duration
      textEls.forEach((el, idx) => {
        const startPoint = idx * 0.33;
        masterTl
          .fromTo(
            el,
            { opacity: 0, y: 35, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.1,
              ease: "power3.out",
            },
            startPoint,
          )
          .to(
            el,
            {
              opacity: 0,
              y: -25,
              scale: 0.98,
              duration: 0.08,
              ease: "power2.in",
            },
            startPoint + 0.23,
          );
      });
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

      {/* Static Center Portrait Card */}
      <div className="story-section__portrait">
        <img
          src="/assets/homepage/IMG_1048.JPG"
          alt="Handcrafted Khadi Garment"
        />
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
