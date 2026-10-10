"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import {
  FiSearch,
  FiTruck,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

const STAGES = [
  { key: "CONFIRMED", label: "Confirmed", desc: "Order placed & verified" },
  { key: "PROCESSING", label: "Processing", desc: "Handloom fabric selected" },
  { key: "PACKED", label: "Packed", desc: "Quality checked & packaged" },
  { key: "SHIPPED", label: "Shipped", desc: "Handed to courier partner" },
  { key: "DELIVERED", label: "Delivered", desc: "Package delivered safely" },
];

function getStageIndex(status) {
  const normalized = (status || "").toUpperCase();
  if (normalized === "DELIVERED") return 4;
  if (normalized === "SHIPPED" || normalized === "OUT_FOR_DELIVERY") return 3;
  if (normalized === "PACKED") return 2;
  if (normalized === "PROCESSING") return 1;
  return 0; // CONFIRMED or PLACED
}

export default function TrackOrderPage() {
  const { orders = [], requestReturn } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("Size fit issue");
  const [returnFeedback, setReturnFeedback] = useState("");

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setSearchError("");
    const term = searchTerm.trim().toLowerCase();

    // 1. Check in client store
    let found = orders.find(
      (o) =>
        o.orderNumber?.toLowerCase() === term ||
        o.orderNumber?.toLowerCase() === `sum-${term}` ||
        o.customer?.email?.toLowerCase() === term ||
        o.trackingNumber?.toLowerCase() === term,
    );

    // 2. Check in localStorage directly
    if (!found) {
      try {
        const local = localStorage.getItem("sum_orders");
        if (local) {
          const parsed = JSON.parse(local);
          found = (Array.isArray(parsed) ? parsed : []).find(
            (o) =>
              o.orderNumber?.toLowerCase() === term ||
              o.orderNumber?.toLowerCase() === `sum-${term}` ||
              o.customer?.email?.toLowerCase() === term ||
              o.trackingNumber?.toLowerCase() === term,
          );
        }
      } catch {}
    }

    // 3. If still not found, fetch from backend API
    if (!found) {
      try {
        const orderQuery = term.startsWith("sum-") ? term.toUpperCase() : `SUM-${term.toUpperCase()}`;
        const res = await fetch(`/api/orders/${encodeURIComponent(orderQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order) {
            found = data.order;
          }
        }
      } catch (err) {
        console.warn("Track order API lookup error:", err);
      }
    }

    setIsLoading(false);

    trackEvent("track_order_search", {
      search_term: searchTerm,
      found: Boolean(found),
      order_number: found?.orderNumber || undefined,
    });

    if (found) {
      setActiveOrder(found);
      setSearchError("");
    } else {
      setActiveOrder(null);
      setSearchError(
        `No shipment found matching "${searchTerm}". Please verify your Order Reference (e.g. SUM-28211) or email address.`
      );
    }
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!activeOrder) return;

    trackEvent("return_exchange_request", {
      order_number: activeOrder.orderNumber,
      return_reason: returnReason,
      item_count: activeOrder.items?.length,
    });

    const res = requestReturn(activeOrder.orderNumber, returnReason);
    setReturnFeedback(res.message);
    setTimeout(() => {
      setReturnModalOpen(false);
      setReturnFeedback("");
    }, 2000);
  };

  const currentStageIndex = activeOrder
    ? getStageIndex(activeOrder.orderStatus)
    : 0;

  return (
    <>
      <Navbar />
      <style>{`
        .track-order-wrapper {
          background: #fbfbfc;
          min-height: 100vh;
          padding: 130px 24px 80px;
          color: #111827;
        }
        .track-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }
        .track-stage-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 2;
          width: 20%;
          padding: 0 2px;
        }
        .track-stage-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .track-stage-label {
          font-size: 12px;
          line-height: 1.25;
          word-break: break-word;
          text-align: center;
        }
        .track-actions-wrap {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        @media (max-width: 640px) {
          .track-order-wrapper {
            padding: 95px 14px 60px !important;
          }
          .track-card {
            padding: 20px 14px !important;
            border-radius: 14px !important;
          }
          .track-stage-circle {
            width: 28px !important;
            height: 28px !important;
            font-size: 11px !important;
            margin-bottom: 6px !important;
          }
          .track-stage-label {
            font-size: 9.5px !important;
            letter-spacing: -0.2px !important;
            font-weight: 700 !important;
          }
          .track-actions-wrap {
            width: 100% !important;
            flex-direction: row !important;
          }
          .track-actions-wrap > * {
            flex: 1 !important;
            justify-content: center !important;
            text-align: center !important;
            padding: 10px 10px !important;
            font-size: 12px !important;
            min-width: 0 !important;
          }
        }
      `}</style>

      <div className="track-order-wrapper">
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: "#f35c27",
              }}
            >
              Live Fulfillment Center
            </span>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2rem)",
                fontWeight: 800,
                margin: "6px 0 10px",
                letterSpacing: "-0.5px",
              }}
            >
              Track Your Order & Delivery
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
              Enter your Order Reference (e.g. <strong>SUM-28211</strong>) or email address to view live courier transit milestones.
            </p>
          </div>

          {/* Search Input Box */}
          <form
            onSubmit={handleSearch}
            style={{
              background: "#ffffff",
              padding: "8px 12px",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: searchError ? 16 : 36,
              maxWidth: 640,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: 4,
                color: "#9ca3af",
                flexShrink: 0,
              }}
            >
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Enter Order # or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#111827",
                background: "transparent",
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: "#111111",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
                transition: "background 0.2s",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Searching..." : "Track Order"}
            </button>
          </form>

          {searchError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fee2e2",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: 10,
                fontSize: 13,
                maxWidth: 640,
                margin: "0 auto 30px",
                textAlign: "center",
              }}
            >
              {searchError}
            </div>
          )}

          {/* Active Order Tracker Card */}
          {activeOrder ? (
            <div className="track-card">
              {/* Top Order Metadata Banner */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #f3f4f6",
                  paddingBottom: 20,
                  marginBottom: 28,
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Order Reference
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#111827",
                      marginTop: 2,
                    }}
                  >
                    #{activeOrder.orderNumber}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div
                    style={{
                      background: "#ecfdf5",
                      color: "#065f46",
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Payment: {activeOrder.paymentStatus || "PAID"}
                  </div>
                  <div
                    style={{
                      background: "#fdf8f6",
                      color: "#9a3412",
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Status: {activeOrder.orderStatus}
                  </div>
                </div>
              </div>

              {/* Carrier & AWB Bar */}
              <div
                style={{
                  background: "#f9fafb",
                  padding: "16px 20px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FiTruck size={20} color="#111827" />
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      Carrier: {activeOrder.carrier || "BlueDart Express"}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      AWB / Tracking Number:{" "}
                      <strong>
                        {activeOrder.trackingNumber || "BD98214710IN"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div
                  style={{ fontSize: 13, color: "#059669", fontWeight: 700 }}
                >
                  Estimated Delivery:{" "}
                  {activeOrder.estimatedDelivery || "3-5 business days"}
                </div>
              </div>

              {/* ─── VISUAL STAGE TIMELINE STEPPER ─── */}
              <div style={{ marginBottom: 36 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  {/* Progress Line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 18,
                      left: "5%",
                      right: "5%",
                      height: 3,
                      background: "#e5e7eb",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: "#15803d",
                        width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%`,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>

                  {/* Stage Nodes */}
                  {STAGES.map((stage, idx) => {
                    const isPassed = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className="track-stage-node"
                      >
                        <div
                          className="track-stage-circle"
                          style={{
                            background: isPassed ? "#15803d" : "#ffffff",
                            border: `2px solid ${isPassed ? "#15803d" : "#d1d5db"}`,
                            color: isPassed ? "#ffffff" : "#6b7280",
                            boxShadow: isCurrent
                              ? "0 0 0 4px rgba(21, 128, 61, 0.2)"
                              : "none",
                          }}
                        >
                          {isPassed ? "✓" : idx + 1}
                        </div>
                        <div
                          className="track-stage-label"
                          style={{
                            fontWeight: isCurrent ? 800 : 600,
                            color: isPassed ? "#111827" : "#9ca3af",
                          }}
                        >
                          {stage.label}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#6b7280",
                            marginTop: 2,
                            display: "none",
                          }}
                        >
                          {stage.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in Order */}
              <div
                style={{
                  borderTop: "1px solid #f3f4f6",
                  paddingTop: 24,
                  marginBottom: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#6b7280",
                    marginBottom: 14,
                  }}
                >
                  Ordered Garments ({activeOrder.items?.length || 1})
                </h3>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {(activeOrder.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: "#fafafa",
                        borderRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <img
                          src={item.image || "/assets/img/14.png"}
                          alt={item.title || item.name}
                          style={{
                            width: 44,
                            height: 54,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                        <div>
                          <strong style={{ fontSize: 14, color: "#111827" }}>
                            {item.title || item.name}
                          </strong>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            Size: <strong>{item.selectedSize || "M"}</strong>{" "}
                            {item.selectedColor
                              ? `| ${item.selectedColor}`
                              : ""}{" "}
                            × {item.quantity || 1}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        ₹
                        {(
                          (item.price || 0) * (item.quantity || 1)
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Destination & Action Row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  borderTop: "1px solid #f3f4f6",
                  paddingTop: 20,
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#6b7280",
                    }}
                  >
                    Shipping Destination
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
                    <strong>{activeOrder.customer?.name}</strong>
                    <br />
                    {activeOrder.shippingAddress?.street}
                    <br />
                    {activeOrder.shippingAddress?.city},{" "}
                    {activeOrder.shippingAddress?.state} -{" "}
                    {activeOrder.shippingAddress?.pincode}
                  </div>
                </div>

                <div className="track-actions-wrap">
                  <button
                    onClick={() => setReturnModalOpen(true)}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #d1d5db",
                      color: "#374151",
                      padding: "10px 16px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <FiRefreshCw size={14} />
                    <span>Return / Exchange</span>
                  </button>

                  <Link
                    href="/shop"
                    style={{
                      background: "#111111",
                      color: "#ffffff",
                      padding: "10px 18px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <span>Shop More</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: "48px 24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#fdf3eb",
                  color: "#f35c27",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <FiPackage size={26} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px", color: "#111827" }}>
                Ready to Track Your Handcrafted Khadi Shipment
              </h3>
              <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 460, margin: "0 auto 24px", lineHeight: 1.6 }}>
                Enter your Order Reference from your order confirmation (e.g. <strong>SUM-28211</strong>) or your registered checkout email address to view live courier transit milestones.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href="/shop"
                  style={{
                    background: "#111111",
                    color: "#ffffff",
                    padding: "10px 20px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Explore Collection
                </Link>
                <Link
                  href="/contact"
                  style={{
                    background: "#f3f4f6",
                    color: "#374151",
                    padding: "10px 20px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── RETURN / EXCHANGE MODAL ─── */}
      {returnModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
            zIndex: 10005,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setReturnModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#ffffff",
              borderRadius: 14,
              padding: 28,
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800 }}>
              Initiate Return / Exchange
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6b7280" }}>
              Orders are eligible for hassle-free returns or size exchanges
              within 7 days of delivery.
            </p>

            {returnFeedback ? (
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#065f46",
                  padding: 14,
                  borderRadius: 8,
                  fontSize: 14,
                }}
              >
                {returnFeedback}
              </div>
            ) : (
              <form onSubmit={handleReturnSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    Reason for Return / Exchange
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      fontSize: 14,
                      outline: "none",
                    }}
                  >
                    <option value="Size fit issue - Need smaller size">
                      Size fit issue - Need smaller size
                    </option>
                    <option value="Size fit issue - Need larger size">
                      Size fit issue - Need larger size
                    </option>
                    <option value="Fabric texture not as expected">
                      Fabric texture not as expected
                    </option>
                    <option value="Defective / damaged item received">
                      Defective / damaged item received
                    </option>
                    <option value="Other">Other reasons</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => setReturnModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      background: "#ffffff",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 6,
                      border: "none",
                      background: "#111111",
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
