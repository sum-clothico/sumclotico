/**
 * @file app/api/customers/route.js
 * @description Next.js proxy - GET customers from backend CRM.
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

    const res = await fetch(`${backend}/crm/customers${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      headers: { ...(auth ? { Authorization: auth } : {}) },
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}