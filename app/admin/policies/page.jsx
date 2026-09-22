"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { FiFileText, FiPlus, FiTrash2, FiSave, FiExternalLink, FiCheck, FiShield } from "react-icons/fi";

const POLICY_TABS = [
  { key: "terms", label: "Terms & Conditions", href: "/policies/terms" },
  { key: "privacy", label: "Privacy Policy", href: "/policies/privacy" },
  { key: "returns", label: "Returns & Exchanges", href: "/policies/returns" },
  { key: "shipping", label: "Shipping & Delivery", href: "/policies/shipping" },
  { key: "cancellation", label: "Cancellation Policy", href: "/policies/cancellation" },
];

export default function AdminPoliciesPage() {
  const { policies = {}, updatePolicy } = useStore();
  const [activeTab, setActiveTab] = useState("terms");
  const [feedback, setFeedback] = useState("");

  const currentPolicy = policies[activeTab] || {
    title: "",
    subtitle: "",
    lastUpdated: "September 2026",
    sections: [],
  };

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    sections: [],
  });

  useEffect(() => {
    if (policies[activeTab]) {
      setFormData({
        title: policies[activeTab].title || "",
        subtitle: policies[activeTab].subtitle || "",
        sections: (policies[activeTab].sections || []).map((s) => ({ ...s })),
      });
    }
  }, [activeTab, policies]);

  const handleSectionChange = (index, field, value) => {
    setFormData((prev) => {
      const nextSections = [...prev.sections];
      nextSections[index] = {
        ...nextSections[index],
        [field]: value,
      };
      return { ...prev, sections: nextSections };
    });
  };

  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `sec-${Date.now()}`,
          title: `${prev.sections.length + 1}. New Policy Clause`,
          content: "Enter the detailed terms, conditions, or guidelines for this clause...",
        },
      ],
    }));
  };

  const handleDeleteSection = (index) => {
    setFormData((prev) => {
      const nextSections = prev.sections.filter((_, i) => i !== index);
      return { ...prev, sections: nextSections };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePolicy(activeTab, {
      title: formData.title,
      subtitle: formData.subtitle,
      sections: formData.sections,
    });

    setFeedback(`✓ ${formData.title || "Policy"} updated successfully! Changes are live immediately.`);
    setTimeout(() => setFeedback(""), 4000);
  };

  const activeTabMeta = POLICY_TABS.find((t) => t.key === activeTab);

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">Legal & Compliance Policy Editor (CMS)</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Directly edit and publish store policies. All changes synchronize instantly across frontend pages and checkout.
            </div>
          </div>

          {activeTabMeta && (
            <Link
              href={activeTabMeta.href}
              target="_blank"
              className="admin-btn admin-btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
            >
              <span>View Customer Page</span>
              <FiExternalLink size={13} />
            </Link>
          )}
        </div>

        {/* Policy Tab Switcher */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, borderBottom: "1px solid #2d3342", paddingBottom: 14 }}>
          {POLICY_TABS.map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: isSelected ? "1px solid #f35c27" : "1px solid #374151",
                  background: isSelected ? "#f35c27" : "#1f242d",
                  color: isSelected ? "#ffffff" : "#d1d5db",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.15s ease",
                }}
              >
                <FiFileText size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div
            style={{
              background: "#065f46",
              color: "#6ee7b7",
              padding: "12px 18px",
              borderRadius: 8,
              marginBottom: 20,
              fontWeight: 600,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FiCheck size={16} />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="admin-form-grid" style={{ marginBottom: 20 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Policy Title</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Subtitle / Description</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Artisanal Handloom Nuances & Customer Rights"
              />
            </div>
          </div>

          {/* Sections Builder */}
          <div style={{ background: "#14171d", padding: 20, borderRadius: 10, border: "1px solid #2d3342", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <strong style={{ fontSize: 14, color: "#fff" }}>Policy Clauses & Content ({formData.sections.length})</strong>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                  Each clause appears with a bold header and descriptive paragraphs on the live website.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="admin-btn admin-btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#34d399", fontWeight: 700 }}
              >
                <FiPlus size={14} />
                <span>+ Add Clause</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {formData.sections.map((section, idx) => (
                <div
                  key={section.id || idx}
                  style={{
                    background: "#1f242d",
                    border: "1px solid #374151",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#f35c27" }}>
                      Clause #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                      }}
                      title="Delete this clause"
                    >
                      <FiTrash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", display: "block", marginBottom: 4 }}>
                      Clause Heading
                    </label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={section.title}
                      onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                      placeholder="e.g. 1. Acceptance of Terms"
                      style={{ background: "#0d0f12" }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", display: "block", marginBottom: 4 }}>
                      Clause Details & Policy Text
                    </label>
                    <textarea
                      rows="4"
                      className="admin-form-textarea"
                      value={section.content}
                      onChange={(e) => handleSectionChange(idx, "content", e.target.value)}
                      placeholder="Enter the full policy terms..."
                      style={{ background: "#0d0f12" }}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af" }}>
              <FiShield size={14} color="#34d399" />
              <span>Changes take effect immediately on frontend policy pages & checkout.</span>
            </div>

            <button type="submit" className="admin-btn admin-btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px" }}>
              <FiSave size={16} />
              <span>Save & Publish {formData.title || "Policy"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
