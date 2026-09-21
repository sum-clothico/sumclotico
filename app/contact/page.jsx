"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiMail, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { trackLead, trackEvent } from "@/lib/analytics";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    trackLead("contact_form", {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
    });
    trackEvent("contact_form_submit", {
      has_message: Boolean(form.message),
    });
    setIsSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <div style={{ background: "#fbfbfc", minHeight: "100vh", padding: "140px 24px 80px", color: "#111827" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#f35c27" }}>
              Get In Touch
            </span>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: "8px 0 12px", letterSpacing: "-0.5px" }}>
              We'd Love to Hear from You
            </h1>
            <p style={{ color: "#6b7280", fontSize: 16, margin: 0, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
              Questions about custom orders, sizing, wholesale, or our artisanal handloom process? Drop us a note anytime.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40 }}>
            {/* Contact Form */}
            <div style={{ background: "#ffffff", padding: "36px", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              {isSubmitted ? (
                <div style={{ textAlign: "center", padding: "40px 10px" }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#ecfdf5", color: "#065f46", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <FiCheckCircle size={32} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>Message Received!</h3>
                  <p style={{ color: "#6b7280", fontSize: 14 }}>
                    Thank you for reaching out, {form.name}. Our team will respond to {form.email} within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Sen"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }}
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="radhika@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }}
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }}
                    />
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Your Message</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Tell us what you're looking for or ask a question..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ width: "100%", padding: "14px", background: "#111111", color: "#ffffff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                  >
                    Send Message →
                  </button>
                </form>
              )}
            </div>

            {/* Studio Info & Direct Touchpoints */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#ffffff", padding: "28px", borderRadius: 16, border: "1px solid #e5e7eb" }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 16px" }}>Our Handloom Studio</h3>
                
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <FiMapPin size={20} color="#f35c27" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
                    <strong>Sum Clothico Studio</strong><br />
                    Handloom Weavers District, Sector 4<br />
                    Kolkata, West Bengal - 700091, India
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <FiMail size={20} color="#f35c27" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: 14, color: "#4b5563" }}>
                    <strong>Direct Email</strong><br />
                    <a href="mailto:hello@sumclotico.com" style={{ color: "#111111", textDecoration: "underline" }}>
                      hello@sumclotico.com
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <FiPhone size={20} color="#f35c27" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: 14, color: "#4b5563" }}>
                    <strong>Customer Support Hours</strong><br />
                    Monday – Saturday: 10:00 AM – 7:00 PM IST
                  </div>
                </div>
              </div>

              <div style={{ background: "#fdf8f6", padding: "24px", borderRadius: 16, border: "1px solid #fed7aa" }}>
                <h4 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: "#9a3412" }}>Need Immediate Help?</h4>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "#7c2d12" }}>
                  Check our Frequently Asked Questions for instant answers regarding shipping, sizing, and returns.
                </p>
                <a href="/faq" style={{ color: "#9a3412", fontWeight: 700, fontSize: 13, textDecoration: "underline" }}>
                  Browse All FAQs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
