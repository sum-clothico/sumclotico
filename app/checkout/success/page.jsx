"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import { trackEvent } from "@/lib/analytics";

function SuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderParam =
    searchParams.get("orderNumber") ||
    searchParams.get("order_id") ||
    searchParams.get("cf_order_id");
  const cleanOrderNumber = rawOrderParam ? rawOrderParam.replace(/^CF_/, "") : "";
  const cfOrderId = searchParams.get("cf_order_id") || searchParams.get("order_id");

  const { orders, updatePaymentStatus } = useStore();

  const order =
    orders.find(
      (o) =>
        o.orderNumber === cleanOrderNumber ||
        o.orderNumber === rawOrderParam ||
        o.cashfreeOrderId === rawOrderParam ||
        (cfOrderId && o.cashfreeOrderId === cfOrderId),
    ) || orders[0];

  const [verifying, setVerifying] = useState(Boolean(cfOrderId));
  const [verifiedStatus, setVerifiedStatus] = useState(
    order?.paymentStatus || "PENDING",
  );
  const [statusMessage, setStatusMessage] = useState("");
  const hasVerifiedRef = useRef(false);

  // Live Cashfree Order Status Verification (Idempotent: runs at most once per session)
  useEffect(() => {
    if (!cfOrderId) {
      setVerifying(false);
      return;
    }

    // 1. In-memory ref guard against StrictMode / re-renders
    if (hasVerifiedRef.current) {
      return;
    }
    hasVerifiedRef.current = true;

    // 2. SessionStorage guard against page refreshes / navigation loops
    const cacheKey = `cf_status_${cfOrderId}`;
    const cachedStatus = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;
    if (cachedStatus) {
      setVerifying(false);
      setVerifiedStatus(cachedStatus);
      setStatusMessage(
        cachedStatus === "PAID"
          ? "Payment verified successfully via Cashfree."
          : "Payment was not completed. No order has been placed."
      );
      return;
    }

    let isMounted = true;

    async function checkCashfreeStatus() {
      try {
        const res = await fetch(
          `/api/payments/cashfree?orderId=${encodeURIComponent(cfOrderId)}`
        );
        const json = await res.json();
        const cfStatus = json?.data?.order_status;

        if (!isMounted) return;

        if (cfStatus === "PAID") {
          setVerifiedStatus("PAID");
          try { sessionStorage.setItem(cacheKey, "PAID"); } catch {}
          setStatusMessage("Payment verified successfully via Cashfree.");

          if (order && updatePaymentStatus) {
            updatePaymentStatus(order.id, "PAID", cfOrderId);
          }

          // Idempotent email dispatch: strictly once per order ID
          const emailSentKey = `email_dispatched_paid_${cfOrderId}`;
          if (typeof window !== "undefined" && !sessionStorage.getItem(emailSentKey)) {
            try { sessionStorage.setItem(emailSentKey, "1"); } catch {}
            fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "ORDER_CONFIRMATION",
                to: order?.customer?.email,
                data: {
                  ...order,
                  paymentStatus: "PAID",
                  paymentMethod: "Cashfree PG",
                },
              }),
            }).catch((e) => console.warn("Email dispatch error:", e));
          }
        } else {
          setVerifiedStatus("FAILED");
          try { sessionStorage.setItem(cacheKey, "FAILED"); } catch {}
          setStatusMessage(
            cfStatus === "ACTIVE"
              ? "Payment was not completed on Cashfree. No order has been placed."
              : `Payment status: ${cfStatus || "FAILED"}. No order has been placed.`
          );

          if (order && updatePaymentStatus) {
            updatePaymentStatus(order.id, "CANCELLED");
          }

          // Idempotent failed email dispatch: strictly once per order ID
          const emailSentKey = `email_dispatched_failed_${cfOrderId}`;
          if (typeof window !== "undefined" && !sessionStorage.getItem(emailSentKey)) {
            try { sessionStorage.setItem(emailSentKey, "1"); } catch {}
            fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "ORDER_PAYMENT_FAILED",
                to: order?.customer?.email,
                data: {
                  ...order,
                  reason: cfStatus === "ACTIVE" ? "User cancelled or window closed" : `Gateway returned ${cfStatus}`,
                },
              }),
            }).catch((e) => console.warn("Payment failed email error:", e));
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn("[Cashfree Verification] Error:", err.message);
        setVerifiedStatus("PENDING");
        setStatusMessage("Could not verify transaction with Cashfree.");
      } finally {
        if (isMounted) setVerifying(false);
      }
    }

    checkCashfreeStatus();

    return () => {
      isMounted = false;
    };
  }, [cfOrderId]);

  useEffect(() => {
    if (order && verifiedStatus === "PAID") {
      trackEvent("order_confirmation_view", {
        order_number: order.orderNumber,
        value: order.totalAmount,
        currency: "INR",
        items_count: order.items?.length,
        payment_gateway: order.paymentGateway,
      });
    }
  }, [order?.orderNumber, verifiedStatus]);

  const isPaid = verifiedStatus === "PAID";
  // COD removed

  if (verifying) {
    return (
      <div
        style={{
          background: "#ffffff",
          padding: "60px 40px",
          borderRadius: 16,
          border: "1px solid #e8e8e8",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "4px solid #f35c27",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        />
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
          Verifying Payment with Cashfree...
        </h2>
        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>
          Please do not refresh or close this window while we secure your transaction.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "40px",
        borderRadius: 16,
        border: "1px solid #e8e8e8",
        boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
      }}
    >
      {/* Status Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        {isPaid ? (
          <>
            <div
              style={{
                width: 70,
                height: 70,
                background: "#e8f5e9",
                color: "#2e7d32",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                margin: "0 auto 16px",
              }}
            >
              ✓
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>
              "Order Confirmed!"
            </h1>
            <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
              "Thank you for supporting handcrafted Indian khadi. Your payment has been verified."
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                width: 70,
                height: 70,
                background: "#fef3c7",
                color: "#b45309",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                margin: "0 auto 16px",
              }}
            >
              ⏳
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", color: "#92400e" }}>
              Payment Incomplete / Pending
            </h1>
            <p style={{ color: "#666", fontSize: 14, margin: "0 0 12px" }}>
              {statusMessage || "Your payment was not completed on Cashfree. No funds were debited."}
            </p>
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                color: "#92400e",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              If your bank account was not charged, you can retry checkout anytime below.
            </div>
          </>
        )}
      </div>

      {order ? (
        <div>
          {/* Order Meta Banner */}
          <div
            style={{
              background: "#f8f9fa",
              borderLeft: `4px solid ${isPaid ? "#2e7d32" : "#f59e0b"}`,
              padding: "14px 18px",
              borderRadius: 4,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: "#666" }}>Order Reference:</div>
                <strong style={{ fontSize: 16, color: "#111" }}>
                  #{order.orderNumber}
                </strong>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 4,
                    background: isPaid ? "#2e7d32" : isCod ? "#374151" : "#d97706",
                    color: "#ffffff",
                  }}
                >
                  {isPaid ? "PAID" : isCod ? "COD" : "PAYMENT PENDING"}
                </span>
                {order.transactionId && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#6b7280",
                      marginTop: 4,
                      fontFamily: "monospace",
                    }}
                  >
                    Txn: {order.transactionId}
                  </div>
                )}
              </div>
            </div>
            {isPaid && (
              <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                Confirmation email dispatched to <strong>{order.customer?.email}</strong>
              </div>
            )}
          </div>

          {/* Items */}
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              margin: "0 0 12px",
              textTransform: "uppercase",
              color: "#888",
            }}
          >
            Items in Order
          </h3>
          <div
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: 12,
              marginBottom: 20,
            }}
          >
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div>
                  <strong style={{ fontSize: 14, color: "#111" }}>
                    {item.title || item.name}
                  </strong>
                  <div style={{ fontSize: 12, color: "#777" }}>
                    Size: {item.selectedSize} × {item.quantity}
                  </div>
                </div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Payment & Totals */}
          <div style={{ marginBottom: 24 }}>
            <div className="cart-summary-row">
              <span>Payment Gateway</span>
              <span style={{ fontWeight: 600 }}>{order.paymentGateway || "Cashfree"}</span>
            </div>
            <div className="cart-summary-row">
              <span>Payment Status</span>
              <span
                style={{
                  fontWeight: 700,
                  color: isPaid ? "#2e7d32" : isCod ? "#374151" : "#d97706",
                }}
              >
                {isPaid ? "PAID" : isCod ? "PENDING (Pay on Delivery)" : "PENDING (Unpaid)"}
              </span>
            </div>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString("en-IN")}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Order Total</span>
              <span style={{ color: isPaid ? "#2e7d32" : "#111" }}>
                ₹{order.totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Shipping Details */}
          <div
            style={{
              background: "#f8f9fa",
              padding: 16,
              borderRadius: 8,
              fontSize: 13,
              color: "#555",
              marginBottom: 30,
            }}
          >
            <strong style={{ color: "#111", display: "block", marginBottom: 4 }}>
              Delivery Destination:
            </strong>
            {order.customer?.name}
            <br />
            {order.shippingAddress?.street}
            <br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
            {order.shippingAddress?.pincode}
            <br />
            Phone: {order.customer?.phone}
          </div>
        </div>
      ) : (
        <p>Order details loaded.</p>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {!isPaid && !isCod && (
          <Link
            href="/checkout"
            className="cart-checkout-btn"
            style={{
              width: "100%",
              margin: 0,
              textDecoration: "none",
              background: "#f35c27",
              textAlign: "center",
            }}
          >
            Retry Payment with Cashfree →
          </Link>
        )}
        <Link
          href="/collection"
          className="cart-checkout-btn"
          style={{
            width: "100%",
            margin: 0,
            textDecoration: "none",
            background: isPaid || isCod ? "#111" : "#ffffff",
            color: isPaid || isCod ? "#ffffff" : "#111111",
            border: isPaid || isCod ? "none" : "1px solid #d1d5db",
            textAlign: "center",
          }}
        >
          Explore More Pieces in Collection →
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <div
        style={{
          background: "#fbfbfc",
          minHeight: "100vh",
          padding: "140px 24px 80px",
          color: "#111",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Suspense
            fallback={
              <div style={{ textAlign: "center", padding: 60 }}>
                Loading order details...
              </div>
            }
          >
            <SuccessContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}
