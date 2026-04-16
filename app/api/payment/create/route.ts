export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import plansData from "@/lib/plans.json";

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

function calcTotalSen(base: number): number {
  const tax = Math.round(base * 0.08 * 100) / 100;
  return Math.round((base + tax + 10) * 100);
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
    const apiKey = process.env.BILLPLZ_API_KEY;
    const collectionId = process.env.BILLPLZ_COLLECTION_ID;
    const apiUrl =
      process.env.BILLPLZ_API_URL ?? "https://www.billplz-sandbox.com/api/v3";
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3004";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Payment gateway not configured: missing API key." },
        { status: 500 }
      );
    }
    if (!collectionId) {
      return NextResponse.json(
        { error: "Payment gateway not configured: missing Collection ID." },
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
    const amountSen = isVoucherValid ? 100 : calcTotalSen(premium);
    const totalRM = isVoucherValid ? 1.0 : calcTotalRM(premium);

    const params = new URLSearchParams({
      collection_id: collectionId,
      email: applicant.email,
      name: applicant.name,
      amount: String(amountSen),
      description: `Allianz Shield Plus \u2013 ${plan.name}`,
      callback_url: `${appUrl}/api/payment/callback`,
      redirect_url: `${appUrl}/payment/result`,
      reference_1_label: "NRIC",
      reference_1: applicant.nric,
      reference_2_label: "Plan",
      reference_2: plan.name,
    });

    // btoa replaces Buffer.from(...).toString("base64") — works on all runtimes
    const billplzRes = await fetch(`${apiUrl}/bills`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${apiKey}:`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await billplzRes.json();

    if (!billplzRes.ok) {
      console.error("Billplz error response:", JSON.stringify(data, null, 2));
      const billplzMessage =
        data?.error?.message ??
        (typeof data?.error === "string" ? data.error : null) ??
        JSON.stringify(data);
      return NextResponse.json(
        { error: `Billplz: ${billplzMessage}`, details: data },
        { status: 502 }
      );
    }

    // Forward full application to n8n at submission time.
    // The callback will fire a second "payment_callback" event keyed by the
    // same billId so n8n can correlate the two.
    await notifyN8n({
      event: "application_submitted",
      billId: data.id,
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

    return NextResponse.json({ paymentUrl: data.url, billId: data.id });
  } catch (err) {
    console.error("Payment create error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
