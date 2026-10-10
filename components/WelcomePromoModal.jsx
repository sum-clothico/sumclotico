"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiX, FiTag, FiCheck, FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useStore } from "@/context/StoreContext";
import { trackEvent } from "@/lib/analytics";
import IndianArchBadge from "@/components/IndianArchBadge";

export default function WelcomePromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { coupons = [] } = useStore();

  // Find active promo coupon dynamically from admin / store context
  const activePromo =
    coupons.find((c) => c.isActive && c.showInBanner) ||
    coupons.find((c) => c.isActive) || {
      code: "KHADI10",
      value: 10,
      type: "percentage",
      title: "Handloom Heritage Offer",
      description: "10% off on all authentic handspun khadi garments.",
    };

  useEffect(() => {
    try {
      const isPermanentlyDismissed =
        localStorage.getItem("sum_welcome_dismissed_at") === "permanent";
      if (isPermanentlyDismissed) return;

      // Show after 30 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        trackEvent("view_welcome_popup", {
          trigger: "timer_30s",
          coupon: activePromo.code,
        });
      }, 30000);
      return () => clearTimeout(timer);
    } catch {}
  }, [activePromo.code]);

  const handleTemporaryClose = () => {
    setIsOpen(false);
  };

  const handlePermanentDismiss = () => {
    setIsOpen(false);
    try {
      localStorage.setItem("sum_welcome_dismissed_at", "permanent");
    } catch {}
    trackEvent("dismiss_welcome_popup_permanent", { coupon: activePromo.code });
  };

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(activePromo.code);
      setCopied(true);
      trackEvent("welcome_coupon_copied", { code: activePromo.code });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
    }
  };

  if (!isOpen) return null;

  const discountText =
    activePromo.type === "percentage"
      ? `${activePromo.value}% Discount`
      : `₹${activePromo.value} Off`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(26, 20, 14, 0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "osModalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={handleTemporaryClose}
    >
      <style>{`
        @keyframes osModalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#EDE8DC",
          borderRadius: "20px",
          boxShadow: "0 28px 70px -15px rgba(26, 20, 14, 0.45)",
          color: "#1a140e",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ASTAKA Scalloped Contour SVG Background */}
        <svg
          viewBox="0 0 500 580"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
          aria-hidden="true"
        >
          <path
            d="M 36,0 L 464,0 L 464,6 A 30 30 0 0 0 494 36 L 500 36 L 500 544 L 494 544 A 30 30 0 0 0 464 574 L 464 580 L 36 580 L 36 574 A 30 30 0 0 0 6 544 L 0 544 L 0 36 L 6 36 A 30 30 0 0 0 36 6 L 36 0 Z"
            fill="#EDE8DC"
            stroke="rgba(44, 32, 22, 0.22)"
            strokeWidth="1.5"
          />
          {/* Inner hairline maroon border */}
          <path
            d="M 42,12 L 458,12 L 458,18 A 24 24 0 0 0 482 42 L 488 42 L 488 538 L 482 538 A 24 24 0 0 0 458 562 L 458 568 L 42 568 L 42 562 A 24 24 0 0 0 18 538 L 12 538 L 12 42 L 18 42 A 24 24 0 0 0 42 18 L 42 12 Z"
            fill="none"
            stroke="#660608"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
        </svg>

        {/* Close Button */}
        <button
          onClick={handleTemporaryClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "rgba(255, 255, 255, 0.65)",
            border: "1px solid rgba(44, 32, 22, 0.18)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.2s ease",
            color: "#1a140e",
          }}
          aria-label="Close welcome offer modal"
        >
          <FiX size={18} />
        </button>

        {/* Modal Inner Content */}
        <div style={{ position: "relative", zIndex: 1, padding: "44px 34px 34px", textAlign: "center" }}>
          {/* Top Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <IndianArchBadge>
              Handloom Heritage Offer
            </IndianArchBadge>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "serif",
              fontSize: "clamp(1.75rem, 4vw, 2.2rem)",
              fontWeight: 600,
              color: "#1a140e",
              lineHeight: 1.2,
              margin: "0 0 8px",
            }}
          >
            Welcome to Sum Clothico
          </h2>

          <p
            style={{
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: "1.05rem",
              color: "#660608",
              margin: "0 0 20px",
            }}
          >
            Slowly made. Easy to wear. Hard to replace.
          </p>

          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.65,
              color: "#4a3c30",
              maxWidth: 380,
              margin: "0 auto 24px",
            }}
          >
            Enjoy an exclusive <strong style={{ color: "#1a140e" }}>{discountText}</strong> on your order of handcrafted Indian Khadi garments.
          </p>

          {/* Luxury Promo Code Box (Dynamic from Admin) */}
          <div
            onClick={handleCopyCode}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(255, 255, 255, 0.75)",
              border: "1.5px dashed #660608",
              borderRadius: "12px",
              padding: "12px 22px",
              cursor: "pointer",
              marginBottom: "24px",
              boxShadow: "0 4px 14px rgba(102, 6, 8, 0.08)",
              transition: "transform 0.2s ease",
            }}
            title="Click to copy coupon code"
          >
            <FiTag color="#660608" size={18} />
            <span
              style={{
                fontFamily: "serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#1a140e",
              }}
            >
              {activePromo.code}
            </span>
            <button
              type="button"
              style={{
                background: copied ? "#15803d" : "#660608",
                color: "#EDE8DC",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "background 0.2s ease",
              }}
            >
              {copied ? (
                <>
                  <FiCheck size={14} /> Copied
                </>
              ) : (
                "Copy"
              )}
            </button>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              href="/shop"
              onClick={handleTemporaryClose}
              style={{
                background: "#1a140e",
                color: "#EDE8DC",
                padding: "14px",
                borderRadius: "99px",
                textAlign: "center",
                fontWeight: 800,
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 16px rgba(26, 20, 14, 0.2)",
                transition: "background 0.2s ease",
              }}
            >
              <span>Explore The Collection</span>
              <FiArrowRight size={15} />
            </Link>

            <a
              href="https://wa.me/919329587707?text=Hi%20Sum%20Clothico%2C%20I%20saw%20your%20welcome%20offer%20and%20would%20like%20to%20chat%20with%20a%20stylist."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("whatsapp_click", { source: "welcome_popup" });
                handleTemporaryClose();
              }}
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                color: "#1b5e20",
                padding: "12px 18px",
                borderRadius: "99px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: "1.5px solid rgba(27, 94, 32, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              <FaWhatsapp size={18} color="#1b5e20" />
              <span>Chat with Stylist on WhatsApp</span>
            </a>
          </div>

          {/* Dismiss Permanently */}
          <div style={{ marginTop: "18px" }}>
            <button
              onClick={handlePermanentDismiss}
              style={{
                background: "none",
                border: "none",
                color: "#7a6c5f",
                fontSize: "0.78rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Don&apos;t show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
