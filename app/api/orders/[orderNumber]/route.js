/**
 * @file app/api/orders/[orderNumber]/route.js
 * @description Next.js proxy - GET single order by order number.
 */

import { getBackendUrl, missingBackendResponse } from "@/lib/backendUrl";

export async function GET(request, { params }) {
  try {
    const backend = getBackendUrl();
    if (!backend) {
      return missingBackendResponse();
    }

    const { orderNumber } = await params;
    const res = await fetch(`${backend}/checkout/order/${orderNumber}`, { cache: "no-store" });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}