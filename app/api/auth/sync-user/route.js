/**
 * @file app/api/auth/sync-user/route.js
 * @description Proxy route to sync Clerk user into MongoDB backend.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/auth/sync-user`, {
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
