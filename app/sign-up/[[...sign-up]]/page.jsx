"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignUpPage() {
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
            Welcome to Sum Clothico
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0 0", color: "#111111", letterSpacing: "-0.5px" }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "6px 0 0" }}>
            Join our mindful living circle and enjoy 10% off your first handcrafted order.
          </p>
        </div>

        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/"
        />

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "underline" }}>
            ← Return to Homepage
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
