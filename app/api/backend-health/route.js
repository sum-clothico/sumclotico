/**
 * @file app/api/backend-health/route.js
 * @description Checks if the Express backend is reachable.
 */

const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_BASE}/health`, { cache: "no-store" });
    const data = await res.json();
    return Response.json({ ...data, backendUrl: BACKEND_BASE }, { status: 200 });
  } catch (err) {
    return Response.json({ status: "UNREACHABLE", error: err.message, backendUrl: BACKEND_BASE }, { status: 503 });
  }
}