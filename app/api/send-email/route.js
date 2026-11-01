import { NextResponse } from "next/server";

const PRIMARY_ADMIN_EMAIL = "support@sumclothico.com";
const FALLBACK_ADMIN_EMAIL = "support@sumclothico.com";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Sum Clothico <support@sumclothico.com>";
    const adminEmail = PRIMARY_ADMIN_EMAIL;

    let customerSubject = "Sum Clothico Notification";
    let customerHtml = "";
    let adminSubject = "";
    let adminHtml = "";

    // ─────────────────────────────────────────────────────────────────────────────
    // SCENARIO 1: ORDER CONFIRMED (PAID)
    // ─────────────────────────────────────────────────────────────────────────────
    if (type === "ORDER_CONFIRMATION") {
      customerSubject = `✓ Order Confirmed: #${data.orderNumber} — Sum Clothico`;

      const itemsHtml = (data.items || [])
        .map(
          (item) => `
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0;">
              <strong style="color: #111;">${item.name || item.title}</strong><br/>
              <span style="color: #666; font-size: 12px;">Size: ${item.selectedSize || "Standard"} ${item.selectedColor ? `• Color: ${item.selectedColor}` : ""}</span>
            </td>
            <td style="padding: 12px 0; text-align: center; color: #444;">${item.quantity}</td>
            <td style="padding: 12px 0; text-align: right; color: #111; font-weight: 700;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
          </tr>`
        )
        .join("");

      customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: #111111; color: #ffffff; padding: 28px 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">सम् CLOTHICO</h1>
            <p style="margin: 6px 0 0; color: #9ca3af; font-size: 13px;">Handcrafted Khadi Textiles & Mindful Living</p>
          </div>
          
          <div style="padding: 32px;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <strong style="color: #166534; font-size: 15px;">✓ Thank you for your order, ${data.customer?.name || "Mindful Shopper"}!</strong>
              <p style="margin: 4px 0 0; color: #15803d; font-size: 13px;">Your handcrafted khadi piece is confirmed and is being prepared by our master weavers.</p>
            </div>

            <table style="width: 100%; font-size: 14px; margin-bottom: 24px;">
              <tr>
                <td><strong>Order Number:</strong> #${data.orderNumber}</td>
                <td style="text-align: right;"><strong>Payment Method:</strong> ${data.paymentMethod || "Prepaid"}</td>
              </tr>
              <tr>
                <td><strong>Estimated Dispatch:</strong> Within 48 Hours</td>
                <td style="text-align: right;"><strong>Delivery Carrier:</strong> BlueDart Express</td>
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
              ${data.discountAmount ? `<div style="display: flex; justify-content: space-between; color: #16a34a;"><span>Discount (${data.couponCode || "VOUCHER"}):</span><span>-₹${data.discountAmount.toLocaleString("en-IN")}</span></div>` : ""}
              <div style="display: flex; justify-content: space-between;"><span>Shipping:</span><span>${data.shippingFee === 0 ? "FREE" : `₹${data.shippingFee}`}</span></div>
              <div style="display: flex; justify-content: space-between; font-size: 17px; font-weight: 800; color: #111; border-top: 2px solid #111; padding-top: 10px; margin-top: 8px;">
                <span>Total Paid:</span><span>₹${(data.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div style="margin-top: 24px; padding: 14px; background: #faf6f0; border-radius: 8px; font-size: 13px;">
              <strong>Delivery Address:</strong><br/>
              ${data.customer?.name}<br/>
              ${data.shippingAddress?.street || ""}, ${data.shippingAddress?.city || ""}, ${data.shippingAddress?.state || ""} — ${data.shippingAddress?.pincode || ""}<br/>
              Phone: ${data.customer?.phone || ""}
            </div>

            <div style="margin-top: 28px; padding: 16px; background: #f9fafb; border-radius: 8px; font-size: 12px; color: #6b7280; text-align: center;">
              Questions? Message us on WhatsApp (+91 9329587707) or email <a href="mailto:support@sumclothico.com" style="color: #660608; font-weight: 700;">support@sumclothico.com</a>
            </div>
          </div>
        </div>
      `;

      // Admin Alert Content
      adminSubject = `🚨 [NEW ORDER] #${data.orderNumber} — ₹${(data.totalAmount || 0).toLocaleString("en-IN")} from ${data.customer?.name}`;
      adminHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #d1d5db; border-radius: 10px; padding: 24px;">
          <h2 style="color: #111; margin-top: 0;">New Order Placed: #${data.orderNumber}</h2>
          <p><strong>Customer:</strong> ${data.customer?.name} (${data.customer?.email})</p>
          <p><strong>Phone:</strong> ${data.customer?.phone || "-"}</p>
          <p><strong>Payment Status:</strong> <span style="background: #16a34a; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: 700;">${data.paymentStatus || "PAID"}</span></p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod || "Cashfree"}</p>
          <p><strong>Total Amount:</strong> ₹${(data.totalAmount || 0).toLocaleString("en-IN")}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <h3>Items to Pack:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="text-align: left; background: #f3f4f6;">
                <th style="padding: 6px;">Item</th>
                <th style="padding: 6px;">Size</th>
                <th style="padding: 6px;">Color</th>
                <th style="padding: 6px;">Qty</th>
              </tr>
            </thead>
            <tbody>
              ${(data.items || []).map((i) => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 6px;"><strong>${i.name || i.title}</strong></td>
                  <td style="padding: 6px;">${i.selectedSize || "STD"}</td>
                  <td style="padding: 6px;">${i.selectedColor || "-"}</td>
                  <td style="padding: 6px;">${i.quantity}</td>
                </tr>`).join("")}
            </tbody>
          </table>
          <p style="margin-top: 20px;">
            <a href="https://sumclotico.com/admin/orders" style="background: #111; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block;">
              View in Admin CRM →
            </a>
          </p>
        </div>
      `;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCENARIO 2: PAYMENT FAILED / INCOMPLETE (Order NOT placed)
    // ─────────────────────────────────────────────────────────────────────────────
    else if (type === "ORDER_PAYMENT_FAILED") {
      customerSubject = `⚠️ Payment Incomplete for Order #${data.orderNumber} — Sum Clothico`;

      customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden;">
          <div style="background: #111111; color: #ffffff; padding: 24px 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">सम् CLOTHICO</h1>
          </div>
          <div style="padding: 32px;">
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <strong style="color: #991b1b; font-size: 15px;">⚠️ Your payment did not go through</strong>
              <p style="margin: 4px 0 0; color: #b91c1c; font-size: 13px;">
                No money was debited. Your order <strong>#${data.orderNumber}</strong> was not placed, but your handcrafted pieces are saved.
              </p>
            </div>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              Hi ${data.customer?.name || "there"}, your transaction on Cashfree was cancelled or could not be completed. You can safely retry checkout below:
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="https://sumclotico.com/checkout?retry=${data.orderNumber}" style="background: #881A1C; color: #ffffff; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                Retry Payment Now →
              </a>
            </div>
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              Need help? WhatsApp us at +91 9329587707 or reply to support@sumclothico.com
            </p>
          </div>
        </div>
      `;

      adminSubject = `⚠️ [PAYMENT FAILED] Order #${data.orderNumber} — Customer ${data.customer?.name} dropped off`;
      adminHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 20px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
          <h2 style="color: #991b1b; margin-top: 0;">Payment Failed Alert</h2>
          <p><strong>Order Ref:</strong> #${data.orderNumber}</p>
          <p><strong>Customer:</strong> ${data.customer?.name} (${data.customer?.email}, ${data.customer?.phone || "-"})</p>
          <p><strong>Cart Value:</strong> ₹${data.totalAmount}</p>
          <p><strong>Reason:</strong> ${data.reason || "User cancelled or gateway timeout"}</p>
          <p style="color: #666; font-size: 13px;">Follow up via WhatsApp or call to assist checkout completion.</p>
        </div>
      `;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCENARIO 3: ORDER SHIPPED & TRACKING DISPATCHED
    // ─────────────────────────────────────────────────────────────────────────────
    else if (type === "ORDER_SHIPPED") {
      customerSubject = `📦 Your Sum Clothico Order #${data.orderNumber} is On Its Way!`;
      customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: #111111; color: #ffffff; padding: 24px 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">सम् CLOTHICO</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #111827; margin-top: 0;">Good News! Your Package Has Shipped.</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              Your handcrafted Khadi garment has been carefully packed and handed over to our courier partner.
            </p>
            <div style="background: #faf6f0; border: 1px solid #e6ddc8; border-radius: 8px; padding: 18px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Tracking AWB:</strong> <code>${data.trackingNumber || "BD" + Math.floor(100000000 + Math.random() * 900000000)}</code></p>
              <p style="margin: 4px 0;"><strong>Courier Partner:</strong> ${data.carrier || "BlueDart Express"}</p>
              <p style="margin: 4px 0;"><strong>Expected Delivery:</strong> 2–4 Business Days</p>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://sumclotico.com/track-order?awb=${data.trackingNumber || ""}" style="background: #111; color: #fff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                Track Live Shipment →
              </a>
            </div>
          </div>
        </div>
      `;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCENARIO 4: LOW-STOCK ALERT TO ADMIN
    // ─────────────────────────────────────────────────────────────────────────────
    else if (type === "LOW_STOCK_ALERT") {
      adminSubject = `⚠️ [LOW STOCK] ${data.productName} has only ${data.remainingStock} units left!`;
      adminHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 24px; background: #fff; border: 1px solid #fee2e2; border-radius: 10px;">
          <h2 style="color: #dc2626; margin-top: 0;">Inventory Threshold Alert</h2>
          <p>Product: <strong>${data.productName}</strong> (SKU: <code>${data.sku || "N/A"}</code>)</p>
          <p>Remaining Stock: <strong style="font-size: 18px; color: #dc2626;">${data.remainingStock} Units</strong></p>
          <p><a href="https://sumclotico.com/admin/products" style="color: #881A1C; font-weight: 700;">Restock in Admin Catalog →</a></p>
        </div>
      `;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCENARIO 5: CONTACT INQUIRY & JOURNAL STORY
    // ─────────────────────────────────────────────────────────────────────────────
    else if (type === "CONTACT_INQUIRY" || type === "JOURNAL_SUBMISSION") {
      adminSubject = `[Atelier ${type === "JOURNAL_SUBMISSION" ? "Journal" : "Inquiry"}] from ${data.name || "Visitor"}`;
      adminHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 24px; background: #faf6f0; border-radius: 10px;">
          <h2>${adminSubject}</h2>
          <p><strong>Name:</strong> ${data.name || "-"}</p>
          <p><strong>Email:</strong> ${data.email || "-"}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #fff; padding: 14px; border-radius: 6px; white-space: pre-wrap;">${(data.message || "").replace(/</g, "&lt;")}</div>
        </div>
      `;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SCENARIO 6: ABANDONED CART RECOVERY
    // ─────────────────────────────────────────────────────────────────────────────
    else if (type === "ABANDONED_CART_RECOVERY") {
      customerSubject = `Namaste ${data.customerName || "Friend"}, did you leave your Khadi piece behind?`;
      customerHtml = `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px;">
          <h2>Your Handcrafted Pieces Are Waiting</h2>
          <p>Our handloom fabrics are woven in mindful limited batches. We saved your items for you.</p>

          <div style="text-align: center;">
            <a href="${data.recoveryUrl || "https://sumclotico.com/collection"}" style="background: #111; color: #fff; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 700; display: inline-block;">
              Complete Your Order →
            </a>
          </div>
        </div>
      `;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DISPATCH LOGIC (Customer + Admin with Resend Sandbox Fallback)
    // ─────────────────────────────────────────────────────────────────────────────
    if (apiKey && !apiKey.includes("test_key")) {
      const sendResend = async (targetTo, subjectLine, htmlBody) => {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [targetTo],
              subject: subjectLine,
              html: htmlBody,
            }),
          });

          const json = await res.json();

          // Handle Resend sandbox limitation (when domain not yet verified)
          if (!res.ok && json.statusCode === 403 && json.message?.includes("only send testing emails to your own email address")) {
            console.warn(`[Resend Sandbox Notice] Target ${targetTo} restricted. Rerouting to verified address ${FALLBACK_ADMIN_EMAIL}.`);
            const fallbackRes = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "onboarding@resend.dev",
                to: [FALLBACK_ADMIN_EMAIL],
                subject: `[FORWARDED for ${targetTo}] ` + subjectLine,
                html: htmlBody,
              }),
            });
            return await fallbackRes.json();
          }

          return json;
        } catch (e) {
          console.error(`[Resend Dispatch Error to ${targetTo}]:`, e.message);
          return { error: e.message };
        }
      };

      // 1. Dispatch Customer Email (if customer content exists and target email specified)
      let customerDispatch = null;
      const targetCustomer = to || data?.customer?.email;
      if (customerHtml && targetCustomer) {
        customerDispatch = await sendResend(targetCustomer, customerSubject, customerHtml);
      }

      // 2. Dispatch Admin Email (always to support@sumclothico.com)
      let adminDispatch = null;
      if (adminHtml && adminSubject) {
        adminDispatch = await sendResend(adminEmail, adminSubject, adminHtml);
      } else if (!customerHtml && adminSubject) {
        adminDispatch = await sendResend(adminEmail, adminSubject, adminHtml);
      }

      return NextResponse.json({
        success: true,
        customerDispatched: Boolean(customerDispatch),
        adminDispatched: Boolean(adminDispatch),
      });
    }

    console.log(`[Email Simulation] Sent "${customerSubject || adminSubject}" to customer & admin`);
    return NextResponse.json({ success: true, simulated: true });
  } catch (error) {
    console.error("Failed to send transactional email:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
