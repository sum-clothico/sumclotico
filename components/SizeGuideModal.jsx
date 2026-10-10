"use client";

import React, { useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { FiX } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";

export default function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();

  useEffect(() => {
    if (isSizeGuideOpen) {
      trackEvent("view_size_guide_modal");
    }
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

        {/* Content Body with the Size Guide Image */}
        <div
          style={{
            padding: "16px",
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#FAF6F0",
          }}
        >
          <img
            src="/assets/homepage/b17b9cad-37de-4103-a916-71feb95c14e7.jpg"
            alt="Garment Size & Measurement Guide"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "75vh",
              objectFit: "contain",
              borderRadius: 12,
              display: "block",
              boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
