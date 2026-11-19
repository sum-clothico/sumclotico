"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useUser, SignIn } from "@clerk/nextjs";
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
  FiArrowRight,
  FiLock,
  FiShield,
  FiBox,
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

const isMockOrTestOrder = (o) => {
  if (!o) return true;
  const num = (o.orderNumber || o.id || "").toUpperCase();
  const name = (o.customer?.name || "").toLowerCase().trim();
  const street = (o.shippingAddress?.street || "").toLowerCase().trim();
  const city = (o.shippingAddress?.city || "").toLowerCase().trim();
  return (
    ["SUM-98214", "SUM-98215", "SUM-98216", "SUM-98217", "SUM-70908", "ORD-101", "ORD-102"].includes(num) ||
    name === "test" ||
    street === "testtesttest" ||
    city === "cuttack"
  );
};

function TrackOrderContent() {
  const { orders = [], requestReturn, currentUser } = useStore();
  const searchParams = useSearchParams();
  const queryParam = searchParams
    ? searchParams.get("order") || searchParams.get("awb") || searchParams.get("id")
    : null;

  let clerkUser = null;
  let isClerkSignedIn = false;
  let isClerkLoaded = false;
  try {
    const clerk = useUser();
    clerkUser = clerk?.user;
    isClerkSignedIn = !!clerk?.isSignedIn;
    isClerkLoaded = clerk?.isLoaded !== false;
  } catch {}

  const isAuthenticated = isClerkSignedIn || !!currentUser;

  const [searchTerm, setSearchTerm] = useState(queryParam || "");
  const [activeOrder, setActiveOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [backendOrders, setBackendOrders] = useState([]);
  const [isFetchingBackend, setIsFetchingBackend] = useState(true);

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("Size fit issue");
  const [returnFeedback, setReturnFeedback] = useState("");

  const userEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress ||
    currentUser?.email;

  const userPhone =
    clerkUser?.primaryPhoneNumber?.phoneNumber ||
    clerkUser?.phoneNumbers?.[0]?.phoneNumber ||
    currentUser?.phone ||
    "";

  // Sanitize localStorage on mount to purge any old test/mock orders from earlier test sessions
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("sum_orders");
        if (raw) {
          const parsed = JSON.parse(raw);
          const cleaned = (Array.isArray(parsed) ? parsed : []).filter((o) => !isMockOrTestOrder(o));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem("sum_orders", JSON.stringify(cleaned));
          }
        }
      } catch {}
    }
  }, []);

  // Fetch real-time live orders directly from MongoDB backend
  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/checkout/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders) && isMounted) {
            setBackendOrders(data.orders);
          }
        }
      } catch (err) {
        console.warn("Could not load backend orders:", err);
      } finally {
        if (isMounted) setIsFetchingBackend(false);
      }
    };
    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  // Merge client store orders and fresh MongoDB orders (purging any mock/test artifacts)
  const allOrders = useMemo(() => {
    const map = new Map();
    (orders || []).forEach((o) => {
      if (o && o.orderNumber && !isMockOrTestOrder(o)) map.set(o.orderNumber, o);
    });
    (backendOrders || []).forEach((o) => {
      if (o && o.orderNumber && !isMockOrTestOrder(o)) {
        map.set(o.orderNumber, {
          ...map.get(o.orderNumber),
          ...o,
          carrier:
            o.carrier && !o.carrier.toLowerCase().includes("bluedart")
              ? o.carrier
              : "Shiprocket Express",
          trackingNumber:
            o.trackingNumber && !/^BD\d+IN$/i.test(o.trackingNumber)
              ? o.trackingNumber
              : "",
        });
      }
    });
    return Array.from(map.values());
  }, [orders, backendOrders]);

  const cleanUserEmail = (userEmail || "").toLowerCase().trim();
  const cleanUserPhone = String(userPhone).replace(/\D/g, "").slice(-10);

  // All genuine orders belonging strictly to the logged in customer
  const userOrders = useMemo(() => {
    if (!cleanUserEmail && !cleanUserPhone) return [];
    return allOrders.filter((o) => {
      if (!o) return false;
      const oEmail = (o.customer?.email || "").toLowerCase().trim();
      const oPhone = String(o.customer?.phone || "").replace(/\D/g, "").slice(-10);

      const emailMatches = cleanUserEmail && oEmail === cleanUserEmail;
      const phoneMatches =
        cleanUserPhone && cleanUserPhone.length >= 10 && oPhone === cleanUserPhone;
      return emailMatches || phoneMatches;
    });
  }, [allOrders, cleanUserEmail, cleanUserPhone]);

  // Undelivered orders (active in transit / tailoring / packing)
  const undeliveredOrders = useMemo(() => {
    return userOrders.filter((o) => {
      const status = (o.orderStatus || "").toUpperCase().trim();
      return status !== "DELIVERED" && status !== "CANCELLED";
    });
  }, [userOrders]);

  // Delivered orders (completed shipments)
  const deliveredOrders = useMemo(() => {
    return userOrders.filter((o) => {
      const status = (o.orderStatus || "").toUpperCase().trim();
      return status === "DELIVERED";
    });
  }, [userOrders]);

  // Auto-select latest genuine order WITHOUT polluting the search input
  useEffect(() => {
    if (!activeOrder && !searchTerm) {
      if (undeliveredOrders.length > 0) {
        setActiveOrder(undeliveredOrders[0]);
        // Note: We deliberately do NOT call setSearchTerm, keeping the input completely empty
      } else if (deliveredOrders.length > 0) {
        setActiveOrder(deliveredOrders[0]);
        // Note: Keep input empty
      }
    }
  }, [undeliveredOrders, deliveredOrders, activeOrder, searchTerm]);

  const runSearch = async (termToSearch) => {
    if (!termToSearch || !termToSearch.trim()) return;

    setIsLoading(true);
    setSearchError("");
    const rawClean = termToSearch.trim();
    const cleanTerm = rawClean.replace(/^#+/, "").trim().toLowerCase();
    const numericPart = cleanTerm.replace(/^sum[-_]?/i, "");
    const formattedSum = `sum-${numericPart}`;

    const isMatch = (o) => {
      if (!o || isMockOrTestOrder(o)) return false;
      const num = (o.orderNumber || "").toLowerCase().trim();
      const numClean = num.replace(/^#+/, "");
      const numDigits = numClean.replace(/^sum[-_]?/i, "");
      const email = (o.customer?.email || "").toLowerCase().trim();
      const tracking = (o.trackingNumber || "").toLowerCase().trim();
      const mongoId = (o._mongoId || o._id || "").toString().toLowerCase().trim();

      return (
        num === cleanTerm ||
        numClean === cleanTerm ||
        num === rawClean.toLowerCase() ||
        numClean === rawClean.toLowerCase() ||
        (numericPart.length >= 3 && numDigits === numericPart) ||
        (numericPart.length >= 3 && (num === formattedSum || numClean === formattedSum)) ||
        email === cleanTerm ||
        (tracking && (tracking === cleanTerm || tracking === rawClean.toLowerCase())) ||
        mongoId === cleanTerm
      );
    };

    // 1. Check in combined store & backend list
    let found = allOrders.find(isMatch);

    // 2. Check in localStorage directly
    if (!found) {
      try {
        const local = localStorage.getItem("sum_orders");
        if (local) {
          const parsed = JSON.parse(local);
          found = (Array.isArray(parsed) ? parsed : []).find(isMatch);
        }
      } catch {}
    }

    // 3. If still not found, fetch single order from backend API
    if (!found) {
      try {
        const primaryQuery = cleanTerm.startsWith("sum-")
          ? cleanTerm.toUpperCase()
          : numericPart.length >= 3
            ? `SUM-${numericPart}`
            : cleanTerm.toUpperCase();

        const res = await fetch(`/api/orders/${encodeURIComponent(primaryQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order && !isMockOrTestOrder(data.order)) {
            found = data.order;
          }
        }
      } catch (err) {
        console.warn("Track order API lookup error:", err);
      }
    }

    setIsLoading(false);

    trackEvent("track_order_search", {
      search_term: termToSearch,
      found: Boolean(found),
      order_number: found?.orderNumber || undefined,
    });

    if (found) {
      setActiveOrder(found);
      setSearchError("");
    } else {
      setActiveOrder(null);
      setSearchError(
        `No shipment found matching "${termToSearch}". Please verify your Order Reference (e.g. SUM-28211) or registered email.`
      );
    }
  };

  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
      runSearch(queryParam);
    }
  }, [queryParam]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    runSearch(searchTerm);
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

  const currentStageIndex = activeOrder ? getStageIndex(activeOrder.orderStatus) : 0;

  // ── Authentication Loading State ──
  if (!isClerkLoaded) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#FAF6F0",
            padding: "120px 20px 60px",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #881A1C",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: 16,
            }}
          />
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Verifying secure customer session...
          </p>
        </div>
      </>
    );
  }

  // ── Mandatory Authentication Gate (Visitors cannot track without sign in) ──
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#FAF6F0",
            padding: "120px 20px 60px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24, maxWidth: 460 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: "#881A1C",
              }}
            >
              Secure Order Tracking Portal
            </span>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                fontWeight: 800,
                margin: "6px 0 8px",
                color: "#111827",
              }}
            >
              Sign In to Track Your Orders
            </h1>
            <p
              style={{
                color: "#6b7280",
                fontSize: 13,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Please sign in with Google or your email OTP to securely view your active shipments in transit, custom tailoring status, and live courier tracking.
            </p>
          </div>

          <div
            className="clerk-crop-wrap"
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <SignIn
              routing="hash"
              signUpUrl="/sign-up?redirect_url=/track-order"
              fallbackRedirectUrl="/track-order"
            />
          </div>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link
              href="/"
              style={{
                fontSize: "13px",
                color: "#6b7280",
                textDecoration: "underline",
              }}
            >
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </>
    );
  }

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
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: "#881A1C",
              }}
            >
              Live Fulfillment Center
            </span>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                fontWeight: 800,
                margin: "6px 0 10px",
                letterSpacing: "-0.5px",
                color: "#111827",
              }}
            >
              Track Your Orders & Shipments
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
              Live transit milestones from our Rewa & Kolkata artisan studios via <strong>Shiprocket Express</strong>.
            </p>
          </div>

          {/* Search Input Box (Clean, never auto-filled) */}
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
              marginBottom: searchError ? 16 : 30,
              maxWidth: 680,
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
              placeholder="Search by Order # (e.g. SUM-28211)"
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
                maxWidth: 680,
                margin: "0 auto 26px",
                textAlign: "center",
              }}
            >
              {searchError}
            </div>
          )}

          {/* ─── ACTIVE UNDELIVERED ORDERS SECTION ─── */}
          {undeliveredOrders.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#f59e0b",
                      boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.2)",
                    }}
                  />
                  <h2
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    Your Active Shipments in Transit ({undeliveredOrders.length})
                  </h2>
                </div>
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                  Select an order to view live timeline
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    undeliveredOrders.length > 1
                      ? "repeat(auto-fit, minmax(280px, 1fr))"
                      : "1fr",
                  gap: 14,
                }}
              >
                {undeliveredOrders.map((ord) => {
                  const isSelected = activeOrder?.orderNumber === ord.orderNumber;
                  const itemCount =
                    (ord.items || []).reduce(
                      (acc, i) => acc + (i.quantity || 1),
                      0
                    ) || 1;

                  return (
                    <div
                      key={ord.orderNumber}
                      onClick={() => {
                        setActiveOrder(ord);
                      }}
                      style={{
                        background: "#ffffff",
                        borderRadius: 14,
                        padding: "16px 18px",
                        border: isSelected
                          ? "2px solid #881A1C"
                          : "1px solid #e5e7eb",
                        boxShadow: isSelected
                          ? "0 8px 24px rgba(136, 26, 28, 0.12)"
                          : "0 2px 8px rgba(0,0,0,0.03)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        position: "relative",
                      }}
                    >
                      {/* Top Row: Order # and Status Badge */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 10,
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#111827",
                              fontWeight: 800,
                            }}
                          >
                            #{ord.orderNumber}
                          </span>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#6b7280",
                              marginTop: 2,
                            }}
                          >
                            {ord.createdAt
                              ? new Date(ord.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Recent"}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: "4px 10px",
                            borderRadius: 999,
                            background:
                              ord.orderStatus === "SHIPPED" ||
                              ord.orderStatus === "OUT_FOR_DELIVERY"
                                ? "#eff6ff"
                                : "#fffbeb",
                            color:
                              ord.orderStatus === "SHIPPED" ||
                              ord.orderStatus === "OUT_FOR_DELIVERY"
                                ? "#1d4ed8"
                                : "#b45309",
                            border:
                              ord.orderStatus === "SHIPPED" ||
                              ord.orderStatus === "OUT_FOR_DELIVERY"
                                ? "1px solid #bfdbfe"
                                : "1px solid #fde68a",
                            textTransform: "uppercase",
                          }}
                        >
                          {ord.orderStatus || "CONFIRMED"}
                        </span>
                      </div>

                      {/* Items Preview */}
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          margin: "12px 0",
                        }}
                      >
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          {(ord.items || []).slice(0, 3).map((item, iIdx) => (
                            <img
                              key={iIdx}
                              src={item.image || "/assets/img/14.png"}
                              alt={item.title || item.name}
                              style={{
                                width: 44,
                                height: 54,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: "1px solid #f3f4f6",
                              }}
                            />
                          ))}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#111827",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {ord.items?.[0]?.title || ord.items?.[0]?.name || "Khadi Piece"}
                            {ord.items?.length > 1
                              ? ` + ${ord.items.length - 1} more`
                              : ""}
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                            ₹{(ord.totalAmount || 0).toLocaleString("en-IN")} • {itemCount} {itemCount === 1 ? "garment" : "garments"}
                          </div>
                        </div>
                      </div>

                      {/* Action & Est delivery footer */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 10,
                          paddingTop: 8,
                          borderTop: "1px dashed #f3f4f6",
                          fontSize: 12,
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        <span style={{ color: "#059669", fontWeight: 600 }}>
                          Est. Delivery: {ord.estimatedDelivery || "10-15 business days"}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {ord.paymentStatus !== "PAID" && (
                            <Link
                              href={`/checkout?retry=${encodeURIComponent(ord.orderNumber)}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                background: "#881A1C",
                                color: "#ffffff",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 800,
                                textDecoration: "none",
                              }}
                            >
                              Retry Payment →
                            </Link>
                          )}
                          <span
                            style={{
                              color: isSelected ? "#881A1C" : "#6b7280",
                              fontWeight: 700,
                            }}
                          >
                            {isSelected ? "Currently Viewing ✓" : "View Timeline →"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── ACTIVE ORDER TRACKER CARD ─── */}
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

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div
                    style={{
                      background: activeOrder.paymentStatus === "PAID" ? "#ecfdf5" : "#fef2f2",
                      color: activeOrder.paymentStatus === "PAID" ? "#065f46" : "#dc2626",
                      border: activeOrder.paymentStatus === "PAID" ? "1px solid #a7f3d0" : "1px solid #fecaca",
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Payment: {activeOrder.paymentStatus || "UNPAID"}
                  </div>
                  {activeOrder.paymentStatus !== "PAID" && (
                    <Link
                      href={`/checkout?retry=${encodeURIComponent(activeOrder.orderNumber)}`}
                      style={{
                        background: "#881A1C",
                        color: "#ffffff",
                        padding: "6px 14px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        boxShadow: "0 2px 6px rgba(136, 26, 28, 0.2)",
                      }}
                    >
                      <span>Retry Payment →</span>
                    </Link>
                  )}
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

              {/* Carrier Bar - WITHOUT ANY AWB PLACEHOLDER */}
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
                      Carrier:{" "}
                      {activeOrder.carrier &&
                      !activeOrder.carrier.toLowerCase().includes("bluedart")
                        ? activeOrder.carrier
                        : "Shiprocket Express"}
                    </div>
                    {activeOrder.trackingNumber &&
                    !/^BD\d+IN$/i.test(activeOrder.trackingNumber) ? (
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                        Tracking: <strong>{activeOrder.trackingNumber}</strong>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div
                  style={{ fontSize: 13, color: "#059669", fontWeight: 700 }}
                >
                  Estimated Delivery:{" "}
                  {activeOrder.estimatedDelivery || "10-15 business days"}
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
                      <div key={stage.key} className="track-stage-node">
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
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in Order with Custom Fit Details */}
              <div
                style={{
                  borderTop: "1px solid #f3f4f6",
                  paddingTop: 24,
                  marginBottom: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
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
                  {(activeOrder.items || []).map((item, idx) => {
                    const fit =
                      typeof item.fitDetails === "string"
                        ? (() => {
                            try {
                              return JSON.parse(item.fitDetails);
                            } catch {
                              return null;
                            }
                          })()
                        : item.fitDetails;

                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 14px",
                          background: "#fafafa",
                          borderRadius: 10,
                          border: "1px solid #f3f4f6",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <img
                            src={item.image || "/assets/img/14.png"}
                            alt={item.title || item.name}
                            style={{
                              width: 48,
                              height: 58,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                          <div>
                            <strong style={{ fontSize: 14, color: "#111827" }}>
                              {item.title || item.name}
                            </strong>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                              Size: <strong>{item.selectedSize || "M"}</strong>{" "}
                              {item.selectedColor ? `| ${item.selectedColor}` : ""}{" "}
                              × {item.quantity || 1}
                            </div>
                            {fit && (fit.bust || fit.waist || fit.hips || fit.notes) && (
                              <div
                                style={{
                                  fontSize: 11.5,
                                  color: "#9a3412",
                                  marginTop: 5,
                                  background: "#fff7ed",
                                  padding: "4px 8px",
                                  borderRadius: 4,
                                  display: "inline-block",
                                  border: "1px solid #fed7aa",
                                  fontWeight: 600,
                                }}
                              >
                                ✦ Custom Fit: Bust {fit.bust}&quot; • Waist {fit.waist}&quot; • Hips {fit.hips}&quot;
                                {fit.fitPreference ? ` • ${fit.fitPreference}` : ""}
                                {fit.lengthPreference && fit.lengthPreference !== "Standard length (as per style)" ? ` • Length: ${fit.lengthPreference}` : ""}
                                {fit.notes ? ` • Note: "${fit.notes}"` : ""}
                              </div>
                            )}
                          </div>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>
                          ₹
                          {(
                            (item.price || 0) * (item.quantity || 1)
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
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
                    <br />
                    <span style={{ color: "#6b7280", fontSize: 12 }}>
                      Phone: {activeOrder.customer?.phone}
                    </span>
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

                  {activeOrder.paymentStatus !== "PAID" && (
                    <Link
                      href={`/checkout?retry=${encodeURIComponent(activeOrder.orderNumber)}`}
                      style={{
                        background: "#881A1C",
                        color: "#ffffff",
                        padding: "10px 20px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        boxShadow: "0 2px 8px rgba(136, 26, 28, 0.25)",
                      }}
                    >
                      <span>Retry Payment with Cashfree →</span>
                    </Link>
                  )}

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
                  color: "#881A1C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <FiPackage size={26} />
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  margin: "0 0 8px",
                  color: "#111827",
                }}
              >
                No Active Shipments in Transit
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 14,
                  maxWidth: 480,
                  margin: "0 auto 24px",
                  lineHeight: 1.6,
                }}
              >
                {userEmail ? (
                  <>
                    No pending shipments found under <strong>{userEmail}</strong>. If you placed an order with another reference number, enter it in the search bar above.
                  </>
                ) : (
                  <>
                    Enter your Order Reference from your order confirmation (e.g. <strong>SUM-28211</strong>) to view live courier transit milestones.
                  </>
                )}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
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

          {/* ─── DELIVERED / PAST ORDERS ACCORDION ─── */}
          {deliveredOrders.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#059669",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <FiCheckCircle size={16} /> Delivered Orders ({deliveredOrders.length})
                </h3>
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                  Eligible for 7-day returns & exchanges
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {deliveredOrders.map((dOrd) => (
                  <div
                    key={dOrd.orderNumber}
                    onClick={() => {
                      setActiveOrder(dOrd);
                    }}
                    style={{
                      background: "#ffffff",
                      borderRadius: 10,
                      padding: "12px 16px",
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 13, color: "#111827" }}>
                        #{dOrd.orderNumber}
                      </strong>
                      <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>
                        Delivered safely • ₹{(dOrd.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: "#881A1C", fontWeight: 700 }}>
                      View Details →
                    </span>
                  </div>
                ))}
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

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderContent />
    </Suspense>
  );
}
