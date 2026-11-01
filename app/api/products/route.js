/**
 * @file app/api/products/route.js
 * @description Next.js proxy — forwards GET/POST product requests to Express backend.
 */

import { getBackendUrl, missingBackendResponse } from "@/lib/backendUrl";

export async function GET(request) {
  try {
    const backend = getBackendUrl();
    if (!backend) {
      return missingBackendResponse();
    }

    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
    const res = await fetch(`${backend}/products${qs ? `?${qs}` : ""}`, { cache: "no-store" });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const backend = getBackendUrl();
    if (!backend) {
      return missingBackendResponse();
    }

    const body = await request.json();
    const auth = request.headers.get("Authorization") || "";
    const res = await fetch(`${backend}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
