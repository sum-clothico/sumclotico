"use client";

import React, { useRef } from "react";
import { FiPrinter, FiX, FiCheckCircle } from "react-icons/fi";

export default function GstInvoiceModal({ order, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const invoiceNumber = `INV-${order.orderNumber || "0000"}`;
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN");

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = Number(order.subtotal || order.totalAmount || 0);
  const discount = Number(order.discountAmount || 0);
  const shippingFee = Number(order.shippingFee || 0);
  const grandTotal = Number(order.totalAmount || 0);

  // 5% GST is split into 2.5% CGST and 2.5% SGST for intrastate, or 5% IGST
  // Prices are inclusive of GST: Taxable Value = Amount / 1.05
  const taxableAmount = Math.round((grandTotal / 1.05) * 100) / 100;
  const totalGst = Math.round((grandTotal - taxableAmount) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(4px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          color: "#111827",
          maxWidth: 780,
          width: "100%",
          borderRadius: 12,
          padding: "36px 40px",
          position: "relative",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
        ref={printRef}
      >
        {/* Top Controls Bar (hidden during printing via @media print) */}
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 14,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                backgroundColor: "#ecfdf5",
                color: "#065f46",
                padding: "3px 8px",
                borderRadius: 4,
                textTransform: "uppercase",
              }}
            >
              GST Compliant Tax Invoice
            </span>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                backgroundColor: "#881A1C",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <FiPrinter size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "none",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28, borderBottom: "2px solid #881A1C", paddingBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "#881A1C" }}>
              सम् CLOTHICO
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#4b5563" }}>
              Handcrafted Khadi Textiles & Sustainable Luxury
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>
              GSTIN: 23AABCS1234F1Z5 · State: Madhya Pradesh (23)
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>
              Email: support@sumclothico.com · Web: www.sumclothico.com
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", textTransform: "uppercase" }}>
              TAX INVOICE
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              <strong>Invoice #:</strong> {invoiceNumber}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              <strong>Order ID:</strong> #{order.orderNumber}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              <strong>Date:</strong> {invoiceDate}
            </div>
            <div style={{ fontSize: 12, color: "#166534", fontWeight: 700, marginTop: 4 }}>
              Status: {order.paymentStatus === "PAID" ? "PAID (Cashfree)" : order.paymentStatus || "CONFIRMED"}
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div style={{ background: "#f9fafb", padding: 14, borderRadius: 8, fontSize: 12 }}>
            <strong style={{ fontSize: 13, color: "#111827", display: "block", marginBottom: 6 }}>
              Billed To:
            </strong>
            <div><strong>{order.customer?.name || "Valued Customer"}</strong></div>
            <div>Email: {order.customer?.email}</div>
            <div>Mobile: +91 {order.customer?.phone}</div>
            <div>Place of Supply: {order.shippingAddress?.state || "India"}</div>
          </div>

          <div style={{ background: "#f9fafb", padding: 14, borderRadius: 8, fontSize: 12 }}>
            <strong style={{ fontSize: 13, color: "#111827", display: "block", marginBottom: 6 }}>
              Shipped To (Delivery Destination):
            </strong>
            <div><strong>{order.customer?.name}</strong></div>
            <div>{order.shippingAddress?.street}</div>
            <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</div>
            <div>Phone: +91 {order.customer?.phone}</div>
          </div>
        </div>

        {/* Itemized Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 20 }}>
          <thead>
            <tr style={{ background: "#f3f4f6", borderBottom: "1px solid #d1d5db", textAlign: "left" }}>
              <th style={{ padding: "8px 10px" }}>#</th>
              <th style={{ padding: "8px 10px" }}>Item Description</th>
              <th style={{ padding: "8px 10px" }}>HSN Code</th>
              <th style={{ padding: "8px 10px", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "8px 10px", textAlign: "right" }}>Unit Price</th>
              <th style={{ padding: "8px 10px", textAlign: "right" }}>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => {
              const itemTotal = Number(it.price || 0) * Number(it.quantity || 1);
              return (
                <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "10px 10px", color: "#6b7280" }}>{idx + 1}</td>
                  <td style={{ padding: "10px 10px" }}>
                    <strong style={{ color: "#111827" }}>{it.title || it.name || "Handcrafted Textile Piece"}</strong>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>
                      Size: {it.selectedSize || "M"} {it.selectedColor ? `· Color: ${it.selectedColor}` : ""}
                    </div>
                  </td>
                  <td style={{ padding: "10px 10px", color: "#6b7280" }}>6204 (Apparel)</td>
                  <td style={{ padding: "10px 10px", textAlign: "center" }}>{it.quantity || 1}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right" }}>₹{Number(it.price || 0).toLocaleString("en-IN")}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: 700 }}>₹{itemTotal.toLocaleString("en-IN")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* GST Breakdown & Grand Total */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
          <div style={{ width: 300, fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563" }}>
              <span>Taxable Value:</span>
              <span>₹{taxableAmount.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563" }}>
              <span>CGST (2.5%):</span>
              <span>₹{cgst.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563" }}>
              <span>SGST (2.5%):</span>
              <span>₹{sgst.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#166534" }}>
                <span>Discount:</span>
                <span>- ₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563" }}>
              <span>Shipping Fee:</span>
              <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0 0",
                marginTop: 6,
                borderTop: "2px solid #111827",
                fontSize: 15,
                fontWeight: 900,
                color: "#111827",
              }}
            >
              <span>Total Invoice Amount:</span>
              <span style={{ color: "#881A1C" }}>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes & Signatory */}
        <div style={{ borderTop: "1px dashed #d1d5db", paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280" }}>
          <div>
            <p style={{ margin: 0 }}><strong>Terms & Conditions:</strong></p>
            <p style={{ margin: "2px 0 0" }}>• This is a computer-generated tax invoice eligible for input tax credit.</p>
            <p style={{ margin: "2px 0 0" }}>• Handcrafted Khadi cotton garments. Dry clean or gentle wash recommended.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontWeight: 700, color: "#111827" }}>For Sum Clothico</p>
            <div style={{ marginTop: 24, borderTop: "1px solid #9ca3af", paddingTop: 4 }}>
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
