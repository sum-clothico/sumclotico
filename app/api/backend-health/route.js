/**
 * @file app/api/backend-health/route.js
 * @description Checks if the Express backend is reachable.
 */

import { getBackendUrl } from "@/lib/backendUrl";

export async function GET() {
  const backend = getBackendUrl();
  if (!backend) {
    return Response.json(
      {
        status: "NOT_CONFIGURED",
        error: "NEXT_PUBLIC_API_URL is not set in environment variables.",
        backendUrl: null,
      },
      { status: 503 }
    );
  }

  const backendBase = backend.replace(/\/api$/, "");

  try {
    const res = await fetch(`${backendBase}/health`, { cache: "no-store" });
    const data = await res.json();
    return Response.json({ ...data, backendUrl: backendBase }, { status: 200 });
  } catch (err) {
    return Response.json({ status: "UNREACHABLE", error: err.message, backendUrl: backendBase }, { status: 503 });
  }
}