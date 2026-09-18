"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    shippingFee,
    cartGrandTotal,
    currentUser,
    setIsAuthModalOpen,
    placeOrder,
  } = useStore();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "Bimal Ray",
    email: currentUser?.email || "bimal@sumclotico.com",
    phone: currentUser?.phone || "+91 98765 43210",
    street: currentUser?.addresses?.[0]?.street || "Plot 14, Koramangala 4th Block",
    city: currentUser?.addresses?.[0]?.city || "Bengaluru",
    state: currentUser?.addresses?.[0]?.state || "Karnataka",
    pincode: currentUser?.addresses?.[0]?.pincode || "560034",
  });

  const [paymentMethod, setPaymentMethod] = useState("cashfree_upi");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showCashfreeModal, setShowCashfreeModal] = useState(false);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Your Cart is Empty</h1>
          <p style={{ color: "#666", marginBottom: 24 }}>You don't have any items in your bag to checkout.</p>
          <Link href="/collection" className="cart-checkout-btn" style={{ padding: "12px 28px", textDecoration: "none" }}>
            Browse Collection →
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setShowCashfreeModal(true);
  };

  const handleCashfreePaymentSuccess = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const order = placeOrder({
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: "India",
        },
        items: [...cart],
        subtotal: cartSubtotal,
        shippingFee,
        totalAmount: cartGrandTotal,
        paymentMethod: paymentMethod === "cashfree_upi" ? "Cashfree UPI (Instant)" : "Cashfree Credit/Debit Card",
      });

      setShowCashfreeModal(false);
      setIsProcessingPayment(false);
      router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div style={{ background: "#fbfbfc", minHeight: "100vh", padding: "120px 24px 80px", color: "#111" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>Secure Checkout</h1>
          <p style={{ color: "#666", marginBottom: 36, fontSize: 14 }}>
            Fast & encrypted checkout powered by <strong>Cashfree Payments</strong>.
          </p>

          {!currentUser && (
            <div
              style={{
                background: "#fff3e0",
                border: "1px solid #ffe082",
                borderRadius: 8,
                padding: "16px 20px",
                marginBottom: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <strong style={{ color: "#d84315", fontSize: 14 }}>Account Required for Checkout</strong>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#555" }}>
                  Sign in or use Google SSO to track your order and receive instant order receipts.
                </p>
              </div>
              <button
                className="cart-checkout-btn"
                style={{ margin: 0, padding: "10px 20px", fontSize: 13, background: "#d84315" }}
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In / Google SSO
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40 }}>
            {/* Left: Customer & Shipping Details */}
            <div>
              <form onSubmit={handleProceedToPayment}>
                <div style={{ background: "#ffffff", padding: 32, borderRadius: 12, border: "1px solid #eaeaea", marginBottom: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", borderBottom: "1px solid #f0f0f0", paddingBottom: 12 }}>
                    1. Contact Information
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="auth-form-group">
                      <label className="auth-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="auth-input"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-label">Email (for receipt & updates)</label>
                      <input
                        type="email"
                        name="email"
                        className="auth-input"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="auth-form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="auth-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="auth-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: 32, borderRadius: 12, border: "1px solid #eaeaea", marginBottom: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", borderBottom: "1px solid #f0f0f0", paddingBottom: 12 }}>
                    2. Shipping Address
                  </h3>
                  <div className="auth-form-group">
                    <label className="auth-label">Street Address & Apartment</label>
                    <input
                      type="text"
                      name="street"
                      className="auth-input"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div className="auth-form-group">
                      <label className="auth-label">City</label>
                      <input
                        type="text"
                        name="city"
                        className="auth-input"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-label">State</label>
                      <input
                        type="text"
                        name="state"
                        className="auth-input"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-label">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        className="auth-input"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: 32, borderRadius: 12, border: "1px solid #eaeaea", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", borderBottom: "1px solid #f0f0f0", paddingBottom: 12 }}>
                    3. Payment Method
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 16,
                        border: `2px solid ${paymentMethod === "cashfree_upi" ? "#111111" : "#e5e7eb"}`,
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cashfree_upi"}
                        onChange={() => setPaymentMethod("cashfree_upi")}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Cashfree UPI (GPay, PhonePe, Paytm, QR)</div>
                        <div style={{ fontSize: 12, color: "#666" }}>Instant QR scan & 0% processing fee</div>
                      </div>
                    </label>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 16,
                        border: `2px solid ${paymentMethod === "cashfree_cards" ? "#111111" : "#e5e7eb"}`,
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cashfree_cards"}
                        onChange={() => setPaymentMethod("cashfree_cards")}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Credit / Debit Cards & NetBanking</div>
                        <div style={{ fontSize: 12, color: "#666" }}>Visa, MasterCard, RuPay, Amex</div>
                      </div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="cart-checkout-btn"
                    style={{ marginTop: 24, fontSize: 16 }}
                  >
                    Pay ₹{cartGrandTotal.toLocaleString("en-IN")} with Cashfree →
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div style={{ background: "#ffffff", padding: 32, borderRadius: 12, border: "1px solid #eaeaea", position: "sticky", top: 120, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", borderBottom: "1px solid #f0f0f0", paddingBottom: 12 }}>
                  Order Summary ({cart.length})
                </h3>

                <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 20 }}>
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "center" }}>
                      <img src={item.image} alt={item.name} style={{ width: 50, height: 60, objectFit: "cover", borderRadius: 4 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "#777" }}>Size: {item.selectedSize} × {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #eeeeee", paddingTop: 16 }}>
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? <strong style={{ color: "#2e7d32" }}>FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                  <div className="cart-summary-row cart-summary-total">
                    <span>Total Amount</span>
                    <span>₹{cartGrandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cashfree Payment Simulator Modal */}
      {showCashfreeModal && (
        <div className="quickview-overlay">
          <div className="quickview-card" style={{ maxWidth: 460, gridTemplateColumns: "1fr", padding: 32 }}>
            <button
              className="cart-close-btn"
              style={{ position: "absolute", top: 16, right: 16 }}
              onClick={() => setShowCashfreeModal(false)}
            >
              ✕
            </button>

            <div style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#111", color: "#fff", padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                <span>Cashfree PG Secure Gateway</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Pay ₹{cartGrandTotal.toLocaleString("en-IN")}</h2>
              <p style={{ fontSize: 13, color: "#666", margin: "0 0 24px" }}>Order for: {formData.name}</p>

              {paymentMethod === "cashfree_upi" ? (
                <div>
                  <div style={{ background: "#f8f9fa", padding: 20, borderRadius: 12, display: "inline-block", border: "1px solid #e2e8f0", marginBottom: 16 }}>
                    {/* Simulated QR Code */}
                    <div style={{ width: 160, height: 160, background: "#ffffff", border: "2px solid #111", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>UPI QR</span>
                      <span style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}>SCAN WITH ANY UPI APP</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
                    <span style={{ background: "#e8f0fe", padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>GPay</span>
                    <span style={{ background: "#f3e8fd", padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>PhonePe</span>
                    <span style={{ background: "#e0f2fe", padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>Paytm</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "left", marginBottom: 20 }}>
                  <div className="auth-form-group">
                    <label className="auth-label">Card Number</label>
                    <input type="text" className="auth-input" defaultValue="4242 •••• •••• 4242" readOnly />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="auth-form-group">
                      <label className="auth-label">Expiry</label>
                      <input type="text" className="auth-input" defaultValue="12/28" readOnly />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-label">CVV</label>
                      <input type="password" className="auth-input" defaultValue="123" readOnly />
                    </div>
                  </div>
                </div>
              )}

              <button
                className="cart-checkout-btn"
                onClick={handleCashfreePaymentSuccess}
                disabled={isProcessingPayment}
                style={{ background: isProcessingPayment ? "#666" : "#2e7d32" }}
              >
                {isProcessingPayment ? "Verifying Payment Webhook..." : "Simulate Successful Payment ✓"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
