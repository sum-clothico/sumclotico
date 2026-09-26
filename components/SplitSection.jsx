import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/split-section.css";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    reversed: false,
    title: ["Easy", "Moves With You"],
    why: "Clothes that move with you wherever your day wanders.",
    how: "Comfort that doesn't ask you to compromise on looking good — easy shapes with effortless attitude.",
    label: ["PRINCIPLE", "EASY"],
    model: "/assets/model.png",
  },
  {
    reversed: true,
    title: ["Thoughtful", "Every Detail"],
    why: "Every detail has a clear reason to be there.",
    how: "Thoughtful silhouettes, functional deep pockets, and cuts designed for real days and spontaneous plans.",
    label: ["PRINCIPLE", "THOUGHTFUL"],
    model: "/assets/m2.png",
  },
  {
    reversed: false,
    title: ["Rooted", "In Place"],
    why: "Textiles with an authentic story, artisan hands, and a place.",
    how: "Starting with pure Khadi cotton sourced from Madhya Pradesh, woven at human pace on wooden looms.",
    label: ["PRINCIPLE", "ROOTED"],
    model: "/assets/m3.png",
  },
  {
    reversed: true,
    title: ["Long-Wearing", "Beyond Seasons"],
    why: "Made to stay in your wardrobe beyond a single fleeting trend.",
    how: "Pieces you can wear more than one way, softening and relaxing naturally with every wash.",
    label: ["PRINCIPLE", "LONG-WEARING"],
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
