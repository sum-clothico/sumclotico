"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/collection.css";
import Footer from "./Footer";
import { useStore } from "@/context/StoreContext";
import { FiShoppingBag, FiFilter, FiCheck, FiX, FiSliders, FiArrowUpRight, FiPlus, FiMinus } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

// Image Slider Component
function ImageSlider({ images, altText }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="slider-container">
      <div 
        className="slider-track" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={`${altText} ${idx + 1}`} loading="lazy" />
        ))}
      </div>
      
      {images.length > 1 && (
        <>
          <button className="slider-btn slider-btn-prev" onClick={handlePrev} aria-label="Previous image">
            &#8249;
          </button>
          <button className="slider-btn slider-btn-next" onClick={handleNext} aria-label="Next image">
            &#8250;
          </button>
          <div className="slider-dots">
            {images.map((_, idx) => (
              <span 
                key={idx} 
                className={`slider-dot ${idx === currentIndex ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CollectionClient() {
  const containerRef = useRef(null);
  const { products = [], addToCart, setQuickViewProduct, setIsCartOpen, cartTotalItems, setIsSizeGuideOpen, categories = ["Tops", "Dresses", "Fabrics"], cart = [], updateQuantity } = useStore();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedFeedback, setAddedFeedback] = useState({});

  // Multi-facet Filter States
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("ALL");
  const [selectedColorFilter, setSelectedColorFilter] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("FEATURED");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".prod-fade",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [products, selectedCategory, selectedSizeFilter, selectedColorFilter, maxPrice, sortBy]);

  // Handle Filtering & Sorting
  let filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" || p.category?.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSize = selectedSizeFilter === "ALL" || (p.sizes && p.sizes.includes(selectedSizeFilter));
    const matchesColor = selectedColorFilter === "ALL" || (p.colors && p.colors.some((c) => c.toLowerCase().includes(selectedColorFilter.toLowerCase())));
    const price = p.salePrice || p.price;
    const matchesPrice = price <= maxPrice;
    return matchesCategory && matchesSize && matchesColor && matchesPrice;
  });

  // Apply Sorting
  filtered.sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;
    if (sortBy === "PRICE_ASC") return priceA - priceB;
    if (sortBy === "PRICE_DESC") return priceB - priceA;
    if (sortBy === "BEST_SELLING") return (b.salesCount || 0) - (a.salesCount || 0);
    if (sortBy === "NEWEST") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0; // Default Featured
  });

  useEffect(() => {
    trackEvent("view_item_list", {
      item_list_name: selectedCategory === "ALL" ? "All Handloom Pieces" : selectedCategory,
      filter_category: selectedCategory,
      filter_size: selectedSizeFilter,
      filter_max_price: maxPrice,
      sort_by: sortBy,
      item_count: filtered.length,
    });
  }, [selectedCategory, selectedSizeFilter, maxPrice, sortBy]);

  const handleSizeChange = (prodId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [prodId]: size }));
    trackEvent("select_variant", { product_id: prodId, variant_size: size });
  };

  const handleAddToCart = (prod) => {
    const size = selectedSizes[prod.id] || prod.sizes?.[0] || "M";
    const color = prod.colors?.[0] || "";
    addToCart(prod, size, color, 1);
    setAddedFeedback((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [prod.id]: false }));
    }, 1200);
  };

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedSizeFilter("ALL");
    setSelectedColorFilter("ALL");
    setMaxPrice(5000);
    setSortBy("FEATURED");
    trackEvent("filter_reset", { page: "collection" });
  };

  const isAnyFilterActive =
    selectedCategory !== "ALL" ||
    selectedSizeFilter !== "ALL" ||
    selectedColorFilter !== "ALL" ||
    maxPrice < 5000 ||
    sortBy !== "FEATURED";

  return (
    <div ref={containerRef} className="collection-page">
      <div className="os-noise" />

      {/* Hero Header */}
      <section className="col-hero" style={{ paddingBottom: "32px" }}>
        <h1 className="prod-fade">Handcrafted Collection</h1>
        <p className="prod-fade">Authentic, breathable Indian Khadi silhouettes designed for mindful everyday living.</p>
        
        <div className="col-details prod-fade">
          <div className="detail-item"><span>Fabric:</span> 100% Handspun Khadi</div>
          <div className="detail-item"><span>Fit:</span> Relaxed Modern</div>
          <div className="detail-item">
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "#f35c27",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                textDecoration: "underline",
              }}
            >
              <span>Size Guide Chart</span>
              <FiArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FILTERS & SORTING BAR ─── */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto 36px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "18px 24px",
            borderRadius: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            border: "1px solid #f0f0f0",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#9ca3af", marginRight: 4 }}>
              Category:
            </span>
            {["ALL", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  border: selectedCategory.toUpperCase() === cat.toUpperCase() ? "1px solid #111111" : "1px solid #e5e7eb",
                  background: selectedCategory.toUpperCase() === cat.toUpperCase() ? "#111111" : "#f9fafb",
                  color: selectedCategory.toUpperCase() === cat.toUpperCase() ? "#ffffff" : "#374151",
                  padding: "6px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {cat === "ALL" ? "All Pieces" : cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Quick Filter Drawer Trigger */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {/* Size Filter Dropdown */}
            <select
              value={selectedSizeFilter}
              onChange={(e) => setSelectedSizeFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                outline: "none",
                background: "#ffffff",
                cursor: "pointer",
              }}
              aria-label="Filter by size"
            >
              <option value="ALL">All Sizes</option>
              <option value="XS">Size XS</option>
              <option value="S">Size S</option>
              <option value="M">Size M</option>
              <option value="L">Size L</option>
              <option value="XL">Size XL</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                outline: "none",
                background: "#ffffff",
                cursor: "pointer",
              }}
              aria-label="Sort products"
            >
              <option value="FEATURED">Sort: Featured Edit</option>
              <option value="BEST_SELLING">Best Selling</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="NEWEST">New Arrivals</option>
            </select>

            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Count Banner */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#6b7280" }}>
          <div>
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "garment" : "garments"}
          </div>
          <div style={{ fontSize: 12 }}>
            Free shipping on orders above ₹1,999
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS GRID ─── */}
      <section className="prod-grid" style={{ maxWidth: 1280, margin: "0 auto 60px", padding: "0 24px 100px" }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FiFilter size={26} color="#9ca3af" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>
              No garments found matching filters
            </h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 20px" }}>
              Try adjusting your category, size, or price filters.
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                padding: "10px 24px",
                background: "#111111",
                color: "#ffffff",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filtered.map((prod) => {
            const currentSize = selectedSizes[prod.id] || prod.sizes?.[0] || "M";
            const displayPrice = (prod.sizePrices && prod.sizePrices[currentSize])
              ? Number(prod.sizePrices[currentSize])
              : (prod.salePrice || prod.price);
            const hasDiscount = prod.salePrice && prod.salePrice < prod.price;
            const isAdded = addedFeedback[prod.id];

            return (
              <div key={prod.id} className="prod-card prod-fade">
                <div 
                  className="prod-img-wrapper" 
                  style={{ cursor: "pointer", position: "relative" }}
                  onClick={() => setQuickViewProduct(prod)}
                >
                  <ImageSlider images={prod.images} altText={prod.name} />

                  {hasDiscount && (
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        background: "#f35c27",
                        color: "#ffffff",
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "4px 8px",
                        borderRadius: 4,
                        zIndex: 10,
                      }}
                    >
                      SALE
                    </div>
                  )}
                </div>

                <div className="prod-info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span className="prod-sub">
                        {prod.subtitle || prod.category}
                      </span>
                      <h2>{prod.name}</h2>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#111111" }}>
                        ₹{displayPrice.toLocaleString("en-IN")}
                      </span>
                      {hasDiscount && (
                        <div style={{ fontSize: 13, color: "#888888", textDecoration: "line-through" }}>
                          ₹{prod.price.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="prod-hook">{prod.hook || prod.description?.slice(0, 70)}</p>
                  <p className="prod-desc">{prod.description}</p>

                  {/* Size Selection Pill Buttons */}
                  <div style={{ margin: "16px 0 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#666" }}>
                        Choose Size:
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSizeGuideOpen(true);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#888888",
                          fontSize: 11,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Size Guide
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      {(prod.sizes || ["XS", "S", "M", "L", "XL"]).map((sz) => (
                        <button
                          key={sz}
                          className={`quickview-size-pill ${currentSize === sz ? "selected" : ""}`}
                          onClick={() => handleSizeChange(prod.id, sz)}
                          style={{ padding: "4px 10px", fontSize: 12, minWidth: 36, textAlign: "center" }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Bag and Quick View Buttons */}
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    {(() => {
                      const matchingItem = cart.find(
                        (i) => i.id === prod.id && i.selectedSize === currentSize
                      );
                      const qty = matchingItem ? matchingItem.quantity : 0;

                      if (qty > 0) {
                        return (
                          <div
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "#111111",
                              color: "#ffffff",
                              borderRadius: 8,
                              padding: "4px 8px",
                            }}
                          >
                            <button
                              onClick={() => updateQuantity(prod.id, currentSize, prod.colors?.[0] || "", -1)}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 4,
                                background: "rgba(255, 255, 255, 0.15)",
                                border: "none",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                              aria-label="Decrease quantity"
                            >
                              <FiMinus size={13} />
                            </button>
                            <span style={{ fontSize: 12, fontWeight: 800 }}>{qty} in Bag</span>
                            <button
                              onClick={() => updateQuantity(prod.id, currentSize, prod.colors?.[0] || "", 1)}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 4,
                                background: "#f35c27",
                                border: "none",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                              aria-label="Increase quantity"
                            >
                              <FiPlus size={13} />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <button
                          className="cart-checkout-btn"
                          style={{
                            margin: 0,
                            flex: 1,
                            padding: "12px 18px",
                            fontSize: 13,
                            background: isAdded ? "#15803d" : "#111111",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            transition: "background 0.2s ease",
                          }}
                          onClick={() => handleAddToCart(prod)}
                        >
                          {isAdded ? (
                            <>
                              <FiCheck size={16} />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <span>Add to Bag</span>
                          )}
                        </button>
                      );
                    })()}

                    <button
                      className="quickview-size-pill"
                      style={{ padding: "12px 16px", background: "#f5f5f5", border: "1px solid #ddd", fontWeight: 700 }}
                      onClick={() => setQuickViewProduct(prod)}
                      title="Quick View Gallery"
                    >
                      Quick View
                    </button>
                    <Link
                      href={`/product/${prod.slug}`}
                      style={{
                        padding: "12px 16px",
                        background: "#fff",
                        border: "1.5px solid #111",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#111",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        whiteSpace: "nowrap",
                        transition: "all 0.2s",
                      }}
                      title="View full product details"
                    >
                      <FiArrowUpRight size={14} /> Details
                    </Link>
                  </div>

                  {prod.oneLine && <p className="prod-oneline" style={{ marginTop: 14 }}>"{prod.oneLine}"</p>}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Floating Cart Button */}
      {cartTotalItems > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 999,
            background: "#111111",
            color: "#ffffff",
            padding: "14px 24px",
            borderRadius: 999,
            border: "none",
            boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FiShoppingBag size={18} />
          <span>View Bag</span>
          <span
            style={{
              background: "#f35c27",
              color: "#fff",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {cartTotalItems}
          </span>
        </button>
      )}

      <Footer />
    </div>
  );
}
