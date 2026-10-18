"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AVAILABLE_COUPONS, validateAndApplyCoupon } from "@/lib/coupons";
import { trackEvent } from "@/lib/analytics";

const StoreContext = createContext();

// ─── Backend API helper ────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "API Error");
  }
  return res.json();
}

// ─── Static / CMS content (not from DB) ───────────────────────────────────────
const PLACEHOLDER_CAMPAIGN_LINKS = [];

// Dummy fallback products removed for production — DB is source of truth

// Orders and abandoned carts start empty — loaded from MongoDB or populated on customer actions
const EMPTY_ORDERS = [];
const EMPTY_ABANDONED_CARTS = [];

const INITIAL_CATEGORIES = [
  "Tops",
  "Dresses",
  "Fabrics",
  "Accessories",
  "Co-ords",
  "Kurtas",
  "Stoles",
];

const INITIAL_POLICIES = {
  terms: {
    key: "terms",
    title: "Terms & Conditions of Service",
    subtitle: "Artisanal Handloom Nuances, Commercial Terms & Customer Rights",
    lastUpdated: "September 2026",
    sections: [
      {
        id: "sec-1",
        title: "1. Acceptance of Terms",
        content:
          "By accessing and purchasing from sumclotico.com, you agree to be bound by these terms, our shipping policy, and return policies.",
      },
      {
        id: "sec-2",
        title: "2. Artisanal Handloom Nuances",
        content:
          "Because our fabrics are spun by hand on traditional wooden looms and dyed with natural plant-based pigments, subtle variations in texture, yarn slubs, and color depth are natural hallmarks of authentic Indian khadi, not defects.",
      },
      {
        id: "sec-3",
        title: "3. Pricing & Currency",
        content:
          "All prices displayed on the store are inclusive of applicable GST taxes and denominated in Indian Rupees (INR ₹).",
      },
    ],
  },
  privacy: {
    key: "privacy",
    title: "Privacy & Data Protection Policy",
    subtitle: "Safeguarding Customer Privacy & PCI-DSS Encrypted Payments",
    lastUpdated: "September 2026",
    sections: [
      {
        id: "sec-1",
        title: "1. Information We Collect",
        content:
          "We collect information you provide directly to us when creating a customer account via Clerk, making a purchase, applying promo coupons, or contacting our support team (such as your name, email address, phone number, and shipping destination).",
      },
      {
        id: "sec-2",
        title: "2. Payment Security",
        content:
          "All electronic transactions are processed through Cashfree Payments, a PCI-DSS certified gateway. Sum Clothico does not store or process your credit card numbers, CVV codes, or net banking passwords on our servers.",
      },
      {
        id: "sec-3",
        title: "3. How We Use Your Data",
        content:
          "• To fulfill and ship your orders and send automated tracking notices.\n• To provide personalized customer service and sizing guidance.\n• We strictly never sell, rent, or trade your personal information to third parties.",
      },
    ],
  },
  returns: {
    key: "returns",
    title: "Returns, Exchanges & Store Credit Policy",
    subtitle: "7-Day Exchange & Store Credit Window",
    lastUpdated: "October 2026",
    sections: [
      {
        id: "sec-1",
        title: "1. 7-Day Exchange & Return for Store Credit",
        content:
          "We want you to love the feel and drape of our handspun khadi. If your garment doesn't fit comfortably or meet expectations, you may request a free size exchange or return for store credit within 7 calendar days from the date of package delivery.",
      },
      {
        id: "sec-2",
        title: "2. Eligibility Criteria",
        content:
          "To qualify for an exchange or store credit return:\n• The garment must be in its original, unworn, unwashed, and undamaged condition.\n• All original brand tags, labels, and craft packaging must be intact.\n• Custom tailored or bespoke length pieces are non-returnable unless defective.",
      },
      {
        id: "sec-3",
        title: "3. How to Initiate an Exchange or Return",
        content:
          "1. Visit our Order Tracking Page or reach out to us directly on WhatsApp.\n2. Search for your Order Reference (e.g. SUM-98214).\n3. Click 'Return / Exchange' and select your size replacement or store credit preference.\n4. Our courier partner will arrange package pickup within 48 hours.",
      },
      {
        id: "sec-4",
        title: "4. Store Credit Processing",
        content:
          "Because each Sum Clothico piece is handcrafted in limited artisan batches, we do not issue direct monetary refunds to bank accounts or cards. Once your returned garment passes quality inspection at our studio, you will receive 100% store credit in the form of a voucher code valid for 1 year from the date of issue.",
      },
    ],
  },
  shipping: {
    key: "shipping",
    title: "Shipping & Delivery Policy",
    subtitle: "Pan-India Express Logistics with BlueDart & Delhivery",
    lastUpdated: "September 2026",
    sections: [
      {
        id: "sec-1",
        title: "1. Order Processing Timelines",
        content:
          "All Sum Clothico pieces are handcrafted with mindful care. Orders are verified and dispatched within 24 to 48 business hours from our Kolkata studio (Monday through Saturday, excluding public holidays).",
      },
      {
        id: "sec-2",
        title: "2. Shipping Charges & Free Delivery Threshold",
        content:
          "• Free Standard Express Shipping: Available on all orders of ₹1,999 and above across all serviceable PIN codes in India.\n• Standard Shipping Fee: A nominal flat fee of ₹99 is applied to orders below ₹1,999.",
      },
      {
        id: "sec-3",
        title: "3. Estimated Delivery Windows",
        content:
          "• Metro Cities (Bengaluru, Delhi NCR, Mumbai, Kolkata, Hyderabad, Chennai, Pune): 3 – 4 business days.\n• Rest of India: 4 – 6 business days.\n• Remote / North-East Regions: 5 – 7 business days.",
      },
      {
        id: "sec-4",
        title: "4. Carrier Partners & Live Tracking",
        content:
          "We partner with premium tier-1 courier carriers including BlueDart Express, Delhivery, and DTDC. As soon as your shipment is picked up, an automated SMS/email with your Air Waybill (AWB) number is triggered, allowing real-time tracking via our Order Tracking Page.",
      },
    ],
  },
  cancellation: {
    key: "cancellation",
    title: "Cancellation & Modification Policy",
    subtitle: "Pre-Dispatch Cancellation & Order Adjustments",
    lastUpdated: "September 2026",
    sections: [
      {
        id: "sec-1",
        title: "1. Order Cancellation Window",
        content:
          "You can cancel your order free of charge at any time prior to shipment dispatch (typically within 12-24 hours of placement). Once a package is handed over to our courier partner with an active AWB, it cannot be cancelled mid-transit and must follow our standard 7-day return procedure upon delivery.",
      },
      {
        id: "sec-2",
        title: "2. How to Request Cancellation",
        content:
          "To cancel an order before dispatch, please email support@sumclothico.com or message our stylists on WhatsApp (+91 9329587707) with your Order Reference (e.g. SUM-98214).",
      },
      {
        id: "sec-3",
        title: "3. Cancellation Refunds",
        content:
          "For prepaid orders cancelled before dispatch, 100% of the transaction amount is instantly reversed and credited to your original payment account within 3 to 5 business days.",
      },
    ],
  },
};

