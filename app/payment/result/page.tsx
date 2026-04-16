export const runtime = "edge";

import { hmacSha256Hex } from "@/lib/hmac";

/**
 * Payment result page — where Billplz redirects after payment.
 *
 * Billplz appends query params in the form:
 *   ?billplz[id]=xxx&billplz[paid]=true&billplz[paid_at]=...
 *   &billplz[transaction_id]=xxx&billplz[transaction_status]=completed
 *   &billplz[x_signature]=yyy
 */

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

async function verifyRedirectSignature(
  params: Record<string, string>,
  signatureKey: string
): Promise<boolean> {
  const sig = params["billplz[x_signature]"];
  if (!sig) return false;

  // All billplz params except x_signature, sorted by key
  const relevant: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (k !== "billplz[x_signature]") relevant[k] = v;
  }
  const sorted = Object.keys(relevant).sort();
  const source = sorted.map((k) => relevant[k]).join("|");
  const computed = await hmacSha256Hex(signatureKey, source);
  return computed === sig;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-MY", {
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default async function PaymentResultPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const billId = params["billplz[id]"] ?? "";
  const paid = params["billplz[paid]"] === "true";
  const paidAt = params["billplz[paid_at]"] ?? "";
  const hasBillplzParams = Boolean(billId);

  // Verify signature if key is configured and we have billplz params
  const signatureKey = process.env.BILLPLZ_X_SIGNATURE_KEY ?? "";
  const signatureValid =
    !hasBillplzParams ||
    !signatureKey ||
    (await verifyRedirectSignature(params, signatureKey));

  // If this page was accessed directly (no params), redirect home
  if (!hasBillplzParams) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-ambient p-10 max-w-md w-full text-center">
          <p
            className="text-sm text-[#41484d] mb-6"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            No payment information found.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#002356] text-white text-sm font-semibold hover:bg-[#003a6e] transition-colors"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!signatureValid) {
    return (
      <ResultLayout>
        <IconBadge type="warning" />
        <h1
          className="text-2xl font-bold text-[#002356] mb-2"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Invalid Payment Response
        </h1>
        <p
          className="text-sm text-[#41484d] mb-8"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          We could not verify this payment response. Please contact us if you
          believe this is an error.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#002356] text-white text-sm font-semibold hover:bg-[#003a6e] transition-colors"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Back to Home
        </a>
      </ResultLayout>
    );
  }

  if (paid) {
    return (
      <ResultLayout>
        <IconBadge type="success" />
        <h1
          className="text-2xl font-bold text-[#002356] mb-2"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Payment Successful
        </h1>
        <p
          className="text-sm text-[#41484d] mb-8"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Your application has been received. We will review your details and
          send your policy documents to your registered email within 1–2 business
          days.
        </p>

        {/* Receipt card */}
        <div className="w-full bg-[#f7f9fb] rounded-xl p-5 mb-8 space-y-3 text-left">
          <Row label="Bill Reference" value={billId} />
          {paidAt && <Row label="Paid At" value={formatDate(paidAt)} />}
        </div>

        <p
          className="text-xs text-[#9aa0a6] mb-6"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Keep your bill reference for future correspondence.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#002356] text-white text-sm font-semibold hover:bg-[#003a6e] transition-colors"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Back to Home
        </a>
      </ResultLayout>
    );
  }

  // Payment not completed / cancelled
  return (
    <ResultLayout>
      <IconBadge type="failed" />
      <h1
        className="text-2xl font-bold text-[#002356] mb-2"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        Payment Incomplete
      </h1>
      <p
        className="text-sm text-[#41484d] mb-8"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        Your payment was not completed. No charges have been made. Please try
        again or use a different payment method.
      </p>

      {billId && (
        <div className="w-full bg-[#f7f9fb] rounded-xl p-5 mb-8 text-left">
          <Row label="Bill Reference" value={billId} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`https://www.billplz.com/bills/${billId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#002356] text-white text-sm font-semibold hover:bg-[#003a6e] transition-colors"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Retry Payment
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          href="/#plans"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#c3c6d3] text-[#41484d] text-sm font-semibold hover:border-[#002356] hover:text-[#002356] transition-colors"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Choose a Different Plan
        </a>
      </div>
    </ResultLayout>
  );
}

// ── Shared layout ─────────────────────────────────────────────────────────────

function ResultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Minimal header */}
      <header className="bg-white border-b border-[#eceef0] shadow-ambient-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-[#41484d] hover:text-[#002356] transition-colors"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L4 8l6 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Home
          </a>
          <div className="flex flex-col items-end leading-none">
            <span
              className="text-xs font-semibold tracking-widest uppercase text-[#006398]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Allianz
            </span>
            <span
              className="text-base font-bold text-[#002356]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Shield Plus
            </span>
          </div>
        </div>
      </header>

      {/* Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-2xl shadow-ambient p-10 max-w-md w-full text-center flex flex-col items-center">
          {children}
        </div>
      </main>

      <footer className="py-6 text-center">
        <p
          className="text-xs text-[#9aa0a6]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Distributed by WF Wealth Management Sdn Bhd
        </p>
      </footer>
    </div>
  );
}

// ── Icon badge ────────────────────────────────────────────────────────────────

function IconBadge({ type }: { type: "success" | "failed" | "warning" }) {
  const configs = {
    success: {
      bg: "bg-green-50",
      border: "border-green-100",
      iconColor: "#16a34a",
      path: (
        <path
          d="M5 13l4.5 4.5L19 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    failed: {
      bg: "bg-red-50",
      border: "border-red-100",
      iconColor: "#dc2626",
      path: (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ),
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      iconColor: "#d97706",
      path: (
        <path
          d="M12 9v4M12 17v.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ),
    },
  };

  const c = configs[type];

  return (
    <div
      className={`w-20 h-20 rounded-full ${c.bg} border-2 ${c.border} flex items-center justify-center mb-6`}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: c.iconColor }}
      >
        {c.path}
      </svg>
    </div>
  );
}

// ── Row helper ────────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className="text-xs text-[#41484d]"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        {label}
      </span>
      <span
        className="text-xs font-semibold text-[#002356] text-right break-all"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        {value}
      </span>
    </div>
  );
}
