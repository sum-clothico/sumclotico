"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { FiShoppingBag, FiCheck, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { trackViewItem, trackEvent } from "@/lib/analytics";

const COLOR_HEX_MAP = {
  "natural khadi": "#EBE5D8",
  "forest sage": "#556B55",
  "indigo earth": "#2B3D4D",
  "terracotta": "#9D5544",
  "raw cotton": "#F4EFE6",
  "white": "#FAF8F5",
  "black": "#222222",
  "olive": "#556B2F",
  "rust": "#B7410E",
  "sage": "#77815C",
  "beige": "#D4C5B9",
  "navy": "#1B2A4A",
};

const getColorHex = (name) => {
  if (!name) return "#EBE5D8";
  const key = name.toLowerCase().trim();
  return COLOR_HEX_MAP[key] || "#D4C5B9";
};

export default function ProductQuickView() {
  const { quickViewProduct, setQuickViewProduct, addToCart, setIsCartOpen, setIsSizeGuideOpen } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIndex(0);
      const initialSize = quickViewProduct.sizes?.[0] || "M";
      setSelectedSize(initialSize);
      setSelectedColor(quickViewProduct.colors?.[0] || "");
      setQuantity(1);
      setIsAdded(false);
      setIsZoomed(false);
      trackViewItem(quickViewProduct, initialSize);
    }
  }, [quickViewProduct]);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!quickViewProduct) return;
      if (e.key === "Escape") setQuickViewProduct(null);
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!quickViewProduct) return null;

  const images = quickViewProduct.images && quickViewProduct.images.length > 0
    ? quickViewProduct.images
    : ["/assets/img/14.png", "/assets/img/25.png", "/assets/img/20.png"];

  const currentImage = images[activeImageIndex] || images[0];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleAdd = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor || quickViewProduct.colors?.[0] || "", quantity, false);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 600);
  };

  const effectivePrice = (quickViewProduct.sizePrices && quickViewProduct.sizePrices[selectedSize])
    ? Number(quickViewProduct.sizePrices[selectedSize])
    : (quickViewProduct.salePrice || quickViewProduct.price);
  const hasDiscount = quickViewProduct.salePrice && quickViewProduct.salePrice < quickViewProduct.price;
  const discountPercent = hasDiscount
    ? Math.round(((quickViewProduct.price - (quickViewProduct.sizePrices?.[selectedSize] || quickViewProduct.salePrice)) / quickViewProduct.price) * 100)
    : 0;

  return (
    <div className="quickview-overlay" onClick={() => setQuickViewProduct(null)}>
      <div
        className="quickview-card"
        style={{
          maxWidth: 1040,
          width: "94%",
          maxHeight: "92vh",
          gridTemplateColumns: "1fr 1fr",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          className="cart-close-btn"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 30,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            cursor: "pointer",
            transition: "transform 0.2s, background 0.2s",
          }}
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
        >
          <FiX size={20} color="#111827" />
        </button>

        {/* ─── BIG EDITORIAL IMAGE GALLERY ─── */}
        <div
          style={{
            background: "#FAF6F0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "24px 20px",
            position: "relative",
            userSelect: "none",
            maxHeight: "92vh",
            overflowY: "auto",
          }}
        >
          {/* Main Large Showcase Image Stage */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 420,
              aspectRatio: "3 / 4",
              maxHeight: "64vh",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 16,
              background: "#f3ede4",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              cursor: isZoomed ? "zoom-out" : "zoom-in",
            }}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {/* Top Badges */}
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 10,
                display: "flex",
                gap: 8,
              }}
            >
              <span
                style={{
                  background: "rgba(17, 17, 17, 0.85)",
                  backdropFilter: "blur(4px)",
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: 999,
                }}
              >
                100% Khadi
              </span>
              {hasDiscount && (
                <span
                  style={{
                    background: "#f35c27",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "5px 10px",
                    borderRadius: 999,
                  }}
                >
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(4px)",
                color: "#1f2937",
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 999,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              {activeImageIndex + 1} / {images.length}
            </div>

            {/* Showcase Image */}
            <img
              src={currentImage}
              alt={`${quickViewProduct.name} - View ${activeImageIndex + 1}`}
              style={{
                width: "100%",
                height: "100%",
                aspectRatio: "3 / 4",
                objectFit: isZoomed ? "contain" : "cover",
                objectPosition: "top center",
                transform: isZoomed ? "scale(1.3)" : "scale(1)",
                transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
              }}
            />

            {/* Prev / Next Image Overlay Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(4px)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    zIndex: 10,
                    transition: "transform 0.2s, background 0.2s",
                  }}
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={20} color="#111827" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(4px)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    zIndex: 10,
                    transition: "transform 0.2s, background 0.2s",
                  }}
                  aria-label="Next image"
                >
                  <FiChevronRight size={20} color="#111827" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Gallery Strip */}
          {images.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {images.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: 62,
                      height: 82,
                      aspectRatio: "3 / 4",
                      padding: 2,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: `2px solid ${isActive ? "#111111" : "#e5e7eb"}`,
                      opacity: isActive ? 1 : 0.65,
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                      cursor: "pointer",
                      background: "#ffffff",
                      transition: "all 0.2s ease",
                      boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
                    }}
                    aria-label={`View photo angle ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Angle thumbnail ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: "3 / 4",
                        objectFit: "cover",
                        objectPosition: "top center",
                        borderRadius: 6,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── PRODUCT DETAILS COLUMN ─── */}
        <div
          className="quickview-details"
          style={{
            padding: "36px 32px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#ffffff",
          }}
        >
          <div>
            {/* Category & Stock Tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    color: "#6b7280",
                    fontWeight: 700,
                  }}
                >
                  Collection / {quickViewProduct.category || "Tops"}
                </span>
              </div>
              <span
                style={{
                  background: (quickViewProduct.stock || 20) <= 5 ? "#fef2f2" : "#dcfce7",
                  color: (quickViewProduct.stock || 20) <= 5 ? "#dc2626" : "#15803d",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                {(quickViewProduct.stock || 20) <= 5 ? `Only ${quickViewProduct.stock} Left` : `In Stock (${quickViewProduct.stock || 20} units)`}
              </span>
            </div>

            {/* Product Title */}
            <h2
              style={{
                margin: "4px 0 6px",
                fontSize: 28,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              {quickViewProduct.name}
            </h2>

            {/* Poetic Subtitle */}
            {quickViewProduct.subtitle && (
              <p
                style={{
                  margin: "0 0 16px",
                  color: "#4b5563",
                  fontSize: 14,
                  fontStyle: "italic",
                }}
              >
                "{quickViewProduct.subtitle}"
              </p>
            )}

            {/* Price & Savings Row */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-0.5px",
                }}
              >
                ₹{effectivePrice.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <>
                  <span
                    style={{
                      fontSize: 17,
                      color: "#9ca3af",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{quickViewProduct.price.toLocaleString("en-IN")}
                  </span>
                  <span
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    Save ₹{(quickViewProduct.price - quickViewProduct.salePrice).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>

            {/* Story & Description */}
            <p
              style={{
                fontSize: 14,
                color: "#4b5563",
                lineHeight: 1.65,
                margin: "0 0 16px",
              }}
            >
              {quickViewProduct.description}
            </p>

            {/* Fabric & Care Note */}
            <div style={{ background: "#f9fafb", padding: "10px 14px", borderRadius: 8, marginBottom: 20, border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#6b7280", letterSpacing: 0.5 }}>
                Fabric & Care
              </div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>
                {quickViewProduct.fabricCare || "100% Handspun Khadi Cotton. Machine wash gentle in cold water."}
              </div>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#1f2937",
                  }}
                >
                  Select Size
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSizeGuideOpen(true);
                    trackEvent("view_size_guide", { source: "quick_view_modal", product_id: quickViewProduct.id, product_name: quickViewProduct.name });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 12,
                    color: "#f35c27",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Size Chart Guide →
                </button>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {(quickViewProduct.sizes || ["XS", "S", "M", "L", "XL"]).map((size) => {
                  const isSelected = selectedSize === size;
                  const customSizePrice = quickViewProduct.sizePrices?.[size];
                  return (
                    <button
                      key={size}
                      className={`quickview-size-pill ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedSize(size);
                        trackEvent("select_variant", { product_id: quickViewProduct.id, variant_size: size, product_name: quickViewProduct.name });
                      }}
                      style={{
                        minWidth: 52,
                        padding: "8px 14px",
                        fontSize: 13,
                        fontWeight: 700,
                        borderRadius: 8,
                        border: isSelected ? "2px solid #111111" : "1px solid #d1d5db",
                        background: isSelected ? "#111111" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#1f2937",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <span>{size}</span>
                      {customSizePrice && (
                        <span style={{ fontSize: 10, opacity: isSelected ? 0.9 : 0.65, fontWeight: 600 }}>
                          ₹{customSizePrice}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color / Shade Selector */}
            {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 10,
                    color: "#1f2937",
                  }}
                >
                  Color Tone: <strong style={{ color: "#111111" }}>{selectedColor || quickViewProduct.colors[0]}</strong>
                </label>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {quickViewProduct.colors.map((color) => {
                    const isSelected = (selectedColor || quickViewProduct.colors[0]) === color;
                    const bg = getColorHex(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setSelectedColor(color);
                          trackEvent("select_variant_color", { product_id: quickViewProduct.id, color, product_name: quickViewProduct.name });
                        }}
                        title={color}
                        aria-label={`Select color ${color}`}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: bg,
                          border: isSelected ? "2.5px solid #660608" : "1.5px solid rgba(42,31,20,0.25)",
                          boxShadow: isSelected ? "0 0 0 2px #EDE8DC, 0 4px 10px rgba(102,6,8,0.25)" : "0 2px 4px rgba(0,0,0,0.06)",
                          cursor: "pointer",
                          padding: 0,
                          transition: "all 0.2s ease",
                          transform: isSelected ? "scale(1.12)" : "scale(1)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "#1f2937",
                }}
              >
                Quantity:
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  style={{
                    background: "#f9fafb",
                    border: "none",
                    width: 36,
                    height: 36,
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span
                  style={{
                    padding: "0 14px",
                    fontWeight: 700,
                    fontSize: 14,
                    minWidth: 32,
                    textAlign: "center",
                  }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  style={{
                    background: "#f9fafb",
                    border: "none",
                    width: 36,
                    height: 36,
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Row & Value Pillars */}
          <div>
            <button
              className="cart-checkout-btn"
              style={{
                width: "100%",
                margin: "0 0 18px",
                padding: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 10,
                background: isAdded ? "#16a34a" : "#111111",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                transition: "all 0.2s ease",
              }}
              onClick={handleAdd}
            >
              {isAdded ? (
                <>
                  <FiCheck size={20} />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <FiShoppingBag size={20} />
                  <span>Add to Bag — ₹{(effectivePrice * quantity).toLocaleString("en-IN")}</span>
                </>
              )}
            </button>

            <Link
              href={`/product/${quickViewProduct.slug}`}
              onClick={() => setQuickViewProduct(null)}
              style={{
                display: "block",
                textAlign: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#111111",
                textDecoration: "underline",
                marginBottom: 6,
                cursor: "pointer",
              }}
            >
              View Full Product Details &amp; Specifications →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
