import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/story-section.css";

gsap.registerPlugin(ScrollTrigger);

const StorySection = () => {
  const sectionRef = useRef(null);
  const drapeRef = useRef(null);
  const textRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slide the cloth image out of frame towards the left on scroll
      const clothEl = sectionRef.current.querySelector(".story-section__cloth");
      if (clothEl) {
        gsap.to(clothEl, {
          xPercent: -80, // Slide most of the way out
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top", // Start sliding when section is pinned/active
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Finalize text reveal
      const textElements = textRef.current.children;
      gsap.fromTo(
        textElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="story-section">

      <div className="story-section__container">
        <div ref={textRef} className="story-section__content">
          <p className="story-section__text">
            This centuries-old art from{" "}
            <span className="story-section__highlight">Kashmir</span> tells
            stories through intricate patterns.
          </p>
          <h2 className="story-section__heading">Can you guess what it is?</h2>
        </div>
      </div>

      {/* ─── Product Image (Cloth) ─── */}
      <div className="story-section__cloth">
        <img src="/assets/cloth.png" alt="Handcrafted Khadi Cloth" />
      </div>

      <div ref={bgRef} className="story-section__bg">
        <img src="/assets/bgiamge.png" alt="Landscape Background" />
      </div>
    </section>
  );
};

export default StorySection;
