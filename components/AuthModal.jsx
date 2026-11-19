"use client";

import React from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import { useStore } from "@/context/StoreContext";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
  } = useStore();

  if (!isAuthModalOpen) return null;

  return (
    <div
      className={`auth-modal-overlay ${isAuthModalOpen ? "open" : ""}`}
      onClick={() => setIsAuthModalOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "#ffffff",
          borderRadius: 20,
          padding: "28px 24px",
          maxWidth: 460,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
      >
        <button
          className="cart-close-btn"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            background: "#f3f4f6",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            color: "#374151",
          }}
          onClick={() => setIsAuthModalOpen(false)}
          title="Close"
        >
          ✕
        </button>

        <div style={{ marginTop: 8 }}>
          {authModalMode === "register" ? (
            <SignUp
              routing="hash"
              signInUrl="#/sign-in"
              fallbackRedirectUrl="/checkout"
              appearance={{
                elements: {
                  rootBox: { width: "100%" },
                  card: { boxShadow: "none", padding: 0, width: "100%" },
                  footer: { "& + div": { display: "none !important" } },
                  footerAction: { borderBottom: "none" },
                },
              }}
            />
          ) : (
            <SignIn
              routing="hash"
              signUpUrl="#/sign-up"
              fallbackRedirectUrl="/checkout"
              appearance={{
                elements: {
                  rootBox: { width: "100%" },
                  card: { boxShadow: "none", padding: 0, width: "100%" },
                  footer: { "& + div": { display: "none !important" } },
                  footerAction: { borderBottom: "none" },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
