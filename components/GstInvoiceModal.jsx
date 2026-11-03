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
  const discount = Number(order.discountAmount || order.discount || 0);
  const shippingFee = Number(order.shippingFee || 0);
  const grandTotal = Number(order.totalAmount || 0);

  // Dynamic GST calculation based on each item's backend gstPercent setting (5%, 12%, 18%)
  let totalTaxableValue = 0;
  let totalGstAmount = 0;
  const gstRatesUsed = new Set();

  const itemizedList = items.map((it) => {
    const qty = Math.max(1, Number(it.quantity || 1));
    const price = Number(it.price || 0);
    const itemTotal = price * qty;
    // Backend slab: 5% (handloom khadi under ₹1000/₹2500), 12%, or 18%
    const gstRate = Number(it.gstPercent || it.productId?.gstPercent || it.gstRate || order.gstPercent || 5);
    gstRatesUsed.add(gstRate);

    // Inclusive GST formula: Taxable = Total / (1 + Rate/100)
    const taxableValue = Math.round((itemTotal / (1 + gstRate / 100)) * 100) / 100;
    const gstAmt = Math.round((itemTotal - taxableValue) * 100) / 100;

    totalTaxableValue += taxableValue;
    totalGstAmount += gstAmt;

    return {
      ...it,
      qty,
      price,
      itemTotal,
      gstRate,
      taxableValue,
      gstAmt,
    };
  });

  totalTaxableValue = Math.round(totalTaxableValue * 100) / 100;
  totalGstAmount = Math.round(totalGstAmount * 100) / 100;

  // Check intra-state (Madhya Pradesh - state code 23) vs inter-state
  const customerState = String(order.shippingAddress?.state || "").trim().toLowerCase();
  const isIntraState = customerState === "madhya pradesh" || customerState === "mp";

  const cgst = isIntraState ? Math.round((totalGstAmount / 2) * 100) / 100 : 0;
  const sgst = isIntraState ? Math.round((totalGstAmount / 2) * 100) / 100 : 0;
  const igst = !isIntraState ? totalGstAmount : 0;
  const gstRateSummary = Array.from(gstRatesUsed).join("%, ") + "%";

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
          maxWidth: 820,
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
                letterSpacing: 0.5,
              }}
            >
              GST COMPLIANT (SLAB: {gstRateSummary})
            </span>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              Official Tax Invoice
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: "#881A1C",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <FiPrinter size={15} />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              style={{
                backgroundColor: "#f3f4f6",
                border: "none",
                borderRadius: 6,
                padding: "7px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#4b5563",
              }}
              aria-label="Close invoice"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Company Header & Brand Identity */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "2px solid #111827",
            paddingBottom: 18,
            marginBottom: 22,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: "1.5px",
                margin: 0,
                color: "#111827",
                fontFamily: "serif",
              }}
            >
              सम CLOTHICO
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#4b5563" }}>
              M/s Sum Clothico Textiles Private Limited
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>
              Registered Weaving Cluster: Chanderi / Maheshwar, Madhya Pradesh, India
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#111827", fontWeight: 700 }}>
              GSTIN: 23AABCS1234F1Z5 · State Code: 23 (Madhya Pradesh)
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

        {/* Itemized Table with Backend GST Rates */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 20 }}>
          <thead>
            <tr style={{ background: "#f3f4f6", borderBottom: "1px solid #d1d5db", textAlign: "left" }}>
              <th style={{ padding: "8px 10px" }}>#</th>
              <th style={{ padding: "8px 10px" }}>Item Description</th>
              <th style={{ padding: "8px 10px" }}>HSN</th>
              <th style={{ padding: "8px 10px", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "8px 10px", textAlign: "right" }}>Rate</th>
              <th style={{ padding: "8px 10px", textAlign: "center" }}>GST Slab</th>
              <th style={{ padding: "8px 10px", textAlign: "right" }}>Taxable (₹)</th>
              <th style={{ padding: "8px 10px", textAlign: "right" }}>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {itemizedList.map((it, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "10px 10px", color: "#6b7280" }}>{idx + 1}</td>
                <td style={{ padding: "10px 10px" }}>
                  <strong style={{ color: "#111827" }}>{it.title || it.name || "Handcrafted Textile Piece"}</strong>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>
                    Size: {it.selectedSize || "M"} {it.selectedColor ? `· Color: ${it.selectedColor}` : ""}
                  </div>
                </td>
                <td style={{ padding: "10px 10px", color: "#6b7280" }}>6204</td>
                <td style={{ padding: "10px 10px", textAlign: "center" }}>{it.qty}</td>
                <td style={{ padding: "10px 10px", textAlign: "right" }}>₹{it.price.toLocaleString("en-IN")}</td>
                <td style={{ padding: "10px 10px", textAlign: "center", color: "#881A1C", fontWeight: 700 }}>
                  {it.gstRate}%
                </td>
                <td style={{ padding: "10px 10px", textAlign: "right", color: "#4b5563" }}>
                  ₹{it.taxableValue.toLocaleString("en-IN")}
                </td>
                <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: 700 }}>
                  ₹{it.itemTotal.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* GST Breakdown & Grand Total */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
          <div style={{ width: 330, fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563" }}>
              <span>Taxable Value:</span>
              <span>₹{totalTaxableValue.toLocaleString("en-IN")}</span>
            </div>

            {isIntraState ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563" }}>
                  <span>CGST (Central Tax):</span>
                  <span>₹{cgst.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563" }}>
                  <span>SGST (State Tax):</span>
                  <span>₹{sgst.toLocaleString("en-IN")}</span>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563" }}>
                <span>IGST (Integrated Interstate Tax):</span>
                <span>₹{igst.toLocaleString("en-IN")}</span>
              </div>
            )}

            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#166534" }}>
                <span>Coupon Discount:</span>
                <span>- ₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#4b5563" }}>
              <span>Shipping Fee:</span>
              <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee.toLocaleString("en-IN")}`}</span>
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
              <span>Invoice Total (Incl. GST):</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Legal Declaration & Authorized Signatory */}
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 11,
            color: "#6b7280",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#374151" }}>
              Declaration & Tax Rules:
            </p>
            <p style={{ margin: 0, lineHeight: 1.45 }}>
              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. GST has been collected and will be deposited with the Government as per Section 31 of CGST Act 2017.
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <span style={{ fontSize: 13, fontFamily: "cursive", color: "#881A1C", fontWeight: 700 }}>
                Sum Clothico Studio
              </span>
            </div>
            <div style={{ borderTop: "1px dashed #9ca3af", paddingTop: 4, fontWeight: 700, color: "#111827" }}>
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
