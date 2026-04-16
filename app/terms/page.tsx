import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions governing the use of the Allianz Shield Plus online application platform operated by WF Wealth Management.",
};

export default function TermsPage() {
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
            Terms and Conditions
          </h1>
          <p
            className="text-sm text-[#9aa0a6] mb-1"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Platform Usage Agreement
          </p>
          <p
            className="text-sm text-[#9aa0a6] mb-10"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Effective Date: 8 April 2025
          </p>

          <Prose>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the platform at asp.finnomalaysia.com, you
              agree to be bound by these Terms and Conditions. If you do not
              agree, please do not use this platform. These terms govern your
              use of the platform and the purchase of insurance products
              distributed by{" "}
              <strong>WF Wealth Management (SSM No. 202101017850)</strong>, an
              authorised general insurance agent under Allianz General Insurance
              Company (Malaysia) Berhad.
            </p>

            <h2>2. About WF Wealth Management</h2>
            <p>
              WF Wealth Management is a registered business under the laws of
              Malaysia (SSM No. 202101017850). We are an authorised general
              insurance agent and are licensed to distribute Allianz insurance
              products including Allianz Shield Plus. We operate the digital
              platform asp.finnomalaysia.com to facilitate online insurance
              applications and payment.
            </p>

            <h2>3. Platform Services</h2>
            <p>Our platform provides the following services:</p>
            <ul>
              <li>
                Online application and purchase of Allianz Shield Plus personal
                accident insurance
              </li>
              <li>
                Secure payment processing via FPX (online banking) and
                credit/debit card
              </li>
              <li>
                Policy issuance facilitation — upon successful payment, we will
                issue the policy within the next business day
              </li>
              <li>
                Ongoing insurance agency services, including claims assistance
                and policy servicing
              </li>
            </ul>

            <h2>4. Policy Issuance and Relationship with Allianz</h2>
            <p>
              4.1 Upon successful payment, WF Wealth Management will process
              and issue your Allianz Shield Plus policy within the next business
              day.
            </p>
            <p>
              4.2 Once your policy is issued, you will have a direct contractual
              relationship with{" "}
              <strong>
                Allianz General Insurance Company (Malaysia) Berhad
              </strong>
              . Policy management, policy documents, claims settlements, and
              coverage obligations are governed by Allianz&apos;s terms and are
              the responsibility of Allianz.
            </p>
            <p>
              4.3 WF Wealth Management will continue to serve you as your
              appointed insurance agent and will assist with claims processing
              and general policy servicing on your behalf.
            </p>

            <h2>5. Payment Terms</h2>
            <p>
              5.1 All premiums are quoted in Malaysian Ringgit (MYR) and are
              inclusive of applicable taxes and stamp duty unless otherwise
              stated.
            </p>
            <p>
              5.2 Payment must be made in full at the time of application. We
              accept the following payment methods:
            </p>
            <ul>
              <li>FPX (online banking via participating Malaysian banks)</li>
              <li>Credit card and debit card (Visa, Mastercard)</li>
            </ul>
            <p>
              5.3 Your coverage will only be activated upon successful payment
              and policy issuance by Allianz. We are not liable for any losses
              arising from delays caused by payment failure or bank processing
              times.
            </p>
            <p>
              5.4 Payment receipts and policy documents will be delivered to the
              email address provided at the time of application.
            </p>

            <h2>6. User Obligations</h2>
            <p>By using this platform, you agree to:</p>
            <ul>
              <li>
                Provide accurate, complete, and truthful information in your
                insurance application
              </li>
              <li>
                Not misrepresent your identity or insurance needs
              </li>
              <li>
                Notify us promptly of any changes to your personal details
              </li>
              <li>Use the platform only for lawful purposes</li>
            </ul>
            <p>
              Providing false or misleading information may result in your
              policy being voided by Allianz, and WF Wealth Management shall
              bear no liability in such circumstances.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on asp.finnomalaysia.com, including text, graphics,
              logos, and software, is the property of WF Wealth Management or
              its licensors. You may not reproduce, distribute, or create
              derivative works from any content on this platform without our
              express written consent.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              WF Wealth Management acts as an intermediary agent. Our liability
              is limited to the facilitation of your insurance application and
              policy issuance. We are not liable for:
            </p>
            <ul>
              <li>Any claims decisions made by Allianz</li>
              <li>
                Policy coverage disputes, which are subject to the policy terms
                issued by Allianz
              </li>
              <li>
                Losses arising from technical failures, payment gateway
                downtime, or third-party service disruptions
              </li>
              <li>
                Any indirect, consequential, or incidental damages arising from
                use of this platform
              </li>
            </ul>

            <h2>9. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in
              accordance with the laws of <strong>Malaysia</strong>. Any
              disputes arising from these terms shall be subject to the
              exclusive jurisdiction of the courts of Malaysia.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any
              time. Changes will be effective upon posting to this platform with
              an updated effective date. Your continued use of the platform
              constitutes acceptance of the updated terms.
            </p>

            <h2>11. Contact</h2>
            <p>
              For any enquiries regarding these terms, please contact:
            </p>
            <ul>
              <li>
                <strong>WF Wealth Management</strong>
              </li>
              <li>Website: asp.finnomalaysia.com</li>
              <li>SSM No.: 202101017850</li>
              <li>Customer service WhatsApp: +6011 5404 7463</li>
            </ul>
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
