"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

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

export default function SizeGuidePage() {
  const [unit, setUnit] = useState("inches");
  const data = unit === "inches" ? MEASUREMENTS_INCHES : MEASUREMENTS_CM;

  return (
    <>
      <Navbar />
      <div style={{ background: "#fbfbfc", minHeight: "100vh", padding: "140px 24px 80px", color: "#111827" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#f35c27" }}>
              Fit & Dimensions
            </span>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: "8px 0 12px", letterSpacing: "-0.5px" }}>
              Garment Size & Measurement Guide
            </h1>
            <p style={{ color: "#6b7280", fontSize: 16, margin: 0 }}>
              Find your ideal silhouette for our handcrafted, breathable khadi tops and dresses.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: "36px", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            {/* Unit Switcher */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#6b7280" }}>
                Standard Sizing Chart
              </span>
              <div style={{ display: "inline-flex", background: "#f3f4f6", borderRadius: 999, padding: 4 }}>
                <button
                  onClick={() => setUnit("inches")}
                  style={{
                    border: "none",
                    padding: "6px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    background: unit === "inches" ? "#111111" : "transparent",
                    color: unit === "inches" ? "#ffffff" : "#4b5563",
                  }}
                >
                  Inches
                </button>
                <button
                  onClick={() => setUnit("cm")}
                  style={{
                    border: "none",
                    padding: "6px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    background: unit === "cm" ? "#111111" : "transparent",
                    color: unit === "cm" ? "#ffffff" : "#4b5563",
                  }}
                >
                  Centimeters
                </button>
              </div>
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 15, marginBottom: 32 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Size</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Chest / Bust</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Waist</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Hips</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Length</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.size} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 800 }}>{row.size}</td>
                    <td style={{ padding: "12px 16px", color: "#4b5563" }}>{row.chest}</td>
                    <td style={{ padding: "12px 16px", color: "#4b5563" }}>{row.waist}</td>
                    <td style={{ padding: "12px 16px", color: "#4b5563" }}>{row.hip}</td>
                    <td style={{ padding: "12px 16px", color: "#4b5563" }}>{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tips Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#f9fafb", padding: "20px", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, textTransform: "uppercase" }}>How to Measure</h4>
                <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>
                  Hold the tape measure straight and parallel to the floor. Measure over standard undergarments without pulling tight.
                </p>
              </div>
              <div style={{ background: "#f9fafb", padding: "20px", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, textTransform: "uppercase" }}>The Relaxed Fit Advantage</h4>
                <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>
                  Our designs celebrate ease and natural flow. There is an intentional 1.5-inch ease built into every size.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 32, textAlign: "center" }}>
              <Link
                href="/collection"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  background: "#111111",
                  color: "#ffffff",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Explore Handcrafted Collection →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
