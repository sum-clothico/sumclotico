"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { FiMessageSquare, FiMail, FiCheckCircle, FiTrash2, FiClock } from "react-icons/fi";

export default function AdminAbandonedCartsPage() {
  const {
    abandonedCarts = [],
    sendAbandonedCartWhatsApp,
    sendAbandonedCartEmail,
    markCartRecovered,
    deleteAbandonedCart,
  } = useStore();

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [feedback, setFeedback] = useState("");

  const formatElapsed = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const ms = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(ms / (1000 * 60));
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days}d ${hours % 24}h ago`;
      if (hours > 0) return `${hours}h ${mins % 60}m ago`;
      if (mins > 0) return `${mins}m ago`;
      return "Just now";
    } catch {
      return "Recently";
    }
  };

  const handleTriggerWhatsApp = (cart) => {
    const waUrl = sendAbandonedCartWhatsApp(cart.id);
    if (waUrl) {
      window.open(waUrl, "_blank", "noopener,noreferrer");
      setFeedback(`✓ WhatsApp recovery link generated for ${cart.customer.name}! Status updated to "Reminder Sent".`);
      setTimeout(() => setFeedback(""), 4000);
    }
  };

  const handleTriggerEmail = (cart) => {
    const success = sendAbandonedCartEmail(cart.id);
    if (success) {
      setFeedback(`✓ Automated recovery email sent to ${cart.customer.email} via Resend simulation!`);
      setTimeout(() => setFeedback(""), 4000);
    }
  };

  const handleMarkRecovered = (cart) => {
    markCartRecovered(cart.id);
    setFeedback(`✓ Cart #${cart.id} marked as Recovered (Order converted)!`);
    setTimeout(() => setFeedback(""), 4000);
  };

  // KPI Calculations
  const totalAbandonedValue = abandonedCarts.reduce((acc, c) => acc + (c.subtotal || 0), 0);
  const recoveredCarts = abandonedCarts.filter((c) => c.status === "RECOVERED");
  const recoveredValue = recoveredCarts.reduce((acc, c) => acc + (c.subtotal || 0), 0);
  const recoveryRate = abandonedCarts.length > 0 ? Math.round((recoveredCarts.length / abandonedCarts.length) * 100) : 0;
  const pendingCartsCount = abandonedCarts.filter((c) => c.status === "PENDING").length;

  const filteredCarts = filterStatus === "ALL"
    ? abandonedCarts
    : abandonedCarts.filter((c) => c.status === filterStatus);

  return (
    <div>
      {/* KPI Overview Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Total Abandoned Value</div>
          <div className="admin-kpi-val">₹{totalAbandonedValue.toLocaleString("en-IN")}</div>
          <div className="admin-kpi-trend" style={{ color: "#fbbf24" }}>
            Across {abandonedCarts.length} dropped sessions
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Recovered Revenue</div>
          <div className="admin-kpi-val" style={{ color: "#34d399" }}>
            ₹{recoveredValue.toLocaleString("en-IN")}
          </div>
          <div className="admin-kpi-trend" style={{ color: "#34d399" }}>
            {recoveredCarts.length} orders saved
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Cart Recovery Rate</div>
          <div className="admin-kpi-val">{recoveryRate}%</div>
          <div className="admin-kpi-trend" style={{ color: "#60a5fa" }}>
            WhatsApp + Email Automation
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Pending Action</div>
          <div className="admin-kpi-val" style={{ color: pendingCartsCount > 0 ? "#f87171" : "#34d399" }}>
            {pendingCartsCount}
          </div>
          <div className="admin-kpi-trend">Unsent recovery reminders</div>
        </div>
      </div>

      {feedback && (
        <div style={{ background: "#065f46", color: "#6ee7b7", padding: "12px 18px", borderRadius: 8, marginBottom: 20, fontWeight: 600, fontSize: 13 }}>
          {feedback}
        </div>
      )}

      {/* Main Abandoned Carts Table Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">Abandoned Carts Stream & 1-Click Recovery</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Push artisanal recovery reminders via WhatsApp and automated Resend emails with an exclusive 10% comeback voucher (<strong>COMEBACK10</strong>).
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              className="admin-form-select"
              style={{ width: "auto", padding: "8px 12px" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Carts ({abandonedCarts.length})</option>
              <option value="PENDING">Pending Action ({pendingCartsCount})</option>
              <option value="REMINDER_SENT">Reminder Dispatched</option>
              <option value="RECOVERED">Recovered / Converted</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Info</th>
                <th>Abandoned Items</th>
                <th>Cart Value</th>
                <th>Time Abandoned</th>
                <th>Recovery Status</th>
                <th>Automated Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                    No abandoned carts found in this filter view.
                  </td>
                </tr>
              ) : (
                filteredCarts.map((cart) => {
                  return (
                    <tr key={cart.id}>
                      <td>
                        <div>
                          <strong style={{ color: "#ffffff", fontSize: 14 }}>{cart.customer?.name}</strong>
                          <div style={{ fontSize: 12, color: "#25d366", fontWeight: 700, marginTop: 2 }}>
                            {cart.customer?.phone}
                          </div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>
                            {cart.customer?.email}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {cart.items.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <img
                                src={item.image || "/assets/img/14.png"}
                                alt={item.name}
                                style={{ width: 32, height: 32, borderRadius: 4, objectFit: "cover" }}
                              />
                              <div style={{ fontSize: 12 }}>
                                <strong>{item.name}</strong> <span style={{ color: "#9ca3af" }}>({item.selectedSize}) × {item.quantity}</span>
                                {item.sku && <span style={{ color: "#f35c27", marginLeft: 6, fontSize: 10, fontWeight: 700 }}>{item.sku}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td>
                        <strong style={{ fontSize: 15, color: "#ffffff" }}>
                          ₹{cart.subtotal.toLocaleString("en-IN")}
                        </strong>
                        <div style={{ fontSize: 11, color: "#fbbf24", fontWeight: 600 }}>
                          Promo: {cart.recoveryCoupon || "COMEBACK10"}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#d1d5db" }}>
                          <FiClock size={13} color="#9ca3af" />
                          <span>{formatElapsed(cart.abandonedAt)}</span>
                        </div>
                        {cart.whatsappReminderSentAt && (
                          <div style={{ fontSize: 10, color: "#34d399", marginTop: 2 }}>
                            WA sent {formatElapsed(cart.whatsappReminderSentAt)}
                          </div>
                        )}
                        {cart.emailReminderSentAt && (
                          <div style={{ fontSize: 10, color: "#60a5fa" }}>
                            Email sent {formatElapsed(cart.emailReminderSentAt)}
                          </div>
                        )}
                      </td>

                      <td>
                        {cart.status === "RECOVERED" && (
                          <span className="admin-status-badge status-delivered">
                            ✓ RECOVERED
                          </span>
                        )}
                        {cart.status === "REMINDER_SENT" && (
                          <span className="admin-status-badge status-shipped">
                            REMINDER SENT
                          </span>
                        )}
                        {cart.status === "PENDING" && (
                          <span className="admin-status-badge status-processing">
                            PENDING ACTION
                          </span>
                        )}
                      </td>

                      <td>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {/* 1-Click WhatsApp Trigger */}
                          <button
                            type="button"
                            onClick={() => handleTriggerWhatsApp(cart)}
                            className="admin-btn"
                            style={{
                              background: "#25d366",
                              color: "#ffffff",
                              padding: "6px 12px",
                              fontSize: 11,
                              fontWeight: 800,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              borderRadius: 6,
                              border: "none",
                              cursor: "pointer",
                            }}
                            title="Open pre-filled recovery message on WhatsApp"
                          >
                            <FiMessageSquare size={13} />
                            <span>WhatsApp</span>
                          </button>

                          {/* 1-Click Resend Email Trigger */}
                          <button
                            type="button"
                            onClick={() => handleTriggerEmail(cart)}
                            className="admin-btn admin-btn-secondary"
                            style={{
                              padding: "6px 10px",
                              fontSize: 11,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title="Send recovery email via Resend"
                          >
                            <FiMail size={13} />
                            <span>Email</span>
                          </button>

                          {/* Mark Recovered */}
                          {cart.status !== "RECOVERED" && (
                            <button
                              type="button"
                              onClick={() => handleMarkRecovered(cart)}
                              className="admin-btn admin-btn-secondary"
                              style={{
                                padding: "6px 10px",
                                fontSize: 11,
                                color: "#34d399",
                              }}
                              title="Mark as converted order"
                            >
                              <FiCheckCircle size={13} />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => deleteAbandonedCart(cart.id)}
                            className="admin-btn admin-btn-secondary"
                            style={{
                              padding: "6px 8px",
                              fontSize: 11,
                              color: "#ef4444",
                            }}
                            title="Delete abandoned session"
                          >
                            <FiTrash2 size={13} />
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
    </div>
  );
}
