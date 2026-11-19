"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { FiX } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";

export default function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isSizeGuideOpen) {
      setIsImgLoading(true);
      setHasError(false);
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

  const sizeChartData = [
    { size: "XS", bust: '32-34"', waist: '26-28"', hip: '34-36"', length: '25-27"' },
    { size: "S", bust: '34-36"', waist: '28-30"', hip: '36-38"', length: '26-28"' },
    { size: "M", bust: '36-38"', waist: '30-32"', hip: '38-40"', length: '27-29"' },
    { size: "L", bust: '38-40"', waist: '32-34"', hip: '40-42"', length: '28-30"' },
    { size: "XL", bust: '40-42"', waist: '34-36"', hip: '42-44"', length: '29-31"' },
  ];

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

        {/* Content Body with the Size Guide Image & Fallback Measurement Table */}
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
          {isImgLoading && !hasError && (
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

          {!hasError && (
            <img
              src="/assets/homepage/sum-clothico-size-fit-guide.png"
              alt="Garment Size & Measurement Guide"
              onLoad={() => setIsImgLoading(false)}
              onError={() => {
                setIsImgLoading(false);
                setHasError(true);
              }}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "65vh",
                objectFit: "contain",
                borderRadius: 12,
                display: "block",
                boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
                opacity: isImgLoading ? 0 : 1,
                transition: "opacity 0.3s ease",
              }}
            />
          )}

          {/* Clean Measurement Table */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: "14px 16px",
              border: "1px solid #ebd9cc",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: "#660608", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              Standard Body Dimensions (Inches)
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "center" }}>
                <thead>
                  <tr style={{ background: "#f8f3ed", color: "#4A3E36", fontWeight: 700 }}>
                    <th style={{ padding: "8px 10px", borderBottom: "2px solid #ebd9cc", textAlign: "left" }}>Size</th>
                    <th style={{ padding: "8px 10px", borderBottom: "2px solid #ebd9cc" }}>Bust</th>
                    <th style={{ padding: "8px 10px", borderBottom: "2px solid #ebd9cc" }}>Waist</th>
                    <th style={{ padding: "8px 10px", borderBottom: "2px solid #ebd9cc" }}>Hips</th>
                    <th style={{ padding: "8px 10px", borderBottom: "2px solid #ebd9cc" }}>Length</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChartData.map((row, idx) => (
                    <tr key={row.size} style={{ borderBottom: idx === sizeChartData.length - 1 ? "none" : "1px solid #f0e6dc" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 800, color: "#111827", textAlign: "left" }}>{row.size}</td>
                      <td style={{ padding: "8px 10px", color: "#555" }}>{row.bust}</td>
                      <td style={{ padding: "8px 10px", color: "#555" }}>{row.waist}</td>
                      <td style={{ padding: "8px 10px", color: "#555" }}>{row.hip}</td>
                      <td style={{ padding: "8px 10px", color: "#555" }}>{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 11, color: "#8a7a6c", marginTop: 8, fontStyle: "italic", textAlign: "center" }}>
              ✦ Need custom measurements? Choose &quot;Custom Tailoring / Fit Details&quot; on the product page.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
