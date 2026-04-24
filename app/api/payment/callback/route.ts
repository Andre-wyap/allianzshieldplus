export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { hmacSha256Hex } from "@/lib/hash";

// Senang Pay server-to-server callback (POST, form-encoded).
// Fired when payment status changes.
// Hash verification: MD5(secretKey + "|" + status_id + "|" + order_id + "|" + transaction_id + "|" + msg)

async function verifySignature(
  secretKey: string,
  statusId: string,
  orderId: string,
  transactionId: string,
  msg: string,
  hash: string
): Promise<boolean> {
  const computed = await hmacSha256Hex(secretKey, `${secretKey}${statusId}${orderId}${transactionId}${msg}`);
  return computed === hash;
}

async function forwardToN8n(payload: object): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (secret) headers["Authorization"] = `Bearer ${secret}`;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`n8n webhook responded ${res.status}: ${text}`);
    } else {
      console.log("n8n webhook notified successfully.");
    }
  } catch (err) {
    console.error("Failed to reach n8n webhook:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.SENANGPAY_SECRET_KEY ?? "";

    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = String(value);
    });

    const { status_id, order_id, transaction_id, msg, hash } = params;

    // Verify signature when secret key is configured
    if (
      secretKey &&
      !(await verifySignature(secretKey, status_id ?? "", order_id ?? "", transaction_id ?? "", msg ?? "", hash ?? ""))
    ) {
      console.warn("Senang Pay callback: signature mismatch — ignoring.");
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }

    // status_id: "1" = success, "0" = failed, "2" = pending
    const paid = status_id === "1";

    console.log("Senang Pay callback received:", {
      orderId: order_id,
      statusId: status_id,
      paid,
      transactionId: transaction_id,
      msg,
    });

    // n8n correlates this "payment_callback" event with the earlier
    // "application_submitted" event by matching orderId.
    await forwardToN8n({
      event: "payment_callback",
      orderId: order_id ?? null,
      paid,
      statusId: status_id ?? null,
      transactionId: transaction_id ?? null,
      msg: msg ?? null,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Payment callback error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
