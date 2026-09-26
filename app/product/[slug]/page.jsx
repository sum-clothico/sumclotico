"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
          <h1 style={{ fontFamily: "serif", fontSize: 28, fontWeight: 600, color: "#1a140e" }}>Piece Not Found</h1>
          <p style={{ color: "#6b5d52" }}>The garment you are looking for is currently unavailable or has been archived.</p>
          <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#1a140e", fontWeight: 700, textDecoration: "underline" }}>
            Return to Shop All Pieces <FiArrowRight size={14} />
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF6F0" }}>
          <p style={{ color: "#8a7a6c", fontStyle: "italic", fontFamily: "serif", fontSize: "1.2rem" }}>Unfolding piece details...</p>
        </div>
        <Footer />
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
          padding: 110px 24px 80px;
        }
        .pdp-container {
          max-width: 1200px;
          margin: 0 auto;
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
        .pdp-detail-card {
          background: #ffffff;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid rgba(42, 31, 20, 0.08);
        }
        .pdp-spec-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(42, 31, 20, 0.06);
          font-size: 14px;
        }
        .pdp-spec-row:last-child {
          border-bottom: none;
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 56, alignItems: "start", marginBottom: 70 }}>

            {/* LEFT: Gallery Visuals */}
            <div style={{ position: "sticky", top: 110 }}>
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
                <h1 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 3.5vw, 2.7rem)", fontWeight: 600, color: "#1a140e", margin: "0 0 6px", lineHeight: 1.15 }}>
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
                  <span style={{ fontSize: "1.85rem", fontWeight: 800, color: "#1a140e", fontFamily: "serif" }}>
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

              {/* Color Selection (if multiple colors) */}
              {product.colors?.length > 1 && (
                <div>
                  <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b5d52", display: "block", marginBottom: 10 }}>
                    Color: <strong style={{ color: "#1a140e" }}>{selectedColor}</strong>
                  </span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          padding: "8px 16px",
                          border: `1.5px solid ${selectedColor === color ? "#1a140e" : "rgba(42,31,20,0.2)"}`,
                          borderRadius: 999,
                          background: selectedColor === color ? "#1a140e" : "#ffffff",
                          color: selectedColor === color ? "#FAF6F0" : "#1a140e",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {color}
                      </button>
                    ))}
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

              {/* Support Links Below CTAs */}
              <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: 14, border: "1px solid rgba(42,31,20,0.08)", display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#55483d" }}>
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

              {/* Trust Features */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "16px 0", borderTop: "1px solid rgba(42,31,20,0.1)" }}>
                {[
                  { icon: <FiTruck size={17} />, label: "Free shipping over ₹1,999" },
                  { icon: <FiRefreshCw size={17} />, label: "7-day easy returns" },
                  { icon: <FiShield size={17} />, label: "Direct weaver verified" },
                ].map(({ icon, label }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
                    <div style={{ color: "#b36338" }}>{icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6e5d4e", lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ─── HOW IT FEELS ─── */}
          {product.howItFeels && (
            <section style={{ maxWidth: 880, margin: "0 auto 70px", textAlign: "center" }}>
              <div style={{ background: "#ffffff", padding: "40px 32px", borderRadius: 20, border: "1px solid rgba(42,31,20,0.08)" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 12 }}>
                  How It Feels
                </span>
                <p style={{ fontFamily: "serif", fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)", fontStyle: "italic", color: "#1a140e", margin: 0, lineHeight: 1.4 }}>
                  "{product.howItFeels}"
                </p>
              </div>
            </section>
          )}

          {/* ─── WHY YOU'LL LOVE IT ─── */}
          <section style={{ margin: "0 auto 80px" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 6 }}>
                Considered Details
              </span>
              <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, color: "#1a140e", margin: 0 }}>
                Why You&apos;ll Love It
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {whyYouLoveIt.map((item, idx) => (
                <div key={idx} style={{ background: "#ffffff", padding: "30px 24px", borderRadius: 16, border: "1px solid rgba(42,31,20,0.08)" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#b36338", letterSpacing: "0.12em", display: "block", marginBottom: 8 }}>
                    0{idx + 1}
                  </span>
                  <h3 style={{ fontFamily: "serif", fontSize: "1.18rem", fontWeight: 700, color: "#1a140e", margin: "0 0 10px", letterSpacing: "0.04em" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#55483d", margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── MADE FOR YOU IF... ─── */}
          <section style={{ maxWidth: 840, margin: "0 auto 80px" }}>
            <div style={{ background: "#2a1f14", color: "#FAF6F0", padding: "clamp(32px, 5vw, 48px)", borderRadius: 24 }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d89b6c", display: "block", marginBottom: 12 }}>
                Wardrobe Fit
              </span>
              <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", margin: "0 0 24px", color: "#FAF6F0" }}>
                Made For You If...
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {madeForYouIf.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(216, 155, 108, 0.2)", color: "#d89b6c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <FiCheck size={13} />
                    </div>
                    <span style={{ fontSize: "1.02rem", lineHeight: 1.7, color: "rgba(250, 246, 240, 0.9)" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── THE DETAILS ─── */}
          <section style={{ maxWidth: 840, margin: "0 auto 80px" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 6 }}>
                Specifications
              </span>
              <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, color: "#1a140e", margin: 0 }}>
                The Details
              </h2>
            </div>
            <div className="pdp-detail-card">
              <div className="pdp-spec-row">
                <span style={{ fontWeight: 700, color: "#6e5d4e" }}>Textile</span>
                <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.fabricComposition || "Khadi cotton"}</span>
              </div>
              <div className="pdp-spec-row">
                <span style={{ fontWeight: 700, color: "#6e5d4e" }}>Fit</span>
                <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.fit || "Relaxed"}</span>
              </div>
              {product.sleeveType && (
                <div className="pdp-spec-row">
                  <span style={{ fontWeight: 700, color: "#6e5d4e" }}>Sleeves</span>
                  <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.sleeveType}</span>
                </div>
              )}
              {product.neckType && (
                <div className="pdp-spec-row">
                  <span style={{ fontWeight: 700, color: "#6e5d4e" }}>Neckline</span>
                  <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.neckType}</span>
                </div>
              )}
              <div className="pdp-spec-row">
                <span style={{ fontWeight: 700, color: "#6e5d4e" }}>Pockets</span>
                <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.hasPockets ? "Yes" : "No"}</span>
              </div>
              <div className="pdp-spec-row">
                <span style={{ fontWeight: 700, color: "#6e5d4e" }}>Made in</span>
                <span style={{ fontWeight: 600, color: "#1a140e" }}>India</span>
              </div>
              <div className="pdp-spec-row">
                <span style={{ fontWeight: 700, color: "#6e5d4e" }}>Care</span>
                <span style={{ fontWeight: 600, color: "#1a140e" }}>{product.fabricCare || "Gentle wash"}</span>
              </div>
            </div>
          </section>

          {/* ─── THE STORY BEHIND THE PIECE ─── */}
          <section style={{ maxWidth: 840, margin: "0 auto 80px", textAlign: "center" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
              Origin & Intention
            </span>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1a140e", margin: "0 0 20px" }}>
              Why we made it.
            </h2>
            <div style={{ fontSize: "1.08rem", lineHeight: 1.85, color: "#443528", background: "#ffffff", padding: "clamp(30px, 4vw, 44px)", borderRadius: 20, border: "1px solid rgba(42,31,20,0.08)" }}>
              <p style={{ margin: 0 }}>
                {story}
              </p>
            </div>
          </section>

          {/* ─── HOW TO WEAR IT ─── */}
          <section style={{ maxWidth: 960, margin: "0 auto 100px" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 6 }}>
                Styling Possibilities
              </span>
              <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, color: "#1a140e", margin: 0 }}>
                One piece. Your way.
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {howToWear.map((style, idx) => (
                <div key={idx} style={{ background: "#ffffff", padding: "28px 24px", borderRadius: 16, border: "1px solid rgba(42,31,20,0.08)" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b36338", display: "block", marginBottom: 8 }}>
                    {style.occasion}
                  </span>
                  <p style={{ fontFamily: "serif", fontSize: "1.08rem", lineHeight: 1.6, color: "#1a140e", margin: 0 }}>
                    {style.styling}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
}