/**
 * @file app/api/checkout/route.js
 * @description Next.js proxy - POST order to Express backend for MongoDB persistence.
 * Uses /checkout/direct endpoint which accepts pre-validated frontend order data.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function POST(request) {
  try {
    const body = await request.json();
    const auth = request.headers.get("Authorization") || "";

    console.log("[API Proxy: /api/checkout] Persisting order to MongoDB:", {
      customer: body.customer?.name,
      items: body.items?.length,
      totalAmount: body.totalAmount,
      orderNumber: body.orderNumber,
    });

    const res = await fetch(`${BACKEND}/checkout/direct`, {
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