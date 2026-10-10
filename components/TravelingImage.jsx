import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/traveling-image.css";

gsap.registerPlugin(ScrollTrigger);

const TEXT_SCROLL_DISTANCE = 400;
const TOTAL_PIN_DISTANCE = 1300;
const STORY_PIN = 1400;

const SPLIT_IMAGES = [
  "/assets/img/12.png",
  "/assets/img/19.png",
  "/assets/img/18.png",
  "/assets/img/17.png",
];

const TravelingImage = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const originalParent = el?.parentElement;
    const hWords = document.querySelector(".horizontal-words-section");
    const storySection = document.querySelector(".story-section");
    const splitSections = document.querySelectorAll(".split-section");

    if (!el || !hWords || !storySection || splitSections.length === 0) return;

    const lastSplit = splitSections[splitSections.length - 1];
    const triggers = [];
    let isLanded = false;

    gsap.set(el, {
      opacity: 0,
      scale: 0.85,
      xPercent: -50,
      yPercent: -50,
      left: "50%",
      top: "58%",
    });
    el.classList.add("ti-ready");

    // ═══ PHASE 0 — Fade in during HorizontalWords ═══
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

    // ═══ PHASE 1 — Travel to StorySection ═══
    const travelToStoryTl = gsap.timeline({
      scrollTrigger: {
        trigger: storySection,
        start: "top 40%",
        end: "top top",
        scrub: 1.5,
      },
    });
    triggers.push(travelToStoryTl.scrollTrigger);
    travelToStoryTl.fromTo(
      el,
      { left: "50%", top: "58%", scale: 1 },
      {
        left: "50%",
        top: "56%",
        scale: 1,
        duration: 1,
        ease: "expo.inOut",
      },
    );

    // ═══ PHASE 2 — Curtain reveal in StorySection ═══
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

    gsap.set([curtain0, curtain1], { clipPath: "inset(0% 0% 0% 0%)" });
    splitTl.to({}, { duration: 0.3 });
    if (curtain0) {
      splitTl.to(curtain0, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.35,
        ease: "expo.inOut",
      });
    }
    splitTl.to({}, { duration: 0.3 });
    if (curtain1) {
      splitTl.to(curtain1, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.35,
        ease: "expo.inOut",
      });
    }

    // ═══ PHASE 3 — Travel through all split sections, swap image ═══
    const splitImgs = el.querySelectorAll(".ti-split");
    // hide all via clip — base image shows through until first section
    gsap.set(splitImgs, { clipPath: "inset(100% 0% 0% 0%)" });

    splitSections.forEach((section, i) => {
      const isReversed = section.classList.contains("split-section--reversed");
      const targetLeft = isReversed ? "82%" : "18%";

      const prevLeft =
        i === 0
          ? "50%"
          : splitSections[i - 1].classList.contains("split-section--reversed")
            ? "82%"
            : "18%";
      const prevTop = i === 0 ? "50%" : "30%";
      const prevScale = i === 0 ? 1 : 1.02;

      const travelTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "top -40%",
          scrub: 1.5,
        },
      });
      triggers.push(travelTl.scrollTrigger);
      travelTl.fromTo(
        el,
        { left: prevLeft, top: prevTop, scale: prevScale },
        {
          left: targetLeft,
          top: "30%",
          scale: 1.02,
          duration: 1,
          ease: "expo.inOut",
        },
      );

      const frame = section.querySelector(".section-frame-path");
      if (frame) {
        const len = frame.getTotalLength();
        gsap.set(frame, { strokeDasharray: len, strokeDashoffset: len });
        travelTl.to(
          frame,
          { strokeDashoffset: 0, ease: "power2.inOut", duration: 1 },
          0,
        );
      }

      // curtain reveal — same as Showreel split animation
      const imgSt = ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        onEnter: () => {
          gsap.to(splitImgs[i], {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.7,
            ease: "expo.inOut",
          });
        },
        onLeaveBack: () => {
          gsap.to(splitImgs[i], {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 0.5,
            ease: "expo.inOut",
          });
        },
      });
      triggers.push(imgSt);
    });

    // ═══ PHASE 4 — Lock to last split section ═══
    const lockST = ScrollTrigger.create({
      trigger: lastSplit,
      start: "top 2%",
      onEnter: () => {
        if (isLanded) return;
        isLanded = true;
        const elRect = el.getBoundingClientRect();
        const splitRect = lastSplit.getBoundingClientRect();
        const absLeft = elRect.left + elRect.width / 2 - splitRect.left;
        const absTop = elRect.top + elRect.height / 2 - splitRect.top;
        lastSplit.appendChild(el);
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

    return () => {
      triggers.forEach((st) => st && st.kill());
      if (el && originalParent && el.parentElement !== originalParent) {
        originalParent.appendChild(el);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="traveling-image">
      <img
        className="traveling-image__base"
        src="/assets/img/12.png"
        alt="Khadi Product"
      />
      <div className="traveling-image__curtain curtain-1">
        <img src="/assets/khadi.jpg" alt="" />
      </div>
      <div className="traveling-image__curtain curtain-0">
        <img src="/assets/fabric.jpg" alt="" />
      </div>
      {SPLIT_IMAGES.map((src, i) => (
        <img key={i} className="ti-split" src={src} alt="" />
      ))}
    </div>
  );
};

export default TravelingImage;
