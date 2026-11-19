"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser, SignIn } from "@clerk/nextjs";
import { useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import {
  FiShield,
  FiTag,
  FiCheck,
  FiTruck,
  FiLock,
  FiCreditCard,
  FiSmartphone,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import { trackEvent } from "@/lib/analytics";
import FitDetailsModal from "@/components/FitDetailsModal";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const retryOrderNumber =
    searchParams?.get("retry") || searchParams?.get("orderNumber");

  const {
    cart = [],
    setCart,
    isCartHydrated,
    orders = [],
    cartSubtotal = 0,
    shippingFee = 0,
    discountAmount = 0,
    cartGrandTotal = 0,
    cartGstPercent = 5,
    cartGstAmount = 0,
    currentUser,
    loginCustomer,
    updateCartItemFit,
    setIsAuthModalOpen,
    createOrder,
    appliedCoupon,
    couponFeedback,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [editingFitItem, setEditingFitItem] = useState(null);
  const [isFitModalOpen, setIsFitModalOpen] = useState(false);

  let clerkUser = null;
  let isClerkSignedIn = false;
  let isClerkLoaded = true;
  try {
    const clerk = useUser();
    clerkUser = clerk?.user;
    isClerkSignedIn = !!clerk?.isSignedIn;
    isClerkLoaded = clerk?.isLoaded !== false;
  } catch {
    // Fallback if Clerk is loading or offline
  }

  const isAuthenticated = isClerkSignedIn || !!currentUser;

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    street: currentUser?.addresses?.[0]?.street || "",
    city: currentUser?.addresses?.[0]?.city || "",
    state: currentUser?.addresses?.[0]?.state || "",
    pincode: currentUser?.addresses?.[0]?.pincode || "",
  });

  // Pre-fill customer details from authenticated user
  useEffect(() => {
    if (clerkUser) {
      const email =
        clerkUser.primaryEmailAddress?.emailAddress ||
        clerkUser.emailAddresses?.[0]?.emailAddress ||
        "";
      const name =
        clerkUser.fullName ||
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "";
      const phone =
        clerkUser.primaryPhoneNumber?.phoneNumber
          ?.replace(/[^0-9]/g, "")
          .slice(-10) || "";
      setFormData((prev) => ({
        ...prev,
        name: prev.name || name,
        email: prev.email || email,
        phone: prev.phone || phone,
      }));
    } else if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.name || "",
        email: prev.email || currentUser.email || "",
        phone: prev.phone || currentUser.phone || "",
      }));
    }
  }, [clerkUser, currentUser]);

  const [couponInput, setCouponInput] = useState("");
  // Selected portal: "cashfree" | "cod"
  const [selectedGateway, setSelectedGateway] = useState("cashfree");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [isRestoringRetry, setIsRestoringRetry] = useState(
    Boolean(retryOrderNumber && cart.length === 0),
  );
  const [restoredBanner, setRestoredBanner] = useState("");

  // Restore order from retry parameter if customer reopens checkout from email or failure screen
  useEffect(() => {
    if (!retryOrderNumber) {
      setIsRestoringRetry(false);
      return;
    }

    let isMounted = true;

    async function loadRetryOrder() {
      try {
        let order = (orders || []).find(
          (o) =>
            o.orderNumber === retryOrderNumber || o.id === retryOrderNumber,
        );

        if (!order) {
          const res = await fetch(
            `/api/orders/${encodeURIComponent(retryOrderNumber)}`,
          );
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.order) {
              order = json.order;
            }
          }
        }

        if (order && isMounted) {
          setFormData((prev) => ({
            name: prev.name || order.customer?.name || "",
            email: prev.email || order.customer?.email || "",
            phone: prev.phone || order.customer?.phone || "",
            street: prev.street || order.shippingAddress?.street || "",
            city: prev.city || order.shippingAddress?.city || "",
            state: prev.state || order.shippingAddress?.state || "",
            pincode: prev.pincode || order.shippingAddress?.pincode || "",
          }));

          if (
            cart.length === 0 &&
            Array.isArray(order.items) &&
            order.items.length > 0 &&
            setCart
          ) {
            const restoredItems = order.items.map((item, idx) => ({
              id:
                item.productId?._id ||
                item.productId ||
                item.id ||
                `retry_${idx}`,
              _mongoId: item.productId?._id || item.productId,
              name: item.title || item.name || "Handcrafted Piece",
              title: item.title || item.name || "Handcrafted Piece",
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || 1,
              selectedSize: item.selectedSize || "Standard",
              selectedColor: item.selectedColor || "Natural",
              image:
                item.image ||
                item.productId?.images?.[0]?.url ||
                "/assets/img/14.png",
            }));
            setCart(restoredItems);
          }

          setRestoredBanner(
            `Reopened Order #${retryOrderNumber}: Your handcrafted pieces and shipping details have been restored.`,
          );
        }
      } catch (err) {
        console.warn("[Checkout Retry] Could not restore order:", err);
      } finally {
        if (isMounted) setIsRestoringRetry(false);
      }
    }

    loadRetryOrder();

    return () => {
      isMounted = false;
    };
  }, [retryOrderNumber, orders]);

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

  // Resilient cart recovery to guarantee items are never lost on reload, redirect, or auth state change
  useEffect(() => {
    if (cart.length === 0 && typeof window !== "undefined") {
      try {
        let restored = null;
        const backup =
          sessionStorage.getItem("sum_cart_backup") ||
          localStorage.getItem("sum_cart");
        if (backup) {
          const parsed = JSON.parse(backup);
          if (Array.isArray(parsed) && parsed.length > 0) {
            restored = parsed;
          }
        }
        if (!restored && typeof document !== "undefined") {
          const m = document.cookie.match(/(^|;\s*)sum_cart=([^;]*)/);
          if (m) {
            const parsed = JSON.parse(decodeURIComponent(m[2]));
            if (Array.isArray(parsed) && parsed.length > 0) {
              restored = parsed;
            }
          }
        }
        if (restored && setCart) {
          setCart(restored);
        }
      } catch {}
    }
  }, [cart.length, setCart]);

  const effectiveCart =
    cart.length > 0
      ? cart
      : (() => {
          if (typeof window === "undefined") return [];
          try {
            const b =
              sessionStorage.getItem("sum_cart_backup") ||
              localStorage.getItem("sum_cart");
            if (b) {
              const p = JSON.parse(b);
              if (Array.isArray(p) && p.length > 0) return p;
            }
            if (typeof document !== "undefined") {
              const m = document.cookie.match(/(^|;\s*)sum_cart=([^;]*)/);
              if (m) {
                const p = JSON.parse(decodeURIComponent(m[2]));
                if (Array.isArray(p) && p.length > 0) return p;
              }
            }
          } catch {}
          return [];
        })();

  if ((!isCartHydrated && effectiveCart.length === 0) || isRestoringRetry) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #881A1C",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: 16,
            }}
          />
          <h2
            style={{
              fontSize: 20,
              marginBottom: 8,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {isRestoringRetry
              ? `Restoring Order #${retryOrderNumber}...`
              : "Loading your bag..."}
          </h2>
          <p style={{ color: "#666", fontSize: 14 }}>
            {isRestoringRetry
              ? "Retrieving your saved handcrafted pieces and details."
              : "Fetching your selected handcrafted pieces."}
          </p>
        </div>
      </>
    );
  }

  if (effectiveCart.length === 0) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#f5ebe6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <FiShoppingBag size={30} color="#660608" />
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 12,
            }}
          >
            Your Bag is Empty
          </h1>
          <p
            style={{
              color: "#666",
              marginBottom: 26,
              fontSize: 14,
              maxWidth: 380,
              lineHeight: 1.6,
            }}
          >
            You don't have any items in your bag to checkout.
          </p>
          <Link
            href="/collection"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#111111",
              color: "#ffffff",
              padding: "14px 36px",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.2s ease, background 0.2s ease",
              width: "auto",
              maxWidth: "280px",
              margin: "0 auto",
            }}
          >
            BROWSE COLLECTION →
          </Link>
        </div>
      </>
    );
  }

  // ── Customer Authentication Gate (Mandatory Clerk Sign-In Before Checkout) ──
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
              signUpUrl="/sign-up?redirect_url=/checkout"
              fallbackRedirectUrl="/checkout"
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setCheckoutError("");

    if (!agreedToTerms) {
      setCheckoutError(
        "Please agree to the terms and shipping policy before placing your order.",
      );
      return;
    }

    if (!formData.name || formData.name.trim().length < 2) {
      setCheckoutError("Please enter your full name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      setCheckoutError(
        "Please enter a valid email address for your order confirmation and invoice.",
      );
      return;
    }
    const cleanPhone = String(formData.phone || "")
      .replace(/[^0-9]/g, "")
      .slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setCheckoutError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!formData.street || formData.street.trim().length < 5) {
      setCheckoutError(
        "Please enter your complete street address (House / Flat / Street).",
      );
      return;
    }
    if (!formData.city || formData.city.trim().length < 2) {
      setCheckoutError("Please enter your city.");
      return;
    }
    if (!formData.state || formData.state.trim().length < 2) {
      setCheckoutError("Please enter your state.");
      return;
    }
    const cleanPincode = String(formData.pincode || "").replace(/[^0-9]/g, "");
    if (!cleanPincode || cleanPincode.length !== 6) {
      setCheckoutError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    trackEvent("add_shipping_info", {
      shipping_tier: "Express Shiprocket Courier",
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

    setIsProcessingPayment(true);

    // ── Cashfree Production Gateway Flow ──
    if (selectedGateway === "cashfree") {
      try {
        const tempOrderNumber = `SUM-${Math.floor(10000 + Math.random() * 90000)}`;

        const res = await fetch("/api/payments/cashfree", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNumber: tempOrderNumber,
            totalAmount: cartGrandTotal,
            discount: discountAmount,
            items: cart.map((item) => ({
              productId: item._mongoId || item.id,
              id: item.id,
              slug: item.slug,
              title: item.name || item.title,
              price: item.price,
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
              fitDetails: item.fitDetails || null,
            })),
            customer: {
              name: formData.name,
              email: formData.email,
              phone: cleanPhone,
            },
            shippingAddress: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              pincode: cleanPincode,
              country: "India",
            },
            returnUrl: `${window.location.origin}/checkout/success?orderNumber=${tempOrderNumber}&cf_order_id={order_id}`,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success || !data.paymentSessionId) {
          setIsProcessingPayment(false);
          setCheckoutError(
            data.error ||
              data.message ||
              "Could not initialize Cashfree payment. Please verify your details.",
          );
          return;
        }

        // Create initial pending order record linked with Cashfree order ID
        createOrder({
          orderNumber: tempOrderNumber,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: cleanPhone,
          },
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: "India",
          },
          paymentGateway: "Cashfree",
          paymentMethod: "Cashfree PG (Instant UPI / Cards)",
          paymentStatus: "PENDING",
          cashfreeOrderId: data.cfOrderId,
        });

        // Load and invoke official Cashfree Web SDK
        const loadCashfreeSdk = () =>
          new Promise((resolve) => {
            if (typeof window !== "undefined" && window.Cashfree) {
              return resolve(window.Cashfree);
            }
            const s = document.createElement("script");
            s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
            s.async = true;
            s.onload = () => resolve(window.Cashfree);
            s.onerror = () => resolve(null);
            document.body.appendChild(s);
          });

        const CashfreeSDK = await loadCashfreeSdk();
        if (CashfreeSDK) {
          const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "production";
          const cashfree = CashfreeSDK({ mode });
          cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_self",
          });
          return;
        } else {
          setIsProcessingPayment(false);
          setCheckoutError(
            "Could not load payment gateway SDK. Please disable ad-blockers and try again.",
          );
          return;
        }
      } catch (cfErr) {
        setIsProcessingPayment(false);
        console.error("Cashfree Checkout error:", cfErr);
        setCheckoutError(
          "Failed to connect to payment server. Please check your internet connection.",
        );
        return;
      }
    }
  };

  const handleApplyCouponCode = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput("");
  };

  return (
    <>
      <Navbar />
      <div className="checkout-wrapper">
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: "#f35c27",
              }}
            >
              Secure D2C Checkout
            </span>
            <h1
              style={{
                fontSize: "clamp(24px, 4.5vw, 32px)",
                fontWeight: 800,
                margin: "6px 0 8px",
                letterSpacing: "-0.5px",
              }}
            >
              Complete Your Order
            </h1>
            <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>
              Fast, encrypted checkout via Cashfree Payments with automated
              order confirmation dispatched to your email.
            </p>
          </div>

          {restoredBanner && (
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fcd34d",
                color: "#92400e",
                padding: "14px 18px",
                borderRadius: 10,
                marginBottom: 20,
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FiShield size={20} color="#d97706" />
              <span>{restoredBanner}</span>
            </div>
          )}

          {checkoutError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #f87171",
                color: "#991b1b",
                padding: "14px 18px",
                borderRadius: 10,
                marginBottom: 24,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              ⚠️ {checkoutError}
            </div>
          )}

          <div className="checkout-grid">
            {/* Left Column: Customer Details & Payment Selector */}
            <div className="checkout-form-col">
              <form onSubmit={handleProceedToPayment}>
                {/* 1. Contact Information */}
                <div className="checkout-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "0 0 16px",
                      borderBottom: "1px solid #f3f4f6",
                      paddingBottom: 10,
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        margin: 0,
                      }}
                    >
                      1. Contact Information
                    </h3>
                    {!isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => setIsAuthModalOpen && setIsAuthModalOpen(true)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#660608",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          textDecoration: "underline",
                          padding: 0,
                        }}
                      >
                        Already have an account? Sign In →
                      </button>
                    )}
                  </div>
                  <div className="checkout-contact-grid">
                    <div className="auth-form-group">
                      <label className="auth-label">
                        Full Name <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="auth-input"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Priya Sharma"
                        required
                      />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-label">
                        Email (for receipt & invoice){" "}
                        <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="auth-input"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. yourname@gmail.com"
                        required
                      />
                    </div>
                    <div
                      className="auth-form-group"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <label className="auth-label">
                        Mobile Phone Number{" "}
                        <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="auth-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="checkout-card">
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      margin: "0 0 16px",
                      borderBottom: "1px solid #f3f4f6",
                      paddingBottom: 10,
                    }}
                  >
                    2. Shipping Address (India)
                  </h3>
                  <div className="auth-form-group">
                    <label className="auth-label">
                      Street Address / House / Flat No.{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      className="auth-input"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="Flat, house no., building, apartment, street"
                      required
                    />
                  </div>
                  <div className="checkout-address-grid">
                    <div className="auth-form-group">
                      <label className="auth-label">
                        City <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="auth-input"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City / Town"
                        required
                      />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-label">
                        State <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        className="auth-input"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        required
                      />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-label">
                        PIN Code <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        className="auth-input"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="6-digit PIN"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment Gateway Portal Selection */}
                <div className="checkout-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #f3f4f6",
                      paddingBottom: 10,
                      marginBottom: 16,
                    }}
                  >
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
                      3. Select Payment Gateway
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        background: "#ecfdf5",
                        color: "#065f46",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontWeight: 700,
                      }}
                    >
                      Prepaid Cashfree PG Active
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
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
                        background:
                          selectedGateway === "cashfree"
                            ? "#fbfbfc"
                            : "#ffffff",
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
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 2,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: 15,
                              color: "#111827",
                            }}
                          >
                            Cashfree Payments Portal
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              background: "#f35c27",
                              color: "#fff",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 4,
                            }}
                          >
                            CASHFREE
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            lineHeight: 1.4,
                          }}
                        >
                          Instant UPI (Google Pay, PhonePe, Paytm, CRED), Cards
                          (Visa, MasterCard, RuPay), NetBanking & PayLater.
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Terms & Policy Agreement */}
                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                    />
                    <label
                      htmlFor="terms"
                      style={{ fontSize: 13, color: "#4b5563" }}
                    >
                      I agree to the{" "}
                      <Link
                        href="/policies/terms"
                        style={{ color: "#111", textDecoration: "underline" }}
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/policies/shipping"
                        style={{ color: "#111", textDecoration: "underline" }}
                      >
                        Shipping Policy
                      </Link>
                      .
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
                      background: "#111111",
                      opacity: isProcessingPayment ? 0.75 : 1,
                      cursor: isProcessingPayment ? "not-allowed" : "pointer",
                    }}
                  >
                    {isProcessingPayment
                      ? "Securing Payment & Placing Order..."
                      : `Pay ₹${cartGrandTotal.toLocaleString("en-IN")} with Cashfree →`}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary & Coupon Box */}
            <div className="checkout-summary-col">
              <div className="checkout-order-summary-card">
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    margin: "0 0 16px",
                    borderBottom: "1px solid #f3f4f6",
                    paddingBottom: 10,
                  }}
                >
                  Order Review ({cart.length})
                </h3>

                {/* Items List */}
                <div
                  style={{
                    maxHeight: 260,
                    overflowY: "auto",
                    marginBottom: 16,
                  }}
                >
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize}`}
                      style={{
                        display: "flex",
                        gap: 12,
                        marginBottom: 12,
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 46,
                          height: 56,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          Size: <strong>{item.selectedSize}</strong>
                          {item.selectedColor
                            ? ` • Color: ${item.selectedColor}`
                            : ""}{" "}
                          × {item.quantity}
                        </div>
                        {item.fitDetails ? (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#166534",
                              marginTop: 4,
                              background: "#f0fdf4",
                              border: "1px solid #bbf7d0",
                              padding: "4px 8px",
                              borderRadius: 6,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 6,
                            }}
                          >
                            <span>
                              <strong>✦ Fit:</strong> Bust {item.fitDetails.bust}&quot; • Waist{" "}
                              {item.fitDetails.waist}&quot; • Hips{" "}
                              {item.fitDetails.hips}&quot;
                              {item.fitDetails.fitPreference
                                ? ` (${item.fitDetails.fitPreference})`
                                : ""}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFitItem(item);
                                setIsFitModalOpen(true);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#166534",
                                fontWeight: 700,
                                textDecoration: "underline",
                                fontSize: 11,
                                cursor: "pointer",
                                padding: 0,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Edit ✎
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFitItem(item);
                              setIsFitModalOpen(true);
                            }}
                            style={{
                              marginTop: 5,
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#660608",
                              background: "#FAF4EC",
                              border: "1px dashed rgba(102, 6, 8, 0.4)",
                              padding: "5px 8px",
                              borderRadius: 6,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 6,
                              width: "100%",
                              textAlign: "left",
                              transition: "background 0.2s",
                            }}
                          >
                            <span>✦ Add Custom Fit (Bust, Waist & Length)</span>
                            <span
                              style={{
                                textDecoration: "underline",
                                whiteSpace: "nowrap",
                              }}
                            >
                              + Add Fits
                            </span>
                          </button>
                        )}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Input Box */}
                <div
                  style={{
                    borderTop: "1px solid #f3f4f6",
                    paddingTop: 14,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 8,
                    }}
                  >
                    <FiTag size={14} color="#f35c27" />
                    <span>Apply Coupon Code</span>
                  </div>

                  {appliedCoupon ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        padding: "8px 12px",
                        borderRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#065f46",
                        }}
                      >
                        ✓ {appliedCoupon.code} (-₹{discountAmount})
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc2626",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
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
                    <div
                      style={{
                        fontSize: 11,
                        marginTop: 4,
                        color:
                          couponFeedback.type === "success"
                            ? "#047857"
                            : "#b91c1c",
                      }}
                    >
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
                    <div
                      className="cart-summary-row"
                      style={{ fontSize: 14, color: "#15803d" }}
                    >
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="cart-summary-row" style={{ fontSize: 14 }}>
                    <span>Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong style={{ color: "#15803d" }}>FREE</strong>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div
                    className="cart-summary-row"
                    style={{ fontSize: 13, color: "#4b5563" }}
                  >
                    <span>Estimated GST ({cartGstPercent || 5}%)</span>
                    <span>
                      + ₹
                      {Math.round(cartGstAmount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div
                    className="cart-summary-row cart-summary-total"
                    style={{ fontSize: 18 }}
                  >
                    <span>Grand Total</span>
                    <span>₹{cartGrandTotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "#166534",
                      marginTop: 6,
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#16a34a",
                        display: "inline-block",
                      }}
                    />
                    <span>5% GST added at checkout</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: 16,
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                >
                  <FiLock size={13} color="#15803d" />
                  <span>100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Secure Payment Loading Overlay */}
      {isProcessingPayment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 999999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              border: "4px solid rgba(255, 255, 255, 0.2)",
              borderTop: "4px solid #f35c27",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              marginBottom: 20,
            }}
          />
          <h3
            style={{
              fontSize: 22,
              fontWeight: 800,
              margin: "0 0 8px",
              color: "#ffffff",
            }}
          >
            Connecting to Cashfree Secure Payments...
          </h3>
          <p
            style={{
              color: "#d1d5db",
              fontSize: 14,
              margin: 0,
              maxWidth: 380,
              lineHeight: 1.5,
            }}
          >
            Please wait while we connect securely to payment gateway. Do not
            refresh or press back.
          </p>
        </div>
      )}

      {editingFitItem && (
        <FitDetailsModal
          isOpen={isFitModalOpen}
          onClose={() => {
            setIsFitModalOpen(false);
            setEditingFitItem(null);
          }}
          product={editingFitItem}
          initialSize={editingFitItem.selectedSize || "M"}
          initialColor={editingFitItem.selectedColor || ""}
          initialFitDetails={editingFitItem.fitDetails || null}
          mode="edit"
          onSaveAndProceed={(fitData) => {
            if (updateCartItemFit) {
              updateCartItemFit(editingFitItem, fitData);
            }
            setIsFitModalOpen(false);
            setEditingFitItem(null);
          }}
        />
      )}
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#666" }}>Loading checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
