"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  const [activeOrder, setActiveOrder] = useState(orders[0] || null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("Size fit issue");
  const [returnFeedback, setReturnFeedback] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber?.toLowerCase() === term ||
        o.orderNumber?.toLowerCase() === `sum-${term}` ||
        o.customer?.email?.toLowerCase() === term ||
        o.trackingNumber?.toLowerCase() === term,
    );

    trackEvent("track_order_search", {
      search_term: searchTerm,
      found: Boolean(found),
      order_number: found?.orderNumber || undefined,
    });

    if (found) {
      setActiveOrder(found);
    } else {
      alert(
        `No order found matching "${searchTerm}". Please check your order reference (e.g. SUM-98214) or email.`,
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
      <div
        style={{
          background: "#fbfbfc",
          minHeight: "100vh",
          padding: "140px 24px 80px",
          color: "#111827",
        }}
      >
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
                fontSize: 32,
                fontWeight: 800,
                margin: "6px 0 10px",
                letterSpacing: "-0.5px",
              }}
            >
              Track Your Order & Delivery
            </h1>
            <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>
              Enter your Order Reference (e.g. <strong>SUM-98214</strong>) or
              email address to view real-time shipping milestones.
            </p>
          </div>

          {/* Search Input Box */}
          <form
            onSubmit={handleSearch}
            style={{
              background: "#ffffff",
              padding: "10px 14px",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 36,
              maxWidth: 640,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: 6,
                color: "#9ca3af",
                flexShrink: 0,
              }}
            >
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Enter Order # (e.g. SUM-98214) or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                fontSize: 15,
                color: "#111827",
                background: "transparent",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#111111",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "10px 22px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
            >
              Track Order
            </button>
          </form>

          {/* Active Order Tracker Card */}
          {activeOrder ? (
            <div
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: "32px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              }}
            >
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
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          zIndex: 2,
                          width: "18%",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: isPassed ? "#15803d" : "#ffffff",
                            border: `2px solid ${isPassed ? "#15803d" : "#d1d5db"}`,
                            color: isPassed ? "#ffffff" : "#6b7280",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 14,
                            marginBottom: 8,
                            boxShadow: isCurrent
                              ? "0 0 0 4px rgba(21, 128, 61, 0.2)"
                              : "none",
                          }}
                        >
                          {isPassed ? "✓" : idx + 1}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
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

                <div style={{ display: "flex", gap: 10 }}>
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
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FiRefreshCw size={14} />
                    <span>Return / Exchange</span>
                  </button>

                  <Link
                    href="/collection"
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
                      gap: 6,
                    }}
                  >
                    <span>Shop More</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p>No order loaded. Please enter your order reference above.</p>
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

      <Footer />
    </>
  );
}
