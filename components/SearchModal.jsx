"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { FiSearch, FiX, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { trackEvent, trackSearch } from "@/lib/analytics";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, products, setQuickViewProduct } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Debounced search query analytics
  useEffect(() => {
    if (!query || query.trim().length < 2) return;
    const timer = setTimeout(() => {
      const matchCount = products.filter((p) => {
        const q = query.trim().toLowerCase();
        return (
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
        );
      }).length;
      trackSearch(query.trim(), matchCount);
    }, 600);
    return () => clearTimeout(timer);
  }, [query, products]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? products.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const subtitle = (p.subtitle || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const colors = (p.colors || []).join(" ").toLowerCase();
        return name.includes(trimmed) || subtitle.includes(trimmed) || category.includes(trimmed) || desc.includes(trimmed) || colors.includes(trimmed);
      })
    : [];

  const handleProductSelect = (product) => {
    trackEvent("select_item", {
      item_list_name: "Search Results",
      search_term: query,
      items: [{
        item_id: String(product.id),
        item_name: product.name,
        price: product.salePrice || product.price,
        item_category: product.category || "Handloom",
      }]
    });
    setIsSearchOpen(false);
    setQuickViewProduct(product);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 10001,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "80px 20px 40px",
        overflowY: "auto",
      }}
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid #f0f0f0",
            gap: 14,
          }}
        >
          <FiSearch size={22} color="#4b5563" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tops, dresses, khadi fabrics, colors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 16,
              color: "#111827",
              fontFamily: "inherit",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                background: "none",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
                padding: 4,
                fontSize: 14,
              }}
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            style={{
              background: "#f3f4f6",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Close search"
          >
            <FiX size={18} color="#111827" />
          </button>
        </div>

        {/* Popular searches suggestions when query is empty */}
        {!trimmed && (
          <div style={{ padding: "24px 28px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#9ca3af", marginBottom: 12 }}>
              Popular Searches
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {["Khadi Tops", "Orange Pop", "Summer Dresses", "Relaxed Fit", "Noir", "Pure Linen"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontSize: 13,
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {term}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#9ca3af", marginBottom: 12 }}>
              Explore Curated Lines
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Link
                href="/collection"
                onClick={() => setIsSearchOpen(false)}
                style={{
                  padding: "12px 16px",
                  background: "#fdf8f6",
                  borderRadius: 10,
                  border: "1px solid #fed7aa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  color: "#9a3412",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <span>The Everyday Tops Edit</span>
                <FiArrowRight size={16} />
              </Link>
              <Link
                href="/collection"
                onClick={() => setIsSearchOpen(false)}
                style={{
                  padding: "12px 16px",
                  background: "#f0fdf4",
                  borderRadius: 10,
                  border: "1px solid #bbf7d0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  color: "#166534",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <span>Handcrafted Dresses</span>
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Results Body */}
        {trimmed && (
          <div style={{ maxHeight: 420, overflowY: "auto", padding: "16px 24px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#6b7280", marginBottom: 12 }}>
              Matching Products ({results.length})
            </div>

            {results.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
                  No results found for "{query}"
                </p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
                  Try checking your spelling or search for "Tops", "Dresses", or "Khadi".
                </p>
                <Link
                  href="/collection"
                  onClick={() => setIsSearchOpen(false)}
                  style={{
                    display: "inline-block",
                    padding: "8px 18px",
                    background: "#111111",
                    color: "#ffffff",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  View All Collection →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {results.map((product) => {
                  const effectivePrice = product.salePrice || product.price;
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid #f3f4f6",
                        background: "#ffffff",
                        cursor: "pointer",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#ffffff";
                        e.currentTarget.style.borderColor = "#f3f4f6";
                      }}
                    >
                      <img
                        src={product.images?.[0] || "/assets/img/14.png"}
                        alt={product.name}
                        style={{ width: 54, height: 64, objectFit: "cover", borderRadius: 6 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                          {product.subtitle || product.category}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>
                          ₹{effectivePrice.toLocaleString("en-IN")}
                        </div>
                        {product.salePrice && (
                          <div style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through" }}>
                            ₹{product.price.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
