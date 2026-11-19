"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { FiX, FiCheckCircle } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";

export default function FabricCareModal() {
  const { isFabricCareOpen, setIsFabricCareOpen } = useStore();
  const [isImgLoading, setIsImgLoading] = useState(true);

  useEffect(() => {
    if (isFabricCareOpen) {
      setIsImgLoading(true);
      document.body.style.overflow = "hidden";
      trackEvent("view_fabric_care_modal");
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFabricCareOpen) {
        setIsFabricCareOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFabricCareOpen, setIsFabricCareOpen]);

  if (!isFabricCareOpen) return null;

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
      onClick={() => setIsFabricCareOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 580,
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
              Fabric & Wash Care Guide
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
              100% Handcrafted Indian Khadi — Crafted with time, cared for with love.
            </p>
          </div>
          <button
            onClick={() => setIsFabricCareOpen(false)}
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
              transition: "background 0.2s ease",
            }}
            aria-label="Close fabric care guide"
          >
            <FiX size={18} color="#111827" />
          </button>
        </div>

        {/* Content Body with Care Poster Image & Essential Highlights */}
        <div
          style={{
            padding: "16px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            background: "#FAF6F0",
            minHeight: "360px",
            position: "relative",
          }}
        >
          {/* Skeleton Loader */}
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
                Loading Fabric Care Guide...
              </span>
            </div>
          )}

          {/* Care Image */}
          <div
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
              background: "#ffffff",
            }}
          >
            <img
              src="/assets/care.jpeg"
              alt="Khadi Fabric Care Instructions & Washing Guide"
              onLoad={() => setIsImgLoading(false)}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "65vh",
                objectFit: "contain",
                display: "block",
                opacity: isImgLoading ? 0 : 1,
                transition: "opacity 0.3s ease",
              }}
            />
          </div>

          {/* Key Quick Tips */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: "14px 18px",
              border: "1px solid #ebd9cc",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#660608",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              ✦ Key Khadi Care Rituals
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6, fontSize: 12, color: "#4A3E36" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle size={14} color="#166534" />
                <span>Wash separately in cold water with mild or organic liquid detergent.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle size={14} color="#166534" />
                <span>Dry inside out in gentle shade — avoid harsh direct sunlight.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle size={14} color="#166534" />
                <span>Iron while slightly damp on warm heat for a crisp handloom drape.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
