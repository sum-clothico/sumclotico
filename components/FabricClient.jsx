"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/fabric.css";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

export default function FabricClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple fade-up for section titles
      gsap.fromTo(
        ".fab-fade-up",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fab-hero",
            start: "top 75%",
          },
        },
      );

      // Stagger steps in How Khadi is Made
      gsap.utils.toArray(".fab-step-row").forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
            },
          },
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fabric-page">
      <div className="os-noise" /> {/* Reusing noise from our-story */}
      {/* Intro */}
      <section className="fab-hero">
        <h1 className="fab-fade-up">
          Not Just Fabric.
          <br />
          Something You Can Feel.
        </h1>
        <p className="fab-fade-up">Some fabrics are made fast.</p>
        <p className="fab-fade-up">
          Khadi is made slowly by real hands, in real time. That's why it
          doesn't just look different. It feels different the moment you wear
          it.
        </p>
      </section>
      {/* What is Khadi */}
      <section className="fab-section fab-what-is">
        <div className="fab-content-box">
          <h2>What is Khadi?</h2>
          <p>
            Khadi is a fabric made from natural fibers like cotton, but what
            makes it special is how it is made. It is:
          </p>
          <ul>
            <li>
              <strong>Hand-spun</strong> (thread made by hand)
            </li>
            <li>
              <strong>Handwoven</strong> (fabric made on looms, not machines)
            </li>
          </ul>
          <p>
            This means every thread has slight variations, and every fabric has
            its own character.
          </p>
          <p className="fab-highlight">
            It's not perfect and that's exactly the point.
          </p>
        </div>
      </section>
      {/* How Khadi Is Made */}
      <section className="fab-section fab-steps">
        <h2 className="text-center mb-40">
          How Khadi Is Made
          <br />
          <span className="text-sm fw-normal">
            (And Why That Changes Everything)
          </span>
        </h2>

        <div className="fab-steps-list">
          {/* Step 1 */}
          <div className="fab-step-row">
            <div className="fab-step-text">
              <span className="fab-step-num">Step 1: Cotton</span>
              <p className="fab-step-desc">
                Raw cotton is cleaned and prepared.
              </p>
            </div>
            <div className="fab-step-img">
              <img src="/assets/ctn.jpg" alt="Raw cotton" loading="lazy" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="fab-step-row fab-step-row--reverse">
            <div className="fab-step-text">
              <span className="fab-step-num">Step 2: Spinning by Hand</span>
              <p className="fab-step-desc">
                The cotton is turned into yarn using a charkha.
              </p>
              <hr />
              <p className="fab-label">Why this matters:</p>
              <p className="fab-sub">
                Hand spinning creates tiny irregular gaps in the yarn.
              </p>
              <p className="fab-label">How it affects you:</p>
              <p className="fab-sub">
                These gaps allow air to pass through making the fabric
                breathable.
              </p>
            </div>
            <div className="fab-step-img">
              <img src="/assets/han.jpg" alt="Spinning" loading="lazy" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="fab-step-row">
            <div className="fab-step-text">
              <span className="fab-step-num">Step 3: Hand Weaving</span>
              <p className="fab-step-desc">
                The yarn is woven on a loom by artisans.
              </p>
              <hr />
              <p className="fab-label">Why this matters:</p>
              <p className="fab-sub">
                There is no uniform pressure like machines.
              </p>
              <p className="fab-label">How it affects you:</p>
              <p className="fab-sub">
                The fabric feels softer, more flexible, and less stiff.
              </p>
            </div>
            <div className="fab-step-img">
              <img src="/assets/wev.jpg" alt="Hand weaving" loading="lazy" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="fab-step-row fab-step-row--reverse">
            <div className="fab-step-text">
              <span className="fab-step-num">Step 4: The Final Fabric</span>
              <p className="fab-step-desc">What you get is a fabric that is:</p>
              <ul className="fab-list-minimal">
                <li>Alive with texture</li>
                <li>Light on the skin</li>
                <li>Made slowly, not in bulk</li>
              </ul>
            </div>
            <div className="fab-step-img">
              <img src="/assets/clt.jpg" alt="Final fabric" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
      {/* Comparisons */}
      <section className="fab-section fab-comparisons">
        <h2 className="text-center mb-40">
          Why Choose Khadi Over Cotton or Linen?
        </h2>
        <p className="text-center mb-40">
          Most people think: "Isn't this just cotton?" Not really.
        </p>

        <div className="fab-compare-grid">
          <div className="fab-compare-card">
            <h3>Khadi vs Regular Cotton</h3>
            <div className="fab-compare-item">
              <h4>Why Khadi feels cooler:</h4>
              <p>Machine-made cotton is tightly packed.</p>
              <p>
                <strong>How Khadi is different:</strong> Hand-spun yarn creates
                airflow → keeps you cooler for longer.
              </p>
            </div>
            <hr />
            <div className="fab-compare-item">
              <h4>Why Khadi feels softer over time:</h4>
              <p>Regular cotton can stay the same or wear out.</p>
              <p>
                <strong>How Khadi behaves:</strong> It becomes softer with every
                wash because the fibers relax naturally.
              </p>
            </div>
          </div>

          <div className="fab-compare-card">
            <h3>Khadi vs Linen</h3>
            <div className="fab-compare-item">
              <h4>Why linen can feel rough:</h4>
              <p>Linen fibers are naturally stiff.</p>
              <p>
                <strong>How Khadi compares:</strong> Khadi is softer from the
                start and adapts better to daily wear.
              </p>
            </div>
            <hr />
            <div className="fab-compare-item">
              <h4>Why Khadi is easier to wear daily:</h4>
              <p>Linen wrinkles sharply and needs maintenance.</p>
              <p>
                <strong>How Khadi helps:</strong> Its natural texture makes
                wrinkles look normal even beautiful.
              </p>
            </div>
          </div>
        </div>

        <p className="fab-compare-footer">
          Simple truth: Khadi is not just about fiber. It's about the process,
          and that changes how it feels on your body.
        </p>
      </section>
      {/* Sustainability & Evolution */}
      <section className="fab-section fab-sustainability">
        <div className="fab-content-box dark-box">
          <h2>Why Khadi Still Matters</h2>
          <p>
            Fast fashion is built on: Speed, Mass production, Uniformity. Khadi
            stands in complete contrast.
          </p>

          <div className="fab-reasons">
            <div className="fab-reason">
              <h4>Because it cannot be rushed</h4>
              <p>
                Each piece takes time which means less waste and more value.
              </p>
            </div>
            <div className="fab-reason">
              <h4>Because it involves people</h4>
              <p>Every step supports artisan communities.</p>
            </div>
            <div className="fab-reason">
              <h4>Made in small quantities</h4>
              <p>
                Not thousands of identical pieces but limited, thoughtful
                production.
              </p>
            </div>
          </div>

          <h3 className="mt-40">How Khadi Is Sustainable (In a Real Way)</h3>
          <div className="fab-sus-grid">
            <div className="fab-sus-item">
              <h4>Low Energy</h4>
              <p>
                <strong>Why:</strong> No heavy machinery
                <br />
                <strong>How it helps:</strong> Less electricity, lower carbon
                impact
              </p>
            </div>
            <div className="fab-sus-item">
              <h4>Minimal Processing</h4>
              <p>
                <strong>Why:</strong> Fewer chemicals used
                <br />
                <strong>How it helps:</strong> Better for your skin and
                environment
              </p>
            </div>
            <div className="fab-sus-item">
              <h4>Human-Centered</h4>
              <p>
                <strong>Why:</strong> Made by artisans
                <br />
                <strong>How it helps:</strong> Supports livelihoods and craft
              </p>
            </div>
          </div>
          <p className="fab-highlight mt-40">
            Sustainability here is not a trend. It's how the fabric has always
            been made.
          </p>
        </div>
      </section>
      <section className="fab-section text-center mb-80">
        <h2>Why People Choose Khadi Today</h2>
        <p>Not because it is traditional. But because it feels right.</p>
        <div className="fab-tags">
          <span>On your skin</span>
          <span>In your lifestyle</span>
          <span>In your choices</span>
        </div>
      </section>
      <Footer />
    </div>
  );
}
