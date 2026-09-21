"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { FiTag, FiPlus, FiTrash2, FiPower, FiCheck, FiCalendar } from "react-icons/fi";

export default function AdminCouponsPage() {
  const { coupons = [], createCoupon, toggleCouponStatus, toggleCouponBanner, deleteCoupon } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    type: "percentage",
    value: 10,
    minOrder: 0,
    maxDiscount: 1000,
    expiresAt: "",
    showInBanner: false,
    bannerText: "",
  });

  const handleInputChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    createCoupon({
      code: formData.code,
      title: formData.title || `${formData.code.toUpperCase()} Discount`,
      description: formData.description,
      type: formData.type,
      value: Number(formData.value),
      minOrder: Number(formData.minOrder) || 0,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      showInBanner: formData.showInBanner,
      bannerText: formData.bannerText || (formData.title ? `${formData.title.toUpperCase()} • CODE: ${formData.code.toUpperCase()}` : `SPECIAL OFFER • USE CODE: ${formData.code.toUpperCase()}`),
    });

    setShowAddModal(false);
    setFormData({
      code: "",
      title: "",
      description: "",
      type: "percentage",
      value: 10,
      minOrder: 0,
      maxDiscount: 1000,
      expiresAt: "",
      showInBanner: false,
      bannerText: "",
    });
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">Promotional Offers & Coupon Manager ({coupons.length})</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Create discount promo codes, set minimum cart spend, and expire promotional campaigns on the fly.
            </div>
          </div>

          <button
            className="admin-btn admin-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus size={16} />
            <span>Create New Coupon</span>
          </button>
        </div>

        {/* Coupons Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount Type & Value</th>
                <th>Min Cart Value</th>
                <th>Max Cap</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Top Banner Announcement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                    No coupons created yet. Click "Create New Coupon" to set up your first promo.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => {
                  const isExpiredByDate = c.expiresAt && new Date(c.expiresAt) < new Date();
                  const effectiveActive = c.isActive && !isExpiredByDate;
                  const isLiveBanner = c.showInBanner && effectiveActive;

                  return (
                    <tr key={c.code}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontSize: 14,
                              fontWeight: 900,
                              background: "#1e293b",
                              color: "#f8fafc",
                              padding: "4px 10px",
                              borderRadius: 6,
                              border: "1px solid #334155",
                              letterSpacing: 1,
                            }}
                          >
                            {c.code}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{c.title}</div>
                      </td>
                      <td>
                        <strong style={{ color: "#34d399", fontSize: 14 }}>
                          {c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                        </strong>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                          {c.type === "percentage" ? "Percentage Discount" : "Fixed Amount"}
                        </div>
                      </td>
                      <td style={{ color: "#e5e7eb" }}>
                        {c.minOrder > 0 ? `₹${c.minOrder.toLocaleString("en-IN")}` : "No minimum"}
                      </td>
                      <td style={{ color: "#9ca3af" }}>
                        {c.maxDiscount ? `₹${c.maxDiscount.toLocaleString("en-IN")}` : "No limit"}
                      </td>
                      <td style={{ fontSize: 13, color: isExpiredByDate ? "#ef4444" : "#9ca3af" }}>
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never expires"}
                        {isExpiredByDate && <div style={{ fontSize: 10, fontWeight: 700 }}>EXPIRED</div>}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: effectiveActive ? "#065f46" : "#7f1d1d",
                            color: effectiveActive ? "#6ee7b7" : "#fca5a5",
                          }}
                        >
                          {effectiveActive ? "ACTIVE" : "DEACTIVATED"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <button
                            onClick={() => toggleCouponBanner(c.code)}
                            disabled={!effectiveActive}
                            style={{
                              background: isLiveBanner ? "rgba(243, 92, 39, 0.2)" : "#1e293b",
                              border: `1px solid ${isLiveBanner ? "#f35c27" : "#334155"}`,
                              color: isLiveBanner ? "#f35c27" : "#94a3b8",
                              borderRadius: 6,
                              padding: "5px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: effectiveActive ? "pointer" : "not-allowed",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              opacity: effectiveActive ? 1 : 0.5,
                            }}
                            title={isLiveBanner ? "Click to remove from announcement banner" : "Click to display on storefront announcement banner"}
                          >
                            <span>{isLiveBanner ? "★ Live on Banner" : "Show on Banner"}</span>
                          </button>
                          {c.showInBanner && (
                            <span style={{ fontSize: 10, color: "#9ca3af", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {c.bannerText}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => toggleCouponStatus(c.code)}
                            style={{
                              background: c.isActive ? "#374151" : "#15803d",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: 6,
                              padding: "6px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title={c.isActive ? "Expire / Deactivate coupon" : "Activate coupon"}
                          >
                            <FiPower size={12} />
                            <span>{c.isActive ? "Deactivate" : "Activate"}</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete coupon "${c.code}"?`)) {
                                deleteCoupon(c.code);
                              }
                            }}
                            style={{
                              background: "#7f1d1d",
                              color: "#fca5a5",
                              border: "none",
                              borderRadius: 6,
                              padding: "6px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                            title="Delete Coupon"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showAddModal && (
        <div className="quickview-overlay">
          <div className="quickview-card" style={{ maxWidth: 540, gridTemplateColumns: "1fr", padding: 32, borderRadius: 16 }}>
            <button
              className="cart-close-btn"
              style={{ position: "absolute", top: 16, right: 16 }}
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>

            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>Create Promotional Coupon</h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>
              New coupons will be active immediately for storefront cart & checkout redemption.
            </p>

            <form onSubmit={handleCreateCoupon}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="auth-form-group">
                  <label className="auth-label">Coupon Code (e.g. FESTIVE25)</label>
                  <input
                    type="text"
                    name="code"
                    className="auth-input"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="KHADI50"
                    style={{ textTransform: "uppercase" }}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Discount Type</label>
                  <select
                    name="type"
                    className="auth-input"
                    value={formData.type}
                    onChange={handleInputChange}
                    style={{ background: "#fff" }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">
                    Discount Value ({formData.type === "percentage" ? "%" : "₹"})
                  </label>
                  <input
                    type="number"
                    name="value"
                    className="auth-input"
                    value={formData.value}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Minimum Order Spend (₹)</label>
                  <input
                    type="number"
                    name="minOrder"
                    className="auth-input"
                    value={formData.minOrder}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Max Discount Cap (₹, optional)</label>
                  <input
                    type="number"
                    name="maxDiscount"
                    className="auth-input"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    placeholder="1000"
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Expiry Date (optional)</label>
                  <input
                    type="date"
                    name="expiresAt"
                    className="auth-input"
                    value={formData.expiresAt}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="auth-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="auth-label">Offer Title / Campaign Description</label>
                  <input
                    type="text"
                    name="title"
                    className="auth-input"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Festive Khadi Special Offer"
                  />
                </div>

                {/* Top Announcement Banner Toggle & Custom Message */}
                <div
                  className="auth-form-group"
                  style={{
                    gridColumn: "1 / -1",
                    background: "#f8f9fa",
                    padding: 16,
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#111827" }}>
                    <input
                      type="checkbox"
                      name="showInBanner"
                      checked={formData.showInBanner}
                      onChange={handleInputChange}
                      style={{ width: 18, height: 18, accentColor: "#f35c27", cursor: "pointer" }}
                    />
                    <span>Feature this coupon on Storefront Top Announcement Banner</span>
                  </label>

                  {formData.showInBanner && (
                    <div style={{ marginTop: 12 }}>
                      <label className="auth-label" style={{ fontSize: 12 }}>Custom Banner Announcement Copy (optional)</label>
                      <input
                        type="text"
                        name="bannerText"
                        className="auth-input"
                        value={formData.bannerText}
                        onChange={handleInputChange}
                        placeholder={`SPECIAL OFFER: Get ${formData.value || 10}${formData.type === 'percentage' ? '%' : '₹'} OFF with code ${formData.code.toUpperCase() || 'PROMO'}`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: 12, background: "#f3f4f6", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cart-checkout-btn"
                  style={{ flex: 2, margin: 0, padding: 12 }}
                >
                  Create & Activate Coupon →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
