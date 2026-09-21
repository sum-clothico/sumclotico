"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { FiLink, FiPlus, FiCopy, FiCheck, FiTrash2, FiExternalLink, FiTrendingUp } from "react-icons/fi";

export default function AdminLinksPage() {
  const { campaignLinks = [], createCampaignLink, deleteCampaignLink } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [formData, setFormData] = useState({
    campaignName: "",
    slug: "",
    source: "Instagram",
    medium: "Social Post",
    targetPage: "/collection",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateLink = (e) => {
    e.preventDefault();
    if (!formData.campaignName.trim()) return;

    createCampaignLink({
      campaignName: formData.campaignName,
      slug: formData.slug || formData.campaignName.toLowerCase().replace(/[^a-z0-9_-]+/g, "_"),
      source: formData.source,
      medium: formData.medium,
      targetPage: formData.targetPage,
    });

    setShowAddModal(false);
    setFormData({
      campaignName: "",
      slug: "",
      source: "Instagram",
      medium: "Social Post",
      targetPage: "/collection",
    });
  };

  const handleCopy = (id, url) => {
    try {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const totalClicks = campaignLinks.reduce((acc, l) => acc + (l.clicks || 0), 0);

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">Custom Campaign & Influencer Links ({campaignLinks.length})</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Generate trackable marketing URLs for Instagram, WhatsApp, Influencer collabs, and monitor click analytics.
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: "#1e293b", padding: "6px 14px", borderRadius: 8, border: "1px solid #334155", fontSize: 13, color: "#f8fafc" }}>
              Total Link Clicks: <strong style={{ color: "#38bdf8" }}>{totalClicks}</strong>
            </div>

            <button
              className="admin-btn admin-btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus size={16} />
              <span>Generate Custom Link</span>
            </button>
          </div>
        </div>

        {/* Links Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Campaign Name & Source</th>
                <th>Trackable URL</th>
                <th>Target Page</th>
                <th>Total Clicks</th>
                <th>Conversions</th>
                <th>Revenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaignLinks.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                    No custom campaign links generated yet. Click "Generate Custom Link" to create one.
                  </td>
                </tr>
              ) : (
                campaignLinks.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{link.campaignName}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                        Source: <span style={{ color: "#38bdf8" }}>{link.source}</span> • Medium: {link.medium}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="text"
                          readOnly
                          value={link.fullUrl}
                          style={{
                            background: "#0f172a",
                            border: "1px solid #334155",
                            color: "#94a3b8",
                            fontSize: 11,
                            padding: "4px 8px",
                            borderRadius: 4,
                            width: 220,
                            fontFamily: "monospace",
                          }}
                        />
                        <button
                          onClick={() => handleCopy(link.id, link.fullUrl)}
                          style={{
                            background: copiedId === link.id ? "#059669" : "#334155",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 8px",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                          title="Copy Link"
                        >
                          {copiedId === link.id ? <FiCheck size={12} /> : <FiCopy size={12} />}
                          <span>{copiedId === link.id ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </td>
                    <td style={{ color: "#e2e8f0", fontSize: 13 }}>
                      {link.targetPage}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: "#38bdf8",
                          background: "#0c4a6e",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {link.clicks || 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>
                        {link.conversions || 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc" }}>
                        ₹{(link.revenue || 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          if (confirm(`Delete tracking link "${link.campaignName}"?`)) {
                            deleteCampaignLink(link.id);
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
                        title="Delete Link"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Custom Link Modal */}
      {showAddModal && (
        <div className="quickview-overlay">
          <div className="quickview-card" style={{ maxWidth: 520, gridTemplateColumns: "1fr", padding: 32, borderRadius: 16 }}>
            <button
              className="cart-close-btn"
              style={{ position: "absolute", top: 16, right: 16 }}
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>

            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>Generate Trackable Campaign Link</h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>
              Create a custom URL with UTM tracking parameters to measure marketing channels and influencer conversions.
            </p>

            <form onSubmit={handleCreateLink}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="auth-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="auth-label">Campaign Name</label>
                  <input
                    type="text"
                    name="campaignName"
                    className="auth-input"
                    value={formData.campaignName}
                    onChange={handleInputChange}
                    placeholder="e.g. Diwali Khadi Story Ad"
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Source</label>
                  <select
                    name="source"
                    className="auth-input"
                    value={formData.source}
                    onChange={handleInputChange}
                    style={{ background: "#fff" }}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp Broadcast</option>
                    <option value="Facebook">Facebook Ads</option>
                    <option value="Influencer">Influencer Collaboration</option>
                    <option value="Email">Email Newsletter</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Medium / Placement</label>
                  <input
                    type="text"
                    name="medium"
                    className="auth-input"
                    value={formData.medium}
                    onChange={handleInputChange}
                    placeholder="e.g. Bio Link, Story Swipe, Reel"
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Custom Slug (Short Code)</label>
                  <input
                    type="text"
                    name="slug"
                    className="auth-input"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g. festive_drop_26"
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Destination Landing Page</label>
                  <select
                    name="targetPage"
                    className="auth-input"
                    value={formData.targetPage}
                    onChange={handleInputChange}
                    style={{ background: "#fff" }}
                  >
                    <option value="/collection">Collection Page (/collection)</option>
                    <option value="/">Homepage (/)</option>
                    <option value="/our-story">Our Story (/our-story)</option>
                    <option value="/fabric">Fabric (/fabric)</option>
                  </select>
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
                  Generate & Save Link →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
