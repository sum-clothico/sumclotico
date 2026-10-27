"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useStore } from "@/context/StoreContext";
import { trackEvent } from "@/lib/analytics";
import { 
  FiTruck, 
  FiRefreshCw, 
  FiShield, 
  FiArrowRight, 
  FiCheck, 
  FiExternalLink, 
  FiShoppingBag,
  FiHelpCircle
} from "react-icons/fi";
import IndianArchBadge from "@/components/IndianArchBadge";

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

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const { products = [], addToCart, setIsSizeGuideOpen } = useStore();

  const product = products.find((p) => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || "");
      setSelectedSize(product.sizes?.[0] || "M");
      trackEvent("view_item", {
        currency: "INR",
        value: product.salePrice || product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            price: product.salePrice || product.price,
            item_category: product.category,
          },
        ],
      });
    }
  }, [product?.id]);

  if (!product && products.length > 0) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40, background: "#FAF6F0" }}>
          <h1 style={{ fontFamily: "Epilogue, sans-serif", fontSize: 28, fontWeight: 600, color: "#1a140e" }}>Piece Not Found</h1>
          <p style={{ color: "#6b5d52" }}>The garment you are looking for is currently unavailable or has been archived.</p>
          <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#1a140e", fontWeight: 700, textDecoration: "underline" }}>
            Return to Shop All Pieces <FiArrowRight size={14} />
          </Link>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF6F0" }}>
          <p style={{ color: "#8a7a6c", fontStyle: "italic", fontFamily: "Epilogue, sans-serif", fontSize: "1.2rem" }}>Unfolding piece details...</p>
        </div>
      </>
    );
  }

  const effectivePrice = product.sizePrices?.[selectedSize]
    ? Number(product.sizePrices[selectedSize])
    : (product.salePrice || product.price);

  const activeVariant = product.variants?.find(
    (v) => v.size === selectedSize && (!selectedColor || v.color === selectedColor)
  );
  const stockForVariant = activeVariant ? activeVariant.stock : (product.stock || 20);
  const isOutOfStock = stockForVariant === 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, qty, false);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2400);
    trackEvent("add_to_cart", {
      currency: "INR",
      value: effectivePrice * qty,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: effectivePrice,
          quantity: qty,
          item_variant: selectedSize,
        },
      ],
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, qty, false);
    trackEvent("begin_checkout", {
      currency: "INR",
      value: effectivePrice * qty,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: effectivePrice,
          quantity: qty,
        },
      ],
    });
    router.push("/checkout");
  };

  const images = product.images?.length ? product.images : ["/assets/img/14.png"];

  // Why you'll love it fallback per design guidelines
  const whyYouLoveIt = product.whyYouLoveIt || [
    { title: "EASY FIT", desc: "Room to move without losing its shape." },
    { title: "POCKETS", desc: "Because clothes should actually be useful." },
    { title: "BREATHABLE", desc: "Made in Khadi cotton for an airy, comfortable feel." },
    { title: "VERSATILE", desc: "Dress it up, dress it down, wear it your way." },
  ];

  // Made for you if fallback
  const madeForYouIf = product.madeForYouIf || [
    "You'd rather have a few really good pieces than a wardrobe full of trends.",
    "You want comfort without looking underdressed.",
    "You need clothes that can keep up with an unpredictable day.",
  ];

  // The story behind the piece
  const story = product.story || (
    "We wanted a dress you could put on without having to figure out the rest of your outfit first. Something comfortable enough for a long day and considered enough to make you feel dressed. So we gave it an easy silhouette, useful pockets and room to move. Nothing unnecessary. Just things you'll actually use."
  );

  // How to wear it 3 possibilities
  const howToWear = product.howToWear || [
    { occasion: "EVERYDAY", styling: "With flats + a simple bag." },
    { occasion: "WORKDAY", styling: "With structured accessories + loafers." },
    { occasion: "EVENING", styling: "With jewellery + a layer + your favourite shoes." },
  ];

  return (
    <>
      <Navbar />
      <style>{`
        .pdp-wrapper {
          background-color: #FAF6F0;
          color: #1a140e;
          min-height: 100vh;
          padding: 120px 24px 90px;
        }
        @media (max-width: 768px) {
          .pdp-wrapper {
            padding: 95px 16px 90px;
          }
        }
        .pdp-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .pdp-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: start;
          margin-bottom: 70px;
        }
        .pdp-gallery-col {
          position: sticky;
          top: 110px;
        }
        @media (max-width: 900px) {
          .pdp-hero-grid {
            display: flex;
            flex-direction: column;
            gap: 28px;
            margin-bottom: 40px;
          }
          .pdp-gallery-col {
            position: static !important;
            top: auto !important;
            width: 100%;
          }
        }
        .pdp-thumb {
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .pdp-thumb.active {
          border-color: #1a140e;
        }
        .pdp-size-btn {
          padding: 10px 18px;
          border: 1.5px solid rgba(42, 31, 20, 0.2);
          border-radius: 8px;
          background: #ffffff;
          color: #1a140e;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pdp-size-btn:hover {
          border-color: #1a140e;
        }
        .pdp-size-btn.active {
          background: #1a140e;
          color: #FAF6F0;
          border-color: #1a140e;
        }
        .pdp-size-btn.oos {
          opacity: 0.35;
          cursor: not-allowed;
          text-decoration: line-through;
        }
        .pdp-add-btn {
          width: 100%;
          padding: 16px 24px;
          background: #1a140e;
          color: #FAF6F0;
          border: 1.5px solid #1a140e;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pdp-add-btn:hover {
          background: #2a1f14;
        }
        .pdp-add-btn.added {
          background: #15803d;
          border-color: #15803d;
        }
        .pdp-buy-now-btn {
          width: 100%;
          padding: 16px 24px;
          background: transparent;
          color: #1a140e;
          border: 1.5px solid #1a140e;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pdp-buy-now-btn:hover {
          background: rgba(26, 20, 14, 0.06);
        }
        .pdp-spec-row {
          display: grid;
          grid-template-columns: 120px 1fr;
          align-items: baseline;
          gap: 16px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(44, 32, 22, 0.1);
          font-size: 14px;
          text-align: left;
        }
        .pdp-spec-row > span:first-child {
          text-align: left;
          color: #8A7A6C;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
        }
        .pdp-spec-row > span:last-child {
          text-align: left;
          color: #1a140e;
          font-weight: 600;
          line-height: 1.5;
        }
      `}</style>

      <div className="pdp-wrapper">
        <div className="pdp-container">

          {/* Breadcrumb Navigation */}
          <nav style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#7a6c5f", marginBottom: 32 }}>
            <Link href="/" style={{ color: "#7a6c5f", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/shop" style={{ color: "#7a6c5f", textDecoration: "none" }}>Shop All Pieces</Link>
            <span>/</span>
            <span style={{ color: "#1a140e", fontWeight: 600 }}>{product.name}</span>
          </nav>

          {/* ─── PRODUCT HERO ─── */}
          <div className="pdp-hero-grid">

            {/* LEFT: Gallery Visuals */}
            <div className="pdp-gallery-col">
              <div style={{ borderRadius: 18, overflow: "hidden", background: "#e8dfd0", aspectRatio: "3/4", marginBottom: 16, position: "relative", border: "1px solid rgba(42,31,20,0.08)" }}>
                {isVideoActive && product.videoUrl ? (
                  <video
                    src={product.videoUrl}
                    controls
                    playsInline
                    autoPlay
                    loop
                    style={{ width: "100%", height: "100%", objectFit: "cover", background: "#000" }}
                  />
                ) : (
                  <img src={images[activeImage]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                )}

                {product.videoUrl && !isVideoActive && (
                  <button
                    type="button"
                    onClick={() => setIsVideoActive(true)}
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      background: "rgba(26, 20, 14, 0.85)",
                      color: "#FAF6F0",
                      border: "none",
                      borderRadius: 30,
                      padding: "8px 16px",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <span>▶ Watch Garment Reel</span>
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`pdp-thumb ${!isVideoActive && i === activeImage ? "active" : ""}`}
                    onClick={() => { setIsVideoActive(false); setActiveImage(i); }}
                    style={{ width: 70, height: 92, background: "#f3f4f6", cursor: "pointer", aspectRatio: "3 / 4" }}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                  </div>
                ))}

                {product.videoUrl && (
                  <div
                    className={`pdp-thumb ${isVideoActive ? "active" : ""}`}
                    onClick={() => setIsVideoActive(true)}
                    style={{
                      width: 70,
                      height: 86,
                      background: "#1a140e",
                      color: "#FAF6F0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "center",
                      border: isVideoActive ? "2px solid #b36338" : "2px solid transparent",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>▶</span>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#d89b6c" }}>
                      Motion
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Product Information & Purchase CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
                  Khadi Handwoven Textiles
                </span>
                <h1 style={{ fontFamily: "Epilogue, sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.7rem)", fontWeight: 600, color: "#1a140e", margin: "0 0 6px", lineHeight: 1.15 }}>
                  {product.name.toUpperCase()}
                </h1>
                {product.subtitle && (
                  <p style={{ fontSize: "1.15rem", color: "#5c4033", fontStyle: "italic", margin: "0 0 6px", fontWeight: 500 }}>
                    {product.subtitle}
                  </p>
                )}
                {product.hook && (
                  <p style={{ fontSize: "0.96rem", color: "#7a6c5f", margin: 0, fontWeight: 600 }}>
                    {product.hook}
                  </p>
                )}
              </div>

              {/* Price */}
              <div style={{ borderTop: "1px solid rgba(42,31,20,0.1)", borderBottom: "1px solid rgba(42,31,20,0.1)", padding: "16px 0" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontSize: "1.85rem", fontWeight: 800, color: "#1a140e", fontFamily: "Epilogue, sans-serif" }}>
                    Rs {effectivePrice}
                  </span>
                  <span style={{ fontSize: 13, color: "#7a6c5f" }}>
                    Inclusive of all taxes
                  </span>
                </div>
              </div>

              {/* Editorial Description */}
              <div style={{ fontSize: "1.02rem", lineHeight: 1.8, color: "#3f3329" }}>
                <p style={{ margin: "0 0 12px" }}>
                  {product.description}
                </p>
              </div>

              {/* Color Selection (if multiple colors) — Visual Swatches */}
              {product.colors?.length > 1 && (
                <div>
                  <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b5d52", display: "block", marginBottom: 10 }}>
                    Color: <strong style={{ color: "#1a140e" }}>{selectedColor}</strong>
                  </span>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color;
                      const bg = getColorHex(color);
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
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

              {/* Size Selector */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b5d52" }}>
                    Select Size:
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#b36338",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Size Guide
                  </button>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {(product.sizes || ["XS", "S", "M", "L", "XL"]).map((size) => (
                    <button
                      key={size}
                      className={`pdp-size-btn ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b5d52" }}>
                  Quantity:
                </span>
                <div style={{ display: "flex", alignItems: "center", background: "#ffffff", border: "1.5px solid rgba(42,31,20,0.2)", borderRadius: 8, overflow: "hidden" }}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    style={{ padding: "8px 14px", border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 16 }}
                  >
                    −
                  </button>
                  <span style={{ padding: "8px 16px", fontWeight: 700, minWidth: 32, textAlign: "center", fontSize: 14 }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(stockForVariant || 99, q + 1))}
                    style={{ padding: "8px 14px", border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 16 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ─── FINAL PRODUCT CTAs ─── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                {/* Primary: ADD TO BAG */}
                <button
                  className={`pdp-add-btn ${addedFeedback ? "added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || !selectedSize}
                >
                  <FiShoppingBag size={17} />
                  {isOutOfStock ? "Out of Stock" : addedFeedback ? "Added to Bag ✓" : "ADD TO BAG"}
                </button>

                {/* Secondary: BUY NOW */}
                <button
                  className="pdp-buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || !selectedSize}
                >
                  <span>BUY NOW</span>
                  <FiArrowRight size={16} />
                </button>
              </div>

              {/* Support Links Below CTAs — Clean Inline Styling (No Floating White Box) */}
              <div style={{ padding: "16px 0", borderTop: "1px solid rgba(44, 32, 22, 0.1)", display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#55483d" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FiHelpCircle size={15} color="#b36338" />
                  <span>
                    Need help with your size?{" "}
                    <Link href="/contact" style={{ color: "#1a140e", fontWeight: 800, textDecoration: "underline" }}>
                      CONTACT US
                    </Link>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FiArrowRight size={15} color="#b36338" />
                  <span>
                    Want to know more about the textile?{" "}
                    <Link href="/fabric" style={{ color: "#1a140e", fontWeight: 800, textDecoration: "underline" }}>
                      EXPLORE THE FABRIC
                    </Link>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FiExternalLink size={15} color="#15803d" />
                  <span>
                    WhatsApp Catalog & Order Assistance:{" "}
                    <a
                      href="https://wa.me/c/99605240905904"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#15803d", fontWeight: 800, textDecoration: "underline" }}
                    >
                      VIEW WHATSAPP CATALOG
                    </a>
                  </span>
                </div>
              </div>

              {/* Trust Features - Free Shipping */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", borderTop: "1px solid rgba(42,31,20,0.1)", color: "#5C4A3E", fontSize: 13, fontWeight: 600 }}>
                <FiTruck size={18} color="#b36338" />
                <span>Free express shipping on all orders over ₹1,999 across India</span>
              </div>

            </div>
          </div>

          {/* ─── TRADITIONAL INDIAN BORDER DIVIDER ─── */}
          <div
            style={{
              width: "100%",
              height: "28px",
              backgroundImage: 'url("/assets/footerpattern-accent.png")',
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              backgroundSize: "auto 26px",
              opacity: 0.85,
              margin: "60px 0 50px",
            }}
            aria-hidden="true"
          />

          {/* ─── SEAMLESS EDITORIAL DETAILS (OUR STYLE — NO BOXES) ─── */}
          <section style={{ maxWidth: 900, margin: "0 auto 60px" }}>
            <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 36px" }}>
              <IndianArchBadge style={{ marginBottom: "16px" }}>
                Khadi Handloom Craft
              </IndianArchBadge>
              <h2 style={{ fontFamily: "Epilogue, sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: "#2C2016", margin: "0 0 14px" }}>
                The Details & Specifications
              </h2>
              {product.howItFeels && (
                <p style={{ fontFamily: "Epilogue, sans-serif", fontSize: "1.15rem", fontStyle: "italic", color: "#5C4A3E", margin: 0, lineHeight: 1.6 }}>
                  &ldquo;{product.howItFeels}&rdquo;
                </p>
              )}
            </div>

            {/* 1. Considered Details / Why You'll Love It — Clean Editorial Row (No Card Boxes) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 28, margin: "0 auto 50px" }}>
              {whyYouLoveIt.map((item, idx) => (
                <div key={idx} style={{ textAlign: "left", borderTop: "1.5px solid #660608", paddingTop: 14 }}>
                  <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#660608", letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    0{idx + 1} • {item.title}
                  </span>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#55483D", margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* 2. Clean Specifications Grid Directly on Background (No floating white box) */}
            <div style={{ borderTop: "1px solid rgba(44, 32, 22, 0.14)", padding: "10px 0 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0 48px" }}>
                <div className="pdp-spec-row">
                  <span style={{ fontWeight: 700, color: "#8A7A6C", textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.1em" }}>Textile</span>
                  <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.fabricComposition || "100% Handspun Khadi Cotton"}</span>
                </div>
                <div className="pdp-spec-row">
                  <span style={{ fontWeight: 700, color: "#8A7A6C", textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.1em" }}>Weave</span>
                  <span style={{ fontWeight: 600, color: "#1a140e" }}>Traditional Wooden Pit Loom</span>
                </div>
                <div className="pdp-spec-row">
                  <span style={{ fontWeight: 700, color: "#8A7A6C", textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.1em" }}>Fit</span>
                  <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.fit || "Relaxed Silhouette"}</span>
                </div>
                <div className="pdp-spec-row">
                  <span style={{ fontWeight: 700, color: "#8A7A6C", textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.1em" }}>Origin</span>
                  <span style={{ fontWeight: 600, color: "#1a140e" }}>Madhya Pradesh, India</span>
                </div>
                {product.sleeveType && (
                  <div className="pdp-spec-row">
                    <span style={{ fontWeight: 700, color: "#8A7A6C", textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.1em" }}>Sleeves</span>
                    <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.sleeveType}</span>
                  </div>
                )}
                {product.neckType && (
                  <div className="pdp-spec-row">
                    <span style={{ fontWeight: 700, color: "#8A7A6C", textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.1em" }}>Neckline</span>
                    <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.neckType}</span>
                  </div>
                )}
                <div className="pdp-spec-row">
                  <span style={{ fontWeight: 700, color: "#8A7A6C", textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.1em" }}>Pockets</span>
                  <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.hasPockets ? "Functional Deep Pockets" : "Clean Line Without Pockets"}</span>
                </div>
                <div className="pdp-spec-row">
                  <span style={{ fontWeight: 700, color: "#8A7A6C", textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.1em" }}>Care</span>
                  <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.fabricCare || "Pure organic handspun cotton. Gentle cycle wash with similar colors."}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Wardrobe Fit / Made For You If... — Clean Seamless Editorial (No Dark Box) */}
          <section style={{ maxWidth: 900, margin: "0 auto 60px", padding: "36px 0", borderTop: "1px solid rgba(44, 32, 22, 0.12)", borderBottom: "1px solid rgba(44, 32, 22, 0.12)" }}>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <span style={{ fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#660608", display: "block", textAlign: "center", marginBottom: 8 }}>
                Wardrobe Fit
              </span>
              <h3 style={{ fontFamily: "Epilogue, sans-serif", fontSize: "clamp(1.5rem, 2.4vw, 2rem)", color: "#1a140e", textAlign: "center", margin: "0 0 20px" }}>
                Made for you if...
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {madeForYouIf.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left" }}>
                    <span style={{ color: "#660608", fontSize: "1.1rem", lineHeight: 1.4, flexShrink: 0 }}>✦</span>
                    <span style={{ fontSize: "1rem", lineHeight: 1.7, color: "#4A3B30" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Origin & Intention — Story Block (No Floating White Box) */}
          <section style={{ maxWidth: 900, margin: "0 auto 60px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#660608", display: "block", marginBottom: 10 }}>
                Origin & Intention
              </span>
              <h3 style={{ fontFamily: "Epilogue, sans-serif", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", color: "#1a140e", margin: "0 0 16px" }}>
                Why we made it.
              </h3>
              <p style={{ fontSize: "1.06rem", lineHeight: 1.85, color: "#4A3B30", margin: "0 auto" }}>
                {story}
              </p>
            </div>
          </section>

          {/* 5. Styling Possibilities / One Piece. Your Way. (No Floating White Boxes) */}
          <section style={{ maxWidth: 900, margin: "0 auto 80px" }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#660608", display: "block", textAlign: "center", marginBottom: 8 }}>
              Styling Possibilities
            </span>
            <h3 style={{ fontFamily: "Epilogue, sans-serif", fontSize: "clamp(1.5rem, 2.4vw, 2rem)", color: "#1a140e", textAlign: "center", margin: "0 0 24px" }}>
              One piece. Your way.
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {howToWear.map((style, idx) => (
                <div key={idx} style={{ padding: "16px 20px", borderLeft: "2.5px solid #660608", background: "rgba(250, 246, 240, 0.7)" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#660608", display: "block", marginBottom: 6 }}>
                    {style.occasion}
                  </span>
                  <p style={{ fontFamily: "Epilogue, sans-serif", fontSize: "1.02rem", lineHeight: 1.6, color: "#1a140e", margin: 0 }}>
                    {style.styling}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Indian Border Pattern Divider */}
          <div
            style={{
              width: "100%",
              height: "28px",
              backgroundImage: 'url("/assets/footerpattern-accent.png")',
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              backgroundSize: "auto 26px",
              opacity: 0.85,
              margin: "0 0 40px",
            }}
            aria-hidden="true"
          />

        </div>
      </div>
    </>
  );
}