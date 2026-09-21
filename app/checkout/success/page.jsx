"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const { orders } = useStore();

  const order = orders.find((o) => o.orderNumber === orderNumber) || orders[0];

  useEffect(() => {
    if (order) {
      trackEvent("order_confirmation_view", {
        order_number: order.orderNumber,
        value: order.totalAmount,
        currency: "INR",
        items_count: order.items?.length,
        payment_gateway: order.paymentGateway,
      });
    }
  }, [order?.orderNumber]);

  return (
    <div style={{ background: "#ffffff", padding: "40px", borderRadius: 16, border: "1px solid #e8e8e8", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" }}>
      {/* Animated checkmark icon */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 70, height: 70, background: "#e8f5e9", color: "#2e7d32", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px" }}>
          ✓
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>Order Confirmed!</h1>
        <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
          Thank you for supporting handcrafted Indian khadi.
        </p>
      </div>

      {order ? (
        <div>
          {/* Order Meta Banner */}
          <div style={{ background: "#f8f9fa", borderLeft: "4px solid #f35c27", padding: "14px 18px", borderRadius: 4, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, color: "#666" }}>Order Reference:</div>
                <strong style={{ fontSize: 16, color: "#111" }}>#{order.orderNumber}</strong>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 4,
                    background: order.paymentGateway === "Razorpay" ? "#0c2340" : order.paymentGateway === "Cashfree" ? "#f35c27" : "#374151",
                    color: "#ffffff",
                  }}
                >
                  {order.paymentGateway || "Cashfree"}
                </span>
                {order.transactionId && (
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4, fontFamily: "monospace" }}>
                    Txn: {order.transactionId}
                  </div>
                )}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
              Confirmation email dispatched via <strong>Resend</strong> to {order.customer?.email}
            </div>
          </div>

          {/* Items */}
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", color: "#888" }}>
            Items Ordered
          </h3>
          <div style={{ borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 20 }}>
            {order.items?.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <strong style={{ fontSize: 14, color: "#111" }}>{item.title || item.name}</strong>
                  <div style={{ fontSize: 12, color: "#777" }}>Size: {item.selectedSize} × {item.quantity}</div>
                </div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          {/* Payment & Totals */}
          <div style={{ marginBottom: 24 }}>
            <div className="cart-summary-row">
              <span>Payment Method</span>
              <span style={{ fontWeight: 600 }}>{order.paymentMethod || "Online Payment"}</span>
            </div>
            <div className="cart-summary-row">
              <span>Payment Status</span>
              <span style={{ fontWeight: 700, color: order.paymentStatus === "PAID" ? "#2e7d32" : "#d97706" }}>
                {order.paymentStatus || "PAID"}
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
              <span>Total Paid</span>
              <span style={{ color: "#2e7d32" }}>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Shipping Details */}
          <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, fontSize: 13, color: "#555", marginBottom: 30 }}>
            <strong style={{ color: "#111", display: "block", marginBottom: 4 }}>Delivery Destination:</strong>
            {order.customer?.name}<br />
            {order.shippingAddress?.street}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
            Phone: {order.customer?.phone}
          </div>
        </div>
      ) : (
        <p>Order details loaded.</p>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <Link
          href="/collection"
          className="cart-checkout-btn"
          style={{ width: "100%", margin: 0, textDecoration: "none" }}
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
      <div style={{ background: "#fbfbfc", minHeight: "100vh", padding: "140px 24px 80px", color: "#111" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Suspense fallback={<div style={{ textAlign: "center", padding: 60 }}>Loading order confirmation...</div>}>
            <SuccessContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}