export function StoreProvider({ children }) {
  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Search & Size Guide Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Coupon Engine & Dynamic Coupons State
  const [coupons, setCoupons] = useState(AVAILABLE_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponFeedback, setCouponFeedback] = useState(null);

  // Marketing Campaign / Affiliate Trackable Links State
  const [campaignLinks, setCampaignLinks] = useState(
    PLACEHOLDER_CAMPAIGN_LINKS,
  );

  // Abandoned Carts State (start empty — real data from real user sessions)
  const [abandonedCarts, setAbandonedCarts] = useState([]);

  // Product Catalog (loaded from MongoDB) & Live Orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Dynamic Categories State
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  // Dynamic Legal Policies State (CMS editable from Admin Panel)
  const [policies, setPolicies] = useState(INITIAL_POLICIES);

  // Customer Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState(null);
  const [adminNotifications, setAdminNotifications] = useState([
    {
      id: "notif-1",
      title: "Welcome to Sumclotico Admin Suite",
      message:
        "Direct database persistence, low-stock auto-alerts, and abandoned cart recovery are active.",
      createdAt: new Date().toISOString(),
      isRead: false,
    },
  ]);

  // ─── LOAD STATE ON MOUNT ──────────────────────────────────────────────────

  // 1. Load products from MongoDB backend (source of truth)
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        console.log(
          "%c[Backend: Loading products from MongoDB...]",
          "background: #7c3aed; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
        );
        const data = await apiFetch("/products");
        if (
          data.success &&
          Array.isArray(data.products) &&
          data.products.length > 0
        ) {
          setProducts(data.products);
          console.log(
            `%c[Backend: ✓ Loaded ${data.products.length} products from MongoDB]`,
            "background: #16a34a; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          );
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.warn(
          "%c[Backend: ⚠ Could not load products]",
          "background: #d97706; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          err.message,
        );
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // 2. Load live orders from MongoDB backend (source of truth)
  useEffect(() => {
    const loadOrders = async () => {
      try {
        console.log(
          "%c[Backend: Loading orders from MongoDB...]",
          "background: #7c3aed; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
        );
        const data = await apiFetch("/checkout/orders");
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          try {
            localStorage.setItem("sum_orders", JSON.stringify(data.orders));
          } catch {}
          console.log(
            `%c[Backend: ✓ Loaded ${data.orders.length} orders from MongoDB]`,
            "background: #16a34a; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          );
        }
      } catch (err) {
        console.warn(
          "[Backend: ⚠ Could not load orders from MongoDB]",
          err.message,
        );
      }
    };
    loadOrders();
  }, []);

  // 3. Load session state from localStorage with dummy-purging sanitizer
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("sum_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedCategories = localStorage.getItem("sum_categories");
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedPolicies = localStorage.getItem("sum_policies");
      if (savedPolicies) {
        try {
          const parsed = JSON.parse(savedPolicies);
          if (parsed?.returns?.title?.includes("Refund")) {
            parsed.returns = INITIAL_POLICIES.returns;
            localStorage.setItem("sum_policies", JSON.stringify(parsed));
          }
          setPolicies(parsed);
        } catch {
          setPolicies(INITIAL_POLICIES);
        }
      }

      const savedCoupons = localStorage.getItem("sum_coupons");
      if (savedCoupons) setCoupons(JSON.parse(savedCoupons));

      // Sanitize campaign links (purge legacy placeholders)
      const savedLinks = localStorage.getItem("sum_campaign_links");
      if (savedLinks) {
        const parsed = JSON.parse(savedLinks);
        const cleanLinks = (Array.isArray(parsed) ? parsed : []).filter(
          (l) => l && !["link-1", "link-2"].includes(l.id),
        );
        setCampaignLinks(cleanLinks);
        localStorage.setItem("sum_campaign_links", JSON.stringify(cleanLinks));
      }

      const savedUser = localStorage.getItem("sum_user");
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedAdmin = localStorage.getItem("sum_admin");
      if (savedAdmin) setAdminUser(JSON.parse(savedAdmin));

      const savedCoupon = localStorage.getItem("sum_coupon");
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));

      // Sanitize orders (purge legacy dummy demo orders)
      const savedOrders = localStorage.getItem("sum_orders");
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        const cleanOrders = (Array.isArray(parsed) ? parsed : []).filter(
          (o) =>
            o &&
            ![
              "SUM-98214",
              "SUM-98215",
              "SUM-98216",
              "SUM-98217",
              "ord-101",
              "ord-102",
            ].includes(o.id || o.orderNumber),
        );
        setOrders(cleanOrders);
        localStorage.setItem("sum_orders", JSON.stringify(cleanOrders));
      }

      // Sanitize abandoned carts (purge legacy mock carts)
      const savedAbandoned = localStorage.getItem("sum_abandoned_carts");
      if (savedAbandoned) {
        const parsed = JSON.parse(savedAbandoned);
        const cleanCarts = (Array.isArray(parsed) ? parsed : []).filter(
          (c) =>
            c && !["cart-ab-101", "cart-ab-102", "cart-ab-103"].includes(c.id),
        );
        setAbandonedCarts(cleanCarts);
        localStorage.setItem("sum_abandoned_carts", JSON.stringify(cleanCarts));
      }
    } catch (e) {
      console.error("Failed to load session data from localStorage:", e);
    }
  }, []);

  // Save Policies to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sum_policies", JSON.stringify(policies));
    } catch {}
  }, [policies]);

  // Save Categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sum_categories", JSON.stringify(categories));
    } catch {}
  }, [categories]);

  // Save Cart to localStorage (session state)
  useEffect(() => {
    try {
      localStorage.setItem("sum_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Cache products in localStorage as fallback
  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem("sum_products", JSON.stringify(products));
      } catch {}
    }
  }, [products]);

  // Save Coupons to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sum_coupons", JSON.stringify(coupons));
    } catch {}
  }, [coupons]);

  // Save Campaign Links to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sum_campaign_links", JSON.stringify(campaignLinks));
    } catch {}
  }, [campaignLinks]);

  // Cache orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sum_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Cache abandoned carts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "sum_abandoned_carts",
        JSON.stringify(abandonedCarts),
      );
    } catch {}
  }, [abandonedCarts]);

  // ─── CART ACTIONS ──────────────────────────────────────────────────────────

  const addToCart = (
    product,
    selectedSize = "M",
    selectedColor = "",
    quantity = 1,
    openCart = false,
  ) => {
    const effectivePrice =
      product.sizePrices && product.sizePrices[selectedSize]
        ? Number(product.sizePrices[selectedSize])
        : product.salePrice || product.price;
    const itemImage = product.images?.[0] || "/assets/img/14.png";

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.id === product.id &&
          i.selectedSize === selectedSize &&
          i.selectedColor === selectedColor,
      );

      if (existingIdx > -1) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? {
                ...item,
                quantity: item.quantity + quantity,
                price: effectivePrice,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          subtitle: product.subtitle || "",
          price: effectivePrice,
          regularPrice: product.price,
          selectedSize,
          selectedColor,
          quantity,
          image: itemImage,
          stock: product.stock || 20,
          sku:
            product.sku ||
            `SC-${(product.category || "PRD").toUpperCase().slice(0, 3)}-00${product.id}`,
        },
      ];
    });

    if (openCart) {
      setIsCartOpen(true);
    }

    trackEvent("add_to_cart", {
      currency: "INR",
      value: effectivePrice * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: effectivePrice,
          quantity,
          item_variant: selectedSize,
          item_category: product.category || "Handloom",
        },
      ],
    });
  };

  const removeFromCart = (productId, selectedSize, selectedColor) => {
    const itemToRemove = cart.find(
      (i) =>
        i.id === productId &&
        i.selectedSize === selectedSize &&
        (selectedColor === undefined || i.selectedColor === selectedColor),
    );

    if (itemToRemove) {
      trackEvent("remove_from_cart", {
        currency: "INR",
        value: itemToRemove.price * itemToRemove.quantity,
        items: [
          {
            item_id: itemToRemove.id,
            item_name: itemToRemove.name,
            price: itemToRemove.price,
            quantity: itemToRemove.quantity,
            item_variant: itemToRemove.selectedSize,
          },
        ],
      });
    }

    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.id === productId &&
            i.selectedSize === selectedSize &&
            i.selectedColor === selectedColor
          ),
      ),
    );
  };

  const updateQuantity = (productId, selectedSize, selectedColor, delta) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (
            i.id === productId &&
            i.selectedSize === selectedSize &&
            i.selectedColor === selectedColor
          ) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem("sum_coupon");
    } catch {}
  };

  // ─── FINANCIAL CALCULATIONS ───────────────────────────────────────────────

  const cartSubtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  // Free shipping threshold (INR ₹1,999)
  const shippingThreshold = 1999;
  const isFreeShipping =
    cartSubtotal >= shippingThreshold || cartSubtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 99;

  // Calculate discount from coupon
  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
      if (
        appliedCoupon.maxDiscount &&
        discountAmount > appliedCoupon.maxDiscount
      ) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.type === "flat") {
      discountAmount = Math.min(appliedCoupon.value, cartSubtotal);
    }
  }

  const cartGrandTotal = Math.max(
    0,
    cartSubtotal - discountAmount + shippingFee,
  );

  // ─── COUPON ACTIONS ────────────────────────────────────────────────────────

  const applyCoupon = (code) => {
    const result = validateAndApplyCoupon(code, cartSubtotal, coupons);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponFeedback({ type: "success", message: result.message });
      try {
        localStorage.setItem("sum_coupon", JSON.stringify(result.coupon));
      } catch {}
      trackEvent("apply_coupon", {
        coupon_code: result.coupon.code,
        discount: result.discountAmount,
      });
    } else {
      setCouponFeedback({ type: "error", message: result.message });
    }
    return result;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponFeedback({ type: "info", message: "Coupon removed." });
    try {
      localStorage.removeItem("sum_coupon");
    } catch {}
  };

  const createCoupon = (newCouponData) => {
    const cleanCode = newCouponData.code.trim().toUpperCase();
    const isBanner = Boolean(newCouponData.showInBanner);
    const newCoupon = {
      code: cleanCode,
      title: newCouponData.title || `${cleanCode} Promo Offer`,
      description: newCouponData.description || `Special discount voucher`,
      type: newCouponData.type || "percentage", // "percentage" | "flat"
      value: Number(newCouponData.value) || 10,
      minOrder: Number(newCouponData.minOrder) || 0,
      maxDiscount: newCouponData.maxDiscount
        ? Number(newCouponData.maxDiscount)
        : null,
      expiresAt: newCouponData.expiresAt || null,
      isActive: true,
      showInBanner: isBanner,
      bannerText:
        newCouponData.bannerText ||
        (newCouponData.title
          ? `${newCouponData.title.toUpperCase()} • CODE: ${cleanCode}`
          : `SPECIAL OFFER • USE CODE: ${cleanCode}`),
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    setCoupons((prev) => {
      const filtered = prev.filter((c) => c.code !== cleanCode);
      const adjusted = isBanner
        ? filtered.map((c) => ({ ...c, showInBanner: false }))
        : filtered;
      return [newCoupon, ...adjusted];
    });
    return newCoupon;
  };

  const toggleCouponStatus = (couponCode) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.code === couponCode ? { ...c, isActive: !c.isActive } : c,
      ),
    );
  };

  const toggleCouponBanner = (couponCode) => {
    setCoupons((prev) => {
      const target = prev.find((c) => c.code === couponCode);
      const willBeBanner = target ? !target.showInBanner : false;
      return prev.map((c) => {
        if (c.code === couponCode) {
          return { ...c, showInBanner: willBeBanner };
        }
        // If enabling banner for this coupon, unset banner for others
        return willBeBanner ? { ...c, showInBanner: false } : c;
      });
    });
  };

  const deleteCoupon = (couponCode) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    if (appliedCoupon?.code === couponCode) {
      removeCoupon();
    }
  };

  // ─── CAMPAIGN & REFERRAL LINKS MANAGEMENT ───────────────────────────────────

  const createCampaignLink = ({
    campaignName,
    slug,
    source,
    medium = "Direct",
    targetPage = "/collection",
  }) => {
    const cleanSlug = slug
      ? slug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_-]+/g, "")
      : `camp_${Date.now()}`;
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://sumclotico.com";
    const fullUrl = `${baseUrl}${targetPage}?utm_source=${encodeURIComponent(source || "custom")}&utm_campaign=${encodeURIComponent(campaignName || "promo")}&ref=${cleanSlug}`;

    const newLink = {
      id: `link-${Date.now()}`,
      campaignName,
      slug: cleanSlug,
      source,
      medium,
      targetPage,
      fullUrl,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    };

    setCampaignLinks((prev) => [newLink, ...prev]);
    return newLink;
  };

  const deleteCampaignLink = (linkId) => {
    setCampaignLinks((prev) => prev.filter((l) => l.id !== linkId));
  };

  // ─── ABANDONED CARTS AUTOMATION & CRM ───────────────────────────────────────

  const sendAbandonedCartWhatsApp = (cartId) => {
    const targetCart = abandonedCarts.find((c) => c.id === cartId);
    if (!targetCart) return null;

    const phoneDigits = targetCart.customer.phone.replace(/[^0-9]/g, "");
    const itemsList = targetCart.items
      .map((i) => `• ${i.name} (Size: ${i.selectedSize})`)
      .join("\n");
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://sumclotico.com";
    const checkoutLink = `${baseUrl}/collection?utm_source=whatsapp_recovery&cart_recover=${cartId}&coupon=COMEBACK10`;

    const message = `Namaste ${targetCart.customer.name},\n\nWe noticed you left some handcrafted Khadi pieces in your Sum Clothico bag:\n\n${itemsList}\n\nTotal: ₹${targetCart.subtotal.toLocaleString("en-IN")}\n\nTo help you complete your order, use exclusive promo code *COMEBACK10* for an extra 10% discount:\n${checkoutLink}\n\nIf you need sizing assistance, simply reply here!`;

    const waUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;

    // Update status in state
    setAbandonedCarts((prev) =>
      prev.map((c) =>
        c.id === cartId
          ? {
              ...c,
              status: "REMINDER_SENT",
              whatsappReminderSentAt: new Date().toISOString(),
            }
          : c,
      ),
    );

    // Push system log
    setAdminNotifications((prev) => [
      {
        id: `notif-wa-${Date.now()}`,
        title: `WhatsApp Cart Reminder Dispatched: ${targetCart.customer.name}`,
        message: `Recovery link with promo COMEBACK10 sent to ${targetCart.customer.phone}.`,
        createdAt: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);

    return waUrl;
  };

  const sendAbandonedCartEmail = async (cartId) => {
    const targetCart = abandonedCarts.find((c) => c.id === cartId);
    if (!targetCart) return false;

    // Send transactional email via API route
    try {
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://sumclotico.com";
      const recoveryUrl = `${baseUrl}/collection?utm_source=email_recovery&cart_recover=${cartId}&coupon=COMEBACK10`;

      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ABANDONED_CART_RECOVERY",
          to: targetCart.customer.email,
          data: {
            customerName: targetCart.customer.name,
            recoveryUrl,
          },
        }),
      }).catch((e) => console.warn("Email API error:", e));
    } catch {}

    setAbandonedCarts((prev) =>
      prev.map((c) =>
        c.id === cartId
          ? {
              ...c,
              status: "REMINDER_SENT",
              emailReminderSentAt: new Date().toISOString(),
            }
          : c,
      ),
    );

    setAdminNotifications((prev) => [
      {
        id: `notif-email-${Date.now()}`,
        title: `Recovery Email Dispatched (Resend): ${targetCart.customer.name}`,
        message: `Automated recovery email dispatched to ${targetCart.customer.email} with 10% recovery voucher (COMEBACK10).`,
        createdAt: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);

    return true;
  };

  const markCartRecovered = (cartId) => {
    setAbandonedCarts((prev) =>
      prev.map((c) =>
        c.id === cartId
          ? { ...c, status: "RECOVERED", recoveredAt: new Date().toISOString() }
          : c,
      ),
    );
  };

  const deleteAbandonedCart = (cartId) => {
    setAbandonedCarts((prev) => prev.filter((c) => c.id !== cartId));
  };

  // ─── ORDER DISPATCH & INVENTORY AUTO-ALERTS ────────────────────────────────

  // Persist order to MongoDB via backend API (source of truth)
  const persistOrderToBackend = async (order, cartItems) => {
    try {
      const payload = {
        customer: {
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
        },
        shippingAddress: order.shippingAddress,
        items: cartItems.map((item) => ({
          productId: item.id && item.id.length === 24 ? item.id : undefined,
          title: item.name || item.title || "Handloom Garment",
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize || "",
          selectedColor: item.selectedColor || "",
          image: item.image || "",
        })),
        subtotal: order.subtotal,
        discount: order.discountAmount || 0,
        couponCode: order.couponCode || null,
        shippingFee: order.shippingFee,
        totalAmount: order.totalAmount,
        paymentGateway: order.paymentGateway,
        paymentMethod: order.paymentMethod,
        transactionId: order.transactionId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        carrier: order.carrier,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        orderNumber: order.orderNumber,
      };

      console.log(
        "%c[Backend Sync: createOrder → MongoDB]",
        "background: #7c3aed; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
        {
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          itemCount: cartItems.length,
        },
      );

      const data = await apiFetch("/checkout/direct", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (data.success && data.data?.orderId) {
        console.log(
          "%c[Backend Sync: ✓ Order persisted to MongoDB]",
          "background: #16a34a; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          {
            mongoOrderId: data.data.orderId,
            orderNumber: data.data.orderNumber,
          },
        );
        // Link genuine MongoDB ObjectId to local order state
        setOrders((prev) =>
          prev.map((o) =>
            o.orderNumber === order.orderNumber
              ? { ...o, id: data.data.orderId, _mongoId: data.data.orderId }
              : o,
          ),
        );
      }
    } catch (err) {
      console.warn(
        "%c[Backend Sync: ⚠ MongoDB persist failed (local state preserved)]",
        "background: #d97706; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
        err.message,
      );
    }
  };

  const createOrder = ({
    customer,
    shippingAddress,
    paymentGateway = "Cashfree",
    paymentMethod = "Cashfree UPI (Instant)",
    paymentStatus = "PAID",
    transactionId = null,
  }) => {
    const orderNumber = `SUM-${Math.floor(10000 + Math.random() * 90000)}`;
    const actualTxnId =
      transactionId ||
      (paymentGateway === "Razorpay"
        ? `pay_${Math.random().toString(36).substring(2, 14)}`
        : paymentGateway === "Cashfree"
          ? `cf_pay_${Math.floor(10000000 + Math.random() * 90000000)}`
          : `cod_${Math.floor(100000 + Math.random() * 900000)}`);

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer,
      shippingAddress,
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      shippingFee,
      totalAmount: cartGrandTotal,
      paymentGateway,
      paymentMethod,
      transactionId: actualTxnId,
      paymentStatus,
      orderStatus: "CONFIRMED",
      carrier: "BlueDart Express",
      trackingNumber: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      estimatedDelivery: "3 - 5 business days",
      createdAt: new Date().toISOString(),
    };

    // Deduct stock in catalog & detect low-stock items
    const lowStockAlerts = [];
    setProducts((prev) =>
      prev.map((p) => {
        const matchingCartItems = cart.filter((item) => item.id === p.id);
        if (matchingCartItems.length > 0) {
          const totalBought = matchingCartItems.reduce(
            (acc, c) => acc + c.quantity,
            0,
          );
          const remainingStock = Math.max(0, (p.stock || 20) - totalBought);
          if (remainingStock <= 5) {
            lowStockAlerts.push({ ...p, remainingStock });
          }
          return {
            ...p,
            stock: remainingStock,
            salesCount: (p.salesCount || 0) + totalBought,
          };
        }
        return p;
      }),
    );

    setOrders((prev) => [newOrder, ...prev]);

    // Persist to MongoDB backend (async, non-blocking — local state already updated above)
    persistOrderToBackend(newOrder, [...cart]);

    // Send transactional order confirmation email via API
    try {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ORDER_CONFIRMATION",
          to: customer.email,
          data: newOrder,
        }),
      }).catch((e) => console.warn("Order email error:", e));

      // Send low-stock email alerts to admin
      lowStockAlerts.forEach((lp) => {
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "LOW_STOCK_ALERT",
            to: "admin@sumclotico.com",
            data: {
              productName: lp.name,
              remainingStock: lp.remainingStock,
              sku: lp.sku,
            },
          }),
        }).catch((e) => console.warn("Low stock alert error:", e));
      });
    } catch {}

    // Push Admin Order Notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `New Order Placed: #${newOrder.orderNumber}`,
      message: `${customer.name} placed an order for ₹${cartGrandTotal.toLocaleString("en-IN")}. Confirmation email dispatched via Resend.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // Auto-Alert: Email to Admin for Low Stock items
    const lowStockNotifs = lowStockAlerts.map((lp) => ({
      id: `notif-low-${Date.now()}-${lp.id}`,
      title: `LOW-STOCK AUTO ALERT: ${lp.name} (${lp.sku || "SC-PRD"})`,
      message: `Remaining stock for "${lp.name}" dropped to ${lp.remainingStock} units. Auto-alert email dispatched to admin@sumclotico.com for immediate replenishment.`,
      createdAt: new Date().toISOString(),
      isRead: false,
      isLowStock: true,
    }));

    setAdminNotifications((prev) => [...lowStockNotifs, newNotif, ...prev]);

    // Track analytics event
    trackEvent("purchase", {
      transaction_id: orderNumber,
      value: cartGrandTotal,
      currency: "INR",
      coupon: appliedCoupon ? appliedCoupon.code : undefined,
      shipping: shippingFee,
      items: cart.map((i) => ({
        item_id: i.id,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity,
        item_variant: i.selectedSize,
        item_category: i.category || "Handloom",
      })),
    });

    clearCart();
    return newOrder;
  };

  const quickRestockProduct = async (prodId, addQuantity = 10) => {
    let updatedName = "";
    let updatedStock = 0;
    let mongoId = null;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          updatedName = p.name;
          updatedStock = (p.stock || 0) + addQuantity;
          mongoId = p._mongoId || (prodId.length === 24 ? prodId : null);
          return { ...p, stock: updatedStock };
        }
        return p;
      }),
    );

    setAdminNotifications((prev) => [
      {
        id: `notif-restock-${Date.now()}`,
        title: `Inventory Restocked: ${updatedName}`,
        message: `Added +${addQuantity} units. New inventory level: ${updatedStock} units.`,
        createdAt: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);

    // Sync stock to MongoDB
    if (mongoId) {
      try {
        await apiFetch(`/products/${mongoId}`, {
          method: "PUT",
          body: JSON.stringify({ stock: updatedStock }),
        });
        console.log(
          `%c[Backend: ✓ Stock updated to ${updatedStock} for ${updatedName}]`,
          "background: #16a34a; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
        );
      } catch (err) {
        console.warn("[Backend: ⚠ Stock sync failed]", err.message);
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus, carrierInfo = {}) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? {
              ...o,
              ...(newStatus ? { orderStatus: newStatus } : {}),
              carrier: carrierInfo.carrier || o.carrier || "BlueDart Express",
              trackingNumber:
                carrierInfo.trackingNumber ||
                o.trackingNumber ||
                `TRK${Date.now().toString().slice(-8)}`,
            }
          : o,
      ),
    );

    try {
      await apiFetch(`/checkout/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({
          ...(newStatus ? { orderStatus: newStatus } : {}),
          carrier: carrierInfo.carrier,
          trackingNumber: carrierInfo.trackingNumber,
        }),
      });
      console.log(
        `%c[Backend: ✓ Order status updated in MongoDB for ${orderId}]`,
        "background: #16a34a; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
      );
    } catch (err) {
      console.warn(
        "[Backend: ⚠ Could not update order status in DB]",
        err.message,
      );
    }
  };

  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? { ...o, paymentStatus: newPaymentStatus }
          : o,
      ),
    );

    try {
      await apiFetch(`/checkout/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      console.log(
        `%c[Backend: ✓ Payment status updated in MongoDB for ${orderId}]`,
        "background: #16a34a; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
      );
    } catch (err) {
      console.warn(
        "[Backend: ⚠ Could not update payment status in DB]",
        err.message,
      );
    }
  };

  const requestReturn = async (orderNumber, reason, requestedItems = []) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderNumber === orderNumber) {
          return {
            ...o,
            returnStatus: "REQUESTED",
            returnReason: reason,
            returnRequestedAt: new Date().toISOString(),
          };
        }
        return o;
      }),
    );

    try {
      await apiFetch(`/checkout/orders/${orderNumber}/status`, {
        method: "PUT",
        body: JSON.stringify({
          returnStatus: "REQUESTED",
          returnReason: reason,
        }),
      });
    } catch (err) {
      console.warn(
        "[Backend: ⚠ Could not update return status in DB]",
        err.message,
      );
    }

    setAdminNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Return Request: #${orderNumber}`,
        message: `Customer requested a return/exchange for order #${orderNumber}. Reason: ${reason}`,
        createdAt: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Return request submitted for #${orderNumber}. Our team will contact you within 24 hours.`,
    };
  };

  // ─── ADMIN PRODUCT MANAGEMENT (Backend-integrated) ─────────────────────────

  const addProduct = async (prodData) => {
    const slug = (prodData.slug || prodData.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    const sku =
      prodData.sku ||
      `SC-${(prodData.category || "PRD").slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const tempId = `prod-${Date.now()}`;

    // Optimistic update
    const optimisticProduct = {
      id: tempId,
      slug,
      sku,
      salesCount: 0,
      productType: prodData.productType || "Top",
      collection: prodData.collection || "",
      status: prodData.status || "Active",
      gstPercent: Number(prodData.gstPercent) || 5,
      lowStockThreshold: Number(prodData.lowStockThreshold) || 5,
      variants: prodData.variants || [],
      videoUrl: prodData.videoUrl || "",
      fabricComposition:
        prodData.fabricComposition || "100% Handspun Khadi Cotton",
      fit: prodData.fit || "Regular",
      length: prodData.length || "Regular",
      sleeveType: prodData.sleeveType || "Half Sleeve",
      neckType: prodData.neckType || "Round Neck",
      hasPockets: Boolean(prodData.hasPockets),
      hasLining: Boolean(prodData.hasLining),
      fabricCare:
        prodData.fabricCare ||
        "100% Handspun Khadi Cotton. Machine wash gentle in cold water.",
      modelMeasurements: prodData.modelMeasurements || "",
      weight: Number(prodData.weight) || 0,
      returnEligible: prodData.returnEligible !== false,
      ...prodData,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [optimisticProduct, ...prev]);

    // Persist to MongoDB
    try {
      const payload = {
        title: prodData.name,
        slug,
        sku,
        subtitle: prodData.subtitle || "",
        hook: prodData.hook || "",
        description: prodData.description || "",
        price: Number(prodData.price),
        salePrice: prodData.salePrice ? Number(prodData.salePrice) : undefined,
        sizePrices: prodData.sizePrices || {},
        stock: Number(prodData.stock) || 0,
        lowStockThreshold: Number(prodData.lowStockThreshold) || 5,
        gstPercent: Number(prodData.gstPercent) || 5,
        category: prodData.category,
        productType: prodData.productType || "",
        collection: prodData.collection || "",
        status: prodData.status || "Active",
        attributes: {
          sizes: prodData.sizes || [],
          colors: prodData.colors || [],
        },
        images: (prodData.images || []).map((url) =>
          typeof url === "string" ? { url } : url,
        ),
        videoUrl: prodData.videoUrl || "",
        isFeatured: prodData.isFeatured || false,
        fabricComposition: prodData.fabricComposition || "",
        fit: prodData.fit || "",
        length: prodData.length || "",
        sleeveType: prodData.sleeveType || "",
        neckType: prodData.neckType || "",
        hasPockets: Boolean(prodData.hasPockets),
        hasLining: Boolean(prodData.hasLining),
        fabricCare:
          prodData.fabricCare ||
          "100% Handspun Khadi Cotton. Machine wash gentle in cold water.",
        modelMeasurements: prodData.modelMeasurements || "",
        weight: Number(prodData.weight) || 0,
        returnEligible: prodData.returnEligible !== false,
        variants: prodData.variants || [],
        isPublished: true,
      };

      console.log(
        "%c[Backend: Creating product in MongoDB...]",
        "background: #7c3aed; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
        payload.title,
      );

      const data = await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (data.success && data.product) {
        // Replace optimistic entry with real MongoDB document
        const realProduct = {
          id: data.product._id,
          _mongoId: data.product._id,
          name: data.product.title,
          slug: data.product.slug,
          sku: data.product.sku,
          subtitle: data.product.subtitle,
          hook: data.product.hook,
          description: data.product.description,
          price: data.product.price,
          salePrice: data.product.salePrice,
          sizePrices: data.product.sizePrices || {},
          stock: data.product.stock,
          lowStockThreshold: data.product.lowStockThreshold ?? 5,
          gstPercent: data.product.gstPercent ?? 5,
          category: data.product.category,
          productType: data.product.productType || prodData.productType || "",
          collection: data.product.collection || prodData.collection || "",
          status: data.product.status || prodData.status || "Active",
          sizes: data.product.attributes?.sizes || prodData.sizes || [],
          colors: data.product.attributes?.colors || prodData.colors || [],
          images: (data.product.images || []).map((img) => img.url || img),
          videoUrl: data.product.videoUrl || "",
          salesCount: 0,
          isFeatured: data.product.isFeatured,
          fabricComposition:
            data.product.fabricComposition || prodData.fabricComposition || "",
          fit: data.product.fit || prodData.fit || "",
          length: data.product.length || prodData.length || "",
          sleeveType: data.product.sleeveType || prodData.sleeveType || "",
          neckType: data.product.neckType || prodData.neckType || "",
          hasPockets: data.product.hasPockets ?? prodData.hasPockets ?? false,
          hasLining: data.product.hasLining ?? prodData.hasLining ?? false,
          fabricCare: data.product.fabricCare || prodData.fabricCare,
          modelMeasurements:
            data.product.modelMeasurements || prodData.modelMeasurements || "",
          weight: data.product.weight ?? prodData.weight ?? 0,
          returnEligible:
            data.product.returnEligible ?? prodData.returnEligible ?? true,
          variants: data.product.variants || prodData.variants || [],
          isPublished: data.product.isPublished,
          createdAt: data.product.createdAt,
        };
        setProducts((prev) =>
          prev.map((p) => (p.id === tempId ? realProduct : p)),
        );
        console.log(
          "%c[Backend: ✓ Product saved to MongoDB]",
          "background: #16a34a; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          realProduct.name,
        );
        return realProduct;
      }
    } catch (err) {
      console.warn(
        "%c[Backend: ⚠ Product save failed (local only)]",
        "background: #d97706; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
        err.message,
      );
    }

    return optimisticProduct;
  };

  const updateProduct = async (prodId, updatedFields) => {
    // Optimistic local update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === prodId
          ? {
              ...p,
              ...updatedFields,
              slug: updatedFields.name
                ? updatedFields.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                : p.slug,
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );

    // Find the mongo ID (_mongoId or id if it's a real ObjectId-like string)
    const product = products.find((p) => p.id === prodId);
    const mongoId = product?._mongoId || (prodId.length === 24 ? prodId : null);

    if (mongoId) {
      try {
        const payload = {
          ...(updatedFields.name && { title: updatedFields.name }),
          ...(updatedFields.name && {
            slug: updatedFields.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          }),
          ...(updatedFields.sku && { sku: updatedFields.sku }),
          ...(updatedFields.subtitle !== undefined && {
            subtitle: updatedFields.subtitle,
          }),
          ...(updatedFields.hook !== undefined && { hook: updatedFields.hook }),
          ...(updatedFields.description !== undefined && {
            description: updatedFields.description,
          }),
          ...(updatedFields.price !== undefined && {
            price: Number(updatedFields.price),
          }),
          ...(updatedFields.salePrice !== undefined && {
            salePrice: Number(updatedFields.salePrice),
          }),
          ...(updatedFields.stock !== undefined && {
            stock: Number(updatedFields.stock),
          }),
          ...(updatedFields.lowStockThreshold !== undefined && {
            lowStockThreshold: Number(updatedFields.lowStockThreshold),
          }),
          ...(updatedFields.gstPercent !== undefined && {
            gstPercent: Number(updatedFields.gstPercent),
          }),
          ...(updatedFields.category && { category: updatedFields.category }),
          ...(updatedFields.productType !== undefined && {
            productType: updatedFields.productType,
          }),
          ...(updatedFields.collection !== undefined && {
            collection: updatedFields.collection,
          }),
          ...(updatedFields.status !== undefined && {
            status: updatedFields.status,
          }),
          ...(updatedFields.isFeatured !== undefined && {
            isFeatured: updatedFields.isFeatured,
          }),
          ...(updatedFields.sizePrices && {
            sizePrices: updatedFields.sizePrices,
          }),
          ...(updatedFields.sizes && {
            attributes: {
              sizes: updatedFields.sizes,
              colors: updatedFields.colors || product?.colors || [],
            },
          }),
          ...(updatedFields.images && {
            images: updatedFields.images.map((img) =>
              typeof img === "string" ? { url: img } : img,
            ),
          }),
          ...(updatedFields.videoUrl !== undefined && {
            videoUrl: updatedFields.videoUrl,
          }),
          ...(updatedFields.fabricComposition !== undefined && {
            fabricComposition: updatedFields.fabricComposition,
          }),
          ...(updatedFields.fit !== undefined && { fit: updatedFields.fit }),
          ...(updatedFields.length !== undefined && {
            length: updatedFields.length,
          }),
          ...(updatedFields.sleeveType !== undefined && {
            sleeveType: updatedFields.sleeveType,
          }),
          ...(updatedFields.neckType !== undefined && {
            neckType: updatedFields.neckType,
          }),
          ...(updatedFields.hasPockets !== undefined && {
            hasPockets: Boolean(updatedFields.hasPockets),
          }),
          ...(updatedFields.hasLining !== undefined && {
            hasLining: Boolean(updatedFields.hasLining),
          }),
          ...(updatedFields.fabricCare !== undefined && {
            fabricCare: updatedFields.fabricCare,
          }),
          ...(updatedFields.modelMeasurements !== undefined && {
            modelMeasurements: updatedFields.modelMeasurements,
          }),
          ...(updatedFields.weight !== undefined && {
            weight: Number(updatedFields.weight),
          }),
          ...(updatedFields.returnEligible !== undefined && {
            returnEligible: Boolean(updatedFields.returnEligible),
          }),
          ...(updatedFields.variants !== undefined && {
            variants: updatedFields.variants,
          }),
        };

        console.log(
          "%c[Backend: Updating product in MongoDB...]",
          "background: #7c3aed; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          mongoId,
        );
        await apiFetch(`/products/${mongoId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        console.log(
          "%c[Backend: ✓ Product updated in MongoDB]",
          "background: #16a34a; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          mongoId,
        );
      } catch (err) {
        console.warn(
          "%c[Backend: ⚠ Product update failed (local only)]",
          "background: #d97706; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          err.message,
        );
      }
    }
  };

  const deleteProduct = async (prodId) => {
    // Optimistic removal
    setProducts((prev) => prev.filter((p) => p.id !== prodId));

    const product = products.find((p) => p.id === prodId);
    const mongoId = product?._mongoId || (prodId.length === 24 ? prodId : null);

    if (mongoId) {
      try {
        console.log(
          "%c[Backend: Deleting product from MongoDB...]",
          "background: #7c3aed; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          mongoId,
        );
        await apiFetch(`/products/${mongoId}`, { method: "DELETE" });
        console.log(
          "%c[Backend: ✓ Product deleted from MongoDB]",
          "background: #16a34a; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          mongoId,
        );
      } catch (err) {
        console.warn(
          "%c[Backend: ⚠ Product delete failed (local only)]",
          "background: #d97706; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
          err.message,
        );
      }
    }
  };

  const toggleProductFeatured = async (prodId) => {
    let message = "";
    let success = true;
    let willBeFeatured = false;
    let mongoId = null;

    setProducts((prev) => {
      const target = prev.find((p) => p.id === prodId);
      if (!target) return prev;

      mongoId = target._mongoId || (prodId.length === 24 ? prodId : null);
      const currentlyFeaturedCount = prev.filter((p) => p.isFeatured).length;
      willBeFeatured = !target.isFeatured;

      if (willBeFeatured && currentlyFeaturedCount >= 6) {
        success = false;
        message =
          "Maximum 6 products can be featured on the homepage. Please unfeature another garment first.";
        return prev;
      }

      if (!willBeFeatured && currentlyFeaturedCount <= 2) {
        success = false;
        message = "At least 2 products must remain featured on the homepage.";
        return prev;
      }

      message = willBeFeatured
        ? `✓ "${target.name}" added to Homepage Showcase (${currentlyFeaturedCount + 1}/6).`
        : `✓ "${target.name}" removed from Homepage Showcase (${currentlyFeaturedCount - 1}/6).`;

      return prev.map((p) =>
        p.id === prodId ? { ...p, isFeatured: willBeFeatured } : p,
      );
    });

    // Sync to MongoDB
    if (success && mongoId) {
      try {
        await apiFetch(`/products/${mongoId}`, {
          method: "PUT",
          body: JSON.stringify({ isFeatured: willBeFeatured }),
        });
      } catch (err) {
        console.warn("[Backend: ⚠ Featured sync failed]", err.message);
      }
    }

    return { success, message };
  };

  // ─── CUSTOMER AUTHENTICATION ──────────────────────────────────────────────

  const loginCustomer = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem("sum_user", JSON.stringify(userData));
    } catch {}
    setIsAuthModalOpen(false);
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("sum_user");
    } catch {}
  };

  // ─── ADMIN AUTHENTICATION ──────────────────────────────────────────────────

  const loginAdmin = (user) => {
    setAdminUser(user);
    try {
      localStorage.setItem("sum_admin", JSON.stringify(user));
    } catch {}
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem("sum_admin");
    } catch {}
  };

  // ─── ANALYTICS & EXECUTIVE METRICS ─────────────────────────────────────────

  const getAnalytics = () => {
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "PAID")
      .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    const totalOrdersCount = orders.length;
    const avgOrderValue =
      totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
    const pendingOrdersCount = orders.filter(
      (o) => o.orderStatus === "CONFIRMED" || o.orderStatus === "PROCESSING",
    ).length;
    const lowStockCount = products.filter((p) => (p.stock || 0) <= 5).length;
    const pendingAbandonedCartsCount = abandonedCarts.filter(
      (c) => c.status === "PENDING",
    ).length;

    const sortedProducts = [...products].sort(
      (a, b) => (b.salesCount || 0) - (a.salesCount || 0),
    );

    return {
      totalRevenue,
      totalOrdersCount,
      avgOrderValue,
      pendingOrdersCount,
      lowStockCount,
      pendingAbandonedCartsCount,
      topSellers: sortedProducts.slice(0, 5),
    };
  };

  // ─── LEGAL POLICIES & CMS MANAGEMENT ─────────────────────────────────────

  const updatePolicy = (policyKey, updatedPolicyData) => {
    setPolicies((prev) => {
      const existing = prev[policyKey] || {};
      const next = {
        ...prev,
        [policyKey]: {
          ...existing,
          ...updatedPolicyData,
          lastUpdated: new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        },
      };
      return next;
    });

    setAdminNotifications((prev) => [
      {
        id: `notif-pol-${Date.now()}`,
        title: `Policy Updated: ${updatedPolicyData.title || policyKey.toUpperCase()}`,
        message: `The live legal & compliance policy was updated from the Admin Suite.`,
        createdAt: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  // ─── DYNAMIC CATEGORIES MANAGEMENT ────────────────────────────────────────

  const addCategory = (categoryName) => {
    const clean = categoryName ? categoryName.trim() : "";
    if (!clean) return;
    setCategories((prev) => {
      if (prev.some((c) => c.toLowerCase() === clean.toLowerCase()))
        return prev;
      return [...prev, clean];
    });
    return clean;
  };

  return (
    <StoreContext.Provider
      value={{
        // Cart
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotalItems,
        isFreeShipping,
        shippingFee,
        shippingThreshold,
        discountAmount,
        cartGrandTotal,

        // Quick View & Modals
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        isSizeGuideOpen,
        setIsSizeGuideOpen,

        // Dynamic Categories
        categories,
        addCategory,

        // Legal & Compliance Policies (Admin CMS)
        policies,
        updatePolicy,

        // Coupons
        coupons,
        createCoupon,
        toggleCouponStatus,
        toggleCouponBanner,
        deleteCoupon,
        appliedCoupon,
        couponFeedback,
        applyCoupon,
        removeCoupon,

        // Campaign & Affiliate Trackable Links
        campaignLinks,
        createCampaignLink,
        deleteCampaignLink,

        // Abandoned Carts Automation
        abandonedCarts,
        sendAbandonedCartWhatsApp,
        sendAbandonedCartEmail,
        markCartRecovered,
        deleteAbandonedCart,

        // Products & Orders
        products,
        isLoadingProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        quickRestockProduct,
        toggleProductFeatured,
        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        requestReturn,

        // Customer Auth
        currentUser,
        loginCustomer,
        logoutCustomer,
        isAuthModalOpen,
        setIsAuthModalOpen,

        // Admin
        adminUser,
        loginAdmin,
        logoutAdmin,
        adminNotifications,
        setAdminNotifications,
        getAnalytics,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
