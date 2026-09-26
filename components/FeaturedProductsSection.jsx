"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { FiShoppingBag, FiArrowRight, FiEye, FiPlus, FiMinus, FiStar } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";

export default function FeaturedProductsSection() {
  const { products = [], setQuickViewProduct, addToCart, cart = [], updateQuantity } = useStore();
  const [selectedSizes, setSelectedSizes] = useState({});

  // Filter products chosen to be featured by the admin (min 2, max 6)
  const adminFeatured = products.filter((p) => p.isFeatured);
  const featured = adminFeatured.length > 0 ? adminFeatured.slice(0, 6) : products.slice(0, 4);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
    trackEvent("select_variant", { product_id: productId, variant_size: size });
  };

  const handleAdd = (prod) => {
    const chosenSize = selectedSizes[prod.id] || prod.sizes?.[0] || "M";
    addToCart(prod, chosenSize, prod.colors?.[0] || "", 1);
  };

  const handleQuickView = (prod) => {
    setQuickViewProduct(prod);
    const itemPrice = prod.salePrice || prod.price;
    trackEvent("view_item", {
      currency: "INR",
      value: itemPrice,
      items: [
        {
          item_id: prod.id,
          item_name: prod.name,
          item_category: prod.category,
          price: itemPrice,
        },
      ],
    });
  };

  return (
    <section
      id="featured-collection"
      style={{
        background: "#fafafa",
        padding: "80px 24px 100px",
        position: "relative",
        borderTop: "1px solid #f0f0f0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 48px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#f35c27", display: "block", marginBottom: "8px" }}>
            Made for Real Days
          </span>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#111111", letterSpacing: "-0.5px", margin: "0 0 14px", lineHeight: 1.2 }}>
            Clothes that keep up with you.
          </h2>
          <p style={{ color: "#4b5563", fontSize: "15px", margin: "0 auto 8px", maxWidth: 620, lineHeight: 1.6 }}>
            For mornings that start too early. Workdays that run too long. Last-minute plans. Slow Sundays. Train journeys. Coffee runs. And all the ordinary, beautiful things in between.
          </p>
          <p style={{ color: "#111111", fontSize: "14px", fontWeight: 600, margin: "0 auto", maxWidth: 600, lineHeight: 1.6 }}>
            We make pieces that are easy to live in — comfortable enough to forget you&apos;re wearing them, considered enough to make you feel good in them.
          </p>
        </div>

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 28,
          }}
        >
          {featured.map((prod) => {
            const currentSize = selectedSizes[prod.id] || prod.sizes?.[0] || "M";
            const effectivePrice = prod.sizePrices && prod.sizePrices[currentSize]
              ? Number(prod.sizePrices[currentSize])
              : (prod.salePrice || prod.price);
            const hasDiscount = prod.salePrice && prod.salePrice < prod.price;

            // Check if current item with selected size is in cart
            const matchingCartItem = cart.find(
              (item) => item.id === prod.id && item.selectedSize === currentSize
            );
            const quantityInCart = matchingCartItem ? matchingCartItem.quantity : 0;

            return (
              <div
                key={prod.id}
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                {/* Image Stage */}
                <div
                  style={{
                    position: "relative",
                    height: 340,
                    background: "#f3f4f6",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => handleQuickView(prod)}
                >
                  <img
                    src={prod.images?.[0] || "/assets/img/14.png"}
                    alt={prod.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />

                  {/* Top Sale Badge Only (No SKU on customer-facing view) */}
                  {hasDiscount && (
                    <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
                      <span
                        style={{
                          background: "#f35c27",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "4px 8px",
                          borderRadius: 4,
                          letterSpacing: "0.5px",
                        }}
                      >
                        SALE
                      </span>
                    </div>
                  )}

                  {/* Quick View Floating Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickView(prod);
                    }}
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      background: "rgba(255, 255, 255, 0.92)",
                      backdropFilter: "blur(4px)",
                      border: "none",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#111",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 2,
                    }}
                    title="Quick Preview"
                    aria-label="Quick Preview"
                  >
                    <FiEye size={16} />
                  </button>
                </div>

                {/* Details */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#6b7280" }}>
                      {prod.category}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111111", margin: "4px 0 2px" }}>
                      {prod.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic", margin: "0 0 12px" }}>
                      "{prod.subtitle}"
                    </p>

                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#111111" }}>
                        ₹{effectivePrice.toLocaleString("en-IN")}
                      </span>
                      {hasDiscount && (
                        <span style={{ fontSize: 13, color: "#9ca3af", textDecoration: "line-through" }}>
                          ₹{prod.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Size Selector */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                      {(prod.sizes || ["XS", "S", "M", "L", "XL"]).map((sz) => {
                        const isSel = currentSize === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => handleSizeSelect(prod.id, sz)}
                            style={{
                              padding: "4px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              borderRadius: 6,
                              border: isSel ? "1.5px solid #111" : "1px solid #e5e7eb",
                              background: isSel ? "#111" : "#ffffff",
                              color: isSel ? "#fff" : "#374151",
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add to Bag or Inline Stepper */}
                  <div>
                    {quantityInCart > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "#111111",
                          color: "#ffffff",
                          borderRadius: 10,
                          padding: "6px 10px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(prod.id, currentSize, prod.colors?.[0] || "", -1)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: "rgba(255, 255, 255, 0.15)",
                            border: "none",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          aria-label="Decrease quantity"
                          title="Decrease quantity"
                        >
                          <FiMinus size={14} />
                        </button>

                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 800 }}>
                            {quantityInCart} in Bag
                          </span>
                        </div>

                        <button
                          onClick={() => updateQuantity(prod.id, currentSize, prod.colors?.[0] || "", 1)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: "#f35c27",
                            border: "none",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          aria-label="Increase quantity"
                          title="Increase quantity"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAdd(prod)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: "#111111",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          transition: "background 0.2s ease, transform 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#262626")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#111111")}
                      >
                        <FiShoppingBag size={15} />
                        <span>Add to Bag</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prominent Bottom CTA Button to Shop */}
        <div style={{ marginTop: 56, textAlign: "center" }}>
          <Link
            href="/shop"
            className="cart-checkout-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 36px",
              fontSize: 15,
              fontWeight: 800,
              borderRadius: 999,
              textDecoration: "none",
              background: "#111111",
              color: "#ffffff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span>Shop All Pieces</span>
            <FiArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
