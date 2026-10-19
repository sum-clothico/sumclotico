"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useStore();
  const [step, setStep] = useState("creds"); // "creds" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email || !password) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials");
      }
      setStep("otp");
      setInfo(data.message || "Verification code sent to admin email.");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp || otp.length < 4) {
      setError("Enter the 6-digit code from email");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Verification failed");
      }
      if (data.data?.token) {
        try {
          localStorage.setItem("sum_token", data.data.token);
          localStorage.setItem("sum_admin_token", data.data.token);
        } catch {}
      }
      loginAdmin(data.data?.user || { email });
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resetToCreds = () => {
    setStep("creds");
    setOtp("");
    setError("");
    setInfo("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0f12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#14171d",
          border: "1px solid #232732",
          borderRadius: 16,
          padding: "40px 32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              Sumclotico
            </span>
            <span className="admin-badge">Admin Suite</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>
            Secure Enterprise Management & Executive Operations
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#7f1d1d",
              border: "1px solid #ef4444",
              color: "#fecaca",
              padding: "10px 14px",
              borderRadius: 6,
              fontSize: 13,
              marginBottom: 18,
            }}
          >
            {error}
          </div>
        )}

        {info && (
          <div
            style={{
              background: "#1e3a8a",
              border: "1px solid #3b82f6",
              color: "#dbeafe",
              padding: "10px 14px",
              borderRadius: 6,
              fontSize: 13,
              marginBottom: 18,
            }}
          >
            {info}
          </div>
        )}

        {step === "creds" && (
          <form onSubmit={handleInitialSubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label">Admin Work Email</label>
              <input
                type="email"
                className="admin-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Password</label>
              <input
                type="password"
                className="admin-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="admin-btn admin-btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: 14,
                fontSize: 14,
                marginTop: 10,
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "Sending code…" : "Send Verification Code →"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp}>
            <div className="admin-form-group">
              <label className="admin-form-label">6-Digit Code from Email</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="admin-form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                style={{ textAlign: "center", fontSize: 22, letterSpacing: 8 }}
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="admin-btn admin-btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: 14,
                fontSize: 14,
                marginTop: 10,
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "Verifying…" : "Verify & Enter Dashboard"}
            </button>

            <button
              type="button"
              onClick={resetToCreds}
              style={{
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                fontSize: 12,
                marginTop: 12,
                cursor: "pointer",
                textDecoration: "underline",
                width: "100%",
              }}
            >
              ← Use different credentials
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link
            href="/"
            style={{ color: "#9ca3af", fontSize: 13, textDecoration: "none" }}
          >
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
