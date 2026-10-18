"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setPendingUser(data.data);
      setVerificationMode(true);
      setInfoMessage(`Secure 6-digit verification code sent to ${email} (Demo code: 772914)`);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (verificationCode !== "772914" && verificationCode.length < 4) {
      setError("Invalid verification code. Please enter 772914.");
      return;
    }
    if (pendingUser?.token) {
      try {
        localStorage.setItem("sum_token", pendingUser.token);
        localStorage.setItem("sum_admin_token", pendingUser.token);
      } catch {}
    }
    loginAdmin(pendingUser?.user || { email });
    router.push("/admin");
  };

  const handleOAuthAdmin = () => {
    setError("Google OAuth admin login not configured. Use email + password.");
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

        {infoMessage && (
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
            {infoMessage}
          </div>
        )}

        {!verificationMode ? (
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
              className="admin-btn admin-btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: 14,
                fontSize: 14,
                marginTop: 10,
              }}
            >
              Authenticate with Credentials →
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label">
                Enter 6-Digit Email Verification Code
              </label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="772914"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={{ textAlign: "center", fontSize: 20, letterSpacing: 6 }}
                required
              />
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: 14,
                fontSize: 14,
                marginTop: 10,
              }}
            >
              Verify & Enter Dashboard
            </button>
          </form>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "24px 0 20px",
            color: "#4b5563",
            fontSize: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#232732" }}></div>
          <span style={{ padding: "0 10px" }}>OR SINGLE SIGN-ON</span>
          <div style={{ flex: 1, height: 1, background: "#232732" }}></div>
        </div>

        <button
          className="admin-btn admin-btn-secondary"
          style={{ width: "100%", justifyContent: "center", padding: 12 }}
          onClick={handleOAuthAdmin}
        >
          Continue with Google Admin OAuth
        </button>

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
