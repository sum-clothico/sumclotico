"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
          padding: "120px 20px 60px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#f35c27" }}>
            Sum Clothico Member Access
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0 0", color: "#111111", letterSpacing: "-0.5px" }}>
            Sign In to Your Account
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "6px 0 0" }}>
            Access your order history, real-time shipment tracking, and exclusive handloom edits.
          </p>
        </div>

        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
        />

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "underline" }}>
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
