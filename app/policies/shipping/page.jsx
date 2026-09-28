"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useStore } from "@/context/StoreContext";

export default function ShippingPolicyPage() {
  const { policies = {} } = useStore();
  const policy = policies.shipping || {
    title: "Shipping & Delivery Policy",
    subtitle: "Pan-India Express Logistics with BlueDart & Delhivery",
    lastUpdated: "September 2026",
    sections: [],
  };

  return (
    <>
      <Navbar />
      <div style={{ background: "#fbfbfc", minHeight: "100vh", padding: "140px 24px 80px", color: "#111827" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", background: "#ffffff", padding: "44px", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#f35c27" }}>
            Policies & Guidelines
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "8px 0 6px", letterSpacing: "-0.5px" }}>
            {policy.title}
          </h1>
          {policy.subtitle && (
            <div style={{ fontSize: 15, color: "#4b5563", marginBottom: 6, fontStyle: "italic" }}>
              {policy.subtitle}
            </div>
          )}
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 28 }}>
            Last Updated: {policy.lastUpdated || "September 2026"}
          </div>

          <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 24 }}>
            {(policy.sections || []).map((sec, idx) => (
              <section key={sec.id || idx} style={{ borderBottom: idx < policy.sections.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: idx < policy.sections.length - 1 ? 20 : 0 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
                  {sec.title}
                </h2>
                <div style={{ margin: 0, whiteSpace: "pre-line" }}>
                  {sec.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
