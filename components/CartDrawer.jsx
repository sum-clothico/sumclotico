"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiX, FiArrowRight, FiShield } from "react-icons/fi";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartTotalItems,
    isFreeShipping,
    shippingFee,
    cartGrandTotal,
    shippingThreshold,
  } = useStore();

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, shippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / shippingThreshold) * 100);

  return (
    <div className={`cart-drawer-overlay ${isCartOpen ? "open" : ""}`} onClick={() => setIsCartOpen(false)}>
      <div
        className="cart-drawer"
        style={{
          maxWidth: 520,
          width: "100%",
          boxShadow: "-12px 0 40px rgba(0, 0, 0, 0.22)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="cart-header"
          style={{
            padding: "26px 32px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#111111",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiShoppingBag size={20} />
            </div>
            <div>
              <div className="cart-title" style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                Shopping Bag
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                {cartTotalItems} {cartTotalItems === 1 ? "handcrafted piece" : "handcrafted pieces"}
              </div>
            </div>
          </div>
          <button
            className="cart-close-btn"
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
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <FiX size={18} color="#111827" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div
          className="cart-shipping-meter"
          style={{
            padding: "16px 32px",
            background: "#fafafa",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
            {isFreeShipping ? (
              <span style={{ color: "#15803d", fontWeight: 700 }}>
                You have unlocked FREE Standard Shipping!
              </span>
            ) : (
              <span>
                Add <strong>₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> more for <strong>FREE Shipping</strong>
              </span>
            )}
            <span style={{ fontSize: 12, fontWeight: 700, color: "#4b5563" }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="cart-shipping-bar" style={{ height: 6, marginTop: 10, background: "#e5e7eb", borderRadius: 999 }}>
            <div
              className="cart-shipping-progress"
              style={{
                width: `${progressPercent}%`,
                background: isFreeShipping ? "#15803d" : "#f35c27",
                borderRadius: 999,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-body" style={{ padding: "24px 32px", flex: 1, overflowY: "auto" }}>
          {cart.length === 0 ? (
            <div className="cart-empty" style={{ padding: "80px 20px", textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <FiShoppingBag size={36} color="#9ca3af" />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 20, color: "#111827", margin: "0 0 8px" }}>
                Your bag is empty
              </h3>
              <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 28px", maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
                Explore our signature collection of handcrafted, sustainable khadi apparel.
              </p>
              <Link
                href="/collection"
                className="cart-checkout-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  textDecoration: "none",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                }}
                onClick={() => setIsCartOpen(false)}
              >
                <span>Browse Collection</span>
                <FiArrowRight size={16} />
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="cart-item-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: 20,
                  padding: "20px 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                {/* Large Product Thumbnail */}
                <div
                  style={{
                    width: 100,
                    height: 130,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Info & Quantity Controls */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                        {item.name}
                      </div>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#9ca3af",
                          cursor: "pointer",
                          padding: 4,
                          transition: "color 0.2s",
                        }}
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        title="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                      Size: <strong style={{ color: "#111827" }}>{item.selectedSize}</strong>
                      {item.selectedColor ? ` | ${item.selectedColor}` : ""}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    {/* Stepper */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        overflow: "hidden",
                        background: "#f9fafb",
                      }}
                    >
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          width: 30,
                          height: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={12} color="#374151" />
                      </button>
                      <span style={{ padding: "0 10px", fontSize: 13, fontWeight: 700, minWidth: 24, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          width: 30,
                          height: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={12} color="#374151" />
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div
            className="cart-footer"
            style={{
              padding: "26px 32px",
              background: "#ffffff",
              borderTop: "1px solid #f0f0f0",
              boxShadow: "0 -8px 24px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="cart-summary-row" style={{ fontSize: 14, color: "#4b5563", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span>Items Subtotal</span>
              <span style={{ fontWeight: 700, color: "#111827" }}>₹{cartSubtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="cart-summary-row" style={{ fontSize: 14, color: "#4b5563", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span>Estimated Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <strong style={{ color: "#15803d" }}>FREE</strong>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>
            <div
              className="cart-summary-row cart-summary-total"
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#111827",
                borderTop: "1px solid #f3f4f6",
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span>Total Amount</span>
              <span style={{ color: "#111827" }}>₹{cartGrandTotal.toLocaleString("en-IN")}</span>
            </div>

            <Link
              href="/checkout"
              className="cart-checkout-btn"
              style={{
                marginTop: 18,
                padding: "18px",
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 10,
                background: "#111111",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.16)",
              }}
              onClick={() => setIsCartOpen(false)}
            >
              <span>Proceed to Checkout</span>
              <FiArrowRight size={18} />
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginTop: 12,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              <FiShield size={14} color="#15803d" />
              <span>Cashfree 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
