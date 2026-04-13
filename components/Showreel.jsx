"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ClipPathTitle from "@/components/ClipPathTitle";
import VideoPinSection from "@/components/VideoPinSection";

export default function Showreel() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealTl = gsap.timeline({
      delay: 1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        end: "top top",
        scrub: 1.5,
      },
    });

    revealTl
      .to(".showreel-section .first-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      })
      .to(".showreel-section .second-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      })
      .to(".showreel-section .third-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      })
      .to(".showreel-section .fourth-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  return (
    <section
      className="showreel-section"
      id="showreel-section"
      ref={sectionRef}
    >
      <div className="showreel__container">
        <div className="showreel__intro">
          <div className="showreel__titles">
            {/* Decorative stickers */}
            <img
              src="/assets/Card-Sticker SVG/sticker-smiley.svg"
              alt=""
              className="showreel__sticker showreel__sticker--smiley"
              aria-hidden="true"
            />
            <img
              src="/assets/Card-Sticker SVG/sticker-heart.svg"
              alt=""
              className="showreel__sticker showreel__sticker--heart"
              aria-hidden="true"
            />
            <img
              src="/assets/Card-Sticker SVG/sticker-hand.svg"
              alt=""
              className="showreel__sticker showreel__sticker--hand"
              aria-hidden="true"
            />

            <ClipPathTitle
              title="Handwoven with care"
              color="#faeade"
              bg="var(--color-green)"
              className="first-title"
              borderColor="var(--color-dark)"
            />
            <ClipPathTitle
              title="100% Organic Khadi"
              color="var(--color-dark)"
              bg="var(--color-lightgreen)"
              className="second-title"
              borderColor="var(--color-dark)"
            />
            <ClipPathTitle
              title="Sustainably crafted"
              color="#faeade"
              bg="var(--color-maroon)"
              className="third-title"
              borderColor="var(--color-dark)"
            />
            <ClipPathTitle
              title="Fair trade certified"
              color="var(--color-dark)"
              bg="var(--color-orange)"
              className="fourth-title"
              borderColor="var(--color-dark)"
            />
          </div>

          <div className="showreel__more">
            <p>And much more ...</p>
          </div>
        </div>
      </div>

      <div className="showreel__video-area">
        <VideoPinSection />
      </div>
    </section>
  );
}
