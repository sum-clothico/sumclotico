import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/split-section.css";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  { reversed: false },
  { reversed: true },
  { reversed: false },
  { reversed: true },
];

const SplitPanel = ({ reversed }) => {
  const sectionRef = useRef(null);
  const modelRef = useRef(null);
  const leftTextRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const xTarget = section.classList.contains("split-section--reversed") ? -150 : 150;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        modelRef.current,
        { scale: 0.95, y: 100, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        },
      );

      gsap.fromTo(modelRef.current,
        { x: 0 },
        {
          x: xTarget,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.from(section.querySelectorAll(".split-section__title span"), {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`split-section${reversed ? " split-section--reversed" : ""}`}
    >
      <svg className="split-section__frame" viewBox="0 0 240 330">
        <rect
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

      <div className="split-section__left">
        <div ref={leftTextRef} className="split-section__content">
          <div className="split-section__title">
            <span>SUNLIT</span>
            <br />
            <span>ESSENTIALS</span>
          </div>
          <p className="split-section__subtitle">
            for carefree, Breezy days. Prints that
            <br />
            flow seamlessly from day to night.
          </p>
        </div>

        <div className="split-section__bottom-label">
          SUMMER
          <br />
          VOL 2
        </div>
      </div>

      <div className="split-section__right" />

      <div ref={modelRef} className="split-section__model">
        <img src="/assets/model.png" alt="Summer Collection Model" />
      </div>
    </section>
  );
};

const SplitSection = () => (
  <>
    {PANELS.map((p, i) => (
      <SplitPanel key={i} index={i} reversed={p.reversed} />
    ))}
  </>
);

export default SplitSection;
