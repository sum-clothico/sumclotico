"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/showreel.css";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    heading: "How Khadi Is Made",
    body: "Khadi is not rushed. That's what makes it special.",
    img: "/assets/img/1.png",
  },
  {
    heading: "The Cotton",
    body: "Natural cotton is cleaned and prepared — raw, unbleached, and full of life.",
    img: "/assets/img/3.png",
  },
  {
    heading: "Spinning",
    body: "Spun by hand on a charkha. The fibers stay airy and alive.",
    img: "/assets/img/5.png",
  },
  {
    heading: "Weaving",
    body: "Woven on handlooms — each movement controlled by hand, no automation.",
    img: "/assets/img/7.png",
  },
  {
    heading: "Fabric Comes to Life",
    body: "A fabric that breathes, moves, and feels different from anything machine-made.",
    img: "/assets/img/9.png",
  },
  {
    heading: "The Beauty of Khadi",
    body: "No two fabrics are the same. Uneven patterns, unmatched weaving, unmatched comfort.",
    img: "/assets/img/11.png",
  },
];

export default function Showreel() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const PIN = STEPS.length * 1000;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${PIN}`,
        pin: true,
        pinSpacing: true,
      });

      const slides = sectionRef.current.querySelectorAll(".sr-slide");
      const images = sectionRef.current.querySelectorAll(".sr-img-layer");

      // init: all hidden except first
      gsap.set(slides, { opacity: 0, y: 40 });
      gsap.set(slides[0], { opacity: 1, y: 0 });

      // images: stack with clip-path, first visible
      gsap.set(images, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(images[0], { clipPath: "inset(0% 0% 0% 0%)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${PIN}`,
          scrub: 2,
        },
      });

      const seg = 1 / STEPS.length;

      STEPS.forEach((_, i) => {
        const start = i * seg;
        const fadeOut = start + seg * 0.6;

        if (i > 0) {
          // text fade in
          tl.fromTo(
            slides[i],
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: seg * 0.35, ease: "power3.out" },
            start,
          );
          // image split reveal (top → bottom curtain)
          tl.fromTo(
            images[i],
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: seg * 0.4,
              ease: "power3.inOut",
            },
            start,
          );
        }

        // fade out text only
        if (i < STEPS.length - 1) {
          tl.to(
            slides[i],
            { opacity: 0, y: -25, duration: seg * 0.25, ease: "power2.in" },
            fadeOut,
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="showreel-section sr-section"
      id="showreel-section"
    >
      <div className="sr-bg" />

      <div className="sr-split">
        {/* Left: text */}
        <div className="sr-left">
          <div className="sr-content-area">
            {STEPS.map((s, i) => (
              <div key={i} className="sr-slide">
                <span className="sr-ornament">✦</span>
                <h2 className="sr-heading">{s.heading}</h2>
                <p className="sr-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: stacked images with split reveal */}
        <div className="sr-right">
          {STEPS.map((s, i) => (
            <div key={i} className="sr-img-layer">
              <img src={s.img} alt={s.heading} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
