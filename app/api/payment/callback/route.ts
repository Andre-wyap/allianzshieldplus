export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { hmacSha256Hex } from "@/lib/hmac";

/**
 * Billplz server-to-server callback (POST, form-encoded).
 *
 * Billplz calls this URL when a bill's payment status changes.
 * Signature verification: sort all params except x_signature by key name,
 * join their values with "|", then HMAC-SHA256 with the X-Signature key.
 */

async function verifySignature(
  params: Record<string, string>,
  signatureKey: string
): Promise<boolean> {
  const { x_signature, ...rest } = params;
  if (!x_signature) return false;
  const sorted = Object.keys(rest).sort();
  const source = sorted.map((k) => rest[k]).join("|");
  const computed = await hmacSha256Hex(signatureKey, source);
  return computed === x_signature;
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
    const signatureKey = process.env.BILLPLZ_X_SIGNATURE_KEY ?? "";

    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = String(value);
    });

    // Verify signature when key is configured
    if (signatureKey && !(await verifySignature(params, signatureKey))) {
      console.warn("Billplz callback: signature mismatch — ignoring.");
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }

    const { id, paid, paid_at, amount, transaction_id, transaction_status } = params;

    console.log("Billplz callback received:", {
      billId: id,
      paid,
      paid_at,
      amount,
      transaction_id,
      transaction_status,
    });

    // Forward payment result to n8n. The "application_submitted" event
    // (fired from /api/payment/create) carries the full applicant data;
    // n8n correlates both events by billId.
    await forwardToN8n({
      event: "payment_callback",
      billId: id,
      paid: paid === "true",
      paidAt: paid_at ?? null,
      amountSen: amount ? parseInt(amount, 10) : null,
      transactionId: transaction_id ?? null,
      transactionStatus: transaction_status ?? null,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Payment callback error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
