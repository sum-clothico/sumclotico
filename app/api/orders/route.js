/**
 * @file app/api/orders/route.js
 * @description Next.js proxy - GET all orders from Express backend (admin CRM).
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
    const auth = request.headers.get("Authorization") || "";

    const res = await fetch(`${backend}/crm/orders${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      headers: { ...(auth ? { Authorization: auth } : {}) },
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}