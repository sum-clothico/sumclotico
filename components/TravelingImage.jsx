import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/traveling-image.css";

gsap.registerPlugin(ScrollTrigger);

const TravelingImage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // We need the sections to be rendered to calculate anchors
    const hWords = document.querySelector(".horizontal-words-section");
    const splitSection = document.querySelector(".split-section");
    const splitLabel = document.querySelector(".split-section__bottom-label");

    if (!hWords || !splitSection || !splitLabel) return;

    // Use a simpler timeline synced to global scroll progress
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".horizontal-words-section",
        start: "bottom center", // Start appearing when HorizontalWords is almost done
        endTrigger: ".split-section",
        end: "bottom bottom",
        scrub: 1.5,
        // markers: true, // Uncomment to debug triggers
      },
    });

    // Initial state: Hidden at the start position (middle-right of the viewport roughly)
    gsap.set(containerRef.current, {
      opacity: 0,
      scale: 0.5,
      left: "70%",
      top: "80%",
      xPercent: -50,
      yPercent: -50,
    });

    // Phase 1: Appear
    tl.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.1,
    });

    // Phase 2: Move down and across the screen
    tl.to(containerRef.current, {
      left: "30%",
      top: "50%",
      rotation: 10,
      ease: "sine.inOut",
      duration: 0.5,
    });

    // Phase 3: Land at final destination
    tl.to(containerRef.current, {
      left: "15%",
      top: "85%", // Just above Summer Vol 2
      rotation: 0,
      ease: "power2.inOut",
      duration: 0.4,
    });

    // Phase 3: Add some sway/rotate along the journey
    gsap.to(containerRef.current, {
      rotation: "+=10",
      yoyo: true,
      repeat: -1,
      duration: 3,
      ease: "sine.inOut",
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === ".horizontal-words" && st.vars.endTrigger === ".split-section") {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="traveling-image">
      <img src="/assets/img/1.png" alt="Traveling Fragment" />
    </div>
  );
};

export default TravelingImage;
