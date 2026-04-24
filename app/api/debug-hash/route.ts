export const runtime = "edge";

import { NextResponse } from "next/server";
import { md5Hex } from "@/lib/md5";

// Temporary debug endpoint — DELETE after confirming hash is correct
export async function GET() {
  const secretKey = process.env.SENANGPAY_SECRET_KEY ?? "";
  const merchantId = process.env.SENANGPAY_MERCHANT_ID ?? "";
  const senangPayUrl = process.env.SENANGPAY_URL ?? "";

  const detail = "Allianz Shield Plus - Test";
  const amount = "1.00";
  const orderId = "ASP-TEST-001";

  const hashInput = `${secretKey}${detail}${amount}${orderId}`;
  const hash = md5Hex(hashInput);

  const params = new URLSearchParams({ detail, amount, order_id: orderId, hash });
  const paymentUrl = `${senangPayUrl}/${merchantId}?${params.toString()}`;

  return NextResponse.json({
    merchantId,
    senangPayUrl,
    secretKeyLength: secretKey.length,
    secretKeyPrefix: secretKey.slice(0, 6),
    hashInput,
    hash,
    paymentUrl,
  });
}
