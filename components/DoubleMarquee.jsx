"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 11 images from /assets/img/
const IMAGES = Array.from({ length: 11 }, (_, i) => ({
  src: `/assets/img/${i + 1}.png`,
  alt: `SUM CLOTHICO ${i + 1}`,
}));

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildImageTracks(isMobile) {
  const tracks = [[], []];
  const shuffled = shuffleArray(IMAGES);

  // Split images across 2 tracks
  shuffled.forEach((img, i) => {
    tracks[i % 2].push(img);
  });

  // Duplicate for seamless looping (desktop only)
  if (!isMobile) {
    tracks[0] = [...tracks[0], ...tracks[0]];
    tracks[1] = [...tracks[1], ...tracks[1]];
  }

  return tracks;
}

export default function DoubleMarquee() {
  const [tracks, setTracks] = useState([[], []]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(mobile);
    setTracks(buildImageTracks(mobile));

    // Arrow path animation
    gsap.set(".marquee-left .marquee-svg-item:nth-child(2) path", {
      strokeDashoffset: 1000,
    });

    const marqueeTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".Double-marquee",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    marqueeTl
      .to(".marquee-underline", {
        scaleX: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      })
      .to(
        ".marquee-left .marquee-svg-item:nth-child(1)",
        {
          scale: 1,
          opacity: 1,
          rotation: -10,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.5",
      )
      .to(
        ".marquee-left .marquee-svg-item:nth-child(2) path",
        { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" },
        "-=0.3",
      );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === ".Double-marquee") t.kill();
      });
    };
  }, []);

  return (
    <>
      {/* Left: Text + Blob + Instagram button */}
      <div className="marquee-left">
        <div className="marquee-text-container">
          <h2>
            follow us on
            <br />
            <span className="text-with">instagram:</span>
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="marquee-underline"
            viewBox="0 0 132 5"
            fill="none"
          >
            <path
              d="M1 2.08377C44.3458 3.90451 87.9791 5.71442 131 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <a
            href="https://www.instagram.com/sumclothico/"
            target="_blank"
            rel="noopener noreferrer"
            className="marquee-instagram-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Visit Instagram
          </a>
        </div>
        <div className="marquee-blob-container">
          <img
            src="/assets/Marquee-blob SVG/marquee-blob.svg"
            className="marquee-blob"
            alt=""
            aria-hidden="true"
          />
          <div className="marquee-svg-container">
            <div className="marquee-svg-item">
              <img
                src="/assets/Marquee-blob SVG/marquee-hand.svg"
                width="100%"
                alt=""
                aria-hidden="true"
              />
            </div>
            <div className="marquee-svg-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                viewBox="0 0 386 127"
                fill="none"
              >
                <path
                  d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Two scrolling columns of images */}
      <div className="marquee-right">
        {tracks.map((trackItems, colIndex) => (
          <div key={colIndex} className="marquee-column">
            <div className="marquee-track">
              {trackItems.map((item, i) => (
                <div key={i} className="marquee-item marquee-item--photo">
                  <img
                    src={item.src}
                    loading="lazy"
                    alt={item.alt}
                    className="marquee-photo"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
