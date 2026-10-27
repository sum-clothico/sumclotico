"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { FiX, FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from "react-icons/fi";

export default function WishlistDrawer() {
  const {
    wishlist = [],
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useStore();

  if (!isWishlistOpen) return null;

  const handleMoveToBag = (prod) => {
    const size = prod.sizes?.[0] || "M";
    const color = prod.colors?.[0] || "";
    addToCart(prod, size, color, 1);
    toggleWishlist(prod);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10005,
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "rgba(26, 20, 14, 0.55)",
        backdropFilter: "blur(6px)",
      }}
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          height: "100%",
          backgroundColor: "#FAF6F0",
          boxShadow: "-8px 0 32px rgba(44, 32, 22, 0.18)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          animation: "slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(44, 32, 22, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FiHeart size={18} color="#660608" />
            <h3
              style={{
                fontFamily: "Epilogue, sans-serif",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1a140e",
                margin: 0,
              }}
            >
              My Wishlist ({wishlist.length})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#1a140e",
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Close wishlist"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {wishlist.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#6b7280",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(102, 6, 8, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#660608",
                }}
              >
                <FiHeart size={24} />
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#1a140e" }}>
                  Your wishlist is empty
                </p>
                <p style={{ margin: 0, fontSize: "0.88rem" }}>
                  Explore handcrafted Khadi pieces and save your favorites here.
                </p>
              </div>
              <Link
                href="/shop"
                onClick={() => setIsWishlistOpen(false)}
                style={{
                  marginTop: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#660608",
                  color: "#FAF6F0",
                  padding: "10px 22px",
                  borderRadius: 99,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  textDecoration: "none",
                }}
              >
                Explore Collection <FiArrowRight size={14} />
              </Link>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: 12,
                  background: "#ffffff",
                  borderRadius: 12,
                  border: "1px solid rgba(44, 32, 22, 0.08)",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.images?.[0] || "/assets/img/14.png"}
                  alt={item.name}
                  style={{
                    width: 70,
                    height: 85,
                    objectFit: "cover",
                    borderRadius: 8,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#8a7a6c",
                    }}
                  >
                    {item.category}
                  </div>
                  <h4
                    style={{
                      margin: "2px 0 4px",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#1a140e",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </h4>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#660608" }}>
                    ₹{(item.salePrice || item.price).toLocaleString("en-IN")}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => handleMoveToBag(item)}
                    style={{
                      background: "#2C2016",
                      color: "#FAF6F0",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                    title="Move to Bag"
                  >
                    <FiShoppingBag size={13} />
                    <span>Bag</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(item)}
                    style={{
                      background: "transparent",
                      color: "#9ca3af",
                      border: "none",
                      padding: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
