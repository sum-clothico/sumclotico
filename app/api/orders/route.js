/**
 * @file app/api/orders/route.js
 * @description Next.js proxy - GET all orders from Express backend (admin CRM).
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
    const auth = request.headers.get("Authorization") || "";

    const res = await fetch(`${BACKEND}/crm/orders${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      headers: { ...(auth ? { Authorization: auth } : {}) },
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}