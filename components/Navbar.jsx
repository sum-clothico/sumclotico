"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { WIGGLE_CONFIG } from "@/lib/data";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { FiShoppingBag, FiUser } from "react-icons/fi";

function initWiggle(element, intensity) {
  const target = element.querySelector("[data-wiggle-target]") || element;
  if (!target) return () => {};
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

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartTotalItems, setIsCartOpen, currentUser, setIsAuthModalOpen } = useStore();

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const contentSection = document.querySelector(".content-section");
    const footerEl = document.querySelector(".main-footer");

    if (navbar) {
      navbar.classList.add("on-light");
      navbar.classList.remove("on-dark");
    }

    const updateNavbarColor = () => {
      if (!navbar || !contentSection || !footerEl) return;
      const scrollPos = window.scrollY + navbar.offsetHeight / 2;
      const contentTop =
        contentSection.getBoundingClientRect().top + window.scrollY;

      const showreelSection = document.querySelector("#showreel-section");
      const showreelTop = showreelSection
        ? showreelSection.getBoundingClientRect().top + window.scrollY
        : Infinity;

      const serviceCardsSection = document.querySelector(
        ".service-cards-wrapper",
      );
      const serviceCardsTop = serviceCardsSection
        ? serviceCardsSection.getBoundingClientRect().top + window.scrollY
        : Infinity;

      const doubleMarquee = document.querySelector(".Double-marquee");
      const doubleMarqueeTop = doubleMarquee
        ? doubleMarquee.getBoundingClientRect().top + window.scrollY
        : Infinity;
      const footerTop = footerEl.getBoundingClientRect().top + window.scrollY;

      if (scrollPos >= footerTop) {
        navbar.classList.add("on-dark");
        navbar.classList.remove("on-light");
      } else if (scrollPos >= doubleMarqueeTop) {
        navbar.classList.add("on-light");
        navbar.classList.remove("on-dark");
      } else if (scrollPos >= serviceCardsTop) {
        navbar.classList.add("on-light");
        navbar.classList.remove("on-dark");
      } else if (scrollPos >= showreelTop) {
        navbar.classList.add("on-dark");
        navbar.classList.remove("on-light");
      } else if (scrollPos >= contentTop) {
        navbar.classList.add("on-light");
        navbar.classList.remove("on-dark");
      } else {
        navbar.classList.add("on-light");
        navbar.classList.remove("on-dark");
      }
    };

    window.addEventListener("scroll", updateNavbarColor);
    updateNavbarColor();

    // Wiggle on logo
    const cleanups = [];
    const logoMain = document.querySelector(".logo-main");
    if (logoMain) cleanups.push(initWiggle(logoMain, WIGGLE_CONFIG.logoMain || 2));

    return () => {
      window.removeEventListener("scroll", updateNavbarColor);
      cleanups.forEach((fn) => fn && fn());
    };
  }, []);

  return (
    <>
      <div className="nav-overlay"></div>
      <nav className="navbar">
        <div
          className="nav-left"
          style={{
            cursor:
              "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer",
          }}
        >
          <div className="nav-main-links desktop-only">
            <Link href="/collection">Collection</Link>
            <Link href="/our-story">Our Story</Link>
            <Link href="/fabric">Fabric</Link>
            <Link href="/about">About</Link>
          </div>
        </div>

        <div className="nav-center">
          <Link
            href="/"
            className="logo-main"
            style={{
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: "currentColor",
              textDecoration: "none",
              cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer",
            }}
          >
            सम् CLOTHICO
          </Link>
        </div>

        <div
          className="nav-right"
          style={{
            cursor:
              "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* User Account / Sign In */}
          <button
            onClick={() => (currentUser ? null : setIsAuthModalOpen(true))}
            style={{
              background: "none",
              border: "1px solid currentColor",
              borderRadius: "99px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: 600,
              color: "currentColor",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              transition: "opacity 0.2s",
            }}
          >
            <FiUser size={14} />
            <span>{currentUser ? currentUser.name.split(" ")[0] : "Sign In"}</span>
          </button>

          {/* Big Bag / Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              background: "#111111",
              border: "1px solid #111111",
              borderRadius: "999px",
              cursor: "pointer",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              fontWeight: 700,
              padding: "10px 22px",
              transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            aria-label={`Shopping bag containing ${cartTotalItems} items`}
          >
            <FiShoppingBag size={20} />
            <span style={{ letterSpacing: "0.5px" }}>Bag</span>
            <span
              style={{
                background: "#f35c27",
                color: "#ffffff",
                fontSize: "12px",
                padding: "3px 8px",
                borderRadius: "999px",
                fontWeight: 800,
                minWidth: "20px",
                textAlign: "center",
                lineHeight: 1,
              }}
            >
              {cartTotalItems}
            </span>
          </button>

          {/* Mobile Hamburger */}
          <div className="mobile-only nav-hamburger">
            <button 
              className={`nav-hamburger-btn ${isMobileMenuOpen ? "is-active" : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`nav-mobile-menu ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="nav-mobile-menu-inner">
          <Link href="/collection" onClick={() => setIsMobileMenuOpen(false)}>Collection</Link>
          <Link href="/our-story" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
          <Link href="/fabric" onClick={() => setIsMobileMenuOpen(false)}>Fabric</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
        </div>
      </div>
    </>
  );
}
