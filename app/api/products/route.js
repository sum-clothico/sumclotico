/**
 * @file app/api/products/route.js
 * @description Next.js proxy — forwards GET/POST product requests to Express backend.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
    const res = await fetch(`${BACKEND}/products${qs ? `?${qs}` : ""}`, { cache: "no-store" });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const auth = request.headers.get("Authorization") || "";
    const res = await fetch(`${BACKEND}/products`, {
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
