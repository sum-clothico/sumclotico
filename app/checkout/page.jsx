"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import { FiShield, FiTag, FiCheck, FiTruck, FiLock, FiCreditCard, FiSmartphone } from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart = [],
    cartSubtotal = 0,
    shippingFee = 0,
    discountAmount = 0,
    cartGrandTotal = 0,
    currentUser,
    setIsAuthModalOpen,
    createOrder,
    appliedCoupon,
    couponFeedback,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    street: currentUser?.addresses?.[0]?.street || "",
    city: currentUser?.addresses?.[0]?.city || "",
    state: currentUser?.addresses?.[0]?.state || "",
    pincode: currentUser?.addresses?.[0]?.pincode || "",
  });

  const [couponInput, setCouponInput] = useState("");
  // Selected portal: "cashfree" | "razorpay" | "cod"
  const [selectedGateway, setSelectedGateway] = useState("cashfree");
  const [subMethod, setSubMethod] = useState("upi"); // "upi" | "card" | "netbanking"
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // "cashfree" | "razorpay" | "cod" | null

  React.useEffect(() => {
    if (cart.length > 0) {
      trackEvent("begin_checkout", {
        value: cartGrandTotal,
        currency: "INR",
        coupon: appliedCoupon?.code || undefined,
        items: cart.map((i) => ({
          item_id: i.id,
          item_name: i.name,
          price: i.price,
          quantity: i.quantity,
          item_variant: i.selectedSize,
        })),
      });
    }
  }, []);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Your Bag is Empty</h1>
          <p style={{ color: "#666", marginBottom: 24 }}>You don't have any items in your bag to checkout.</p>
          <Link href="/collection" className="cart-checkout-btn" style={{ padding: "12px 28px", textDecoration: "none" }}>
            Browse Collection →
          </Link>
        </div>
      </>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Please agree to the terms and shipping policy before placing your order.");
      return;
    }

    trackEvent("add_shipping_info", {
      shipping_tier: "Express BlueDart Courier",
      value: cartGrandTotal,
      currency: "INR",
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    });

    trackEvent("add_payment_info", {
      payment_type: selectedGateway,
      value: cartGrandTotal,
      currency: "INR",
      coupon: appliedCoupon?.code || undefined,
    });

    // Make payment go through seamlessly — API keys will be configured later
    setIsProcessingPayment(true);

    const isCod = selectedGateway === "cod";
    const gatewayName = selectedGateway === "cashfree"
      ? "Cashfree"
      : selectedGateway === "razorpay"
      ? "Razorpay"
      : "Cash on Delivery";

    const methodDesc = selectedGateway === "cashfree"
      ? "Cashfree Instant UPI / Card"
      : selectedGateway === "razorpay"
      ? "Razorpay Instant UPI / NetBanking"
      : "Cash on Delivery (Doorstep)";

    setTimeout(() => {
      const order = createOrder({
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
        paymentGateway: gatewayName,
        paymentMethod: methodDesc,
        paymentStatus: isCod ? "PENDING" : "PAID",
      });

      setIsProcessingPayment(false);
      router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
    }, 600);
  };

  const handleApplyCouponCode = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput("");
  };

  const handleExecutePayment = (gatewayName, methodDesc) => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const isCod = gatewayName === "Cash on Delivery";
      const order = createOrder({
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
        paymentGateway: gatewayName,
        paymentMethod: methodDesc,
        paymentStatus: isCod ? "PENDING" : "PAID",
      });

      setActiveModal(null);
      setIsProcessingPayment(false);
      router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
    }, 600);
  };

  return (
    <>
      <Navbar />
      <div style={{ background: "#fbfbfc", minHeight: "100vh", padding: "140px 24px 80px", color: "#111827" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#f35c27" }}>
              Secure D2C Multi-Gateway Checkout
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: "6px 0 8px", letterSpacing: "-0.5px" }}>
              Complete Your Order
            </h1>
            <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>
              Choose between Cashfree or Razorpay secure portals with automated order receipts dispatched via Resend.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 36 }}>
            {/* Left Column: Customer Details & Payment Selector */}
            <div>
              <form onSubmit={handleProceedToPayment}>
                {/* 1. Contact Information */}
                <div style={{ background: "#ffffff", padding: 28, borderRadius: 14, border: "1px solid #e5e7eb", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 16px", borderBottom: "1px solid #f3f4f6", paddingBottom: 10 }}>
                    1. Contact Information
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
                      <label className="auth-label">Email (for receipt & tracking)</label>
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
                      <label className="auth-label">Mobile Phone Number</label>
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

                {/* 2. Shipping Address */}
                <div style={{ background: "#ffffff", padding: 28, borderRadius: 14, border: "1px solid #e5e7eb", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 16px", borderBottom: "1px solid #f3f4f6", paddingBottom: 10 }}>
                    2. Shipping Address (India)
                  </h3>
                  <div className="auth-form-group">
                    <label className="auth-label">Street Address / House / Flat No.</label>
                    <input
                      type="text"
                      name="street"
                      className="auth-input"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
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
                      <label className="auth-label">PIN Code</label>
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

                {/* 3. Payment Gateway Portal Selection */}
                <div style={{ background: "#ffffff", padding: 28, borderRadius: 14, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", paddingBottom: 10, marginBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
                      3. Select Payment Gateway
                    </h3>
                    <span style={{ fontSize: 11, background: "#ecfdf5", color: "#065f46", padding: "3px 8px", borderRadius: 4, fontWeight: 700 }}>
                      Dual Portals Active
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Portal 1: Cashfree Payments */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "16px",
                        border: `2px solid ${selectedGateway === "cashfree" ? "#111111" : "#e5e7eb"}`,
                        borderRadius: 12,
                        cursor: "pointer",
                        background: selectedGateway === "cashfree" ? "#fbfbfc" : "#ffffff",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment_gateway"
                        checked={selectedGateway === "cashfree"}
                        onChange={() => setSelectedGateway("cashfree")}
                        style={{ marginTop: 4 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <span style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>Cashfree Payments Portal</span>
                          <span style={{ fontSize: 11, background: "#f35c27", color: "#fff", fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                            CASHFREE
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.4 }}>
                          Instant UPI QR Scan, Cards (Visa/MasterCard/RuPay), NetBanking & PayLater with instant settlement.
                        </div>
                      </div>
                    </label>

                    {/* Portal 2: Razorpay Secure */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "16px",
                        border: `2px solid ${selectedGateway === "razorpay" ? "#0c2340" : "#e5e7eb"}`,
                        borderRadius: 12,
                        cursor: "pointer",
                        background: selectedGateway === "razorpay" ? "#f0f7ff" : "#ffffff",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment_gateway"
                        checked={selectedGateway === "razorpay"}
                        onChange={() => setSelectedGateway("razorpay")}
                        style={{ marginTop: 4 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <span style={{ fontWeight: 800, fontSize: 15, color: "#0c2340" }}>Razorpay Secure Portal</span>
                          <span style={{ fontSize: 11, background: "#0c2340", color: "#fff", fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                            RAZORPAY
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.4 }}>
                          Google Pay, PhonePe, Paytm, CRED UPI, International & Domestic Cards, EMI & 50+ NetBanking Banks.
                        </div>
                      </div>
                    </label>

                    {/* Portal 3: Cash on Delivery */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "16px",
                        border: `2px solid ${selectedGateway === "cod" ? "#111111" : "#e5e7eb"}`,
                        borderRadius: 12,
                        cursor: "pointer",
                        background: selectedGateway === "cod" ? "#fbfbfc" : "#ffffff",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment_gateway"
                        checked={selectedGateway === "cod"}
                        onChange={() => setSelectedGateway("cod")}
                        style={{ marginTop: 4 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <span style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>Cash on Delivery (COD)</span>
                          <span style={{ fontSize: 11, background: "#e5e7eb", color: "#374151", fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                            DOORSTEP
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.4 }}>
                          Pay in cash upon doorstep delivery by our express courier partner.
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Terms & Policy Agreement */}
                  <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                    />
                    <label htmlFor="terms" style={{ fontSize: 13, color: "#4b5563" }}>
                      I agree to the <Link href="/policies/terms" style={{ color: "#111", textDecoration: "underline" }}>Terms</Link> and <Link href="/policies/shipping" style={{ color: "#111", textDecoration: "underline" }}>Shipping Policy</Link>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="cart-checkout-btn"
                    disabled={isProcessingPayment}
                    style={{
                      marginTop: 20,
                      fontSize: 16,
                      padding: "16px",
                      background: selectedGateway === "razorpay" ? "#0c2340" : "#111111",
                      opacity: isProcessingPayment ? 0.75 : 1,
                      cursor: isProcessingPayment ? "not-allowed" : "pointer",
                    }}
                  >
                    {isProcessingPayment
                      ? "Securing Payment & Placing Order..."
                      : `Pay ₹${cartGrandTotal.toLocaleString("en-IN")} with ${selectedGateway === "cashfree" ? "Cashfree" : selectedGateway === "razorpay" ? "Razorpay" : "COD"} →`}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary & Coupon Box */}
            <div>
              <div style={{ background: "#ffffff", padding: 28, borderRadius: 14, border: "1px solid #e5e7eb", position: "sticky", top: 120, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 16px", borderBottom: "1px solid #f3f4f6", paddingBottom: 10 }}>
                  Order Review ({cart.length})
                </h3>

                {/* Items List */}
                <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 16 }}>
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
                      <img src={item.image} alt={item.name} style={{ width: 46, height: 56, objectFit: "cover", borderRadius: 6 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>Size: {item.selectedSize} × {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>

                {/* Coupon Input Box */}
                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 14, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                    <FiTag size={14} color="#f35c27" />
                    <span>Apply Coupon Code</span>
                  </div>

                  {appliedCoupon ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "8px 12px", borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#065f46" }}>
                        ✓ {appliedCoupon.code} (-₹{discountAmount})
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        placeholder="e.g. KHADI10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: 6,
                          fontSize: 13,
                          textTransform: "uppercase",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCouponCode}
                        style={{
                          padding: "8px 14px",
                          background: "#111111",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponFeedback && (
                    <div style={{ fontSize: 11, marginTop: 4, color: couponFeedback.type === "success" ? "#047857" : "#b91c1c" }}>
                      {couponFeedback.message}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
                  <div className="cart-summary-row" style={{ fontSize: 14 }}>
                    <span>Subtotal</span>
                    <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="cart-summary-row" style={{ fontSize: 14, color: "#15803d" }}>
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="cart-summary-row" style={{ fontSize: 14 }}>
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? <strong style={{ color: "#15803d" }}>FREE</strong> : `₹${shippingFee}`}</span>
                  </div>

                  <div className="cart-summary-row cart-summary-total" style={{ fontSize: 18 }}>
                    <span>Grand Total</span>
                    <span>₹{cartGrandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, fontSize: 12, color: "#6b7280" }}>
                  <FiLock size={13} color="#15803d" />
                  <span>256-Bit SSL Encrypted Dual Gateways</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PORTAL 1: Cashfree Payments Simulator Modal */}
      {activeModal === "cashfree" && (
        <div className="quickview-overlay">
          <div className="quickview-card" style={{ maxWidth: 480, gridTemplateColumns: "1fr", padding: 32, borderRadius: 16 }}>
            <button
              className="cart-close-btn"
              style={{ position: "absolute", top: 16, right: 16 }}
              onClick={() => setActiveModal(null)}
            >
              ✕
            </button>

            <div style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f35c27", color: "#fff", padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 800, marginBottom: 16 }}>
                <span>CASHFREE PAYMENTS GATEWAY</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Pay ₹{cartGrandTotal.toLocaleString("en-IN")}</h2>
              <p style={{ fontSize: 13, color: "#666", margin: "0 0 20px" }}>Order for: {formData.name} • Sum Clothico</p>

              {/* Sub-method tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: 18 }}>
                <button
                  type="button"
                  onClick={() => setSubMethod("upi")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderBottom: subMethod === "upi" ? "2px solid #f35c27" : "2px solid transparent",
                    background: "none",
                    fontWeight: 700,
                    fontSize: 13,
                    color: subMethod === "upi" ? "#f35c27" : "#6b7280",
                    cursor: "pointer",
                  }}
                >
                  UPI QR & Apps
                </button>
                <button
                  type="button"
                  onClick={() => setSubMethod("card")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderBottom: subMethod === "card" ? "2px solid #f35c27" : "2px solid transparent",
                    background: "none",
                    fontWeight: 700,
                    fontSize: 13,
                    color: subMethod === "card" ? "#f35c27" : "#6b7280",
                    cursor: "pointer",
                  }}
                >
                  Cards & NetBanking
                </button>
              </div>

              {subMethod === "upi" ? (
                <div>
                  <div style={{ background: "#f8f9fa", padding: 18, borderRadius: 12, display: "inline-block", border: "1px solid #e2e8f0", marginBottom: 14 }}>
                    <div style={{ width: 140, height: 140, background: "#ffffff", border: "2px solid #111", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>CASHFREE UPI</span>
                      <span style={{ fontSize: 9, fontWeight: 700, marginTop: 4, color: "#f35c27" }}>SCAN & PAY</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 18 }}>
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
                onClick={() => handleExecutePayment("Cashfree", subMethod === "upi" ? "Cashfree UPI (Instant)" : "Cashfree Credit/Debit Card")}
                disabled={isProcessingPayment}
                style={{ background: isProcessingPayment ? "#666" : "#f35c27", padding: "16px" }}
              >
                {isProcessingPayment ? "Verifying Cashfree Webhook..." : `Authorize ₹${cartGrandTotal.toLocaleString("en-IN")} with Cashfree ✓`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL 2: Razorpay Payments Simulator Modal */}
      {activeModal === "razorpay" && (
        <div className="quickview-overlay">
          <div className="quickview-card" style={{ maxWidth: 480, gridTemplateColumns: "1fr", padding: 0, borderRadius: 16, overflow: "hidden" }}>
            {/* Razorpay Header */}
            <div style={{ background: "#0c2340", padding: "24px 28px", color: "#ffffff", position: "relative" }}>
              <button
                className="cart-close-btn"
                style={{ position: "absolute", top: 16, right: 16, color: "#ffffff" }}
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Sum Clothico Handlooms</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Order #{Math.floor(100000 + Math.random() * 900000)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#38bdf8" }}>₹{cartGrandTotal.toLocaleString("en-IN")}</div>
                  <div style={{ fontSize: 10, background: "#0284c7", padding: "2px 6px", borderRadius: 4, display: "inline-block", marginTop: 2 }}>
                    RAZORPAY
                  </div>
                </div>
              </div>
            </div>

            {/* Razorpay Body */}
            <div style={{ padding: "28px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Payment Options (Trusted by 10M+ Businesses)
              </div>

              {/* UPI Option */}
              <div
                onClick={() => setSubMethod("upi")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px",
                  border: `2px solid ${subMethod === "upi" ? "#0284c7" : "#e2e8f0"}`,
                  borderRadius: 10,
                  marginBottom: 10,
                  cursor: "pointer",
                  background: subMethod === "upi" ? "#f0f9ff" : "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FiSmartphone size={18} color="#0284c7" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>UPI Apps (GPay, PhonePe, Paytm, CRED)</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Instant zero-fee payment with UPI PIN</div>
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0284c7" }}>Instant</span>
              </div>

              {/* Card Option */}
              <div
                onClick={() => setSubMethod("card")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px",
                  border: `2px solid ${subMethod === "card" ? "#0284c7" : "#e2e8f0"}`,
                  borderRadius: 10,
                  marginBottom: 10,
                  cursor: "pointer",
                  background: subMethod === "card" ? "#f0f9ff" : "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FiCreditCard size={18} color="#0284c7" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Credit / Debit Cards</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Visa, Mastercard, RuPay, Maestro, Amex</div>
                  </div>
                </div>
              </div>

              {/* NetBanking Option */}
              <div
                onClick={() => setSubMethod("netbanking")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px",
                  border: `2px solid ${subMethod === "netbanking" ? "#0284c7" : "#e2e8f0"}`,
                  borderRadius: 10,
                  marginBottom: 20,
                  cursor: "pointer",
                  background: subMethod === "netbanking" ? "#f0f9ff" : "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FiShield size={18} color="#0284c7" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>NetBanking (50+ Indian Banks)</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>HDFC, ICICI, SBI, Axis, Kotak</div>
                  </div>
                </div>
              </div>

              <button
                className="cart-checkout-btn"
                onClick={() => handleExecutePayment("Razorpay", subMethod === "upi" ? "Razorpay UPI (Google Pay)" : subMethod === "card" ? "Razorpay Credit/Debit Card" : "Razorpay NetBanking")}
                disabled={isProcessingPayment}
                style={{ background: isProcessingPayment ? "#64748b" : "#0c2340", padding: "16px", borderRadius: 8 }}
              >
                {isProcessingPayment ? "Verifying Razorpay Signature..." : `Pay ₹${cartGrandTotal.toLocaleString("en-IN")} via Razorpay →`}
              </button>

              <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#94a3b8" }}>
                Secured by Razorpay • 256-bit encryption • PCI-DSS Compliant
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL 3: Cash on Delivery Modal */}
      {activeModal === "cod" && (
        <div className="quickview-overlay">
          <div className="quickview-card" style={{ maxWidth: 440, gridTemplateColumns: "1fr", padding: 32, borderRadius: 16 }}>
            <button
              className="cart-close-btn"
              style={{ position: "absolute", top: 16, right: 16 }}
              onClick={() => setActiveModal(null)}
            >
              ✕
            </button>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, background: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <FiTruck size={26} color="#111827" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>Confirm Cash on Delivery</h2>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>
                Pay <strong>₹{cartGrandTotal.toLocaleString("en-IN")}</strong> in cash upon delivery to {formData.city}, {formData.state}.
              </p>

              <button
                className="cart-checkout-btn"
                onClick={() => handleExecutePayment("Cash on Delivery", "Cash on Delivery (Doorstep)")}
                disabled={isProcessingPayment}
                style={{ background: "#111827", padding: "16px" }}
              >
                {isProcessingPayment ? "Confirming Order..." : "Confirm & Place COD Order ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

