/**
 * @file app/api/auth/admin-verify/route.js
 * @description Next.js proxy - Admin login step 2 (OTP code verification & JWT issuance).
 */

import { getBackendUrl, missingBackendResponse } from "@/lib/backendUrl";

export async function POST(request) {
  try {
    const backend = getBackendUrl();
    if (!backend) {
      return missingBackendResponse();
    }

    const body = await request.json();
    const res = await fetch(`${backend}/auth/admin-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

