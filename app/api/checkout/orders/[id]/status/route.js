/**
 * @file app/api/checkout/orders/[id]/status/route.js
 * @description Next.js proxy - PUT order status/tracking/items to Express backend.
 */

import { getBackendUrl, missingBackendResponse } from "@/lib/backendUrl";

export async function PUT(request, { params }) {
  try {
    const backend = getBackendUrl();
    if (!backend) {
      return missingBackendResponse();
    }

    const { id } = await params;
    const body = await request.json();
    const auth = request.headers.get("Authorization") || "";

    const res = await fetch(`${backend}/checkout/orders/${encodeURIComponent(id)}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
