"use client";

import React, { useState } from "react";
import GstInvoiceModal from "@/components/GstInvoiceModal";
import { FiPrinter } from "react-icons/fi";
import { useStore } from "@/context/StoreContext";

export default function AdminOrdersPage() {
  const { orders = [], updateOrderStatus, updatePaymentStatus } = useStore();
  const [filter, setFilter] = useState("ALL");
  const [gatewayFilter, setGatewayFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [editingAwbOrderId, setEditingAwbOrderId] = useState(null);
  const [awbInput, setAwbInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("Shiprocket");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  const filtered = (orders || []).filter((o) => {
    if (!o) return false;
    const matchesFilter = filter === "ALL" || o.orderStatus === filter || (filter === "RETURNS" && o.returnStatus === "REQUESTED");
    const matchesGateway = gatewayFilter === "ALL" || (o.paymentGateway || "").toLowerCase() === gatewayFilter.toLowerCase();
    const term = (search || "").toLowerCase().trim();
    if (!term) return matchesFilter && matchesGateway;

    const orderNum = (o.orderNumber || "").toString().toLowerCase();
    const custName = (o.customer?.name || "").toString().toLowerCase();
    const custEmail = (o.customer?.email || "").toString().toLowerCase();
    const custPhone = (o.customer?.phone || "").toString().toLowerCase();
    const city = (o.shippingAddress?.city || "").toString().toLowerCase();
    const awb = (o.trackingNumber || "").toString().toLowerCase();
    const gateway = (o.paymentGateway || "").toString().toLowerCase();
    const txn = (o.transactionId || "").toString().toLowerCase();

    const matchesSearch =
      orderNum.includes(term) ||
      custName.includes(term) ||
      custEmail.includes(term) ||
      custPhone.includes(term) ||
      city.includes(term) ||
      gateway.includes(term) ||
      txn.includes(term) ||
      awb.includes(term);

    return matchesFilter && matchesGateway && matchesSearch;
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

  const handleSaveAwb = (orderId) => {
    updateOrderStatus(orderId, undefined, { carrier: carrierInput, trackingNumber: awbInput });
    setEditingAwbOrderId(null);
    setAwbInput("");
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="admin-card-title">Live Orders & Dispatch CRM ({filtered.length})</div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
            Manage Cashfree & COD orders, assign AWB tracking numbers, and fulfill customer orders.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            type="text"
            className="admin-form-input"
            placeholder="Search by order #, customer, AWB, Txn..."
            style={{ width: 240, padding: "8px 12px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-form-select"
            style={{ width: "auto", padding: "8px 12px" }}
            value={gatewayFilter}
            onChange={(e) => setGatewayFilter(e.target.value)}
          >
            <option value="ALL">All Portals</option>
            <option value="Cashfree">Cashfree Portal</option>
                        
          </select>
          <select
            className="admin-form-select"
            style={{ width: "auto", padding: "8px 12px" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            <option value="CONFIRMED">Confirmed / Placed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="RETURNS">Return Requests</option>
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
              <th>Shipping Details & AWB</th>
              <th>Items</th>
              <th>Portal & Total</th>
              <th>Fulfillment Status</th>
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
                  <td style={{ fontWeight: 800, color: "#fff" }}>
                    #{ord.orderNumber || "ORD-000"}
                    {ord.returnStatus === "REQUESTED" && (
                      <div style={{ background: "#7f1d1d", color: "#fca5a5", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 4, marginTop: 4, display: "inline-block" }}>
                        RETURN REQUESTED
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap" }}>
                    {formatDate(ord.createdAt)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#fff" }}>{ord.customer?.name || "Anonymous"}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{ord.customer?.email || "No email"}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{ord.customer?.phone || ""}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: "#e5e7eb" }}>
                      {[ord.shippingAddress?.city, ord.shippingAddress?.state].filter(Boolean).join(", ")}
                      {ord.shippingAddress?.pincode ? ` - ${ord.shippingAddress.pincode}` : ""}
                    </div>

                    {/* AWB Tracking Info */}
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                      {editingAwbOrderId === ord.id ? (
                        <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                          <input
                            type="text"
                            placeholder="AWB Number"
                            value={awbInput}
                            onChange={(e) => setAwbInput(e.target.value)}
                            style={{ padding: "4px 8px", fontSize: 11, width: 120, background: "#1f242d", color: "#fff", border: "1px solid #374151", borderRadius: 4 }}
                          />
                          <button
                            onClick={() => handleSaveAwb(ord.id)}
                            style={{ padding: "4px 8px", background: "#f35c27", color: "#fff", border: "none", borderRadius: 4, fontSize: 11, cursor: "pointer" }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}>
                          <span>AWB: <strong style={{ color: "#34d399" }}>{ord.trackingNumber || "Unassigned"}</strong></span>
                          <button
                            onClick={() => {
                              setEditingAwbOrderId(ord.id);
                              setAwbInput(ord.trackingNumber || "");
                              setCarrierInput(ord.carrier || "Shiprocket");
                            }}
                            style={{ background: "none", border: "none", color: "#f35c27", fontSize: 11, textDecoration: "underline", cursor: "pointer" }}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {(ord.items || []).map((it, i) => {
                      const fit = typeof it.fitDetails === "string"
                        ? (() => {
                            try {
                              return JSON.parse(it.fitDetails);
                            } catch {
                              return { notes: it.fitDetails };
                            }
                          })()
                        : it.fitDetails;

                      const hasFitData = Boolean(
                        fit &&
                          (fit.bust ||
                            fit.waist ||
                            fit.hips ||
                            fit.fitPreference ||
                            (fit.lengthPreference && fit.lengthPreference !== "Standard length (as per style)") ||
                            fit.notes)
                      );

                      return (
                        <div
                          key={i}
                          style={{
                            fontSize: 12,
                            marginBottom: 8,
                            background: "rgba(255,255,255,0.03)",
                            padding: "8px 10px",
                            borderRadius: 6,
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: hasFitData ? 6 : 0 }}>
                            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 13 }}>{it.title || it.name}</span>
                            <span style={{ color: "#93c5fd", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "1px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                              Size: {it.selectedSize || "Standard"}
                            </span>
                            {it.selectedColor && (
                              <span style={{ color: "#fef3c7", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "1px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                                Color: {it.selectedColor}
                              </span>
                            )}
                            <span style={{ color: "#34d399", fontWeight: 800, fontSize: 12, marginLeft: "auto" }}>
                              × {it.quantity}
                            </span>
                          </div>

                          {hasFitData && (
                            <div
                              style={{
                                fontSize: 11.5,
                                color: "#ffedd5",
                                background: "rgba(234, 88, 12, 0.12)",
                                border: "1px solid rgba(249, 115, 22, 0.35)",
                                padding: "6px 10px",
                                borderRadius: 6,
                                lineHeight: 1.5,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 800, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: 10 }}>
                                <span>✦ Tailored Measurements &amp; Fit Data:</span>
                                {fit.garmentType && (
                                  <span style={{ background: "#ea580c", color: "#fff", padding: "1px 6px", borderRadius: 3, fontSize: 9 }}>
                                    {fit.garmentType}
                                  </span>
                                )}
                              </div>

                              {(fit.bust || fit.waist || fit.hips) && (
                                <div style={{ marginTop: 3, fontWeight: 700, color: "#ffffff" }}>
                                  {fit.bust ? `Bust: ${fit.bust}"` : ""}
                                  {fit.waist ? ` • Waist: ${fit.waist}"` : ""}
                                  {fit.hips ? ` • Hips: ${fit.hips}"` : ""}
                                </div>
                              )}

                              {(fit.fitPreference || (fit.lengthPreference && fit.lengthPreference !== "Standard length (as per style)")) && (
                                <div style={{ marginTop: 2, color: "#fed7aa" }}>
                                  {fit.fitPreference && <span>Fit: <strong>{fit.fitPreference}</strong></span>}
                                  {fit.fitPreference && fit.lengthPreference && fit.lengthPreference !== "Standard length (as per style)" ? " • " : ""}
                                  {fit.lengthPreference && fit.lengthPreference !== "Standard length (as per style)" && (
                                    <span>Length: <strong>{fit.lengthPreference}</strong></span>
                                  )}
                                </div>
                              )}

                              {fit.notes && (
                                <div style={{ marginTop: 3, fontStyle: "italic", color: "#fde047", background: "rgba(0,0,0,0.25)", padding: "3px 6px", borderRadius: 4 }}>
                                  Additional Notes: &quot;{fit.notes}&quot;
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: (ord.paymentGateway || "").toLowerCase().includes("cashfree") ? "#f35c27" : "#374151",
                          color: "#ffffff",
                          border: "none",
                        }}
                      >
                        {ord.paymentGateway || "Cashfree"}
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, color: "#34d399", fontSize: 14 }}>
                      ₹{(ord.totalAmount || 0).toLocaleString("en-IN")}
                    </div>

                    {ord.transactionId && (
                      <div style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace", marginTop: 2 }}>
                        {ord.transactionId}
                      </div>
                    )}

                    <select
                      className="admin-form-select"
                      style={{ padding: "2px 6px", fontSize: 11, width: "auto", marginTop: 4 }}
                      value={ord.paymentStatus || "PENDING"}
                      onChange={(e) => updatePaymentStatus(ord.id, e.target.value)}
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <select
                        className="admin-form-select"
                        style={{ padding: "6px 10px", fontSize: 12, width: "auto" }}
                        value={ord.orderStatus || "CONFIRMED"}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          padding: "4px 8px",
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: "#1f2937",
                          color: "#93c5fd",
                          border: "1px solid #374151",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        <FiPrinter size={12} />
                        <span>GST Invoice</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <GstInvoiceModal
        order={selectedInvoiceOrder}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
}

