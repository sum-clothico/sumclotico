import React, { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/traveling-image.css";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_PIN_DISTANCE = 950;
const STORY_PIN = 1000;

const SPLIT_IMAGES = [
  "/assets/img/12.png",
  "/assets/img/19.png",
  "/assets/img/18.png",
  "/assets/img/17.png",
];

const TravelingImage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const originalParent = el?.parentElement;
    const hWords = document.querySelector(".horizontal-words-section");
    const storySection = document.querySelector(".story-section");
    const splitSections = document.querySelectorAll(".split-section");

    if (!el || !hWords || !storySection || splitSections.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const lastSplit = splitSections[splitSections.length - 1];
      const triggers = [];
      let isLanded = false;

      gsap.set(el, {
        opacity: 0,
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "72%",
      });
      el.classList.add("ti-ready");

    // ═══ PHASE 0 — Fade in during HorizontalWords ═══
    const fadeInTl = gsap.timeline({
      scrollTrigger: {
        trigger: hWords,
        start: "top top",
        end: `+=${TOTAL_PIN_DISTANCE}`,
        scrub: 0.8,
      },
    });
    triggers.push(fadeInTl.scrollTrigger);
    fadeInTl.to({}, { duration: 150 });
    fadeInTl.to(el, {
      opacity: 1,
      scale: 1,
      left: "50%",
      top: "72%",
      duration: TOTAL_PIN_DISTANCE - 150,
      ease: "power2.out",
    });

    // Reset when scrolling back up above HorizontalWords
    const resetTrigger = ScrollTrigger.create({
      trigger: hWords,
      start: "top top",
      onLeaveBack: () => {
        gsap.set(el, {
          opacity: 0,
          scale: 1,
          left: "50%",
          top: "72%",
        });
      },
    });
    triggers.push(resetTrigger);

    const hFrame = hWords.querySelector(".section-frame-path");
    if (hFrame) {
      const len = hFrame.getTotalLength ? hFrame.getTotalLength() : 1100;
      gsap.set(hFrame, { strokeDasharray: len, strokeDashoffset: len });
      fadeInTl.to(
        hFrame,
        {
          strokeDashoffset: 0,
          ease: "power2.inOut",
          duration: TOTAL_PIN_DISTANCE - 150,
        },
        "<",
      );
    }

    // ═══ PHASE 1 — Travel to StorySection ═══
    // Both sections share frame position at left: 50%, top: 57%
    const travelToStoryTl = gsap.timeline({
      scrollTrigger: {
        trigger: storySection,
        start: "top bottom",
        end: "top top",
        scrub: 0.8,
      },
    });
    triggers.push(travelToStoryTl.scrollTrigger);
    travelToStoryTl.to(el, {
      left: "50%",
      top: "72%",
      scale: 1,
      duration: 1,
      ease: "none",
    });

    // ═══ PHASE 2 — 3-Curtain reveal in StorySection ═══
    const curtain0 = el.querySelector(".curtain-0");
    const curtain1 = el.querySelector(".curtain-1");
    const curtain2 = el.querySelector(".curtain-2");

    const splitTl = gsap.timeline({
      scrollTrigger: {
        trigger: storySection,
        start: "top top",
        end: `+=${STORY_PIN}`,
        scrub: 0.8,
      },
    });
    triggers.push(splitTl.scrollTrigger);

    gsap.set([curtain0, curtain1, curtain2], {
      clipPath: "inset(0% 0% 0% 0%)",
    });

    // Phase 1 hold on IMG_1048.JPG
    splitTl.to({}, { duration: 0.28 });
    if (curtain0) {
      splitTl.to(curtain0, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.12,
        ease: "power2.inOut",
      });
    }

    // Phase 2 hold on 14887305-5caf-4e77-b3fa-c79443ced34b.png
    splitTl.to({}, { duration: 0.25 });
    if (curtain1) {
      splitTl.to(curtain1, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.12,
        ease: "power2.inOut",
      });
    }

    // Phase 3 hold on IMG_0110.jpg
    splitTl.to({}, { duration: 0.23 });

    // ═══ PHASE 3 — Travel through all split sections, swap image ═══
    const splitImgs = el.querySelectorAll(".ti-split");
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
      const prevTop = i === 0 ? "72%" : "32%";
      const prevScale = 1;

      // Moves promptly as section enters viewport so it arrives right into frame
      const travelTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "top 15%",
          scrub: 0.8,
        },
      });
      triggers.push(travelTl.scrollTrigger);
      travelTl.fromTo(
        el,
        { left: prevLeft, top: prevTop, scale: prevScale, immediateRender: false },
        {
          left: targetLeft,
          top: "32%",
          scale: 1,
          duration: 1,
          ease: "power2.inOut",
          immediateRender: false,
        },
      );

      const frame = section.querySelector(".section-frame-path");
      if (frame) {
        const len = frame.getTotalLength ? frame.getTotalLength() : 1100;
        gsap.set(frame, { strokeDasharray: len, strokeDashoffset: len });
        const frameSt = ScrollTrigger.create({
          trigger: section,
          start: "top 75%",
          end: "top 25%",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(frame, { strokeDashoffset: len * (1 - self.progress) });
          },
        });
        triggers.push(frameSt);
      }

      // Smooth curtain reveal for single dress images
      const imgSt = ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        onEnter: () => {
          gsap.to(splitImgs[i], {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.6,
            ease: "expo.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(splitImgs[i], {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 0.4,
            ease: "expo.in",
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
    ScrollTrigger.refresh();

      return () => {
        triggers.forEach((st) => st && st.kill());
        if (el && originalParent && el.parentElement !== originalParent) {
          originalParent.appendChild(el);
        }
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="traveling-image">
      <div className="traveling-image__curtain curtain-2">
        <img
          src="/assets/homepage/IMG_0110.jpg"
          alt="Handcrafted Khadi Texture"
        />
      </div>
      <div className="traveling-image__curtain curtain-1">
        <img
          src="/assets/homepage/14887305-5caf-4e77-b3fa-c79443ced34b.png"
          alt="Weaving Process"
        />
      </div>
      <div className="traveling-image__curtain curtain-0">
        <img src="/assets/homepage/IMG_1048.JPG" alt="Khadi Artisan Craft" />
      </div>
      {SPLIT_IMAGES.map((src, i) => (
        <img key={i} className="ti-split" src={src} alt="" />
      ))}
    </div>
  );
};

export default TravelingImage;
