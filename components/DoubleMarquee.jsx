"use client";

import "../app/styles/marquee.css";

const IMAGES = Array.from({ length: 11 }, (_, i) => ({
  src: `/assets/img/${i + 1}.png`,
  alt: `SUM CLOTHICO ${i + 1}`,
}));

const ROW1 = [...IMAGES, ...IMAGES];
const ROW2 = [...[...IMAGES].reverse(), ...[...IMAGES].reverse()];

export default function DoubleMarquee() {
  return (
    <div className="marquee-section">
      <div className="marquee-text-block">
        <p className="arc-marquee__label">Our Collection</p>
        <h2 className="arc-marquee__heading">
          Curious What We've
          <br />
          <em>Crafted?</em>
        </h2>
        <p className="arc-marquee__desc">
          Explore our handwoven khadi textiles, sustainable fashion, and
          artisanal home collections.
        </p>
        <a
          href="https://www.instagram.com/sumclothico/"
          target="_blank"
          rel="noopener noreferrer"
          className="arc-marquee__btn"
        >
          Visit Instagram
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>
      </div>

      <div className="marquee-row marquee-row--left">
        <div className="marquee-track">
          {ROW1.map((img, i) => (
            <div key={i} className="marquee-item">
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-row marquee-row--right">
        <div className="marquee-track">
          {ROW2.map((img, i) => (
            <div key={i} className="marquee-item">
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
