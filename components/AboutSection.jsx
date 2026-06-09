import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/about-section.css";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "We don't change Khadi.",
  "We design it for today.",
];

const PIN_DISTANCE = 500 * LINES.length;

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = sectionRef.current.querySelectorAll(".about-line");

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${PIN_DISTANCE}`,
        pin: true,
        pinSpacing: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${PIN_DISTANCE}`,
          scrub: 1.5,
        },
      });

      const seg = 1 / LINES.length;

      lines.forEach((line, i) => {
        const start = i * seg;
        tl.fromTo(
          line,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: seg * 0.5, ease: "power3.out" },
          start,
        );
      });

      // Animate CTA fading in at the end
      const cta = sectionRef.current.querySelector(".about-cta");
      if (cta) {
        tl.fromTo(
          cta,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: seg * 0.5, ease: "power3.out" },
          "+=0.1"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="about-section">
      {/* Earthy textured background */}
      <div className="about-section__bg" />

      {/* Philosophy card — clean beige, no maroon SVG */}
      <div className="about-section__card">
        <div className="about-section__inner">
          {/* Logo */}
          <img className="about-section__logo" src="/assets/logo.svg" alt="Sum Clothico" />

          {/* Divider */}
          <div className="about-section__divider" />

          {/* Lines */}
          <div className="about-section__lines">
            {LINES.map((line, i) => (
              <p key={i} className="about-line">
                {line}
              </p>
            ))}
          </div>

          {/* Sub-label */}
          <p className="about-section__sub">
            A brand rooted in Khadi. Designed for how women live today.
          </p>
        </div>
      </div>

      {/* Merged CTA */}
      <div className="about-cta">
        <h2 className="about-cta__title">Ready to experience Khadi?</h2>
        <div className="about-cta__buttons">
          <Link href="/collection" className="about-cta__btn about-cta__btn--primary">
            Explore the Collection
          </Link>
          <Link href="/our-story" className="about-cta__btn about-cta__btn--secondary">
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
