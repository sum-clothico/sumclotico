/**
 * @file app/api/auth/users/route.js
 * @description Next.js proxy - GET registered users from backend for Admin CRM.
 */

import { getBackendUrl, missingBackendResponse } from "@/lib/backendUrl";

export async function GET(request) {
  try {
    const backend = getBackendUrl();
    if (!backend) {
      return missingBackendResponse();
    }

    const auth = request.headers.get("Authorization") || "";
    const res = await fetch(`${backend}/auth/users`, {
      cache: "no-store",
      headers: { ...(auth ? { Authorization: auth } : {}) },
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

