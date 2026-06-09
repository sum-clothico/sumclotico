"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/collection.css";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: 1,
    name: "Seju's Top",
    subtitle: "The Throw-On Glow",
    hook: "Bright. Easy. Always works.",
    description: "For days when you're running late but still want to look like you tried—this is the one. Lightweight, breathable, and instantly cheerful, it adds just the right pop without any effort.",
    why: [
      "Feel-good color that lifts your whole look",
      "Easy fit that doesn't need styling",
      "Perfect for college, cafés, and everything in between"
    ],
    when: "You want to look cute without thinking twice.",
    oneLine: "Comfy, bright, and ready in seconds.",
    images: ["/assets/img/13.png", "/assets/img/12.png", "/assets/img/17.png"]
  },
  {
    id: 2,
    name: "Saumya's Top",
    subtitle: "The No-Extra Essential",
    hook: "Nothing extra. Everything right.",
    description: "Clean, modern, and endlessly versatile—this is your everyday uniform upgrade. It works across plans, moods, and outfits without ever trying too hard.",
    why: [
      "Sleek silhouette that looks polished instantly",
      "Goes with literally everything you own",
      "Breathable and easy from work to weekend"
    ],
    when: "You need one top that does it all—and does it well.",
    oneLine: "There's nothing extra about it—and that's the best part.",
    images: ["/assets/img/14.png", "/assets/img/18.png", "/assets/img/19.png"]
  },
  {
    id: 3,
    name: "Orange Top",
    subtitle: "The Effortless Pop",
    hook: "Bold mood. Zero effort.",
    description: "Not too loud, never dull—this top brings just the right amount of color to brighten your day (and your outfit). It's your easy way to stand out without going overboard.",
    why: [
      "Vibrant shade that instantly elevates your look",
      "Relaxed, breezy feel for all-day comfort",
      "No styling needed—just put it on and go"
    ],
    when: "You want a little attention—but on your terms.",
    oneLine: "Bright, effortless, and just enough to stand out.",
    images: ["/assets/img/15.png", "/assets/img/12.png", "/assets/img/17.png"]
  },
  {
    id: 4,
    name: "Meera's Dress",
    subtitle: "The Everyday Ease Dress",
    hook: "Simple. Breathable. Built for real days.",
    description: "Designed for women who don't have time to overthink outfits, this easy-fit dress is all about comfort, function, and quiet style. Clean lines, soft fabric, and thoughtful details make it a piece you'll keep reaching for—day after day.",
    why: [
      "Easy, relaxed fit – Moves with you, never feels restrictive",
      "Breathable fabric – Keeps you comfortable through long, busy days",
      "Elbow-length sleeves – Just the right coverage, all seasons",
      "Functional pockets – Because you actually need them",
      "Versatile design – Dress it up or down without effort"
    ],
    when: "You want one dress that works for errands, work, and downtime.",
    oneLine: "Comfortable, practical, and effortlessly put-together—every single day.",
    images: ["/assets/img/16.png", "/assets/img/18.png", "/assets/img/19.png"]
  }
];

// Simple Image Slider Component
function ImageSlider({ images, altText }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="slider-container">
      <div 
        className="slider-track" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={`${altText} ${idx + 1}`} loading="lazy" />
        ))}
      </div>
      
      {images.length > 1 && (
        <>
          <button className="slider-btn slider-btn-prev" onClick={handlePrev} aria-label="Previous image">
            &#8249;
          </button>
          <button className="slider-btn slider-btn-next" onClick={handleNext} aria-label="Next image">
            &#8250;
          </button>
          <div className="slider-dots">
            {images.map((_, idx) => (
              <span 
                key={idx} 
                className={`slider-dot ${idx === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CollectionClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".prod-fade",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".prod-grid",
            start: "top 75%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="collection-page">
      <div className="os-noise" />

      {/* Hero */}
      <section className="col-hero">
        <h1 className="prod-fade">Our Collection</h1>
        <p className="prod-fade">Pieces designed for how you live today.</p>
        
        <div className="col-details prod-fade">
          <div className="detail-item"><span>Fabric:</span> 100% Khadi</div>
          <div className="detail-item"><span>Fit:</span> Relaxed</div>
          <div className="detail-item"><span>Care:</span> Gentle wash</div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="prod-grid">
        {PRODUCTS.map((prod) => (
          <div key={prod.id} className="prod-card prod-fade">
            <div className="prod-img-wrapper">
              <ImageSlider images={prod.images} altText={prod.name} />
            </div>
            <div className="prod-info">
              <span className="prod-sub">{prod.subtitle}</span>
              <h2>{prod.name}</h2>
              <p className="prod-hook">{prod.hook}</p>
              <p className="prod-desc">{prod.description}</p>
              
              <div className="prod-why">
                <h4>Why you'll love it:</h4>
                <ul>
                  {prod.why.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>

              <div className="prod-when">
                <h4>Wear it when:</h4>
                <p>{prod.when}</p>
              </div>

              <p className="prod-oneline">"{prod.oneLine}"</p>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
