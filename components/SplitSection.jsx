import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/split-section.css";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    reversed: false,
    title: ["It Breathes", "With You"],
    why: "The yarn is hand-spun — slightly uneven and airy.",
    how: "Air passes through easily, so the fabric stays cool in summer and comfortable in changing weather.",
    label: ["KHADI", "VOL 1"],
    model: "/assets/model.png",
  },
  {
    reversed: true,
    title: ["It Has a Life", "of Its Own"],
    why: "Machines create perfect, uniform fabric. Hands don't.",
    how: "Those tiny variations make each piece unique — it doesn't feel flat or lifeless.",
    label: ["KHADI", "VOL 2"],
    model: "/assets/m2.png",
  },
  {
    reversed: false,
    title: ["Gentle on", "Your Skin"],
    why: "Khadi is made with minimal chemical processing.",
    how: "It feels soft, natural, and is suitable for long hours of wear.",
    label: ["KHADI", "VOL 3"],
    model: "/assets/m3.png",
  },
  {
    reversed: true,
    title: ["Better for", "the Planet"],
    why: "No heavy machines, low electricity, less industrial processing.",
    how: "Lower environmental impact — making it a more sustainable choice.",
    label: ["KHADI", "VOL 4"],
    model: "/assets/m1.png",
  },
];

const SplitPanel = ({ reversed, title, why, how, label, model }) => {
  const sectionRef = useRef(null);
  const modelRef = useRef(null);

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

      gsap.fromTo(
        modelRef.current,
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

      gsap.from(section.querySelectorAll(".split-section__why, .split-section__how"), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
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
        <div className="split-section__content">
          <div className="split-section__title">
            {title.map((t, i) => (
              <React.Fragment key={i}>
                <span>{t}</span>
                {i < title.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          <div className="split-section__why">
            <span style={{ fontWeight: 700, color: "#5C4033", display: "block", marginBottom: "4px" }}>WHY IT MATTERS</span>
            {why}
          </div>
          <div className="split-section__how">
            <span style={{ fontWeight: 700, color: "#5C4033", display: "block", marginBottom: "4px" }}>HOW IT FEELS</span>
            {how}
          </div>
        </div>
      </div>

      <div className="split-section__right" />

      <div ref={modelRef} className="split-section__model">
        <img src={model} alt="Khadi Model" />
      </div>
    </section>
  );
};

const SplitSection = () => (
  <>
    {PANELS.map((p, i) => (
      <SplitPanel key={i} {...p} />
    ))}
  </>
);

export default SplitSection;
