"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
    </>
  );
}
