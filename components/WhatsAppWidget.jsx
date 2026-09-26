"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiMessageSquare, FiX } from "react-icons/fi";
import { trackEvent, trackLead } from "@/lib/analytics";

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Show widget after 4 seconds of page engagement
  useEffect(() => {
    // Do not show on admin routes
    if (pathname.startsWith("/admin")) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
        // Show tooltip for 6 seconds on initial appearance
        setIsTooltipOpen(true);
        trackEvent("view_whatsapp_widget", { page: pathname });
        const tooltipTimer = setTimeout(() => setIsTooltipOpen(false), 7000);
        return () => clearTimeout(tooltipTimer);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [pathname, isDismissed]);

  const handleChatClick = () => {
    trackLead("whatsapp", { source: "floating_stylist_widget", page: pathname });
    trackEvent("whatsapp_click", { source: "floating_stylist_widget", page: pathname });
  };

  if (!isVisible || pathname.startsWith("/admin")) return null;

  const whatsappUrl =
    "https://wa.me/919329587707?text=" +
    encodeURIComponent(
      "Hello Sum Clothico! I need assistance with sizing and fabric details.",
    );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 998,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
      }}
    >
      {/* Gentle Floating Tooltip */}
      {isTooltipOpen && (
        <div
          style={{
            background: "#ffffff",
            color: "#111827",
            padding: "12px 16px",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            border: "1px solid #e5e7eb",
            fontSize: 13,
            maxWidth: 240,
            lineHeight: 1.4,
            position: "relative",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 2 }}>
            Need Sizing or Styling Help?
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Chat directly with our Khadi textile stylists.
          </div>
          <button
            onClick={() => setIsTooltipOpen(false)}
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              background: "none",
              border: "none",
              color: "#9ca3af",
              cursor: "pointer",
              padding: 2,
            }}
          >
            <FiX size={12} />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleChatClick}
          style={{
            background: "#128C7E",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 6px 24px rgba(18, 140, 126, 0.35)",
            transition: "transform 0.2s, background 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="Chat on WhatsApp"
        >
          <FiMessageSquare size={16} />
          <span>Stylist Chat</span>
        </a>
      </div>
    </div>
  );
}
