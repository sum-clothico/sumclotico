import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/traveling-image.css";

gsap.registerPlugin(ScrollTrigger);

const TEXT_SCROLL_DISTANCE = 2500;
const TOTAL_PIN_DISTANCE = 3300;

const TravelingImage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const hWords = document.querySelector(".horizontal-words-section");
    const storySection = document.querySelector(".story-section");
    const splitSection = document.querySelector(".split-section");

    if (!el || !hWords || !storySection || !splitSection) return;

    const triggers = [];
    let isLanded = false;

    // ── Initial state: hidden, centered in viewport ──
    gsap.set(el, {
      opacity: 0,
      scale: 0.85,
      xPercent: -50,
      yPercent: -50,
      left: "50%",
      top: "40%",
    });

    // ═══════════════════════════════════════════════════════════
    // PHASE 0 — Elegant fade-in from center during extended pin
    // ═══════════════════════════════════════════════════════════
    const fadeInTl = gsap.timeline({
      scrollTrigger: {
        trigger: hWords,
        start: "top top",
        end: `+=${TOTAL_PIN_DISTANCE}`,
        scrub: 1,
      },
    });
    triggers.push(fadeInTl.scrollTrigger);

    fadeInTl.to({}, { duration: TEXT_SCROLL_DISTANCE });
    fadeInTl.to(el, {
      opacity: 1,
      scale: 1,
      duration: TOTAL_PIN_DISTANCE - TEXT_SCROLL_DISTANCE,
      ease: "power3.out",
    });

    // ═══════════════════════════════════════════════════════════
    // PHASE 1 & 2 — Smooth travel to Story → Split
    // ═══════════════════════════════════════════════════════════
    const travelTl = gsap.timeline({
      scrollTrigger: {
        trigger: storySection,
        start: "top bottom",
        endTrigger: splitSection,
        end: "top 10%",
        scrub: 1.5,
      },
    });
    triggers.push(travelTl.scrollTrigger);

    // Waypoint 1: Drift to StorySection center-left
    travelTl.to(el, {
      left: "50%",
      top: "50%",
      duration: 1,
      ease: "expo.inOut",
    });

    // Waypoint 2: Settle onto SplitSection title area
    travelTl.to(el, {
      left: "18%",
      top: "30%",
      scale: 1.02,
      duration: 1.5,
      ease: "expo.inOut",
    });

    // ═══════════════════════════════════════════════════════════
    // PHASE 3 — Lock image to SplitSection so it scrolls away
    //
    // When the travel ends, reparent the element from body into
    // the SplitSection as position:absolute. It now scrolls with
    // the section naturally. On scroll-back, return to fixed.
    // ═══════════════════════════════════════════════════════════
    const lockST = ScrollTrigger.create({
      trigger: splitSection,
      start: "top 2%",
      onEnter: () => {
        if (isLanded) return;
        isLanded = true;

        const elRect = el.getBoundingClientRect();
        const splitRect = splitSection.getBoundingClientRect();

        // Place at exact visual position so reparent is invisible
        const absLeft = elRect.left + elRect.width / 2 - splitRect.left;
        const absTop = elRect.top + elRect.height / 2 - splitRect.top;

        splitSection.appendChild(el);
        gsap.set(el, {
          position: "absolute",
          left: absLeft,
          top: absTop,
        });
      },
      onLeaveBack: () => {
        if (!isLanded) return;
        isLanded = false;

        const elRect = el.getBoundingClientRect();

        // Reparent back to body as fixed
        document.body.appendChild(el);
        gsap.set(el, {
          position: "fixed",
          left: elRect.left + elRect.width / 2,
          top: elRect.top + elRect.height / 2,
        });
      },
    });
    triggers.push(lockST);

    return () => {
      triggers.forEach((st) => st && st.kill());
      fadeInTl.kill();
      travelTl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="traveling-image">
      <img src="/assets/img/12.png" alt="Khadi Product" />
    </div>
  );
};

export default TravelingImage;
