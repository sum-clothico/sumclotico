"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { FiX, FiCheck } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";

const MEASUREMENTS_INCHES = [
  { size: "XS", chest: '34"', waist: '28"', hip: '36"', length: '26"' },
  { size: "S", chest: '36"', waist: '30"', hip: '38"', length: '27"' },
  { size: "M", chest: '38"', waist: '32"', hip: '40"', length: '28"' },
  { size: "L", chest: '40"', waist: '34"', hip: '42"', length: '29"' },
  { size: "XL", chest: '42"', waist: '36"', hip: '44"', length: '30"' },
  { size: "XXL", chest: '44"', waist: '38"', hip: '46"', length: '31"' },
];

const MEASUREMENTS_CM = [
  { size: "XS", chest: "86 cm", waist: "71 cm", hip: "91 cm", length: "66 cm" },
  { size: "S", chest: "91 cm", waist: "76 cm", hip: "96 cm", length: "68 cm" },
  { size: "M", chest: "96 cm", waist: "81 cm", hip: "101 cm", length: "71 cm" },
  { size: "L", chest: "101 cm", waist: "86 cm", hip: "106 cm", length: "73 cm" },
  { size: "XL", chest: "106 cm", waist: "91 cm", hip: "111 cm", length: "76 cm" },
  { size: "XXL", chest: "111 cm", waist: "96 cm", hip: "116 cm", length: "78 cm" },
];

export default function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState("inches"); // "inches" | "cm"

  useEffect(() => {
    if (isSizeGuideOpen) {
      trackEvent("view_size_guide_modal", { unit });
    }
  }, [isSizeGuideOpen]);

  if (!isSizeGuideOpen) return null;

  const data = unit === "inches" ? MEASUREMENTS_INCHES : MEASUREMENTS_CM;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(5px)",
        zIndex: 10002,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={() => setIsSizeGuideOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          overflow: "hidden",
          position: "relative",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>
              Garment Size & Measurement Guide
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
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

        {/* Content Body */}
        <div style={{ padding: "24px 28px", overflowY: "auto" }}>
          {/* Unit Toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#6b7280" }}>
              Measurement Table
            </span>
            <div
              style={{
                display: "inline-flex",
                background: "#f3f4f6",
                borderRadius: 999,
                padding: 3,
              }}
            >
              <button
                onClick={() => setUnit("inches")}
                style={{
                  border: "none",
                  padding: "4px 14px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  background: unit === "inches" ? "#111111" : "transparent",
                  color: unit === "inches" ? "#ffffff" : "#4b5563",
                  transition: "all 0.15s",
                }}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit("cm")}
                style={{
                  border: "none",
                  padding: "4px 14px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  background: unit === "cm" ? "#111111" : "transparent",
                  color: unit === "cm" ? "#ffffff" : "#4b5563",
                  transition: "all 0.15s",
                }}
              >
                Centimeters (CM)
              </button>
            </div>
          </div>

          {/* Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#111827" }}>Size</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#111827" }}>Chest / Bust</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#111827" }}>Waist</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#111827" }}>Hips</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#111827" }}>Length</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.size} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 800, color: "#111827" }}>{row.size}</td>
                  <td style={{ padding: "10px 14px", color: "#4b5563" }}>{row.chest}</td>
                  <td style={{ padding: "10px 14px", color: "#4b5563" }}>{row.waist}</td>
                  <td style={{ padding: "10px 14px", color: "#4b5563" }}>{row.hip}</td>
                  <td style={{ padding: "10px 14px", color: "#4b5563" }}>{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sizing Tips */}
          <div style={{ background: "#f9fafb", padding: 16, borderRadius: 10, border: "1px solid #e5e7eb" }}>
            <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#111827" }}>
              How to Measure Yourself
            </h4>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>
              <li><strong>Bust/Chest:</strong> Measure around the fullest part of your chest, keeping the tape comfortably horizontal.</li>
              <li><strong>Relaxed Fit:</strong> Our silhouettes are designed with generous ease (1.5-2 inches) for natural drape and breathability.</li>
              <li><strong>Between Sizes?</strong> If you prefer a trimmer silhouette, choose the smaller size; for a flowy relaxed aesthetic, choose your regular size.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
