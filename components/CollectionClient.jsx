"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/collection.css";
import { useStore } from "@/context/StoreContext";
import { FiShoppingBag, FiFilter, FiCheck, FiX, FiSliders, FiArrowUpRight, FiPlus, FiMinus, FiEye } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";
import IndianArchBadge from "@/components/IndianArchBadge";

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
    <div className="slider-container" style={{ width: "100%", height: "100%", aspectRatio: "3 / 4" }}>
      <div 
        className="slider-track" 
        style={{ transform: `translateX(-${currentIndex * 100}%)`, height: "100%" }}
      >
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={`${altText} ${idx + 1}`} loading="lazy" style={{ width: "100%", height: "100%", aspectRatio: "3 / 4", objectFit: "cover", objectPosition: "top center" }} />
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
      <section className="col-hero" style={{ paddingBottom: "24px", textAlign: "center", maxWidth: 840, margin: "28px auto 36px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <IndianArchBadge>Handcrafted Everyday Silhouettes</IndianArchBadge>
        </div>
        <h1 className="prod-fade" style={{ fontFamily: "serif", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 600, color: "#2C2016", marginBottom: 16 }}>
          Clothes you&apos;ll want to wear again.
        </h1>
        <p className="prod-fade" style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "#5C4A3E", maxWidth: 640, margin: "0 auto 24px" }}>
          Easy pieces. Thoughtful details. Handwoven beginnings.
          <br />
          Made for everyday life however yours happens to look.
        </p>
        
        <div className="col-details prod-fade" style={{ justifyContent: "center", gap: 20 }}>
          <div className="detail-item"><span>Textile:</span> 100% Handspun Khadi Cotton</div>
          <div className="detail-item"><span>Origin:</span> Madhya Pradesh, India</div>
          <div className="detail-item">
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "#660608",
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
          maxWidth: 1360,
          margin: "0 auto 36px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "#FAF6F0",
            padding: "16px 24px",
            borderRadius: 14,
            boxShadow: "0 4px 20px rgba(44, 32, 22, 0.04)",
            border: "1px solid rgba(44, 32, 22, 0.12)",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Category Filter Pills: ALL PIECES, TOPS, SHIRTS, DRESSES, SETS */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a7a6c", marginRight: 4 }}>
              Categories:
            </span>
            {["ALL PIECES", "TOPS", "SHIRTS", "DRESSES", "SETS"].map((cat) => {
              const isSelected = (cat === "ALL PIECES" && (selectedCategory === "ALL" || selectedCategory === "ALL PIECES")) || selectedCategory.toUpperCase() === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === "ALL PIECES" ? "ALL" : cat)}
                  style={{
                    border: isSelected ? "1.5px solid #660608" : "1px solid rgba(44, 32, 22, 0.18)",
                    background: isSelected ? "#660608" : "#FAF6F0",
                    color: isSelected ? "#FAF6F0" : "#4A3B30",
                    padding: "8px 18px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Optional Filters: SIZE, COLOUR, PRICE */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Size Filter Dropdown */}
            <select
              value={selectedSizeFilter}
              onChange={(e) => setSelectedSizeFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(44, 32, 22, 0.2)",
                fontSize: 12,
                fontWeight: 700,
                color: "#2C2016",
                outline: "none",
                background: "#FAF6F0",
                cursor: "pointer",
              }}
              aria-label="Filter by size"
            >
              <option value="ALL">Size: All</option>
              <option value="XS">Size XS</option>
              <option value="S">Size S</option>
              <option value="M">Size M</option>
              <option value="L">Size L</option>
              <option value="XL">Size XL</option>
            </select>

            {/* Colour Filter Dropdown */}
            <select
              value={selectedColorFilter}
              onChange={(e) => setSelectedColorFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(44, 32, 22, 0.2)",
                fontSize: 12,
                fontWeight: 700,
                color: "#2C2016",
                outline: "none",
                background: "#FAF6F0",
                cursor: "pointer",
              }}
              aria-label="Filter by colour"
            >
              <option value="ALL">Colour: All</option>
              <option value="Khadi">Natural Khadi</option>
              <option value="Green">Green</option>
              <option value="Noir">Noir / Black</option>
              <option value="Rust">Rust</option>
              <option value="Blue">Soft Blue</option>
              <option value="Purple">Purple</option>
              <option value="Orange">Orange</option>
            </select>

            {/* Price Filter Dropdown */}
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(44, 32, 22, 0.2)",
                fontSize: 12,
                fontWeight: 700,
                color: "#2C2016",
                outline: "none",
                background: "#FAF6F0",
                cursor: "pointer",
              }}
              aria-label="Filter by price"
            >
              <option value={5000}>Price: All</option>
              <option value={1700}>Under ₹1,700</option>
              <option value={1900}>Under ₹1,900</option>
              <option value={2200}>Under ₹2,200</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(44, 32, 22, 0.2)",
                fontSize: 12,
                fontWeight: 700,
                color: "#2C2016",
                outline: "none",
                background: "#FAF6F0",
                cursor: "pointer",
              }}
              aria-label="Sort products"
            >
              <option value="FEATURED">Sort: Featured</option>
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
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Product Count Banner */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#6b7280" }}>
          <div>
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "piece" : "pieces"}
          </div>
          <div style={{ fontSize: 12 }}>
            Free shipping on orders above ₹1,999
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS GRID ─── */}
      <section className="prod-grid" style={{ maxWidth: 1360, margin: "0 auto 60px", padding: "0 24px 100px" }}>
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

            return (
              <div
                key={prod.id}
                className="prod-card prod-fade"
                style={{
                  background: "#FAF6F0",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(44, 32, 22, 0.12)",
                  boxShadow: "0 6px 24px rgba(44, 32, 22, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(44, 32, 22, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(44, 32, 22, 0.05)";
                }}
              >
                <div 
                  className="prod-img-wrapper" 
                  style={{ cursor: "pointer", position: "relative", width: "100%", aspectRatio: "3 / 4", overflow: "hidden", background: "#EBE5D9" }}
                >
                  <Link href={`/product/${prod.slug}`} style={{ display: "block", width: "100%", height: "100%", aspectRatio: "3 / 4" }}>
                    <ImageSlider images={prod.images} altText={prod.name} />
                  </Link>

                  {hasDiscount && (
                    <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
                      <span
                        style={{
                          background: "#660608",
                          color: "#FAF6F0",
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "4px 9px",
                          borderRadius: 999,
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 8px rgba(102, 6, 8, 0.3)",
                        }}
                      >
                        SALE
                      </span>
                    </div>
                  )}

                  {/* Quick View Floating Eye Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(prod);
                    }}
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      background: "rgba(250, 246, 240, 0.94)",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                      border: "1px solid rgba(44, 32, 22, 0.15)",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2C2016",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(44, 32, 22, 0.12)",
                      zIndex: 10,
                      transition: "transform 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#660608";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(250, 246, 240, 0.94)";
                      e.currentTarget.style.color = "#2C2016";
                    }}
                    title="Quick Preview"
                    aria-label="Quick Preview"
                  >
                    <FiEye size={16} />
                  </button>
                </div>

                {/* Details */}
                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#8C7868" }}>
                      {prod.category}
                    </div>
                    <Link href={`/product/${prod.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#2C2016", margin: "4px 0 2px" }}>
                        {prod.name}
                      </h3>
                    </Link>
                    <p style={{ fontSize: 13, color: "#7A695C", fontStyle: "italic", margin: "0 0 12px" }}>
                      &ldquo;{prod.personality || prod.hook || prod.subtitle}&rdquo;
                    </p>

                    {/* Price in Brand Dark Brown */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#2C2016" }}>
                        ₹{displayPrice.toLocaleString("en-IN")}
                      </span>
                      {hasDiscount && (
                        <span style={{ fontSize: 13, color: "#9E8E80", textDecoration: "line-through" }}>
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
                            onClick={() => handleSizeChange(prod.id, sz)}
                            style={{
                              padding: "4px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              borderRadius: 6,
                              border: isSel ? "1.5px solid #2C2016" : "1px solid rgba(44, 32, 22, 0.2)",
                              background: isSel ? "#2C2016" : "#FAF6F0",
                              color: isSel ? "#FAF6F0" : "#4A3B30",
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

                  {/* Primary Action Button — Add to Bag / Quantity Counter */}
                  <div style={{ marginTop: "auto" }}>
                    {(() => {
                      const matchingCartItem = cart.find(
                        (item) => item.id === prod.id && item.selectedSize === currentSize
                      );
                      const quantityInCart = matchingCartItem ? matchingCartItem.quantity : 0;

                      if (quantityInCart > 0) {
                        return (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF6F0", border: "1.5px solid #2C2016", borderRadius: 8, padding: "4px 8px" }}>
                            <button
                              onClick={() => updateQuantity(prod.id, quantityInCart - 1, currentSize)}
                              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", cursor: "pointer", color: "#2C2016" }}
                              aria-label="Decrease quantity"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#2C2016" }}>
                              {quantityInCart} in bag
                            </span>
                            <button
                              onClick={() => updateQuantity(prod.id, quantityInCart + 1, currentSize)}
                              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", cursor: "pointer", color: "#2C2016" }}
                              aria-label="Increase quantity"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <button
                          onClick={() => handleAddToCart(prod)}
                          style={{
                            width: "100%",
                            padding: "12px 18px",
                            background: addedFeedback[prod.id] ? "#15803d" : "#2C2016",
                            color: "#FAF6F0",
                            border: "none",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "background 0.2s ease, transform 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!addedFeedback[prod.id]) e.currentTarget.style.background = "#660608";
                          }}
                          onMouseLeave={(e) => {
                            if (!addedFeedback[prod.id]) e.currentTarget.style.background = "#2C2016";
                          }}
                        >
                          <FiShoppingBag size={15} />
                          {addedFeedback[prod.id] ? "Added to Bag ✓" : "Add to Bag"}
                        </button>
                      );
                    })()}
                  </div>
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
    </div>
  );
}
