import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/traveling-image.css";

gsap.registerPlugin(ScrollTrigger);

const TEXT_SCROLL_DISTANCE = 2500;
const TOTAL_PIN_DISTANCE = 3300;
const STORY_PIN = 4500;

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

    // ── Initial state ──
    gsap.set(el, {
      opacity: 0,
      scale: 0.85,
      xPercent: -50,
      yPercent: -50,
      left: "50%",
      top: "40%",
    });

    // ═════════════════════════════════════════════════════════════
    // PHASE 0 — Fade in during HorizontalWords extended pin
    // ═════════════════════════════════════════════════════════════
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

    // ── HorizontalWords frame draw ──
    const hFrame = hWords.querySelector(".section-frame-path");
    if (hFrame) {
      const len = hFrame.getTotalLength();
      gsap.set(hFrame, { strokeDasharray: len, strokeDashoffset: len });
      fadeInTl.to(
        hFrame,
        {
          strokeDashoffset: 0,
          ease: "power2.inOut",
          duration: TOTAL_PIN_DISTANCE - TEXT_SCROLL_DISTANCE,
        },
        "<",
      );
    }

    // ═════════════════════════════════════════════════════════════
    // PHASE 1 — Travel to StorySection center
    // ═════════════════════════════════════════════════════════════
    const travelToStoryTl = gsap.timeline({
      scrollTrigger: {
        trigger: storySection,
        start: "top bottom",
        end: "top top",
        scrub: 1.5,
      },
    });
    triggers.push(travelToStoryTl.scrollTrigger);
    travelToStoryTl.to(el, {
      left: "50%",
      top: "50%",
      duration: 1,
      ease: "expo.inOut",
    });

    // ═════════════════════════════════════════════════════════════
    // PHASE 2 — Single vertical reveal (bottom → top)
    // ═════════════════════════════════════════════════════════════
    const curtain0 = el.querySelector(".curtain-0");
    const curtain1 = el.querySelector(".curtain-1");

    const splitTl = gsap.timeline({
      scrollTrigger: {
        trigger: storySection,
        start: "top top",
        end: `+=${STORY_PIN}`,
        scrub: 1,
      },
    });
    triggers.push(splitTl.scrollTrigger);

    // Initial state
    gsap.set([curtain0, curtain1], {
      clipPath: "inset(0% 0% 0% 0%)",
    });

    // Phase A hold
    splitTl.to({}, { duration: 0.3 });

    // Reveal curtain 0 (bottom → top)
    if (curtain0) {
      splitTl.to(curtain0, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.35,
        ease: "expo.inOut",
      });
    }

    // Phase B hold
    splitTl.to({}, { duration: 0.3 });

    // Reveal curtain 1 (bottom → top)
    if (curtain1) {
      splitTl.to(curtain1, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.35,
        ease: "expo.inOut",
      });
    }

    // Phase C holds remainder

    // ═════════════════════════════════════════════════════════════
    // PHASE 3 — Travel from StorySection to SplitSection
    // ═════════════════════════════════════════════════════════════
    const travelToSplitTl = gsap.timeline({
      scrollTrigger: {
        trigger: splitSection,
        start: "top bottom",
        end: "top 10%",
        scrub: 1.5,
      },
    });
    triggers.push(travelToSplitTl.scrollTrigger);
    travelToSplitTl.to(el, {
      left: "18%",
      top: "30%",
      scale: 1.02,
      duration: 1.5,
      ease: "expo.inOut",
    });

    // ── SplitSection frame draw ──
    const splitFrame = splitSection.querySelector(".section-frame-path");
    if (splitFrame) {
      const len = splitFrame.getTotalLength();
      gsap.set(splitFrame, { strokeDasharray: len, strokeDashoffset: len });
      travelToSplitTl.to(
        splitFrame,
        { strokeDashoffset: 0, ease: "power2.inOut", duration: 1.5 },
        0,
      );
    }

    // ═════════════════════════════════════════════════════════════
    // PHASE 4 — Lock to SplitSection (reparent fixed → absolute)
    // ═════════════════════════════════════════════════════════════
    const lockST = ScrollTrigger.create({
      trigger: splitSection,
      start: "top 2%",
      onEnter: () => {
        if (isLanded) return;
        isLanded = true;
        const elRect = el.getBoundingClientRect();
        const splitRect = splitSection.getBoundingClientRect();
        const absLeft = elRect.left + elRect.width / 2 - splitRect.left;
        const absTop = elRect.top + elRect.height / 2 - splitRect.top;
        splitSection.appendChild(el);
        gsap.set(el, { position: "absolute", left: absLeft, top: absTop });
      },
      onLeaveBack: () => {
        if (!isLanded) return;
        isLanded = false;
        const elRect = el.getBoundingClientRect();
        document.body.appendChild(el);
        gsap.set(el, {
          position: "fixed",
          left: elRect.left + elRect.width / 2,
          top: elRect.top + elRect.height / 2,
        });
      },
    });
    triggers.push(lockST);

    return () => triggers.forEach((st) => st && st.kill());
  }, []);

  return (
    <div ref={containerRef} className="traveling-image">
      {/* Bottom: Phase C image */}
      <img
        className="traveling-image__base"
        src="/assets/img/12.png"
        alt="Khadi Product"
      />

      {/* Middle curtain: Phase B → splits to reveal Phase C */}
      {/* Middle curtain */}
      <div className="traveling-image__curtain curtain-1">
        <img src="/assets/img/5.png" alt="" />
      </div>

      {/* Top curtain */}
      <div className="traveling-image__curtain curtain-0">
        <img src="/assets/img/8.png" alt="" />
      </div>
    </div>
  );
};

export default TravelingImage;
