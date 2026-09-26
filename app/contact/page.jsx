"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiSend,
  FiArrowRight,
  FiInstagram,
  FiYoutube,
  FiBookOpen,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { trackLead, trackEvent } from "@/lib/analytics";
import "@/app/styles/contact.css";

const CATEGORIES = [
  "Order / Product",
  "Collaboration",
  "Wholesale / B2B",
  "General",
  "Other",
];

export default function ContactPage() {
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Order / Product",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectCategoryAndScroll = (cat) => {
    setForm((prev) => ({ ...prev, category: cat }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    trackLead("contact_form", {
      name: form.name,
      email: form.email,
      category: form.category,
    });
    trackEvent("contact_form_submit", {
      category: form.category,
      has_message: Boolean(form.message),
    });

    setIsSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <div className="contact-page">
        <div className="contact-container">
          
          {/* ─── Hero ─── */}
          <div className="contact-hero">
            <h1 className="contact-hero__headline">Come say hello.</h1>
            <p className="contact-hero__copy">
              A question about a piece?
              <br />
              Need help finding your size?
              <br />
              Have an idea?
              <br />
              We&apos;re listening.
            </p>
          </div>

          {/* ─── Contact Options Cards ─── */}
          <div className="contact-options-grid">
            
            {/* Card 1: Order & Product Help */}
            <div className="contact-card">
              <div>
                <span className="contact-card__title">Order & Product Help</span>
                <p style={{ fontSize: "0.85rem", color: "#7a6c5f", margin: "0 0 10px 0" }}>
                  Questions about:
                </p>
                <ul className="contact-card__list">
                  <li>Your order</li>
                  <li>Size and fit</li>
                  <li>Product availability</li>
                  <li>Care</li>
                  <li>Shipping</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => selectCategoryAndScroll("Order / Product")}
                className="contact-card__btn"
              >
                Get Order Help <FiArrowRight />
              </button>
            </div>

            {/* Card 2: Collaborate With Us */}
            <div className="contact-card">
              <div>
                <span className="contact-card__title">Collaborate With Us</span>
                <p style={{ fontSize: "0.85rem", color: "#7a6c5f", margin: "0 0 10px 0" }}>
                  For:
                </p>
                <ul className="contact-card__list">
                  <li>Creator collaborations</li>
                  <li>Brand collaborations</li>
                  <li>Creative partnerships</li>
                  <li>Events</li>
                  <li>Features</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => selectCategoryAndScroll("Collaboration")}
                className="contact-card__btn"
              >
                Start a Conversation <FiArrowRight />
              </button>
            </div>

            {/* Card 3: Wholesale / B2B */}
            <div className="contact-card">
              <div>
                <span className="contact-card__title">Wholesale / B2B</span>
                <p style={{ fontSize: "0.85rem", color: "#7a6c5f", margin: "0 0 10px 0" }}>
                  Interested in:
                </p>
                <ul className="contact-card__list">
                  <li>Stocking Sum</li>
                  <li>Corporate requirements</li>
                  <li>Bulk orders</li>
                  <li>Manufacturing partnerships</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => selectCategoryAndScroll("Wholesale / B2B")}
                className="contact-card__btn"
              >
                Business Enquiry <FiArrowRight />
              </button>
            </div>

            {/* Card 4: Just Want to Talk? */}
            <div className="contact-card">
              <div>
                <span className="contact-card__title">Just Want to Talk?</span>
                <h3 className="contact-card__head">We&apos;re open to ideas.</h3>
                <p className="contact-card__desc">
                  If there&apos;s something we haven&apos;t covered, send us a message.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectCategoryAndScroll("General")}
                className="contact-card__btn"
              >
                Send Us a Message <FiArrowRight />
              </button>
            </div>

          </div>

          {/* ─── Contact Form & Direct Contact ─── */}
          <div ref={formRef} className="contact-main-grid">
            
            {/* Form */}
            <div className="contact-form-box">
              <h2 className="contact-form-box__title">Send a message</h2>
              
              {isSubmitted ? (
                <div style={{ textAlign: "center", padding: "40px 10px" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "#e8f5e9",
                      color: "#2e7d32",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <FiCheckCircle size={30} />
                  </div>
                  <h3 style={{ fontFamily: "serif", fontSize: "1.4rem", margin: "0 0 10px" }}>
                    Message Received
                  </h3>
                  <p style={{ color: "#55483d", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 24 }}>
                    Thank you for reaching out, {form.name}. We will get back to you at {form.email} as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setForm({ name: "", email: "", category: "Order / Product", message: "" });
                    }}
                    className="contact-card__btn"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  
                  {/* Name */}
                  <div className="contact-field">
                    <label className="contact-label">Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="contact-input"
                    />
                  </div>

                  {/* Email */}
                  <div className="contact-field">
                    <label className="contact-label">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="contact-input"
                    />
                  </div>

                  {/* What can we help you with? */}
                  <div className="contact-field">
                    <label className="contact-label">What can we help you with? *</label>
                    <div className="contact-radio-group">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat })}
                          className={`contact-radio-pill ${form.category === cat ? "active" : ""}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="contact-field">
                    <label className="contact-label">Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us what you have in mind..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="contact-textarea"
                    />
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    <FiSend size={15} /> Send
                  </button>
                </form>
              )}
            </div>

            {/* Direct Contact */}
            <div className="contact-direct-box">
              <span className="contact-direct__title">Direct Contact</span>

              {/* WhatsApp */}
              <div className="contact-direct__channel">
                <div className="contact-direct__icon-wrap" style={{ color: "#16a34a" }}>
                  <FaWhatsapp size={20} />
                </div>
                <div>
                  <div className="contact-direct__label">WhatsApp</div>
                  <a
                    href="https://wa.me/919329587707"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-direct__val"
                  >
                    9329587707
                  </a>
                  <div className="contact-direct__subtext">
                    Direct chat with our styling and support concierge.
                  </div>
                </div>
              </div>

              {/* Catalogue link */}
              <div className="contact-direct__channel">
                <div className="contact-direct__icon-wrap">
                  <FiBookOpen size={18} />
                </div>
                <div>
                  <div className="contact-direct__label">Catalogue</div>
                  <a href="/shop" className="contact-direct__val">
                    View Sum Catalogue
                  </a>
                  <div className="contact-direct__subtext">
                    Browse all pieces, silhouettes and handcrafted textiles.
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="contact-direct__channel">
                <div className="contact-direct__icon-wrap">
                  <FiMail size={18} />
                </div>
                <div>
                  <div className="contact-direct__label">Email</div>
                  <a href="mailto:support@sumclothico.com" className="contact-direct__val">
                    support@sumclothico.com
                  </a>
                  <div className="contact-direct__subtext">
                    Write to us for queries, size consultation or orders.
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="contact-direct__channel">
                <div className="contact-direct__icon-wrap">
                  <FiInstagram size={18} />
                </div>
                <div>
                  <div className="contact-direct__label">Instagram</div>
                  <a
                    href="https://www.instagram.com/sumclothico/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-direct__val"
                  >
                    @sumclothico
                  </a>
                  <div className="contact-direct__subtext">
                    Follow our journey of hands, looms and everyday living.
                  </div>
                </div>
              </div>

              {/* YouTube */}
              <div className="contact-direct__channel">
                <div className="contact-direct__icon-wrap">
                  <FiYoutube size={18} />
                </div>
                <div>
                  <div className="contact-direct__label">YouTube</div>
                  <a
                    href="https://youtube.com/@sumclothico"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-direct__val"
                  >
                    @sumclothico
                  </a>
                  <div className="contact-direct__subtext">
                    Documentary films on weaving, spinning and making.
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ─── Closing Line ─── */}
          <div className="contact-closing">
            <p className="contact-closing__text">
              Some of the best things start with a conversation.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
