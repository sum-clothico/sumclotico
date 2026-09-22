"use client";

import React, { useState } from "react";
import { FiX, FiCheck, FiStar } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

export default function WhatsAppQRModal({ isOpen, onClose }) {
  const [selectedPrompt, setSelectedPrompt] = useState("Hi Sum Clothico, I need help choosing a size from your handloom collection.");
  const [selectedLabel, setSelectedLabel] = useState("Sizing & Fit Advice");

  if (!isOpen) return null;

  const prompts = [
    { label: "Sizing & Fit Advice", text: "Hi Sum Clothico, I need help choosing the right size for my measurements." },
    { label: "Order & Tracking Query", text: "Hi Sum Clothico, I have a question regarding an order / delivery status." },
    { label: "Fabric & Craft Consultation", text: "Hi Sum Clothico, I would like to learn more about the 100% Khadi weave & care." },
    { label: "Custom / Bulk Inquiries", text: "Hi Sum Clothico, I am interested in custom styling or corporate gifting orders." },
  ];

  const handleSelectTopic = (p) => {
    setSelectedPrompt(p.text);
    setSelectedLabel(p.label);
    trackEvent("whatsapp_topic_select", { topic: p.label, prompt: p.text });
  };

  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(selectedPrompt)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(waUrl)}&color=111111&bgcolor=ffffff&margin=1`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.25s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          maxWidth: "460px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
          color: "#111827",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: "#111827", padding: "20px 24px", color: "#ffffff", position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Close modal"
          >
            <FiX size={16} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaWhatsapp size={20} color="#000000" />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800 }}>Sum Clothico Concierge</div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>Available Mon–Sat • 10 AM – 7 PM IST</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 24px 28px", textAlign: "center" }}>
          {/* Dynamic QR Code Container */}
          <div
            style={{
              background: "#ffffff",
              border: "2px solid #e5e7eb",
              borderRadius: "16px",
              padding: "14px",
              display: "inline-block",
              marginBottom: "14px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              position: "relative",
            }}
          >
            <img
              src={qrCodeUrl}
              alt="Scan WhatsApp QR Code"
              style={{
                width: "180px",
                height: "180px",
                display: "block",
                borderRadius: "8px",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#25D366",
                color: "#000000",
                fontSize: "9px",
                fontWeight: 900,
                padding: "2px 10px",
                borderRadius: "99px",
                letterSpacing: "0.5px",
                border: "1px solid #1ebc59",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                whiteSpace: "nowrap",
              }}
            >
              SCAN TO CHAT
            </div>
          </div>

          <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>
            Scan with your phone camera or WhatsApp
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "18px" }}>
            Instant direct connection with our artisanal stylists in India
          </div>

          {/* Quick inquiry chips */}
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "#9ca3af", marginBottom: "8px", display: "flex", alignItems: "center", gap: 4 }}>
              <FiStar size={12} color="#f35c27" />
              <span>Select Conversation Topic:</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {prompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectTopic(p)}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${selectedLabel === p.label ? "#25D366" : "#e5e7eb"}`,
                    background: selectedLabel === p.label ? "#f0fdf4" : "#ffffff",
                    color: selectedLabel === p.label ? "#065f46" : "#374151",
                    fontSize: "12px",
                    fontWeight: selectedLabel === p.label ? 700 : 500,
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{p.label}</span>
                  {selectedLabel === p.label && <FiCheck size={15} color="#059669" />}
                </button>
              ))}
            </div>
          </div>

          {/* Direct CTA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent("whatsapp_click", { source: "navbar_qr_modal", topic: selectedLabel });
              onClose();
            }}
            style={{
              background: "#25D366",
              color: "#000000",
              padding: "13px 20px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "14px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              border: "1px solid #1ebc59",
              boxShadow: "0 4px 14px rgba(37, 211, 102, 0.3)",
              transition: "transform 0.15s ease",
            }}
          >
            <FaWhatsapp size={19} color="#000000" />
            <span>Open WhatsApp Web / Mobile App →</span>
          </a>
        </div>
      </div>
    </div>
  );
}
