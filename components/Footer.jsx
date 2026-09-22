"use client";

import { useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SOCIAL_ICONS, WIGGLE_CONFIG } from "@/lib/data";

function initWiggle(element, intensity) {
  const target = element.querySelector("[data-wiggle-target]") || element;
  gsap.set(target, { transformOrigin: "center center" });
  let tween;
  const onEnter = () => {
    tween = gsap.to(target, {
      rotation: intensity,
      duration: 0.17,
      repeat: -1,
      yoyo: true,
      ease: "steps(1)",
    });
  };
  const onLeave = () => {
    if (tween) {
      tween.kill();
      gsap.to(target, { rotation: 0, duration: 0.3, ease: "power2.out" });
    }
  };
  element.addEventListener("mouseenter", onEnter);
  element.addEventListener("mouseleave", onLeave);
  return () => {
    element.removeEventListener("mouseenter", onEnter);
    element.removeEventListener("mouseleave", onLeave);
  };
}

export default function Footer() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ─── Map link underline draw/undraw ───
    const footerMapLink = document.querySelector(".footer-map-link");
    if (footerMapLink) {
      const mapSvgPaths = footerMapLink.querySelectorAll(".draw-btn__svg path");
      mapSvgPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
      });
      const onEnter = () =>
        gsap.fromTo(
          mapSvgPaths,
          { strokeDashoffset: (i, el) => el.getTotalLength() },
          {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1,
            overwrite: true,
          },
        );
      const onLeave = () =>
        gsap.to(mapSvgPaths, {
          strokeDashoffset: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      footerMapLink.addEventListener("mouseenter", onEnter);
      footerMapLink.addEventListener("mouseleave", onLeave);
    }

    // ─── Credits pop-out ───
    const creditsWrapper = document.querySelector(".footer-credits-wrapper");
    if (creditsWrapper) {
      const creditsBox = creditsWrapper.querySelector(".credits-box");
      const creditsItems = creditsBox.querySelectorAll(".credits-item");

      // Temporarily make the box visible to measure full dimensions
      gsap.set(creditsBox, {
        visibility: "visible",
        width: "auto",
        height: "auto",
        opacity: 1,
      });
      const boxRect = creditsBox.getBoundingClientRect();
      const fullWidth = boxRect.width;
      const fullHeight = boxRect.height;
      const boxHeight = boxRect.height; // for text Y translation

      // Distance from box's final position down to behind the credits button
      const creditsBtn = creditsWrapper.querySelector(".footer-credits");
      const startY = creditsBtn.offsetHeight + 15;

      // Set precise initial states for box and text
      // Box starts collapsed rather than 0 scale
      gsap.set(creditsBox, {
        visibility: "hidden",
        width: 0,
        height: 0,
        opacity: 0,
        y: startY,
      });
      gsap.set(creditsItems, { y: boxHeight });

      const onEnter = () => {
        gsap.set(creditsBox, { visibility: "visible" });
        gsap.killTweensOf(creditsBox);
        gsap.killTweensOf(creditsItems);

        // Box physically grows to full dimensions instead of scaling
        gsap.to(creditsBox, {
          width: fullWidth,
          height: fullHeight,
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        });

        // Text slides up smoothly, slightly delayed
        gsap.to(creditsItems, {
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: "power3.out",
          delay: 0.1,
        });
      };

      const onLeave = () => {
        gsap.killTweensOf(creditsBox);
        gsap.killTweensOf(creditsItems);

        // Box physically shrinks to 0x0
        gsap.to(creditsBox, {
          width: 0,
          height: 0,
          opacity: 0,
          y: startY,
          duration: 0.35,
          ease: "power3.in",
          onComplete: () => gsap.set(creditsBox, { visibility: "hidden" }),
        });

        // Text sits perfectly still while the box begins crushing it,
        // and then slowly slides back down in reverse order (`stagger: -0.03`) so the rightmost column clears first
        gsap.to(creditsItems, {
          y: boxHeight,
          duration: 0.4,
          ease: "power3.in",
          stagger: -0.03,
          delay: 0.1,
        });
      };

      creditsWrapper.addEventListener("mouseenter", onEnter);
      creditsWrapper.addEventListener("mouseleave", onLeave);
    }



    // ─── Wiggle on footer interactive elements ───
    const wiggleTargets = [
      { selector: ".footer-column:first-child h3", key: "jobHeading" },
      { selector: ".footer-map-link span", key: "googleMap" },
      { selector: ".footer-email", key: "email" },
      { selector: ".credits-name", key: "socials" }, // Added wiggle target for names using social intensity
    ];
    wiggleTargets.forEach(({ selector, key }) => {
      document
        .querySelectorAll(selector)
        .forEach((el) => initWiggle(el, WIGGLE_CONFIG[key]));
    });

    // ─── Social icon wiggle ───
    document
      .querySelectorAll(".single-social")
      .forEach((el) => initWiggle(el, WIGGLE_CONFIG.socials));
  }, []);

  return (
    <div className="footer-inner">
      <div className="footer-top">
        {/* Careers */}
        <div className="footer-column">
          <span className="footer-badge">join our weavers</span>
          <h3>artisan positions opening soon</h3>
        </div>
        {/* Studio */}
        <div className="footer-column">
          <span className="footer-badge">studio</span>
          <address>
            handloom district
            <br />
            kolkata, india
          </address>
          <a href="#" className="footer-map-link">
            <span>Google Maps</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              viewBox="0 0 169 10"
              fill="none"
              className="draw-btn__svg"
            >
              <path
                d="M1 6.5661C56.3941 3.06082 112.187 1.20095 168 0.999878"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
              ></path>
              <path
                d="M32.1313 8.63371C68.2147 6.92799 104.462 6.13378 140.695 6.25107"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
              ></path>
            </svg>
          </a>
        </div>
        {/* Contact */}
        <div className="footer-column">
          <span className="footer-badge">contact</span>
          <a href="mailto:hello@sumclotico.com" className="footer-email">
            hello@sumclotico.com
          </a>
          <p className="footer-note">
            we&apos;d love to hear from you — reach out anytime.
          </p>
          <div className="footer-socials" id="footer-socials">
            {SOCIAL_ICONS.map(({ href, label, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="single-social w-inline-block"
                aria-label={label}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ))}
            {/* Facebook */}
            <a
              href="https://www.facebook.com/sumclotico"
              target="_blank"
              rel="noopener noreferrer"
              className="single-social w-inline-block"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none">
                <path d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C28.837 36 36 28.837 36 20C36 11.163 28.837 4 20 4ZM24.5 14H22C21.173 14 21 14.327 21 15.2V17H24.5L24 21H21V33H17V21H15V17H17V15.2C17 12.013 18.513 10 22 10C23.343 10 24.5 10.1 24.5 10.1V14Z" fill="currentColor"/>
              </svg>
            </a>
            {/* Blogs */}
            <a
              href="/blogs"
              className="single-social w-inline-block footer-blogs-link"
              aria-label="Blogs"
              title="Read our blog"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none">
                <path d="M8 10C8 8.895 8.895 8 10 8H30C31.105 8 32 8.895 32 10V30C32 31.105 31.105 32 30 32H10C8.895 32 8 31.105 8 30V10ZM12 14V16H28V14H12ZM12 19V21H28V19H12ZM12 24V26H22V24H12Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Big SUM CLOTHICO wordmark */}
      <div className="footer-bottom">
        <div className="footer-big-text">
          <span
            className="footer-logo__text"
            style={{
              fontWeight: 800,
              fontSize: "clamp(3rem, 10vw, 10rem)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: "currentColor",
              display: "block",
              lineHeight: 1,
            }}
          >
            सम् CLOTHICO
          </span>
        </div>



        {/* Bottom row: credits */}
        <div className="footer-bottom-row">
          <div></div>
          <div className="footer-credits-wrapper">
            <div className="credits-box">
              <div className="credits-content">
                <div className="credits-item credit-wiggle">
                  <div className="overflow-wrapper">
                    <span className="credits-label">design by</span>
                  </div>
                  <div className="overflow-wrapper">
                    <a
                      href="#"
                      className="credits-name"
                      data-wiggle-target="true"
                    >
                      Bimal
                    </a>
                  </div>
                </div>
                <div className="credits-item credit-wiggle">
                  <div className="overflow-wrapper">
                    <span className="credits-label">code by</span>
                  </div>
                  <div className="overflow-wrapper">
                    <a
                      href="#"
                      className="credits-name"
                      data-wiggle-target="true"
                    >
                      Bimal
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <a href="#" className="footer-credits">
              credits
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Gradient and Image Overlay */}
      <div className="footer-bottom-gradient"></div>
      <div className="footer-f1-overlay">
        <img src="/assets/f1.png" alt="" />
      </div>

      {/* Closing tagline + quick links */}
      <div className="footer-closing-line" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
        <p className="footer-closing-tagline">Slowly made. Easy to wear. Hard to replace.</p>
        
        {/* Main Site Links */}
        <nav className="footer-quick-links" aria-label="Footer site links">
          <Link href="/collection">Shop Collection</Link>
          <Link href="/our-story">Our Story</Link>
          <Link href="/fabric">Handloom Fabric</Link>
          <Link href="/track-order">Track Order</Link>
          <Link href="/faq">FAQs</Link>
          <Link href="/blogs">Artisan Journal</Link>
          <a href="https://www.instagram.com/sumclothico/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:hello@sumclotico.com">Contact Us</a>
        </nav>

        {/* Legal, Terms & Policies Links */}
        <nav
          className="footer-policy-links"
          aria-label="Legal and policy links"
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.65)",
            paddingTop: "6px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Link href="/policies/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms & Conditions</Link>
          <span>•</span>
          <Link href="/policies/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
          <span>•</span>
          <Link href="/policies/returns" style={{ color: "inherit", textDecoration: "none" }}>Returns & Exchange Policy</Link>
          <span>•</span>
          <Link href="/policies/shipping" style={{ color: "inherit", textDecoration: "none" }}>Shipping & Delivery</Link>
          <span>•</span>
          <Link href="/policies/cancellation" style={{ color: "inherit", textDecoration: "none" }}>Cancellation Policy</Link>
        </nav>
      </div>
    </div>
  );
}
