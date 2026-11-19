"use client";

import React, { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function SignUpContent() {
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
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl={`/sign-in${redirectUrl ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : ""}`}
          fallbackRedirectUrl={redirectUrl}
          appearance={{
            elements: {
              footer: {
                "& + div": { display: "none !important" },
              },
              footerAction: {
                borderBottom: "none",
              },
            },
          }}
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

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: "100vh", padding: 140, textAlign: "center" }}>Loading Sign Up...</div>}>
        <SignUpContent />
      </Suspense>
    </>
  );
}
