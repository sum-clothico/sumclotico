"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiInfo, FiCheck, FiArrowRight } from "react-icons/fi";

/**
 * FitDetailsModal
 * Replicates the authentic "Your Fit Details" artisan form from Sum Clothico:
 * Mandatory measurements (Bust, Waist, Hips) + Fit Preference + Length Preference + Notes.
 */
export default function FitDetailsModal({
  isOpen,
  onClose,
  product,
  initialSize = "M",
  initialColor = "",
  initialFitDetails = null,
  mode = "add_to_cart", // "add_to_cart" | "buy_now" | "edit"
  onSaveAndProceed,
}) {
  const [garmentType, setGarmentType] = useState("Dress");
  const [size, setSize] = useState(initialSize || "M");
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [fitPreference, setFitPreference] = useState("Relaxed & comfortable");
  const [lengthPreference, setLengthPreference] = useState("Standard length (as per style)");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Preset garment type and pre-fill details if available
  useEffect(() => {
    if (initialFitDetails) {
      if (initialFitDetails.bust) setBust(initialFitDetails.bust);
      if (initialFitDetails.waist) setWaist(initialFitDetails.waist);
      if (initialFitDetails.hips) setHips(initialFitDetails.hips);
      if (initialFitDetails.fitPreference) setFitPreference(initialFitDetails.fitPreference);
      if (initialFitDetails.lengthPreference) setLengthPreference(initialFitDetails.lengthPreference);
      if (initialFitDetails.notes) setNotes(initialFitDetails.notes);
      if (initialFitDetails.garmentType) setGarmentType(initialFitDetails.garmentType);
      if (initialFitDetails.size) setSize(initialFitDetails.size);
    } else {
      const catOrTitle = ((product?.category || "") + " " + (product?.title || "") + " " + (product?.name || "")).toLowerCase();
      if (catOrTitle.includes("top") || catOrTitle.includes("shirt") || catOrTitle.includes("kurta")) setGarmentType("Top");
      else if (catOrTitle.includes("bottom") || catOrTitle.includes("pant") || catOrTitle.includes("skirt") || catOrTitle.includes("trouser")) setGarmentType("Bottom");
      else if (catOrTitle.includes("co-ord") || catOrTitle.includes("coord") || catOrTitle.includes("set")) setGarmentType("Co-ord / Set");
      else setGarmentType("Dress");
    }
    if (initialSize) {
      setSize(initialSize);
    }
  }, [product, initialSize, initialFitDetails, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!bust.trim() || !waist.trim() || !hips.trim()) {
      setError("Please enter your Bust, Waist, and Hips measurements (in inches).");
      return;
    }

    const fitData = {
      garmentType,
      size,
      bust: bust.trim(),
      waist: waist.trim(),
      hips: hips.trim(),
      fitPreference,
      lengthPreference,
      notes: notes.trim(),
    };

    setError("");
    onSaveAndProceed(fitData);
  };

  const garmentOptions = ["Top", "Bottom", "Dress", "Co-ord / Set"];
  const fitOptions = ["Relaxed & comfortable", "Regular fit", "Closer to the body"];
  const lengthOptions = ["Standard length (as per style)", "Shorter (specify below)", "Longer (specify below)"];
  const availableSizes = product?.sizes && product.sizes.length > 0
    ? product.sizes
    : ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26, 20, 14, 0.65)",
        backdropFilter: "blur(6px)",
        padding: "16px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FAF6F0",
          borderRadius: 20,
          maxWidth: 540,
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          border: "1px solid rgba(212, 175, 55, 0.28)",
          position: "relative",
          padding: "clamp(24px, 4vw, 36px) clamp(20px, 4vw, 32px)",
          color: "#2C2016",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#EDE4D6",
            border: "none",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#4A3E36",
            transition: "all 0.2s ease",
          }}
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#660608",
              marginBottom: 4,
            }}
          >
            SUM CLOTHICO
          </div>
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#8C7868",
              marginBottom: 10,
            }}
          >
            AIRY • EARTHY • FLUID
          </div>
          <h2
            style={{
              fontFamily: "var(--font-epilogue, 'Epilogue', serif)",
              fontSize: "clamp(1.5rem, 2.8vw, 1.85rem)",
              fontWeight: 700,
              color: "#2C2016",
              margin: "0 0 6px",
            }}
          >
            Your Fit Details
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "#665547",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            A few quick details to get your size just right.
          </p>
        </div>

        {/* Info Callout */}
        <div
          style={{
            display: "flex",
            gap: 10,
            background: "#F3ECE2",
            border: "1px solid rgba(136, 26, 28, 0.15)",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: "0.78rem",
            lineHeight: 1.5,
            color: "#4A3C30",
            marginBottom: 20,
            alignItems: "flex-start",
          }}
        >
          <FiInfo size={16} color="#660608" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            Please share your <strong>actual body measurements (in inches)</strong>, not your bra size or garment size.
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* 1. Garment & Size */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#4A3C30" }}>
                Garment & Size*
              </label>
              <span style={{ fontSize: "0.78rem", color: "#660608", fontWeight: 700 }}>
                Size: {size}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {garmentOptions.map((opt) => {
                const isSelected = garmentType === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGarmentType(opt)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 99,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: isSelected ? "1.5px solid #5B6245" : "1px solid rgba(74, 62, 54, 0.2)",
                      background: isSelected ? "#5B6245" : "#FAF6F0",
                      color: isSelected ? "#ffffff" : "#4A3C30",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      transition: "all 0.18s ease",
                    }}
                  >
                    {isSelected && <FiCheck size={12} />}
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Size Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.8rem", color: "#665547", fontWeight: 600 }}>Standard Size:</span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: "1.5px solid rgba(74, 62, 54, 0.25)",
                  background: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#2C2016",
                  cursor: "pointer",
                }}
              >
                {availableSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Measurements (in inches) */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#4A3C30", marginBottom: 8 }}>
              Your Measurements* (in inches)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", color: "#665547", fontWeight: 600, marginBottom: 4 }}>
                  Bust*
                </span>
                <input
                  type="text"
                  placeholder="e.g. 36"
                  value={bust}
                  onChange={(e) => setBust(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1.5px solid rgba(74, 62, 54, 0.25)",
                    background: "#ffffff",
                    fontSize: "0.88rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <div>
                <span style={{ display: "block", fontSize: "0.75rem", color: "#665547", fontWeight: 600, marginBottom: 4 }}>
                  Waist*
                </span>
                <input
                  type="text"
                  placeholder="e.g. 30"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1.5px solid rgba(74, 62, 54, 0.25)",
                    background: "#ffffff",
                    fontSize: "0.88rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <div>
                <span style={{ display: "block", fontSize: "0.75rem", color: "#665547", fontWeight: 600, marginBottom: 4 }}>
                  Hips*
                </span>
                <input
                  type="text"
                  placeholder="e.g. 40"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1.5px solid rgba(74, 62, 54, 0.25)",
                    background: "#ffffff",
                    fontSize: "0.88rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* 3. Fit Preference */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#4A3C30", marginBottom: 8 }}>
              Fit Preference*
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {fitOptions.map((opt) => (
                <label
                  key={opt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.84rem",
                    color: "#3B2E24",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="fitPreference"
                    value={opt}
                    checked={fitPreference === opt}
                    onChange={(e) => setFitPreference(e.target.value)}
                    style={{ accentColor: "#5B6245" }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Length Preference */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#4A3C30", marginBottom: 8 }}>
              Length Preference*
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {lengthOptions.map((opt) => (
                <label
                  key={opt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.84rem",
                    color: "#3B2E24",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="lengthPreference"
                    value={opt}
                    checked={lengthPreference === opt}
                    onChange={(e) => setLengthPreference(e.target.value)}
                    style={{ accentColor: "#5B6245" }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Additional Notes (Optional) */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#4A3C30", marginBottom: 6 }}>
              Additional Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. sleeve length, shoulder fit, or any other preference"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: 8,
                border: "1.5px solid rgba(74, 62, 54, 0.25)",
                background: "#ffffff",
                fontSize: "0.84rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Validation Error */}
          {error && (
            <div style={{ color: "#dc2626", fontSize: "0.78rem", fontWeight: 700, textAlign: "center" }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              marginTop: 6,
              width: "100%",
              padding: "14px 20px",
              borderRadius: 999,
              background: "#595F43",
              color: "#FAF6F0",
              border: "none",
              fontSize: "0.92rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 6px 20px rgba(89, 95, 67, 0.35)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#484D35")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#595F43")}
          >
            <span>
              {mode === "edit"
                ? "Save Fit Details ✓"
                : mode === "buy_now"
                  ? "Save Fit Details & Proceed to Checkout"
                  : "Save Fit Details & Add to Cart"}
            </span>
            <FiArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
