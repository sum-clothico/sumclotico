"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { FiChevronDown, FiChevronUp, FiHelpCircle } from "react-icons/fi";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

const FAQS = [
  {
    category: "Orders & Payments",
    items: [
      {
        q: "What payment methods are supported?",
        a: "We accept all major payment methods via Cashfree, including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit cards (Visa, MasterCard, RuPay), Net Banking across 50+ Indian banks, and select digital wallets.",
      },
      {
        q: "Can I apply discount coupons during checkout?",
        a: "Yes! You can enter promo codes like KHADI10 or FIRST500 in either your Cart Drawer or at the Checkout summary page to get instant discounts.",
      },
      {
        q: "Will I receive an order confirmation email?",
        a: "Yes. As soon as your payment is processed, an automated confirmation receipt with your full order breakdown and invoice is dispatched via our Resend transactional service to your registered email.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        q: "How long does standard delivery take?",
        a: "Orders are processed within 24-48 business hours. Delivery across metro cities (Bengaluru, Delhi, Mumbai, Kolkata, Hyderabad, Chennai) takes 3-4 business days. Other regions typically arrive in 4-6 business days via BlueDart and Delhivery.",
      },
      {
        q: "Is standard shipping free?",
        a: "Yes, we provide FREE standard express shipping across India on all orders of ₹1,999 and above. For orders under ₹1,999, a flat delivery fee of ₹99 is applied.",
      },
      {
        q: "How do I track my shipment?",
        a: "You can track your order anytime on our dedicated /track-order page by simply typing your Order Reference number (e.g. SUM-98214) or registered email.",
      },
    ],
  },
  {
    category: "Sizing, Fabric & Care",
    items: [
      {
        q: "What is special about Sum Clothico's Khadi fabric?",
        a: "Our garments are woven from 100% handspun organic cotton fibers on traditional handlooms. Khadi possesses natural micro-ventilation, making it cool and breathable in summer while retaining warmth in cooler weather.",
      },
      {
        q: "How should I care for my Khadi garments?",
        a: "We recommend gentle machine wash in cold water with mild, plant-based detergent, or hand washing. Line dry in shade to preserve the artisanal low-impact dyes.",
      },
      {
        q: "How do I know my size?",
        a: "Our silhouettes follow a relaxed standard fit designed for effortless ease. Click on 'Size Guide' on any product page or visit /size-guide for full bust, waist, hip, and length measurements in both inches and centimeters.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return & exchange policy?",
        a: "We offer a 7-day hassle-free return and exchange window from the date of delivery. Items must be unworn, unwashed, with all original tags attached.",
      },
      {
        q: "How do I initiate a return or exchange?",
        a: "Navigate to /track-order, lookup your order, and click the 'Return / Exchange' button to submit your request. Our support team arranges reverse pickup within 48 hours.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    const willOpen = !openItems[key];
    if (willOpen) {
      trackEvent("view_faq_answer", {
        category: FAQS[catIdx]?.category,
        question: FAQS[catIdx]?.items[itemIdx]?.q,
      });
    }
    setOpenItems((prev) => ({ ...prev, [key]: willOpen }));
  };

  return (
    <>
      <Navbar />
      <div style={{ background: "#fbfbfc", minHeight: "100vh", padding: "140px 24px 80px", color: "#111827" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#f35c27" }}>
              Help Center & Support
            </span>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: "8px 0 12px", letterSpacing: "-0.5px" }}>
              Frequently Asked Questions
            </h1>
            <p style={{ color: "#6b7280", fontSize: 16, margin: 0 }}>
              Find quick answers to common questions about our handcrafted garments, shipping, sizing, and returns.
            </p>
          </div>

          {/* FAQs Categorized Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {FAQS.map((cat, catIdx) => (
              <div
                key={cat.category}
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  padding: "28px 32px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 18px", borderBottom: "1px solid #f3f4f6", paddingBottom: 12 }}>
                  {cat.category}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {cat.items.map((item, itemIdx) => {
                    const isOpen = openItems[`${catIdx}-${itemIdx}`];
                    return (
                      <div
                        key={item.q}
                        style={{
                          border: "1px solid #f0f0f0",
                          borderRadius: 10,
                          overflow: "hidden",
                          background: isOpen ? "#fbfbfc" : "#ffffff",
                          transition: "background 0.2s",
                        }}
                      >
                        <button
                          onClick={() => toggleItem(catIdx, itemIdx)}
                          style={{
                            width: "100%",
                            padding: "16px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "none",
                            border: "none",
                            textAlign: "left",
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#111827",
                            cursor: "pointer",
                          }}
                        >
                          <span>{item.q}</span>
                          {isOpen ? <FiChevronUp size={18} color="#f35c27" /> : <FiChevronDown size={18} color="#6b7280" />}
                        </button>

                        {isOpen && (
                          <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#4b5563", lineHeight: 1.65, borderTop: "1px solid #f9fafb" }}>
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Need more help banner */}
          <div
            style={{
              marginTop: 48,
              textAlign: "center",
              padding: "32px",
              background: "#111111",
              borderRadius: 16,
              color: "#ffffff",
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Still have questions?</h3>
            <p style={{ color: "#9ca3af", fontSize: 14, margin: "0 0 20px" }}>
              Our customer care and textile styling team are here to assist you.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                background: "#f35c27",
                color: "#ffffff",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Contact Support Team →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
