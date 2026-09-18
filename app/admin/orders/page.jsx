"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function AdminOrdersPage() {
  const { orders = [], updateOrderStatus } = useStore();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = (orders || []).filter((o) => {
    if (!o) return false;
    const matchesFilter = filter === "ALL" || o.orderStatus === filter;
    const term = (search || "").toLowerCase().trim();
    if (!term) return matchesFilter;

    const orderNum = (o.orderNumber || "").toString().toLowerCase();
    const custName = (o.customer?.name || "").toString().toLowerCase();
    const custEmail = (o.customer?.email || "").toString().toLowerCase();
    const custPhone = (o.customer?.phone || "").toString().toLowerCase();
    const city = (o.shippingAddress?.city || "").toString().toLowerCase();

    const matchesSearch =
      orderNum.includes(term) ||
      custName.includes(term) ||
      custEmail.includes(term) ||
      custPhone.includes(term) ||
      city.includes(term);

    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? "Recent" : d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="admin-card-title">Live Orders & Fulfillment CRM ({filtered.length})</div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
            Monitor, inspect, and transition order fulfillment lifecycle stages in real-time.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            type="text"
            className="admin-form-input"
            placeholder="Search by order #, customer, city..."
            style={{ width: 260, padding: "8px 12px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-form-select"
            style={{ width: "auto", padding: "8px 12px" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            <option value="PLACED">Placed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Items & Sizes</th>
              <th>Total (INR)</th>
              <th>Status Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                  No orders found matching the selected filter or search term.
                </td>
              </tr>
            ) : (
              filtered.map((ord) => (
                <tr key={ord.id || ord.orderNumber}>
                  <td style={{ fontWeight: 800, color: "#fff" }}>#{ord.orderNumber || "ORD-000"}</td>
                  <td style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap" }}>
                    {formatDate(ord.createdAt)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#fff" }}>{ord.customer?.name || "Anonymous Customer"}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{ord.customer?.email || "No email"}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{ord.customer?.phone || ""}</div>
                  </td>
                  <td>
                    <div>{ord.shippingAddress?.street || "Standard Address"}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>
                      {[ord.shippingAddress?.city, ord.shippingAddress?.state].filter(Boolean).join(", ")}
                      {ord.shippingAddress?.pincode ? ` - ${ord.shippingAddress.pincode}` : ""}
                    </div>
                  </td>
                  <td>
                    {(ord.items || []).map((it, i) => (
                      <div key={i} style={{ fontSize: 12, marginBottom: 3 }}>
                        <span style={{ color: "#e5e7eb", fontWeight: 600 }}>{it.title || it.name || "Handcrafted Garment"}</span>{" "}
                        <span style={{ color: "#9ca3af" }}>({it.selectedSize || "M"}) × {it.quantity || 1}</span>
                      </div>
                    ))}
                  </td>
                  <td style={{ fontWeight: 800, color: "#34d399", whiteSpace: "nowrap" }}>
                    ₹{(ord.totalAmount || 0).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <select
                      className="admin-form-select"
                      style={{ padding: "6px 10px", fontSize: 12, width: "auto" }}
                      value={ord.orderStatus || "PLACED"}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
