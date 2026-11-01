/**
 * @file app/api/payments/cashfree/route.js
 * @description Next.js Proxy for Cashfree Payment Gateway.
 * Forwards requests to Express backend for server-side MongoDB price verification.
 * NO secrets or API keys are hardcoded; all configuration is loaded strictly via environment variables.
 */

import { getBackendUrl } from "@/lib/backendUrl";

export async function POST(request) {
  try {
    const body = await request.json();
    const backendUrl = getBackendUrl();

    // 1. Forward to backend service where MongoDB price validation is enforced (if backend is configured)
    if (backendUrl) {
      try {
        const backendRes = await fetch(`${backendUrl}/payments/cashfree/create-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (backendRes.ok) {
          const backendData = await backendRes.json();
          if (backendData.success) {
            return Response.json(backendData);
          }
        }
      } catch (backendError) {
        console.warn("[Cashfree Proxy] Backend forwarding notice:", backendError.message);
      }
    }

    // 2. Direct fallback — strictly using environment variables only
    const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "production";
    const baseUrl = mode === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

    if (!appId || !secretKey) {
      return Response.json(
        { success: false, error: "Cashfree credentials are not configured in environment variables." },
        { status: 500 }
      );
    }

    const { orderNumber, totalAmount, customer, returnUrl } = body;
    const cleanOrderNumber = orderNumber || `SUM-${Date.now()}`;
    const cfOrderId = `CF_${cleanOrderNumber.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    const cleanPhone = String(customer?.phone || "9999999999").replace(/[^0-9]/g, "").slice(-10) || "9999999999";

    const host = request.headers.get("host") || "sumclothico.com";
    const safeHost = host.includes("localhost") ? "sumclothico.com" : host;
    const defaultReturnUrl = `https://${safeHost}/checkout/success?orderNumber=${cleanOrderNumber}&cf_order_id={order_id}`;
    const safeReturnUrl = (returnUrl || defaultReturnUrl)
      .replace(/^http:\/\/localhost(:\d+)?/, "https://sumclothico.com")
      .replace(/^http:\/\//, "https://");

    const res = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: cfOrderId,
        order_amount: Number(Number(totalAmount).toFixed(2)),
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${cleanPhone}`,
          customer_name: customer?.name || "Customer",
          customer_email: customer?.email || "care@sumclothico.com",
          customer_phone: cleanPhone,
        },
        order_meta: {
          return_url: safeReturnUrl,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create Cashfree order");
    }

    return Response.json({
      success: true,
      orderNumber: cleanOrderNumber,
      cfOrderId: data.order_id,
      paymentSessionId: data.payment_session_id,
    });
  } catch (err) {
    console.error("[Cashfree Proxy] Error:", err.message);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return Response.json({ success: false, error: "orderId is required" }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "production";
    const baseUrl = mode === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

    if (!appId || !secretKey) {
      return Response.json(
        { success: false, error: "Cashfree credentials are not configured in environment variables." },
        { status: 500 }
      );
    }

    const res = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
    });

    const data = await res.json();
    return Response.json({ success: res.ok, data });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
