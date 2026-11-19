"use client";

import React, { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function SignInContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect_url") || searchParams?.get("redirectUrl") || "/checkout";

  return (
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
      <div
        className="clerk-crop-wrap"
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl={`/sign-up${redirectUrl ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : ""}`}
          fallbackRedirectUrl={redirectUrl}
        />
      </div>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Link href="/" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "underline" }}>
          ← Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: "100vh", padding: 140, textAlign: "center" }}>Loading Sign In...</div>}>
        <SignInContent />
      </Suspense>
    </>
  );
}
