"use client";

import { useEffect, useRef } from "react";

/**
 * Next.js App Router root error boundary (replaces root layout on crash).
 * Catches commit-phase errors from third-party DOM mutators (Clerk dev portals, GSAP, etc.)
 * and auto-recovers so users never see the default "Application error" screen.
 */
export default function GlobalError({ error, reset }) {
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;
    if (typeof window !== "undefined") {
      console.warn("[GlobalError auto-recovered]", error?.message || error);
    }
    const id = requestAnimationFrame(() => reset());
    return () => cancelAnimationFrame(id);
  }, [error, reset]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#EDE8DC" }} />
    </html>
  );
}
