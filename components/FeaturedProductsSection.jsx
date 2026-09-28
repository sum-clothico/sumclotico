"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/context/StoreContext";
import { FiShoppingBag, FiArrowRight, FiEye, FiPlus, FiMinus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";

import IndianArchBadge from "@/components/IndianArchBadge";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProductsSection() {
  const sectionRef = useRef(null);
  const { products = [], setQuickViewProduct, addToCart, cart = [], updateQuantity } = useStore();
  const [selectedSizes, setSelectedSizes] = useState({});
  const sliderRef = useRef(null);

  // Animate Heading Words
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = sectionRef.current?.querySelectorAll(".fp-heading-word");
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { y: "125%", rotate: 2.5, opacity: 0 },
          {
            y: "0%",
            rotate: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.06,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );
      }

      const desc = sectionRef.current?.querySelector(".fp-desc");
      if (desc) {
        gsap.fromTo(
          desc,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Filter products chosen to be featured by the admin (min 2, max 8)
  const adminFeatured = products.filter((p) => p.isFeatured);
  const featured = adminFeatured.length > 0 ? adminFeatured : products.slice(0, 6);

  const [canScroll, setCanScroll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check if products overflow the container and update scroll button states
  React.useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const checkScrollState = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth + 6;
      setCanScroll(hasOverflow);
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    };

    checkScrollState();

    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        checkScrollState();
      });
      ro.observe(el);
    }

    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
      if (ro) ro.disconnect();
    };
  }, [featured]);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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

  const fpWords = ["Clothes", "that", "keep", "up", "with", "you."];

  return (
    <section
      ref={sectionRef}
      id="featured-collection"
      style={{
        background: "var(--bg-color, #EDE8DC)",
        padding: "90px 24px 105px",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(44, 32, 22, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section Header — Center Aligned with Indian Arch Sub-Header */}
        <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 40px" }}>
          <IndianArchBadge style={{ marginBottom: "18px" }}>
            Made for Real Days
          </IndianArchBadge>

          <h2
            style={{
              fontSize: "clamp(28px, 4.2vw, 42px)",
              fontWeight: 800,
              color: "#2C2016", // Warm brand brown from swatch
              letterSpacing: "-0.5px",
              margin: "0 0 14px",
              lineHeight: 1.2,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.26em",
            }}
          >
            {fpWords.map((word, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "top",
                  paddingBottom: "4px",
                }}
              >
                <span
                  className="fp-heading-word"
                  style={{ display: "inline-block", transformOrigin: "bottom left" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p
            className="fp-desc"
            style={{
              color: "#5C4A3E",
              fontSize: "15px",
              margin: "0 auto 8px",
              maxWidth: 680,
              lineHeight: 1.65,
            }}
          >
            For mornings that start too early. Workdays that run too long. Last-minute plans. Slow Sundays. Train journeys. Coffee runs. And all the ordinary, beautiful things in between.
          </p>

          {/* Slider Prev / Next Arrows — ONLY SHOWN IF CONTENT ACTUALLY OVERFLOWS */}
          {canScroll && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => scrollSlider("left")}
                disabled={!canScrollLeft}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: canScrollLeft ? "#FAF6F0" : "#EBE5D9",
                  border: "1.5px solid rgba(44, 32, 22, 0.2)",
                  color: canScrollLeft ? "#2C2016" : "#A69888",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: canScrollLeft ? "pointer" : "not-allowed",
                  boxShadow: canScrollLeft ? "0 2px 10px rgba(44, 32, 22, 0.06)" : "none",
                  opacity: canScrollLeft ? 1 : 0.45,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (canScrollLeft) {
                    e.currentTarget.style.background = "#660608";
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "#660608";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canScrollLeft) {
                    e.currentTarget.style.background = "#FAF6F0";
                    e.currentTarget.style.color = "#2C2016";
                    e.currentTarget.style.borderColor = "rgba(44, 32, 22, 0.2)";
                  }
                }}
                aria-label="Previous products"
                title="Previous products"
              >
                <FiChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => scrollSlider("right")}
                disabled={!canScrollRight}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: canScrollRight ? "#660608" : "#EBE5D9",
                  border: `1.5px solid ${canScrollRight ? "#660608" : "rgba(44, 32, 22, 0.15)"}`,
                  color: canScrollRight ? "#ffffff" : "#A69888",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: canScrollRight ? "pointer" : "not-allowed",
                  boxShadow: canScrollRight ? "0 4px 14px rgba(102, 6, 8, 0.25)" : "none",
                  opacity: canScrollRight ? 1 : 0.45,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (canScrollRight) {
                    e.currentTarget.style.background = "#4d0406";
                    e.currentTarget.style.borderColor = "#4d0406";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canScrollRight) {
                    e.currentTarget.style.background = "#660608";
                    e.currentTarget.style.borderColor = "#660608";
                  }
                }}
                aria-label="Next products"
                title="Next products"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Product Slider — Locked strictly to a single row without wrapping */}
        <div
          ref={sliderRef}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: canScroll ? "flex-start" : (featured.length <= 3 ? "center" : "flex-start"),
            gap: 24,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 24,
            paddingTop: 8,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
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
                  flex: canScroll ? "0 0 290px" : (featured.length <= 3 ? "0 1 340px" : "0 0 290px"),
                  maxWidth: canScroll ? 290 : 360,
                  minWidth: 260,
                  scrollSnapAlign: "start",
                  background: "#FAF6F0", // Warm natural card cream
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
                {/* Image Stage — Portrait 3:4 */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3 / 4",
                    width: "100%",
                    background: "#EBE5D9",
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
                      objectPosition: "top center",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />

                  {/* Top Sale Badge in #660608 */}
                  {hasDiscount && (
                    <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
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
                      background: "rgba(250, 246, 240, 0.94)",
                      backdropFilter: "blur(6px)",
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
                      zIndex: 2,
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
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#8C7868" }}>
                      {prod.category}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#2C2016", margin: "4px 0 2px" }}>
                      {prod.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "#7A695C", fontStyle: "italic", margin: "0 0 12px" }}>
                      &ldquo;{prod.subtitle}&rdquo;
                    </p>

                    {/* Price in Brand Dark Brown */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#2C2016" }}>
                        ₹{effectivePrice.toLocaleString("en-IN")}
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
                            onClick={() => handleSizeSelect(prod.id, sz)}
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

                  {/* Add to Bag or Inline Stepper */}
                  <div>
                    {quantityInCart > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "#2C2016", // Warm brand brown
                          color: "#FAF6F0",
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
                            color: "#FAF6F0",
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
                            background: "#B85741", // Terracotta accent
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
                          background: "#2C2016", // Warm brand brown
                          color: "#FAF6F0",
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
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#B85741")} // Terracotta on hover
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#2C2016")}
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
        <div style={{ marginTop: 44, textAlign: "center" }}>
          <Link
            href="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 38px",
              fontSize: 15,
              fontWeight: 800,
              borderRadius: 999,
              textDecoration: "none",
              background: "#660608", // Accent #660608
              color: "#ffffff",
              boxShadow: "0 8px 24px rgba(102, 6, 8, 0.28)",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.background = "#4d0406";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "#660608";
            }}
          >
            <span>Shop All Pieces</span>
            <FiArrowRight size={17} />
          </Link>
        </div>
      </div>

      {/* Traditional Indian Border Pattern Divider Band (Full-Bleed Across Screen) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "28px",
          backgroundImage: 'url("/assets/footerpattern-accent.png")',
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center",
          backgroundSize: "auto 26px",
          opacity: 0.85,
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden="true"
      />
    </section>
  );
}

