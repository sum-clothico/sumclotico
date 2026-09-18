"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/styles/collection.css";
import Footer from "./Footer";
import { useStore } from "@/context/StoreContext";
import { FiShoppingBag } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

// Simple Image Slider Component
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
  const { products, addToCart, setQuickViewProduct, setIsCartOpen, cartTotalItems } = useStore();
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".prod-fade",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".prod-grid",
            start: "top 75%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [products]);

  const handleSizeChange = (prodId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [prodId]: size }));
  };

  const handleAddToCart = (prod) => {
    const size = selectedSizes[prod.id] || prod.sizes?.[0] || "M";
    const color = prod.colors?.[0] || "";
    addToCart(prod, size, color, 1);
  };

  return (
    <div ref={containerRef} className="collection-page">
      <div className="os-noise" />

      {/* Hero */}
      <section className="col-hero">
        <h1 className="prod-fade">Our Collection</h1>
        <p className="prod-fade">Pieces designed for how you live today.</p>
        
        <div className="col-details prod-fade">
          <div className="detail-item"><span>Fabric:</span> 100% Khadi</div>
          <div className="detail-item"><span>Fit:</span> Relaxed</div>
          <div className="detail-item"><span>Care:</span> Gentle wash</div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="prod-grid">
        {products.map((prod) => {
          const currentSize = selectedSizes[prod.id] || prod.sizes?.[0] || "M";
          const displayPrice = prod.salePrice || prod.price;

          return (
            <div key={prod.id} className="prod-card prod-fade">
              <div 
                className="prod-img-wrapper" 
                style={{ cursor: "pointer" }}
                onClick={() => setQuickViewProduct(prod)}
              >
                <ImageSlider images={prod.images} altText={prod.name} />
              </div>

              <div className="prod-info">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span className="prod-sub">{prod.subtitle || prod.category}</span>
                    <h2>{prod.name}</h2>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#111111" }}>
                      ₹{displayPrice.toLocaleString("en-IN")}
                    </span>
                    {prod.salePrice && prod.salePrice < prod.price && (
                      <div style={{ fontSize: 13, color: "#888888", textDecoration: "line-through" }}>
                        ₹{prod.price.toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>
                </div>

                <p className="prod-hook">{prod.hook || prod.description?.slice(0, 70)}</p>
                <p className="prod-desc">{prod.description}</p>
                
                {prod.why && prod.why.length > 0 && (
                  <div className="prod-why">
                    <h4>Why you'll love it:</h4>
                    <ul>
                      {prod.why.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Size Selection Pill Buttons */}
                <div style={{ margin: "16px 0 12px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#666" }}>
                    Choose Size:
                  </span>
                  <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                    {(prod.sizes || ["XS", "S", "M", "L", "XL"]).map((sz) => (
                      <button
                        key={sz}
                        className={`quickview-size-pill ${currentSize === sz ? "selected" : ""}`}
                        onClick={() => handleSizeChange(prod.id, sz)}
                        style={{ padding: "4px 10px", fontSize: 12 }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Bag Button */}
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button
                    className="cart-checkout-btn"
                    style={{ margin: 0, flex: 1, padding: "12px 18px", fontSize: 13 }}
                    onClick={() => handleAddToCart(prod)}
                  >
                    Add to Bag
                  </button>
                  <button
                    className="quickview-size-pill"
                    style={{ padding: "12px 14px", background: "#f5f5f5", border: "1px solid #ddd" }}
                    onClick={() => setQuickViewProduct(prod)}
                    title="Quick Details"
                  >
                    Quick View
                  </button>
                </div>

                {prod.oneLine && <p className="prod-oneline" style={{ marginTop: 14 }}>"{prod.oneLine}"</p>}
              </div>
            </div>
          );
        })}
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
