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
