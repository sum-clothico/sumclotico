"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { FiX } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";

export default function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [isImgLoading, setIsImgLoading] = useState(true);

  useEffect(() => {
    if (isSizeGuideOpen) {
      setIsImgLoading(true);
      document.body.style.overflow = "hidden";
      trackEvent("view_size_guide_modal");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSizeGuideOpen]);

  if (!isSizeGuideOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 10002,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={() => setIsSizeGuideOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#ffffff",
          borderRadius: 18,
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          overflow: "hidden",
          position: "relative",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111827" }}>
              Size Chart Guide
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
              Standard Relaxed Fit tailored for handloom cotton movement.
            </p>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            style={{
              background: "#f3f4f6",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Close size guide"
          >
            <FiX size={18} color="#111827" />
          </button>
        </div>

        {/* Content Body with the Size Guide Image & Skeleton Loader */}
        <div
          style={{
            padding: "16px",
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#FAF6F0",
            minHeight: "440px",
            position: "relative",
          }}
        >
          {isImgLoading && (
            <div
              className="sum-skeleton-shimmer"
              style={{
                position: "absolute",
                inset: 16,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  border: "3px solid rgba(102, 6, 8, 0.2)",
                  borderTopColor: "#660608",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#660608",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Loading Size Guide...
              </span>
            </div>
          )}
          <img
            src="/assets/homepage/Sum Clothico Size & Fit Guide-7.png"
            alt="Garment Size & Measurement Guide"
            onLoad={() => setIsImgLoading(false)}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "75vh",
              objectFit: "contain",
              borderRadius: 12,
              display: "block",
              boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
              opacity: isImgLoading ? 0 : 1,
              transition: "opacity 0.3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
