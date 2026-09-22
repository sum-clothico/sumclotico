"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiX, FiTag, FiCheck, FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

export default function WelcomePromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // 3 Days in milliseconds: 3 * 24 * 60 * 60 * 1000 = 259,200,000 ms
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    try {
      const isPermanentlyDismissed = localStorage.getItem("sum_welcome_dismissed_at") === "permanent";
      if (isPermanentlyDismissed) return;

      // Show after 3.5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        trackEvent("view_welcome_popup", { trigger: "timer_3.5s" });
      }, 3500);
      return () => clearTimeout(timer);
    } catch {}
  }, []);

  // Temporary hide (on clicking backdrop, cross X, explore link, etc.) - will show again on refresh
  const handleTemporaryClose = () => {
    setIsOpen(false);
  };

  // Permanent dismissal - ONLY on clicking "Don't show this again" button
  const handlePermanentDismiss = () => {
    setIsOpen(false);
    try {
      localStorage.setItem("sum_welcome_dismissed_at", "permanent");
    } catch {}
    trackEvent("dismiss_welcome_popup_permanent");
  };

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText("KHADI10");
      setCopied(true);
      trackEvent("welcome_coupon_copied", { code: "KHADI10" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={handleTemporaryClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          maxWidth: "520px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
          color: "#111827",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleTemporaryClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          aria-label="Close welcome popup"
        >
          <FiX size={18} color="#111" />
        </button>

        {/* Top Banner Graphic */}
        <div
          style={{
            height: "140px",
            background: "linear-gradient(135deg, #111111 0%, #2a2a2a 100%)",
            padding: "24px 32px",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "#f35c27", marginBottom: "4px" }}>
            Handloom Heritage Offer
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
            Welcome to Sum Clothico
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#d1d5db" }}>
            Slowly made. Easy to wear. Hard to replace.
          </p>
        </div>

        {/* Body Content */}
        <div style={{ padding: "32px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "14px", color: "#4b5563", marginBottom: "12px" }}>
              Enjoy an exclusive <strong>10% Discount</strong> on your first order of handcrafted Khadi garments.
            </div>

            {/* Promo Code Box */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                background: "#fef3c7",
                border: "2px dashed #f59e0b",
                borderRadius: "10px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
              onClick={handleCopyCode}
              title="Click to copy promo code"
            >
              <FiTag color="#b45309" size={18} />
              <span style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "1px", color: "#92400e" }}>
                KHADI10
              </span>
              <button
                type="button"
                style={{
                  background: copied ? "#059669" : "#111111",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {copied ? <><FiCheck size={12} /> Copied</> : "Copy"}
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              href="/collection"
              onClick={handleTemporaryClose}
              style={{
                background: "#111111",
                color: "#ffffff",
                padding: "14px",
                borderRadius: "10px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>Explore The Collection</span>
              <FiArrowRight size={16} />
            </Link>

            <a
              href="https://wa.me/919876543210?text=Hi%20Sum%20Clothico%2C%20I%20saw%20your%20welcome%20offer%20and%20would%20like%20to%20chat%20with%20a%20stylist."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("whatsapp_click", { source: "welcome_popup" });
                handleTemporaryClose();
              }}
              style={{
                background: "#25D366",
                color: "#000000",
                padding: "13px 18px",
                borderRadius: "10px",
                textAlign: "center",
                fontWeight: 800,
                fontSize: "14px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                border: "1px solid #1ebc59",
                boxShadow: "0 4px 14px rgba(37, 211, 102, 0.3)",
              }}
            >
              <FaWhatsapp size={19} color="#000000" />
              <span>Chat with Stylist on WhatsApp</span>
            </a>
          </div>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              onClick={handlePermanentDismiss}
              style={{ background: "none", border: "none", color: "#9ca3af", fontSize: "11px", cursor: "pointer", textDecoration: "underline" }}
            >
              Don't show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
