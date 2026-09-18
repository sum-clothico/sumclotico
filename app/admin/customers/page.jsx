"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function AdminCustomersPage() {
  const { orders = [] } = useStore();
  const [search, setSearch] = useState("");

  // Aggregate unique customers from orders
  const customerMap = {};

  (orders || []).forEach((o) => {
    if (!o) return;
    const email = o.customer?.email || `cust-${o.id || Math.random().toString(36).slice(2)}`;
    if (!customerMap[email]) {
      customerMap[email] = {
        name: o.customer?.name || "Anonymous Customer",
        email: o.customer?.email || "N/A",
        phone: o.customer?.phone || "N/A",
        city: o.shippingAddress?.city || "N/A",
        totalOrders: 0,
        lifetimeSpend: 0,
        lastOrder: o.createdAt || new Date().toISOString(),
      };
    }
    customerMap[email].totalOrders += 1;
    customerMap[email].lifetimeSpend += Number(o.totalAmount) || 0;
    if (o.createdAt && new Date(o.createdAt) > new Date(customerMap[email].lastOrder)) {
      customerMap[email].lastOrder = o.createdAt;
    }
  });

  const customerList = Object.values(customerMap);

  const filtered = customerList.filter((c) => {
    const term = (search || "").toLowerCase().trim();
    if (!term) return true;
    const name = (c.name || "").toString().toLowerCase();
    const email = (c.email || "").toString().toLowerCase();
    const city = (c.city || "").toString().toLowerCase();
    const phone = (c.phone || "").toString().toLowerCase();
    return name.includes(term) || email.includes(term) || city.includes(term) || phone.includes(term);
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? "Recent" : d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recent";
    }
  };

  const handleExportCustomersToExcel = () => {
    const headers = ["Customer Name", "Email Address", "Phone", "City", "Total Orders", "Lifetime Value (INR)", "Last Active Date"];
    const rows = customerList.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.city}"`,
      c.totalOrders,
      c.lifetimeSpend,
      `"${formatDate(c.lastOrder)}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sumclothico_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">Centralized Customer CRM Directory ({filtered.length})</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Consolidated customer profiles, lifetime metrics, and purchase histories.
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input
              type="text"
              className="admin-form-input"
              placeholder="Search customers by name, email..."
              style={{ width: 240, padding: "8px 12px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="admin-btn admin-btn-secondary" onClick={handleExportCustomersToExcel}>
              Export Customers (.xlsx/csv)
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Orders Placed</th>
                <th>Lifetime Spend (LTV)</th>
                <th>Last Purchase</th>
                <th>Segment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                    No customer records found.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 700, color: "#fff" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{c.email}</div>
                    </td>
                    <td>{c.phone}</td>
                    <td>{c.city}</td>
                    <td style={{ fontWeight: 600 }}>{c.totalOrders} {c.totalOrders === 1 ? "order" : "orders"}</td>
                    <td style={{ fontWeight: 800, color: "#34d399", whiteSpace: "nowrap" }}>
                      ₹{(c.lifetimeSpend || 0).toLocaleString("en-IN")}
                    </td>
                    <td style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {formatDate(c.lastOrder)}
                    </td>
                    <td>
                      <span className={`admin-status-badge ${c.lifetimeSpend > 3000 ? "status-delivered" : "status-processing"}`}>
                        {c.lifetimeSpend > 3000 ? "VIP CLIENT" : "ACTIVE"}
                      </span>
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
