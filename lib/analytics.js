// ─── lib/analytics.js — D2C Funnel & Comprehensive Event Tracker ──────────────

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-4PDRN1Q81Y";

/**
 * Helper to ensure window.gtag is initialized and available
 */
export function ensureGtag() {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
  return window.gtag;
}

/**
 * Tracks SPA Page Views for Google Analytics 4
 * @param {string} url 
 * @param {string} title 
 */
export function trackPageView(url, title = "") {
  if (typeof window === "undefined") return;

  const pageTitle = title || document.title || "SUM CLOTHICO";
  const gtag = ensureGtag();

  console.log(
    `%c[GA4 Analytics: page_view] %c${url}`,
    "background: #2563eb; color: #ffffff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
    "color: #2563eb; font-weight: 700;",
    { url, title: pageTitle, measurementId: GA_MEASUREMENT_ID, timestamp: new Date().toLocaleTimeString() }
  );

  if (gtag) {
    try {
      gtag("event", "page_view", {
        page_location: window.location.href,
        page_path: url,
        page_title: pageTitle,
      });
    } catch (err) {
      console.warn("[GA4] Pageview error:", err);
    }
  }

  if (window.dataLayer && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: "page_view",
      page_path: url,
      page_title: pageTitle,
    });
  }
}

/**
 * Core event logger for D2C Funnel & Interactive touchpoints
 * Compatible with Google Analytics 4 (GA4), Meta Pixel, and internal analytics
 * @param {string} eventName
 * @param {object} params
 */
export function trackEvent(eventName, params = {}) {
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...params,
  };

  if (typeof window !== "undefined") {
    // Prominent Console Log for every analytics event with badge styling
    console.log(
      `%c[GA4 Event: ${eventName}]`,
      "background: #f35c27; color: #ffffff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
      params
    );

    const gtag = ensureGtag();
    if (gtag) {
      try {
        gtag("event", eventName, params);
      } catch (err) {
        console.warn("[GA4] gtag event error:", err);
      }
    }

    // Window dataLayer bridge for GTM
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }

    // Persist recent customer events in sessionStorage for abandoned cart & behavioral triggers
    try {
      const existing = JSON.parse(
        sessionStorage.getItem("sum_user_events") || "[]",
      );
      existing.push({ event: eventName, timestamp: Date.now(), data: params });
      if (existing.length > 50) existing.shift();
      sessionStorage.setItem("sum_user_events", JSON.stringify(existing));
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * GA4 Standard: View Item List (Catalog / Collection Page)
 */
export function trackViewItemList(items, listName = "Collection", filters = {}) {
  trackEvent("view_item_list", {
    item_list_name: listName,
    item_list_id: listName.toLowerCase().replace(/\s+/g, "_"),
    ...filters,
    items: (items || []).slice(0, 20).map((item, idx) => ({
      item_id: String(item.id),
      item_name: item.name,
      price: item.salePrice || item.price,
      item_category: item.category || "Handloom",
      index: idx + 1,
    })),
  });
}

/**
 * GA4 Standard: View Item (Product Details / Quick View)
 */
export function trackViewItem(product, selectedSize = "M") {
  if (!product) return;
  const price = (product.sizePrices && product.sizePrices[selectedSize])
    ? Number(product.sizePrices[selectedSize])
    : (product.salePrice || product.price);

  trackEvent("view_item", {
    currency: "INR",
    value: price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        price: price,
        item_category: product.category || "Handloom",
        item_variant: selectedSize,
      },
    ],
  });
}

/**
 * GA4 Standard: Add to Cart
 */
export function trackAddToCart(product, quantity = 1, size = "M", color = "") {
  if (!product) return;
  const price = (product.sizePrices && product.sizePrices[size])
    ? Number(product.sizePrices[size])
    : (product.salePrice || product.price);

  trackEvent("add_to_cart", {
    currency: "INR",
    value: price * quantity,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        price: price,
        quantity: quantity,
        item_variant: size,
        item_category: product.category || "Handloom",
        item_color: color,
      },
    ],
  });
}

/**
 * GA4 Standard: Remove from Cart
 */
export function trackRemoveFromCart(product, quantity = 1, size = "M") {
  if (!product) return;
  const price = product.price || 0;

  trackEvent("remove_from_cart", {
    currency: "INR",
    value: price * quantity,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        price: price,
        quantity: quantity,
        item_variant: size,
      },
    ],
  });
}

/**
 * GA4 Standard: View Cart
 */
export function trackViewCart(cart = [], total = 0) {
  trackEvent("view_cart", {
    currency: "INR",
    value: total,
    items: cart.map((item, idx) => ({
      item_id: String(item.id),
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.selectedSize,
      index: idx + 1,
    })),
  });
}

/**
 * GA4 Standard: Begin Checkout
 */
export function trackBeginCheckout(cart = [], total = 0, couponCode = "") {
  trackEvent("begin_checkout", {
    currency: "INR",
    value: total,
    coupon: couponCode || undefined,
    items: cart.map((item, idx) => ({
      item_id: String(item.id),
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.selectedSize,
      index: idx + 1,
    })),
  });
}

/**
 * GA4 Standard: Purchase
 */
export function trackPurchase(order) {
  if (!order) return;
  trackEvent("purchase", {
    transaction_id: order.orderNumber,
    value: order.totalAmount,
    currency: "INR",
    tax: 0,
    shipping: order.shippingFee || 0,
    coupon: order.appliedCoupon?.code || undefined,
    payment_type: order.paymentGateway,
    items: (order.items || []).map((item, idx) => ({
      item_id: String(item.id),
      item_name: item.title || item.name,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.selectedSize,
      index: idx + 1,
    })),
  });
}

/**
 * GA4 Standard: Search
 */
export function trackSearch(query, resultCount = 0) {
  if (!query) return;
  trackEvent("search", {
    search_term: query,
    result_count: resultCount,
  });
}

/**
 * GA4 Standard: Generate Lead
 */
export function trackLead(method = "whatsapp", details = {}) {
  trackEvent("generate_lead", {
    lead_type: method,
    ...details,
  });
}

/**
 * Track custom marketing link / campaign visits
 */
export function trackCampaignVisit() {
  if (typeof window === "undefined") return;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    const ref = urlParams.get("ref");

    if (utmSource || utmCampaign || ref) {
      // Update links click tracker in localStorage
      const savedLinks = JSON.parse(
        localStorage.getItem("sum_campaign_links") || "[]",
      );
      const linkIdx = savedLinks.findIndex(
        (l) =>
          l.slug === ref ||
          l.campaignName === utmCampaign ||
          l.source === utmSource,
      );

      if (linkIdx > -1) {
        savedLinks[linkIdx].clicks = (savedLinks[linkIdx].clicks || 0) + 1;
        savedLinks[linkIdx].lastClickedAt = new Date().toISOString();
        localStorage.setItem("sum_campaign_links", JSON.stringify(savedLinks));
      }

      // Log GA4 campaign event
      trackEvent("campaign_link_click", {
        source: utmSource || "direct",
        medium: utmMedium || "referral",
        campaign: utmCampaign || ref || "custom_promo",
        ref_code: ref || "",
        landing_page: window.location.pathname,
      });
    }
  } catch (e) {
    console.error("Failed to track campaign visit:", e);
  }
}

