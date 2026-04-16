import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Premium refund and cancellation guidelines for Allianz Shield Plus distributed by WF Wealth Management.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Header */}
      <header className="bg-white border-b border-[#eceef0]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-10 py-14">
        <div className="bg-white rounded-2xl shadow-ambient px-8 md:px-12 py-12">
          <p
            className="text-xs font-semibold tracking-widest uppercase text-[#006398] mb-3"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Legal
          </p>
          <h1
            className="text-3xl font-bold text-[#002356] mb-2"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Refund Policy
          </h1>
          <p
            className="text-sm text-[#9aa0a6] mb-1"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Premium Refund &amp; Cancellation Guidelines
          </p>
          <p
            className="text-sm text-[#9aa0a6] mb-10"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Effective Date: 8 April 2025
          </p>

          <Prose>
            <h2>1. Overview</h2>
            <p>
              This Refund Policy applies to all insurance premiums paid through
              the platform asp.finnomalaysia.com for the purchase of Allianz
              Shield Plus, distributed by{" "}
              <strong>WF Wealth Management (SSM No. 202101017850)</strong>.
              Please read this policy carefully before making any payment.
            </p>

            <h2>2. 24-Hour Refund Window</h2>
            <p>
              2.1 You may request a full refund of your premium within{" "}
              <strong>24 hours of payment</strong>, provided that your policy
              has not yet been issued or activated.
            </p>
            <p>
              2.2 To request a refund within this window, please contact us
              immediately via the contact details provided in Section 6 with the
              following information:
            </p>
            <ul>
              <li>Full name as per NRIC/Passport</li>
              <li>Payment reference number or transaction ID</li>
              <li>Date and time of payment</li>
              <li>Reason for refund request</li>
            </ul>
            <p>
              2.3 Refunds approved within this window will be processed back to
              the original payment method (FPX bank account or credit/debit
              card). Processing times are subject to your bank or card
              issuer&apos;s timeline, typically{" "}
              <strong>5–14 business days</strong>.
            </p>

            <h2>3. Cancellation After 24 Hours</h2>
            <p>
              3.1 Refund or cancellation requests made after 24 hours of
              payment will be handled in accordance with Allianz&apos;s standard
              cancellation procedure.
            </p>
            <p>
              3.2 If your policy has already been issued, cancellation is
              subject to Allianz&apos;s policy cancellation terms, which may
              include:
            </p>
            <ul>
              <li>
                Short-rate or pro-rata refund of unused premium (as determined
                by Allianz)
              </li>
              <li>
                Administrative fees or deductions as per the policy contract
              </li>
              <li>No refund if a claim has already been made under the policy</li>
            </ul>
            <p>
              3.3 WF Wealth Management will assist you in submitting a
              cancellation request to Allianz and will liaise on your behalf.
              However, the final decision on refund amounts rests with{" "}
              <strong>
                Allianz General Insurance Company (Malaysia) Berhad
              </strong>
              .
            </p>

            <h2>4. Non-Refundable Circumstances</h2>
            <p>
              The following circumstances are not eligible for a refund:
            </p>
            <ul>
              <li>
                Requests made after 24 hours of payment where the policy has
                been issued
              </li>
              <li>
                Policies where a claim has already been submitted or paid
              </li>
              <li>
                Failure to disclose accurate health or personal information at
                the time of application (policy may be voided without refund at
                Allianz&apos;s discretion)
              </li>
              <li>
                Promotional or discounted policies where refund exclusions are
                stated at the time of purchase
              </li>
            </ul>

            <h2>5. Payment Gateway Errors</h2>
            <p>
              If you were charged but did not receive a policy confirmation due
              to a payment gateway or technical error, please contact us within{" "}
              <strong>48 hours</strong>. We will investigate and process a full
              refund if the charge is confirmed and no policy was issued.
            </p>

            <h2>6. How to Request a Refund</h2>
            <p>
              To initiate a refund, contact WF Wealth Management through the
              following:
            </p>
            <ul>
              <li>Website: asp.finnomalaysia.com</li>
              <li>
                Customer service WhatsApp:{" "}
                <a href="https://wa.me/60115404746">+6011 5404 7463</a>
              </li>
            </ul>
            <p>
              Please include your transaction details and reason for the
              request. We will acknowledge your request within{" "}
              <strong>1 business day</strong>.
            </p>

            <h2>7. Regulatory Reference</h2>
            <p>
              This refund policy is designed to align with the requirements of
              Bank Negara Malaysia (BNM) and Allianz General Insurance Company
              (Malaysia) Berhad&apos;s standard policy terms. Nothing in this
              policy limits any rights you may have under Malaysian consumer
              protection laws.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              WF Wealth Management reserves the right to update this Refund
              Policy at any time. The current version will always be available
              on asp.finnomalaysia.com.
            </p>
          </Prose>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p
          className="text-xs text-[#9aa0a6]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          WF Wealth Management (SSM No. 202101017850) &middot; Authorised
          Allianz Agent
        </p>
      </footer>
    </div>
  );
}

// ── Shared prose wrapper ──────────────────────────────────────────────────────

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="space-y-6 text-[#41484d] text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[#002356] [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-[#006398] [&_a]:underline [&_a:hover]:text-[#002356] [&_strong]:text-[#002356] [&_strong]:font-semibold"
      style={{ fontFamily: "var(--font-manrope)" }}
    >
      {children}
    </div>
  );
}
