"use client";

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
    mobileModel: "/assets/img/15.png",
  },
  {
    reversed: true,
    title: ["Thoughtful", "Every Detail"],
    why: "Every detail has a clear reason to be there.",
    how: "Thoughtful silhouettes, functional deep pockets, and cuts designed for real days and spontaneous plans.",
    label: ["PRINCIPLE", "THOUGHTFUL"],
    model: "/assets/m2.png",
    mobileModel: "/assets/img/13.png",
  },
  {
    reversed: false,
    title: ["Rooted", "In Place"],
    why: "Textiles with an authentic story, artisan hands, and a place.",
    how: "Starting with pure Khadi cotton sourced from Madhya Pradesh, woven at human pace on wooden looms.",
    label: ["PRINCIPLE", "ROOTED"],
    model: "/assets/m3.png",
    mobileModel: "/assets/img/24.png",
  },
  {
    reversed: true,
    title: ["Long-Wearing", "Beyond Seasons"],
    why: "Made to stay in your wardrobe beyond a single fleeting trend.",
    how: "Pieces you can wear more than one way, softening and relaxing naturally with every wash.",
    label: ["PRINCIPLE", "LONG-WEARING"],
    model: "/assets/m1.png",
    mobileModel: "/assets/img/26.png",
  },
];

const SplitPanel = ({ reversed, title, why, how, label, model, mobileModel, isLast }) => {
  const sectionRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const xTarget = 0;

    const ctx = gsap.context(() => {
      const isDesktop = typeof window !== "undefined" && window.innerWidth > 900;

      gsap.fromTo(
        modelRef.current,
        { scale: 0.96, y: isDesktop ? 80 : 25, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        },
      );

      if (isDesktop) {
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
      }

      const contentEl = section.querySelector(".split-section__content");
      const titleWords = section.querySelectorAll(".split-title-word");
      if (titleWords.length > 0) {
        gsap.fromTo(
          titleWords,
          { y: "125%", rotate: 2.5, opacity: 0 },
          {
            y: "0%",
            rotate: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: contentEl || section,
              start: "top 80%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`split-section${reversed ? " split-section--reversed" : ""}`}
    >
      {isLast && (
        <div className="last-split-portrait" aria-hidden="true">
          <img
            src="/assets/img/17.png"
            alt="Long-Wearing Red Linen Shirt"
          />
        </div>
      )}

      <div className="split-section__left">
        <div className="split-section__content">
          <div className="split-section__title">
            {title.map((line, lineIdx) => (
              <div
                key={lineIdx}
                style={{
                  overflow: "hidden",
                  display: "block",
                  paddingBottom: "4px",
                  lineHeight: 1.05,
                }}
              >
                {line.split(" ").map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      verticalAlign: "top",
                      marginRight: "0.26em",
                    }}
                  >
                    <span
                      className="split-title-word"
                      style={{ display: "inline-block", transformOrigin: "bottom left" }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </div>
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
        <picture>
          {mobileModel && <source media="(max-width: 900px)" srcSet={mobileModel} />}
          <img src={model} alt="Khadi Model" />
        </picture>
      </div>
    </section>
  );
};

const SplitSection = () => (
  <>
    {PANELS.map((p, i) => (
      <SplitPanel key={i} isLast={i === PANELS.length - 1} {...p} />
    ))}
  </>
);

export default SplitSection;
