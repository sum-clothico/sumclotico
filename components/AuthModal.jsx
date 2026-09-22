"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginCustomer,
    loginWithGoogle,
  } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    loginCustomer(email, password);
  };

  return (
    <div className={`auth-modal-overlay ${isAuthModalOpen ? "open" : ""}`} onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="cart-close-btn"
          style={{ position: "absolute", top: 20, right: 20 }}
          onClick={() => setIsAuthModalOpen(false)}
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${authModalMode === "login" ? "active" : ""}`}
            onClick={() => setAuthModalMode("login")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${authModalMode === "register" ? "active" : ""}`}
            onClick={() => setAuthModalMode("register")}
          >
            Create Account
          </button>
        </div>

        {/* Google SSO Button */}
        <button className="google-auth-btn" onClick={loginWithGoogle}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.43 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.57 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider">or with email</div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          {authModalMode === "register" && (
            <>
              <div className="auth-form-group">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Maya Sen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="auth-form-group">
                <label className="auth-label">Phone Number</label>
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {authModalMode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
