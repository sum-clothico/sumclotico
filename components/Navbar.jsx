"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { WIGGLE_CONFIG } from "@/lib/data";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { FiShoppingBag, FiUser, FiSearch, FiMessageSquare, FiX, FiTruck, FiRefreshCw, FiLogOut } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useUser, useClerk } from "@clerk/nextjs";
import { trackEvent } from "@/lib/analytics";
import WhatsAppQRModal from "@/components/WhatsAppQRModal";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWhatsAppQROpen, setIsWhatsAppQROpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const profileRef = useRef(null);
  const { cartTotalItems, setIsCartOpen, currentUser, logoutCustomer, setIsAuthModalOpen, setIsSearchOpen, coupons = [] } = useStore();

  let userState = null;
  let isClerkSignedIn = false;
  let clerkSignOut = null;
  try {
    const clerkUser = useUser();
    userState = clerkUser?.user;
    isClerkSignedIn = !!clerkUser?.isSignedIn;
    const clerk = useClerk();
    clerkSignOut = clerk?.signOut;
  } catch {
    // Graceful fallback if Clerk keys are not yet configured on localhost
  }

  const handleSignOut = async () => {
    setIsProfileDropdownOpen(false);
    try {
      if (clerkSignOut) {
        await clerkSignOut();
      }
    } catch (e) {
      console.error("Clerk sign out error:", e);
    }
    if (logoutCustomer) {
      logoutCustomer();
    }
    trackEvent("user_sign_out", { timestamp: Date.now() });
  };

  // Close profile dropdown on scroll or clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileDropdownOpen]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("sum_banner_dismissed")) {
        setIsBannerDismissed(true);
      }
    } catch {}

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Wiggle on logo
    const cleanups = [];
    const logoMain = document.querySelector(".logo-main");
    if (logoMain) cleanups.push(initWiggle(logoMain, WIGGLE_CONFIG.logoMain || 2));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cleanups.forEach((fn) => fn && fn());
    };
  }, []);

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_click", { source: "top_announcement_bar" });
  };

  const handleDismissBanner = () => {
    setIsBannerDismissed(true);
    try {
      sessionStorage.setItem("sum_banner_dismissed", "1");
    } catch {}
  };

  // Find active banner coupon configured from admin panel
  const activeBannerCoupon = coupons.find((c) => c.showInBanner && c.isActive);
  const defaultBannerCopy = "FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹1,999 • CODE: KHADI10";
  const bannerMessage = activeBannerCoupon
    ? (activeBannerCoupon.bannerText || `${activeBannerCoupon.title.toUpperCase()} • CODE: ${activeBannerCoupon.code}`)
    : defaultBannerCopy;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        transition: "all 0.3s ease",
      }}
    >
      {/* ─── Top Announcement Ribbon with Dynamic Coupon & WhatsApp Push CTA ─── */}
      {!isBannerDismissed && (
        <div
          style={{
            background: "#0a0a0a",
            color: "#ffffff",
            padding: "6px 24px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {/* Left: WhatsApp Direct Push Button with QR Modal Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleWhatsAppClick();
              setIsWhatsAppQROpen(true);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#25D366",
              color: "#000000",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 800,
              textDecoration: "none",
              letterSpacing: "0.3px",
              border: "1px solid #1ebc59",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            <FaWhatsapp size={13} color="#000000" />
            <span>Chat on WhatsApp (Scan QR)</span>
          </button>

          {/* Center: Dynamic Admin Coupon Announcement */}
          <div style={{ textAlign: "center", flex: 1, minWidth: "240px", fontSize: "11px", letterSpacing: "0.5px" }}>
            <span>
              {activeBannerCoupon ? (
                <>
                  {activeBannerCoupon.bannerText || (
                    <>
                      {activeBannerCoupon.title.toUpperCase()} • CODE:{" "}
                      <strong style={{ color: "#f35c27" }}>{activeBannerCoupon.code}</strong>
                    </>
                  )}
                </>
              ) : (
                <span>FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹1,999 • CODE: <strong style={{ color: "#f35c27" }}>KHADI10</strong></span>
              )}
            </span>
          </div>

          {/* Right: Close / Cross Button to Dismiss Banner */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleDismissBanner}
              style={{
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3px",
                borderRadius: "4px",
                transition: "color 0.2s",
              }}
              title="Close announcement banner"
              aria-label="Close announcement banner"
            >
              <FiX size={15} color="#d1d5db" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Main Navbar Navigation ─── */}
      <nav
        className={`navbar ${isScrolled ? "on-light" : "on-light"}`}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isScrolled ? "12px 40px" : "18px 40px",
          background: isScrolled ? "rgba(255, 255, 255, 0.96)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: isScrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
          boxShadow: isScrolled ? "0 4px 20px rgba(0,0,0,0.04)" : "none",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="nav-left">
          <div className="nav-main-links desktop-only" style={{ display: "flex", gap: "24px" }}>
            <Link href="/collection" style={{ textDecoration: "none", color: "#111", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Collection</Link>
            <Link href="/our-story" style={{ textDecoration: "none", color: "#111", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Our Story</Link>
            <Link href="/fabric" style={{ textDecoration: "none", color: "#111", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Fabric</Link>
            <Link href="/about" style={{ textDecoration: "none", color: "#111", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>About</Link>
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
              color: "#111111",
              textDecoration: "none",
            }}
          >
            सम् CLOTHICO
          </Link>
        </div>

        <div
          className="nav-right"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "relative",
          }}
        >
          {/* Instant Predictive Search Trigger */}
          <button
            onClick={() => {
              trackEvent("open_search_modal", { source: "navbar_search_button" });
              setIsSearchOpen(true);
            }}
            style={{
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "50%",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#111111",
              cursor: "pointer",
              transition: "transform 0.2s, background 0.2s",
            }}
            aria-label="Search collection"
            title="Search products"
          >
            <FiSearch size={16} />
          </button>

          {/* WhatsApp QR Modal Trigger */}
          <button
            onClick={() => {
              handleWhatsAppClick();
              setIsWhatsAppQROpen(true);
            }}
            style={{
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: "50%",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.2s, background 0.2s",
            }}
            aria-label="Chat with Stylist on WhatsApp (Scan QR)"
            title="Chat with Stylist (Scan QR / WhatsApp)"
          >
            <FaWhatsapp size={18} color="#16a34a" />
          </button>

          {/* Customer Profile & Account Popover Trigger */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              style={{
                background: "none",
                border: "1px solid #111111",
                borderRadius: "99px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#111111",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.2s",
              }}
            >
              <FiUser size={14} />
              <span>{userState ? userState.firstName || "Account" : currentUser ? currentUser.name.split(" ")[0] : "Account"}</span>
            </button>

            {/* Profile Dropdown Popover */}
            {isProfileDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  background: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
                  border: "1px solid #e5e7eb",
                  width: "280px",
                  padding: "16px",
                  zIndex: 10002,
                  animation: "fadeIn 0.2s ease",
                }}
              >
                <div style={{ paddingBottom: "12px", borderBottom: "1px solid #f3f4f6", marginBottom: "10px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>
                    {userState ? (userState.fullName || userState.firstName || "Member") : currentUser ? currentUser.name : "Welcome Shopper"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                    {userState?.primaryEmailAddress?.emailAddress || currentUser?.email || "Sustainable Khadi Lifestyle"}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <Link
                    href="/track-order"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      color: "#1f2937",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: "#f9fafb",
                    }}
                  >
                    <FiTruck size={16} color="#f35c27" />
                    <span>Track Order & Delivery</span>
                  </Link>

                  <Link
                    href="/policies/returns"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      color: "#1f2937",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: "#f9fafb",
                    }}
                  >
                    <FiRefreshCw size={15} color="#059669" />
                    <span>Return, Exchange & Help</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsWhatsAppQROpen(true);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      color: "#1f2937",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: "#f0fdf4",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <FaWhatsapp size={16} color="#16a34a" />
                    <span>Chat with Stylist (WhatsApp)</span>
                  </button>

                  {(isClerkSignedIn || currentUser) ? (
                    <div style={{ paddingTop: "10px", borderTop: "1px solid #f3f4f6", marginTop: "6px" }}>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          color: "#dc2626",
                          background: "#fef2f2",
                          border: "1px solid #fee2e2",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <FiLogOut size={15} color="#dc2626" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #f3f4f6" }}>
                      <Link
                        href="/sign-in"
                        onClick={() => {
                          trackEvent("click_sign_in", { source: "navbar_profile_menu" });
                          setIsProfileDropdownOpen(false);
                        }}
                        style={{
                          flex: 1,
                          padding: "8px",
                          textAlign: "center",
                          background: "#111111",
                          color: "#ffffff",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => {
                          trackEvent("click_sign_up", { source: "navbar_profile_menu" });
                          setIsProfileDropdownOpen(false);
                        }}
                        style={{
                          flex: 1,
                          padding: "8px",
                          textAlign: "center",
                          background: "#f3f4f6",
                          color: "#111111",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Luxury 520px Bag Drawer Trigger */}
          <button
            onClick={() => {
              trackEvent("open_cart_drawer", { source: "navbar_bag_btn", total_items: cartTotalItems });
              setIsCartOpen(true);
            }}
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
            <FiShoppingBag size={18} />
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
          <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)}>Track Order</Link>
          <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQs</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
          <button
            type="button"
            onClick={() => {
              handleWhatsAppClick();
              setIsWhatsAppQROpen(true);
              setIsMobileMenuOpen(false);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#25d366",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              textAlign: "left",
              padding: "10px 0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FiMessageSquare size={16} />
            <span>Chat on WhatsApp (Scan QR)</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Scan-to-Chat QR Modal */}
      <WhatsAppQRModal isOpen={isWhatsAppQROpen} onClose={() => setIsWhatsAppQROpen(false)} />
    </header>
  );
}

