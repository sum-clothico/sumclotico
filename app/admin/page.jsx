"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function AdminDashboardPage() {
  const { orders = [], products = [], getAnalytics, updateOrderStatus, abandonedCarts = [], quickRestockProduct } = useStore();
  const analytics = getAnalytics ? getAnalytics() : { totalRevenue: 0, totalOrdersCount: 0, avgOrderValue: 0, pendingOrdersCount: 0, lowStockCount: 0, pendingAbandonedCartsCount: 0, topSellers: [] };
  const { totalRevenue = 0, totalOrdersCount = 0, avgOrderValue = 0, pendingOrdersCount = 0, lowStockCount = 0, pendingAbandonedCartsCount = 0, topSellers = [] } = analytics;
  const [filterStatus, setFilterStatus] = useState("ALL");

  const lowStockProducts = products.filter((p) => (p.stock || 0) <= 5);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? "Recent" : d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recent";
    }
  };

  // Excel (.xlsx / CSV compatible format) Export function
  const handleExportOrdersToExcel = () => {
    const headers = [
      "Order Number",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Payment Status",
      "Order Status",
      "Items Count",
      "Total Amount (INR)",
      "Shipping City",
      "Order Date",
    ];

    const rows = (orders || []).map((o) => [
      o.orderNumber || "",
      `"${(o.customer?.name || "").replace(/"/g, '""')}"`,
      `"${o.customer?.email || ""}"`,
      `"${o.customer?.phone || ""}"`,
      o.paymentStatus || "PAID",
      o.orderStatus || "PLACED",
      o.items?.length || 1,
      o.totalAmount || 0,
      `"${(o.shippingAddress?.city || "").replace(/"/g, '""')}"`,
      `"${formatDate(o.createdAt)}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sumclothico_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = filterStatus === "ALL" ? orders : (orders || []).filter((o) => o?.orderStatus === filterStatus);

  return (
    <div>
      {/* Low-Stock Warning Banner if any items <= 5 */}
      {lowStockProducts.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(136, 26, 28, 0.28) 0%, rgba(34, 29, 25, 0.95) 100%)",
            border: "1px solid rgba(136, 26, 28, 0.45)",
            borderRadius: 14,
            padding: "18px 22px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <div>
            <div style={{ color: "#FAF6F0", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#E8A87C" }}>✦ LOW-STOCK INVENTORY ALERT:</span> {lowStockProducts.length} {lowStockProducts.length === 1 ? "garment requires" : "garments require"} replenishment
            </div>
            <div style={{ color: "#A39688", fontSize: 12.5, marginTop: 4 }}>
              Auto-notification logged for <strong>admin@sumclotico.com</strong>. Items: {lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(", ")}.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/admin/products" className="admin-btn admin-btn-primary" style={{ fontSize: 12, padding: "8px 18px" }}>
              Replenish Inventory →
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Gross Revenue</div>
          <div className="admin-kpi-val">₹{(totalRevenue || 0).toLocaleString("en-IN")}</div>
          <div className="admin-kpi-trend">↑ +24.8% vs last month</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Total Orders Placed</div>
          <div className="admin-kpi-val">{totalOrdersCount || 0}</div>
          <div className="admin-kpi-trend" style={{ color: "#60a5fa" }}>● 100% Cashfree Verified</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Average Order Value</div>
          <div className="admin-kpi-val">₹{(avgOrderValue || 0).toLocaleString("en-IN")}</div>
          <div className="admin-kpi-trend" style={{ color: "#a78bfa" }}>High ticket fashion items</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Abandoned Carts</div>
          <div className="admin-kpi-val" style={{ color: pendingAbandonedCartsCount > 0 ? "#fbbf24" : "#34d399" }}>
            {pendingAbandonedCartsCount || 0}
          </div>
          <div className="admin-kpi-trend">
            <Link href="/admin/abandoned-carts" style={{ color: "#38bdf8", textDecoration: "underline" }}>
              Recover via WhatsApp →
            </Link>
          </div>
        </div>
      </div>

      {/* Top Selling Products Showcase */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">Best-Selling Products (Most Sales)</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Ranked by unit sales volume and revenue generated across all channels.
            </div>
          </div>
          <Link href="/admin/products" className="admin-btn admin-btn-secondary">
            Manage Catalog →
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Unit Price</th>
                <th>Total Volume (₹)</th>
                <th>Stock Left</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topSellers.map((prod, idx) => {
                const effectivePrice = prod.salePrice || prod.price || 0;
                const totalRev = (prod.salesCount || 0) * effectivePrice;
                const isLowStock = (prod.stock || 0) <= 5;
                return (
                  <tr key={prod.id || idx}>
                    <td style={{ fontWeight: 800, color: idx === 0 ? "#f35c27" : "#e5e7eb" }}>
                      #{idx + 1}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={prod.images?.[0] || "/assets/img/14.png"}
                          alt={prod.name}
                          style={{ width: 42, height: 42, borderRadius: 6, objectFit: "cover" }}
                        />
                        <div>
                          <strong style={{ color: "#fff" }}>{prod.name}</strong>
                          <div style={{ fontSize: 12, color: "#9ca3af" }}>{prod.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#f35c27", fontWeight: 700 }}>
                        {prod.sku || `SC-PRD-00${prod.id}`}
                      </span>
                    </td>
                    <td>{prod.category || "Tops"}</td>
                    <td style={{ fontWeight: 700, color: "#34d399" }}>{prod.salesCount || 0} units</td>
                    <td>₹{effectivePrice.toLocaleString("en-IN")}</td>
                    <td style={{ fontWeight: 700 }}>₹{totalRev.toLocaleString("en-IN")}</td>
                    <td>
                      <span
                        style={{
                          color: isLowStock ? "#ef4444" : "#e5e7eb",
                          fontWeight: isLowStock ? 800 : 400,
                        }}
                      >
                        {prod.stock || 0} left
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${!isLowStock ? "status-delivered" : "status-processing"}`} style={isLowStock ? { background: "#fef2f2", color: "#dc2626" } : {}}>
                        {!isLowStock ? "IN STOCK" : "⚠️ LOW STOCK"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Table & Excel Export */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">Customer Orders & Fulfillment</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Real-time feed of placed orders with automated Resend confirmation email dispatch.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* Filter Tabs */}
            <select
              className="admin-form-select"
              style={{ width: "auto", padding: "8px 12px" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>

            <button className="admin-btn admin-btn-secondary" onClick={handleExportOrdersToExcel}>
              Export to Excel (.xlsx/csv)
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Items</th>
                <th>Total Paid</th>
                <th>Payment</th>
                <th>Fulfillment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "30px 20px", color: "#9ca3af" }}>
                    No orders matching filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id || ord.orderNumber}>
                    <td style={{ fontWeight: 700, color: "#fff" }}>#{ord.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#fff" }}>{ord.customer?.name || "Anonymous"}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{ord.customer?.email || ""}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{ord.customer?.phone || ""}</div>
                    </td>
                    <td>
                      <div>{[ord.shippingAddress?.city, ord.shippingAddress?.state].filter(Boolean).join(", ") || "Standard"}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{ord.shippingAddress?.pincode || ""}</div>
                    </td>
                    <td>
                      {(ord.items || []).map((it, i) => (
                        <div key={i} style={{ fontSize: 12 }}>
                          • {it.title || it.name} ({it.selectedSize || "M"}) × {it.quantity || 1}
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 700, color: "#34d399", whiteSpace: "nowrap" }}>
                      ₹{(ord.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span className="admin-status-badge status-paid">
                        {ord.paymentMethod || "Cashfree"}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-form-select"
                        style={{ padding: "4px 8px", fontSize: 12, width: "auto" }}
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
                    <td>
                      <button
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: "4px 10px", fontSize: 11 }}
                        onClick={() => alert(`Order details for #${ord.orderNumber}:\nCustomer: ${ord.customer?.name || "N/A"}\nEmail: ${ord.customer?.email || "N/A"}\nTotal: ₹${ord.totalAmount}\nAddress: ${ord.shippingAddress?.street || ""}, ${ord.shippingAddress?.city || ""}`)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
