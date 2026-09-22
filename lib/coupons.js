// ─── lib/coupons.js — Predefined Coupon & Promotional Discounts Engine ──────────────

export const AVAILABLE_COUPONS = [
  {
    code: "KHADI10",
    title: "10% Welcome Discount",
    description: "Get 10% off on all authentic handspun khadi garments.",
    type: "percentage",
    value: 10,
    minOrder: 0,
    maxDiscount: 1000,
    isActive: true,
    showInBanner: true,
    bannerText: "FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹1,999 • USE CODE: KHADI10",
  },
  {
    code: "FIRST500",
    title: "Flat ₹500 Off",
    description: "Flat ₹500 off on minimum purchase of ₹2,000.",
    type: "flat",
    value: 500,
    minOrder: 2000,
    isActive: true,
    showInBanner: false,
    bannerText: "FLAT ₹500 OFF ON ORDERS ABOVE ₹2,000 • CODE: FIRST500",
  },
  {
    code: "SUMMER20",
    title: "20% Summer Luxe Offer",
    description: "20% off on orders above ₹3,000 for our summer artisanal edit.",
    type: "percentage",
    value: 20,
    minOrder: 3000,
    maxDiscount: 2000,
    isActive: true,
    showInBanner: false,
    bannerText: "20% SUMMER LUXE DISCOUNT ON ORDERS ABOVE ₹3,000 • CODE: SUMMER20",
  },
];

/**
 * Validates and calculates discount for a given coupon code and subtotal amount
 * @param {string} code 
 * @param {number} subtotal 
 * @param {Array} customCouponsList 
 * @returns {{ valid: boolean, discountAmount: number, message: string, coupon: object|null }}
 */
export function validateAndApplyCoupon(code, subtotal, customCouponsList = null) {
  if (!code || typeof code !== "string") {
    return { valid: false, discountAmount: 0, message: "Please enter a coupon code.", coupon: null };
  }

  const list = Array.isArray(customCouponsList) && customCouponsList.length > 0 ? customCouponsList : AVAILABLE_COUPONS;
  const cleanCode = code.trim().toUpperCase();
  const coupon = list.find((c) => c.code === cleanCode && c.isActive);

  if (!coupon) {
    return { valid: false, discountAmount: 0, message: `Coupon code "${cleanCode}" is invalid, expired, or deactivated.`, coupon: null };
  }

  // Check expiration date if set
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discountAmount: 0, message: `Coupon "${cleanCode}" expired on ${new Date(coupon.expiresAt).toLocaleDateString("en-IN")}.`, coupon: null };
  }

  if (subtotal < (coupon.minOrder || 0)) {
    const needed = (coupon.minOrder || 0) - subtotal;
    return {
      valid: false,
      discountAmount: 0,
      message: `Add ₹${needed.toLocaleString("en-IN")} more to unlock "${cleanCode}" (Min order: ₹${(coupon.minOrder || 0).toLocaleString("en-IN")}).`,
      coupon: null,
    };
  }

  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.type === "flat") {
    discountAmount = Math.min(coupon.value, subtotal);
  }

  return {
    valid: true,
    discountAmount,
    message: `✓ Applied "${coupon.code}" — Saved ₹${discountAmount.toLocaleString("en-IN")}!`,
    coupon,
  };
}
