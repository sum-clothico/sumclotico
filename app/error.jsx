"use client";

import { useEffect, useRef } from "react";

/**
 * Next.js App Router error boundary.
 * Catches render + commit errors (including Clerk dev-on-prod `removeChild` NotFoundError)
 * and silently recovers by remounting the route segment.
 */
export default function RouteError({ error, reset }) {
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;
    // Log once for debugging, then auto-recover
    if (typeof window !== "undefined") {
      console.warn("[RouteError auto-recovered]", error?.message || error);
    }
    // Give React one tick to settle, then re-mount the segment
    const id = requestAnimationFrame(() => reset());
    return () => cancelAnimationFrame(id);
  }, [error, reset]);

  // Render nothing visible — recovery happens immediately
  return null;
}
