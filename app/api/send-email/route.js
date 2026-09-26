import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "orders@sumclotico.com";

    let subject = "Sum Clothico Notification";
    let htmlContent = "";

    // ── 1. Order Confirmation Email to Customer ──
    if (type === "ORDER_CONFIRMATION") {
      subject = `Order Confirmed: #${data.orderNumber} — Sum Clothico`;
      const itemsHtml = (data.items || [])
        .map(
          (item) => `
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0;">
              <strong style="color: #111;">${item.name || item.title}</strong><br/>
              <span style="color: #666; font-size: 12px;">Size: ${item.selectedSize} ${item.selectedColor ? `• Color: ${item.selectedColor}` : ""}</span>
            </td>
            <td style="padding: 12px 0; text-align: center; color: #444;">${item.quantity}</td>
            <td style="padding: 12px 0; text-align: right; color: #111; font-weight: 700;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
          </tr>`
        )
        .join("");

      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: #111111; color: #ffffff; padding: 28px 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">सम् CLOTHICO</h1>
            <p style="margin: 6px 0 0; color: #9ca3af; font-size: 13px;">Handcrafted Khadi Textiles & Mindful Living</p>
          </div>
          
          <div style="padding: 32px;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <strong style="color: #166534; font-size: 15px;">✓ Thank you for your order, ${data.customer?.name || "Mindful Shopper"}!</strong>
              <p style="margin: 4px 0 0; color: #15803d; font-size: 13px;">Your handcrafted piece is being prepared by our master artisans in Kolkata.</p>
            </div>

            <table style="width: 100%; font-size: 14px; margin-bottom: 24px;">
              <tr>
                <td><strong>Order Number:</strong> #${data.orderNumber}</td>
                <td style="text-align: right;"><strong>Estimated Delivery:</strong> 3–5 Days</td>
              </tr>
              <tr>
                <td><strong>Tracking Number:</strong> ${data.trackingNumber || "BD98214710IN"}</td>
                <td style="text-align: right;"><strong>Carrier:</strong> ${data.carrier || "BlueDart Express"}</td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
              <thead>
                <tr style="border-bottom: 2px solid #111; color: #111; text-align: left;">
                  <th style="padding-bottom: 8px;">Garment</th>
                  <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                  <th style="padding-bottom: 8px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 14px; line-height: 1.8;">
              <div style="display: flex; justify-content: space-between;"><span>Subtotal:</span><span>₹${(data.subtotal || 0).toLocaleString("en-IN")}</span></div>
              ${data.discountAmount ? `<div style="display: flex; justify-content: space-between; color: #16a34a;"><span>Discount (${data.couponCode}):</span><span>-₹${data.discountAmount.toLocaleString("en-IN")}</span></div>` : ""}
              <div style="display: flex; justify-content: space-between;"><span>Shipping:</span><span>${data.shippingFee === 0 ? "FREE" : `₹${data.shippingFee}`}</span></div>
              <div style="display: flex; justify-content: space-between; font-size: 17px; font-weight: 800; color: #111; border-top: 2px solid #111; padding-top: 10px; margin-top: 8px;">
                <span>Total Paid:</span><span>₹${(data.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div style="margin-top: 28px; padding: 16px; background: #f9fafb; border-radius: 8px; font-size: 12px; color: #6b7280; text-align: center;">
              Questions? Message our stylists on WhatsApp (+91 9329587707) or email us at <a href="mailto:support@sumclothico.com" style="color: #f35c27;">support@sumclothico.com</a>
            </div>
          </div>
        </div>
      `;
    }

    // ── 2. Low-Stock Auto Alert to Admin ──
    else if (type === "LOW_STOCK_ALERT") {
      subject = `⚠️ URGENT LOW-STOCK ALERT: ${data.productName} (${data.remainingStock} units remaining)`;
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #fee2e2; border-radius: 10px; padding: 28px;">
          <div style="background: #dc2626; color: #ffffff; padding: 12px 18px; border-radius: 6px; font-weight: 800; font-size: 15px; margin-bottom: 20px;">
            ⚠️ INVENTORY THRESHOLD TRIGGERED: Immediate Restock Required
          </div>
          <h2 style="margin: 0 0 10px; color: #111827;">${data.productName}</h2>
          <p style="color: #4b5563; font-size: 14px; margin-bottom: 16px;">
            The active catalog inventory for <strong>${data.productName}</strong> (SKU: <code>${data.sku || "SC-PRD"}</code>) has fallen below the safety threshold.
          </p>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; font-size: 14px; color: #991b1b; margin-bottom: 20px;">
            <strong>Current Stock Remaining:</strong> <span style="font-size: 20px; font-weight: 800;">${data.remainingStock} Units</span>
          </div>
          <p style="font-size: 13px; color: #6b7280;">
            Please initiate weaving loom re-orders or adjust inventory levels in your <a href="https://sumclotico.com/admin/products" style="color: #dc2626; font-weight: 700;">Sum Clothico Admin Catalog</a>.
          </p>
        </div>
      `;
    }

    // ── 3. Abandoned Cart Recovery Email to Customer ──
    else if (type === "ABANDONED_CART_RECOVERY") {
      subject = `Namaste ${data.customerName || "Friend"}, did you leave something behind in your bag?`;
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: #111111; color: #ffffff; padding: 24px 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">सम् CLOTHICO</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="font-size: 20px; color: #111; margin-top: 0;">Your Handcrafted Pieces Are Waiting</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              We noticed you left some pure Khadi pieces in your shopping bag. Our handloom fabrics are woven in mindful limited batches, so pieces go fast!
            </p>
            <div style="background: #fef3c7; border: 2px dashed #f59e0b; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="font-size: 12px; font-weight: 700; color: #b45309; text-transform: uppercase;">Exclusive 10% Recovery Voucher</span>
              <div style="font-size: 22px; font-weight: 900; color: #92400e; margin: 6px 0;">COMEBACK10</div>
              <span style="font-size: 12px; color: #78350f;">Valid for the next 48 hours</span>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="${data.recoveryUrl || "https://sumclotico.com/collection"}" style="background: #111111; color: #ffffff; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                Complete Your Order →
              </a>
            </div>
          </div>
        </div>
      `;
    }

    // ── Dispatch via Resend API if API key exists ──
    if (apiKey && !apiKey.includes("test_key")) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to || "customer@sumclotico.com"],
          subject,
          html: htmlContent,
        }),
      });

      const resData = await res.json();
      return NextResponse.json({ success: true, resendId: resData.id, simulated: false });
    }

    // Safe simulation mode if in development
    console.log(`[Resend Email Simulated] Dispatched "${subject}" to ${to}`);
    return NextResponse.json({ success: true, simulated: true, subject, to });
  } catch (error) {
    console.error("Failed to send transactional email:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
