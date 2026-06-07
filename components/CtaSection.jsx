import React from "react";
import Link from "next/link";
import "../app/styles/cta-section.css";

export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-section__container">
        <h2 className="cta-section__title">Ready to experience Khadi?</h2>
        <div className="cta-section__buttons">
          <Link href="/collection" className="cta-section__btn cta-section__btn--primary">
            Explore the Collection
          </Link>
          <Link href="/our-story" className="cta-section__btn cta-section__btn--secondary">
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
