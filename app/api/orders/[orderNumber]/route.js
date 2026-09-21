/**
 * @file app/api/orders/[orderNumber]/route.js
 * @description Next.js proxy - GET single order by order number.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request, { params }) {
  try {
    const { orderNumber } = await params;
    const res = await fetch(`${BACKEND}/checkout/order/${orderNumber}`, { cache: "no-store" });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}