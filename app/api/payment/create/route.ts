export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import plansData from "@/lib/plans.json";
import { hmacSha256Hex } from "@/lib/hash";

type AgeBand = "under50" | "51to80";
type OccCategory = "A" | "B";

interface ApplicantInput {
  name: string;
  email: string;
  nric: string;
  dob: string;
  gender: "male" | "female" | "";
  address: string;
  occupation: string;
  isSmoker: boolean;
}

interface NomineeInput {
  name: string;
  nric: string;
  relationship: string;
  nationality: string;
}

function getPremium(planId: number, age: AgeBand, occ: OccCategory): number | null {
  const plan = plansData.plans.find((p) => p.id === planId);
  if (!plan) return null;
  const key = occ === "A" ? "categoryA" : "categoryB";
  const tier = plan.premiums.withoutWeeklyBenefit[key];
  if (!tier) return null;
  return age === "under50" ? tier.age50AndBelow : tier.age51To80;
}

function calcTotalRM(base: number): number {
  const tax = Math.round(base * 0.08 * 100) / 100;
  return Math.round((base + tax + 10) * 100) / 100;
}

async function notifyN8n(payload: object): Promise<void> {
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
      console.error(`n8n responded ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error("Failed to reach n8n webhook:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const merchantId = process.env.SENANGPAY_MERCHANT_ID;
    const secretKey = process.env.SENANGPAY_SECRET_KEY;
    const senangPayUrl =
      process.env.SENANGPAY_URL ?? "https://sandbox.senangpay.my/payment";
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3004";

    if (!merchantId) {
      return NextResponse.json(
        { error: "Payment gateway not configured: missing Merchant ID." },
        { status: 500 }
      );
    }
    if (!secretKey) {
      return NextResponse.json(
        { error: "Payment gateway not configured: missing Secret Key." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { planId, ageBand, occCategory, applicant, nominees, voucherCode } = body as {
      planId: number;
      ageBand: AgeBand;
      occCategory: OccCategory;
      applicant: ApplicantInput;
      nominees?: NomineeInput[];
      voucherCode?: string;
    };

    if (!planId || !ageBand || !occCategory || !applicant) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const plan = plansData.plans.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan ID." }, { status: 400 });
    }

    const premium = getPremium(planId, ageBand, occCategory);
    if (premium === null) {
      return NextResponse.json(
        { error: "Selected plan is not available for this occupation category." },
        { status: 400 }
      );
    }

    const isVoucherValid = voucherCode?.trim().toLowerCase() === "andrew";
    const totalRM = isVoucherValid ? 10.0 : calcTotalRM(premium);

    // Senang Pay expects amount as a string with 2 decimal places (e.g. "100.00")
    const amountStr = totalRM.toFixed(2);

    // Unique order ID for this transaction
    const orderId = `ASP-${Date.now()}`;

    const detail = `Allianz Shield Plus - ${plan.name}`;

    // Hash formula: MD5(secretKey + "|" + detail + "|" + amount + "|" + order_id)
    // Senang Pay hash: MD5(secretKey + detail + amount + order_id) — no separators
    const hash = await hmacSha256Hex(secretKey, `${secretKey}${detail}${amountStr}${orderId}`);

    const params = new URLSearchParams({
      detail,
      amount: amountStr,
      order_id: orderId,
      hash,
      name: applicant.name,
      email: applicant.email,
    });

    const paymentUrl = `${senangPayUrl}/${merchantId}?${params.toString()}`;

    await notifyN8n({
      event: "application_submitted",
      orderId,
      submittedAt: new Date().toISOString(),
      plan: {
        id: planId,
        name: plan.name,
        ageBand,
        occCategory,
        premiumRM: premium,
        totalRM,
        voucherApplied: isVoucherValid,
      },
      applicant: {
        name: applicant.name,
        email: applicant.email,
        nric: applicant.nric,
        dob: applicant.dob ?? "",
        gender: applicant.gender ?? "",
        address: applicant.address ?? "",
        occupation: applicant.occupation ?? "",
        isSmoker: applicant.isSmoker ?? false,
      },
      nominees: (nominees ?? []).map((n) => ({
        name: n.name,
        nric: n.nric,
        relationship: n.relationship,
        nationality: n.nationality,
      })),
    });

    return NextResponse.json({ paymentUrl, orderId });
  } catch (err) {
    console.error("Payment create error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
