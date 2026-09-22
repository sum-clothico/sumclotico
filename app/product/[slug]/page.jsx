"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import { trackEvent } from "@/lib/analytics";
import { FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";

export default function ProductPage() {
  const params = useParams();
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
      setSelectedSize(product.sizes?.[0] || "");
      trackEvent("view_item", {
        currency: "INR",
        value: product.salePrice || product.price,
        items: [{ item_id: product.id, item_name: product.name, price: product.salePrice || product.price, item_category: product.category }],
      });
    }
  }, [product?.id]);

  if (!product && products.length > 0) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Product not found</h1>
          <Link href="/collection" style={{ color: "#f35c27", fontWeight: 700, textDecoration: "none" }}>Back to Collection</Link>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#888" }}>Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  const effectivePrice = product.sizePrices?.[selectedSize]
    ? Number(product.sizePrices[selectedSize])
    : (product.salePrice || product.price);

  const isOnSale = product.salePrice && product.salePrice < product.price;
  const discountPct = isOnSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  const activeVariant = product.variants?.find(
    (v) => v.size === selectedSize && (!selectedColor || v.color === selectedColor)
  );
  const stockForVariant = activeVariant ? activeVariant.stock : product.stock;
  const variantSku = activeVariant?.sku || product.sku;
  const isLowStock = stockForVariant <= (product.lowStockThreshold || 5) && stockForVariant > 0;
  const isOutOfStock = stockForVariant === 0;

  const handleAddToCart = () => {
    if (!selectedSize) { alert("Please select a size."); return; }
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, qty, false);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
    trackEvent("add_to_cart", {
      currency: "INR",
      value: effectivePrice * qty,
      items: [{ item_id: product.id, item_name: product.name, price: effectivePrice, quantity: qty, item_variant: selectedSize }],
    });
  };

  const images = product.images?.length ? product.images : ["/assets/img/14.png"];

  return (
    <>
      <Navbar />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .pdp-thumb { cursor:pointer; border:2px solid transparent; border-radius:8px; overflow:hidden; transition:border-color 0.2s; }
        .pdp-thumb.active { border-color:#f35c27; }
        .pdp-size-btn { padding:10px 18px; border:1.5px solid #d1d5db; border-radius:8px; background:#fff; font-weight:700; font-size:14px; cursor:pointer; transition:all 0.2s; }
        .pdp-size-btn.active { background:#111; color:#fff; border-color:#111; }
        .pdp-size-btn.oos { opacity:0.35; cursor:not-allowed; text-decoration:line-through; }
        .pdp-add-btn { width:100%; padding:16px; background:#111; color:#fff; border:none; border-radius:12px; font-size:16px; font-weight:800; cursor:pointer; transition:background 0.2s; }
        .pdp-add-btn:hover { background:#f35c27; }
        .pdp-add-btn.added { background:#16a34a; }
        .pdp-add-btn:disabled { background:#9ca3af; cursor:not-allowed; }
        .pdp-badge { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; }
        .pdp-detail-row { display:flex; gap:8px; align-items:flex-start; font-size:14px; padding:9px 0; border-bottom:1px solid #f3f4f6; }
        .pdp-detail-label { color:#6b7280; font-weight:600; min-width:140px; flex-shrink:0; }
        .pdp-detail-val { color:#111827; font-weight:500; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#fafafa", padding: "120px 24px 80px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <nav style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#9ca3af", marginBottom: 32 }}>
            <Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/collection" style={{ color: "#9ca3af", textDecoration: "none" }}>Collection</Link>
            <span>/</span>
            <span style={{ color: "#111" }}>{product.name}</span>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>

            {/* LEFT: Gallery */}
            <div style={{ position: "sticky", top: 110 }}>
              <div style={{ borderRadius: 16, overflow: "hidden", background: "#f3f4f6", aspectRatio: "3/4", marginBottom: 12, position: "relative" }}>
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
                  <img src={images[activeImage]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}

                {product.videoUrl && !isVideoActive && (
                  <button
                    type="button"
                    onClick={() => setIsVideoActive(true)}
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      background: "rgba(17,17,17,0.85)",
                      color: "#fff",
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
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <span>▶ Watch Garment Video</span>
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`pdp-thumb ${!isVideoActive && i === activeImage ? "active" : ""}`}
                    onClick={() => { setIsVideoActive(false); setActiveImage(i); }}
                    style={{ width: 72, height: 88, background: "#f3f4f6", cursor: "pointer" }}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}

                {product.videoUrl && (
                  <div
                    className={`pdp-thumb ${isVideoActive ? "active" : ""}`}
                    onClick={() => setIsVideoActive(true)}
                    style={{
                      width: 72,
                      height: 88,
                      background: "#111",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      borderRadius: 8,
                      cursor: "pointer",
                      padding: 4,
                      textAlign: "center",
                      border: isVideoActive ? "2px solid #f35c27" : "2px solid transparent",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>▶</span>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: "#f35c27" }}>
                      Video
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              <div>
                {product.collection && (
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#f35c27", textTransform: "uppercase", marginBottom: 6 }}>{product.collection}</div>
                )}
                <h1 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>{product.name}</h1>
                {product.subtitle && <p style={{ fontSize: 16, color: "#6b7280", margin: "6px 0 0", fontStyle: "italic" }}>{product.subtitle}</p>}
              </div>

              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.productType && <span className="pdp-badge" style={{ background: "#f3f4f6", color: "#374151" }}>{product.productType}</span>}
                {product.hasPockets && <span className="pdp-badge" style={{ background: "#ecfdf5", color: "#065f46" }}>✓ Pockets</span>}
                {product.hasLining && <span className="pdp-badge" style={{ background: "#eff6ff", color: "#1d4ed8" }}>✓ Lined</span>}
                {product.returnEligible && <span className="pdp-badge" style={{ background: "#fef3c7", color: "#92400e" }}>7-Day Returns</span>}
                {isLowStock && !isOutOfStock && <span className="pdp-badge" style={{ background: "#fef2f2", color: "#991b1b" }}>Only {stockForVariant} left!</span>}
              </div>

              {/* Price */}
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: "#111" }}>₹{effectivePrice.toLocaleString("en-IN")}</span>
                  {isOnSale && (
                    <>
                      <span style={{ fontSize: 18, color: "#9ca3af", textDecoration: "line-through" }}>₹{product.price.toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>{discountPct}% OFF</span>
                    </>
                  )}
                </div>
                {product.gstPercent > 0 && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Inclusive of GST ({product.gstPercent}%)</div>}
                {variantSku && <div style={{ fontSize: 11, color: "#c4c4c4", fontFamily: "monospace", marginTop: 4 }}>SKU: {variantSku}</div>}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f0f0f0" }} />

              {/* Colour */}
              {product.colors?.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Colour — <span style={{ fontWeight: 500, color: "#6b7280" }}>{selectedColor}</span></div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {product.colors.map((color) => (
                      <button key={color} onClick={() => setSelectedColor(color)} style={{ padding: "6px 14px", border: `2px solid ${selectedColor === color ? "#111" : "#e5e7eb"}`, borderRadius: 20, background: selectedColor === color ? "#111" : "#fff", color: selectedColor === color ? "#fff" : "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{color}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {product.sizes?.length > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                      Size — <span style={{ fontWeight: 500, color: "#6b7280" }}>{selectedSize}</span>
                      {selectedSize && product.sizePrices?.[selectedSize] && <span style={{ color: "#f35c27", marginLeft: 8 }}>₹{Number(product.sizePrices[selectedSize]).toLocaleString("en-IN")}</span>}
                    </div>
                    <button onClick={() => setIsSizeGuideOpen(true)} style={{ fontSize: 12, color: "#6b7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}>Size Guide</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {product.sizes.map((size) => {
                      const vStock = product.variants?.find(v => v.size === size && (!selectedColor || v.color === selectedColor))?.stock ?? product.stock;
                      const oos = vStock === 0;
                      return (
                        <button key={size} className={`pdp-size-btn ${selectedSize === size ? "active" : ""} ${oos ? "oos" : ""}`} onClick={() => !oos && setSelectedSize(size)} disabled={oos}>{size}</button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Qty */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Qty</span>
                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: "8px 14px", border: "none", background: "#f9fafb", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>−</button>
                  <span style={{ padding: "8px 16px", fontWeight: 700, minWidth: 32, textAlign: "center" }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(stockForVariant || 99, q + 1))} style={{ padding: "8px 14px", border: "none", background: "#f9fafb", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>+</button>
                </div>
              </div>

              {/* Add to Cart */}
              <button className={`pdp-add-btn ${addedFeedback ? "added" : ""}`} onClick={handleAddToCart} disabled={isOutOfStock || !selectedSize}>
                {isOutOfStock ? "Out of Stock" : addedFeedback ? "✓ Added to Bag!" : `Add to Bag — ₹${(effectivePrice * qty).toLocaleString("en-IN")}`}
              </button>

              {/* Trust row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "16px 0", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
                {[{ icon: <FiTruck size={18} />, label: "Free shipping over ₹1,999" }, { icon: <FiRefreshCw size={18} />, label: "7-day easy returns" }, { icon: <FiShield size={18} />, label: "Secure checkout" }].map(({ icon, label }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
                    <div style={{ color: "#f35c27" }}>{icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5, color: "#374151" }}>About This Piece</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#4b5563", margin: 0 }}>{product.description}</p>
                  {product.hook && <p style={{ fontSize: 15, fontStyle: "italic", color: "#f35c27", fontWeight: 600, margin: "10px 0 0" }}>"{product.hook}"</p>}
                </div>
              )}

              {/* Details Table */}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.5, color: "#374151" }}>Product Details</h3>
                <div style={{ background: "#fafafa", borderRadius: 10, border: "1px solid #f0f0f0", padding: "4px 16px" }}>
                  {[
                    { label: "Fabric", value: product.fabricComposition },
                    { label: "Fit", value: product.fit },
                    { label: "Length", value: product.length },
                    { label: "Sleeve", value: product.sleeveType },
                    { label: "Neckline", value: product.neckType },
                    { label: "Pockets", value: product.hasPockets ? "Yes" : null },
                    { label: "Lining", value: product.hasLining ? "Yes" : null },
                    { label: "Care Instructions", value: product.fabricCare },
                    { label: "Model Wears", value: product.modelMeasurements },
                    { label: "Type", value: product.productType || product.category },
                    { label: "Collection", value: product.collection },
                    { label: "GST", value: product.gstPercent ? `${product.gstPercent}% (included)` : null },
                    { label: "Returns", value: product.returnEligible ? "Eligible — 7 days from delivery" : "Non-returnable" },
                  ].filter(r => r.value).map(({ label, value }) => (
                    <div key={label} className="pdp-detail-row">
                      <span className="pdp-detail-label">{label}</span>
                      <span className="pdp-detail-val">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Garment in Motion & Craft Video (Cloudinary) */}
              {product.videoUrl && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: 0.5, color: "#374151" }}>
                      Garment in Motion
                    </h3>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#f35c27", background: "#fff5f0", padding: "3px 8px", borderRadius: 4 }}>
                      HD Craft Reel
                    </span>
                  </div>
                  <div style={{ borderRadius: 14, overflow: "hidden", background: "#000", aspectRatio: "16/9", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
                    <video
                      src={product.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}