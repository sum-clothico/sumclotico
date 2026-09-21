/**
 * @file app/api/products/[slug]/route.js
 * @description Next.js proxy - GET/PUT/DELETE single product via Express backend.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const res = await fetch(`${BACKEND}/products/${slug}`, { cache: "no-store" });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const auth = request.headers.get("Authorization") || "";
    const res = await fetch(`${BACKEND}/products/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    const auth = request.headers.get("Authorization") || "";
    const res = await fetch(`${BACKEND}/products/${slug}`, {
      method: "DELETE",
      headers: { ...(auth ? { Authorization: auth } : {}) },
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}