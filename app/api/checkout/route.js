/**
 * @file app/api/checkout/route.js
 * @description Next.js proxy - POST order to Express backend for MongoDB persistence.
 * Uses /checkout/direct endpoint which accepts pre-validated frontend order data.
 */

import { getBackendUrl, missingBackendResponse } from "@/lib/backendUrl";

export async function POST(request) {
  try {
    const backend = getBackendUrl();
    if (!backend) {
      return missingBackendResponse();
    }

    const body = await request.json();
    const auth = request.headers.get("Authorization") || "";

    console.log("[API Proxy: /api/checkout] Persisting order to MongoDB:", {
      customer: body.customer?.name,
      items: body.items?.length,
      totalAmount: body.totalAmount,
      orderNumber: body.orderNumber,
    });

    const res = await fetch(`${backend}/checkout/direct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("[API Proxy: /api/checkout] Error:", err.message);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}