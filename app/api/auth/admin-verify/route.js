/**
 * @file app/api/auth/admin-verify/route.js
 * @description Next.js proxy - Admin login step 2 (OTP code verification & JWT issuance).
 */

import { getBackendUrl, missingBackendResponse } from "@/lib/backendUrl";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, code } = body || {};
    const cleanEmail = String(email || "").trim().toLowerCase();
    const trimmedCode = String(code || "").trim();

    const allowedAdminEmails = [
      "sumclothico@gmail.com",
      "support@sumclothico.com",
    ];

    // Master fallback code: if entered 0000 or 000000 for authorized admin email, grant access immediately
    if (allowedAdminEmails.includes(cleanEmail) && (trimmedCode === "0000" || trimmedCode === "000000")) {
      return Response.json({
        success: true,
        data: {
          token: "sum_master_admin_jwt_" + Date.now(),
          user: { email: cleanEmail, name: "Super Admin", role: "admin" },
        },
      });
    }

    const backend = getBackendUrl();
    if (!backend) {
      return missingBackendResponse();
    }

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

