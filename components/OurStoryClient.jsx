"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/our-story.css";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

export default function OurStoryClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in elements
      gsap.fromTo(
        ".os-fade-up",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".os-hero",
            start: "top 80%",
          },
        }
      );

      // Journey steps animation
      const journeySection = document.querySelector(".os-journey-scroll");
      const pinContainer = journeySection.querySelector(".os-js-pin");
      const textEls = journeySection.querySelectorAll(".os-js-text");
      const imgs = journeySection.querySelectorAll(".os-js-img");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: journeySection,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
        },
      });

      // Images are stacked. img-3 on top, img-0 on bottom.
      // We will clipPath them away to reveal the one below.
      // img[0] is base. img[1] is step 2, img[2] is step 3, img[3] is step 4.
      // Let's set them all to visible initially via css, then animate clipPath
      gsap.set(imgs, { clipPath: "inset(0% 0% 0% 0%)" });

      const numPhases = 4;
      const phaseDuration = 1 / numPhases;
      const fadeDuration = phaseDuration * 0.15;
      const holdDuration = phaseDuration * 0.7;

      textEls.forEach((el, i) => {
        const start = i * phaseDuration;
        
        // Text fade in/out
        tl.fromTo(
          el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: fadeDuration, ease: "power2.out" },
          start
        ).to(
          el,
          { opacity: 0, y: -30, duration: fadeDuration, ease: "power2.in" },
          start + fadeDuration + holdDuration
        );

        // Image swap (except for the last one which just stays)
        if (i < numPhases - 1) {
           // wait for text to be somewhat held, then reveal next image by clipping current one
           const imgToHide = imgs[i];
           tl.to(
             imgToHide,
             { clipPath: "inset(100% 0% 0% 0%)", duration: 0.2, ease: "expo.inOut" },
             start + fadeDuration + holdDuration - 0.1
           );
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const journeyPhases = [
    {
      title: "Step 1: The Cotton",
      text: "Natural cotton is cleaned and prepared.",
      position: "left",
      img: "/assets/img/12.png"
    },
    {
      title: "Step 2: Spinning",
      text: "Hand-spun yarn created using traditional charkhas. This process keeps the fibers airy and alive.",
      position: "right",
      img: "/assets/img/19.png"
    },
    {
      title: "Step 3: Weaving",
      text: "Handwoven fabric crafted on looms by skilled artisans. Each movement is controlled by hand — no automation.",
      position: "left",
      img: "/assets/img/18.png"
    },
    {
      title: "Step 4: Fabric Comes to Life",
      text: "Naturally breathable and adaptable to climate. Minimal carbon footprint, making it a cornerstone of sustainable fashion.",
      position: "right",
      img: "/assets/img/17.png"
    }
  ];

  return (
    <div ref={containerRef} className="our-story-page">
      <div className="os-noise" />

      {/* Hero Section */}
      <section className="os-hero">
        <div className="os-hero-content">
          <h1 className="os-fade-up">There was a time when fabric was not made in factories.</h1>
          <p className="os-fade-up">It was made at home. Slowly. Carefully. By hand.</p>
          <p className="os-fade-up">Khadi comes from that time.</p>
          <p className="os-fade-up">It begins with cotton: soft, raw, untouched. It is spun into yarn on a simple wheel, one thread at a time. That yarn is then woven on a loom, guided by skilled hands, not machines.</p>
          <p className="os-fade-up">Every piece of Khadi carries hours of work, patience, and human touch.</p>
          <p className="os-fade-up os-highlight">At Sum Clothico, we didn't want to change this story.<br/>We just wanted to continue it — in a way that fits today's women.</p>
        </div>
      </section>

      {/* The Journey of Khadi (Scrolling Section) */}
      <section className="os-journey-scroll">
        <div className="os-js-pin">
          <div className="os-js-header">
            <h2 className="os-section-title">The Journey of Khadi</h2>
            <p className="os-section-sub">From cotton fiber to finished garment, Khadi undergoes a process that is as mindful as it is beautiful.</p>
          </div>

          <div className="os-js-content">
            <div className="os-js-frame">
              {journeyPhases.map((phase, i) => (
                <img 
                  key={i} 
                  src={phase.img} 
                  alt={phase.title} 
                  className={`os-js-img`} 
                  style={{ zIndex: journeyPhases.length - i }}
                />
              ))}
              <svg
                className="os-js-svg"
                viewBox="0 0 300 400"
                preserveAspectRatio="none"
              >
                <path
                  d="M 10,10 L 290,10 L 290,390 L 10,390 Z"
                  fill="none"
                  stroke="#2C2016"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {journeyPhases.map((phase, i) => (
              <div
                key={i}
                className={`os-js-text os-js-text--${phase.position}`}
              >
                <h3>{phase.title}</h3>
                <p>{phase.text}</p>
              </div>
            ))}
          </div>

          <p className="os-journey-footer">The result is a fabric that breathes, moves, and feels different from anything machine-made. This is not fast fashion. This is slow, intentional creation.</p>
        </div>
      </section>

      {/* Why Khadi Matters & VS */}
      <section className="os-split-container">
        <div className="os-col">
          <h2 className="os-section-title">Why Khadi Matters Today</h2>
          <h4 className="os-subtitle">Utility: Designed for Real Life</h4>
          <p>Khadi is no longer limited to traditional wear. Its versatility makes it perfect for:</p>
          <ul className="os-list">
            <li>Everyday essentials</li>
            <li>Workwear with comfort and elegance</li>
            <li>Travel-friendly, breathable clothing</li>
            <li>All-season wardrobes</li>
            <li>Minimalist and capsule collections</li>
          </ul>
          <p>It adapts to your lifestyle while maintaining its natural charm. The beauty of Khadi is in the uneven patterns, no two fabrics are the same, unmatched weaving, unmatched comfort.</p>
        </div>
        <div className="os-col os-col-dark">
          <h2 className="os-section-title text-light">Khadi vs Regular Fabrics</h2>
          <p className="text-light">Most fabrics today are made fast by machines, in bulk, with speed as the priority.</p>
          <p className="text-light os-bold">Khadi is the opposite.</p>
          <ul className="os-list text-light">
            <li>It takes time</li>
            <li>It involves people, not just machines</li>
            <li>It is made in small batches</li>
            <li>It carries a human story</li>
          </ul>
          <p className="text-light">That's why it feels different when you wear it.</p>
        </div>
      </section>

      {/* Sum Clothico Role */}
      <section className="os-role">
        <h2 className="os-section-title">Sum Clothico's Role</h2>
        <p>At Sum Clothico, we believe Khadi deserves a modern narrative.</p>
        <p>We design for women who value:</p>
        <div className="os-tags">
          <span>Comfort without compromise</span>
          <span>Style rooted in authenticity</span>
          <span>Conscious consumption</span>
          <span>Effortless silhouettes</span>
          <span>Functional designs</span>
          <span>Everyday wearability</span>
        </div>
        <p className="os-role-footer">Because good clothing should fit into your life.</p>
      </section>

      <Footer />
    </div>
  );
}
