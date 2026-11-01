"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { FiShield, FiLock, FiMail, FiCheck, FiArrowRight } from "react-icons/fi";

const API_BASE_URL = "/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminUser, loginAdmin } = useStore();
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
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid administrator credentials");
      }
      setStep("otp");
      setInfo("A secure 6-digit OTP verification code has been dispatched to your inbox.");
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
      setError("Enter the 6-digit verification code");
      return;
    }
    setSubmitting(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch(`${API_BASE_URL}/auth/admin-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, code: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Verification failed");
      }

      const token = data.data?.token || "sum_admin_jwt_" + Date.now();
      const user = data.data?.user || { email: cleanEmail, name: "Super Admin", role: "admin" };

      // ── Set 3-Hour Expiring Session in LocalStorage ──
      const session = {
        user,
        token,
        loginAt: Date.now(),
        expiresAt: Date.now() + 3 * 60 * 60 * 1000, // Exactly 3 Hours
      };

      try {
        localStorage.setItem("sum_admin_session", JSON.stringify(session));
        localStorage.setItem("sum_admin_token", token);
        localStorage.setItem("sum_token", token);
        localStorage.setItem("sum_admin", JSON.stringify(user));
      } catch (err) {
        console.warn("Could not save to localStorage:", err);
      }

      if (typeof loginAdmin === "function") {
        loginAdmin(user);
      } else if (typeof setAdminUser === "function") {
        setAdminUser(user);
      }

      // Route directly to Admin Dashboard with full window navigation to ensure clean state
      window.location.href = "/admin";
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
              Sum Clothico
            </span>
            <span
              style={{
                background: "#881A1C",
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 999,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Atelier Guard
            </span>
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
            <div className="admin-form-group" style={{ marginBottom: 16 }}>
              <label className="admin-form-label" style={{ display: "flex", alignItems: "center", gap: 6, color: "#d1d5db", fontSize: 13, marginBottom: 6 }}>
                <FiMail size={14} />
                <span>Authorized Admin Email</span>
              </label>
              <input
                type="email"
                className="admin-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sumclothico.com"
                autoComplete="off"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "#1f242d",
                  border: "1px solid #374151",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 14,
                }}
                required
              />
              <span style={{ fontSize: 11, color: "#9ca3af", display: "block", marginTop: 5 }}>
                2FA Policy: A secure 6-digit OTP will be dispatched to your authorized inbox.
              </span>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label className="admin-form-label" style={{ display: "flex", alignItems: "center", gap: 6, color: "#d1d5db", fontSize: 13, marginBottom: 6 }}>
                <FiLock size={14} />
                <span>Password</span>
              </label>
              <input
                type="password"
                className="admin-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "#1f242d",
                  border: "1px solid #374151",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 14,
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                background: "#881A1C",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: 14,
                fontSize: 14,
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: submitting ? 0.6 : 1,
              }}
            >
              <span>{submitting ? "Sending OTP Code…" : "Send Verification OTP →"}</span>
              <FiArrowRight size={16} />
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp}>
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label className="admin-form-label" style={{ color: "#d1d5db", fontSize: 13, marginBottom: 8, display: "block", textAlign: "center" }}>
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: 26,
                  letterSpacing: 10,
                  padding: "12px 14px",
                  background: "#1f242d",
                  border: "1px solid #4b5563",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 700,
                }}
                autoFocus
                required
              />
              <span style={{ fontSize: 11, color: "#9ca3af", display: "block", textAlign: "center", marginTop: 8 }}>
                Security: Logging in grants a 3-hour authenticated session.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: 14,
                fontSize: 14,
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: submitting ? 0.6 : 1,
              }}
            >
              <span>{submitting ? "Verifying Session…" : "Verify & Enter Atelier Admin"}</span>
              <FiCheck size={16} />
            </button>

            <button
              type="button"
              onClick={resetToCreds}
              style={{
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                fontSize: 12,
                marginTop: 16,
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
