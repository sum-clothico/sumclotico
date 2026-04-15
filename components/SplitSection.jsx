import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/split-section.css";

gsap.registerPlugin(ScrollTrigger);

const SplitSection = () => {
  const sectionRef = useRef(null);
  const modelRef = useRef(null);
  const leftTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Model parallax effect (fade-in & slide-up)
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
            trigger: sectionRef.current,
            start: "top 70%",
          },
        },
      );

      // Model horizontal move on scroll
      gsap.to(modelRef.current, {
        x: 100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Typography entrance
      gsap.from(".split-section__title span", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });

      gsap.from(".split-section__mahay", {
        opacity: 0,
        y: -30,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="split-section">
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

      <div className="split-section__right">
        {/* Warm colored background via CSS */}
      </div>

      <div ref={modelRef} className="split-section__model">
        <img src="/assets/model.png" alt="Summer Collection Model" />
      </div>
    </section>
  );
};

export default SplitSection;
