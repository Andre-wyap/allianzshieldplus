import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How WF Wealth Management collects, uses, and protects your personal data under Malaysia's Personal Data Protection Act 2010.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p
            className="text-sm text-[#9aa0a6] mb-1"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Protecting Your Personal Information
          </p>
          <p
            className="text-sm text-[#9aa0a6] mb-10"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Effective Date: 8 April 2025
          </p>

          <Prose>
            <h2>1. Introduction</h2>
            <p>
              WF Wealth Management (SSM No. 202101017850) (&ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo;), operating the platform at
              asp.finnomalaysia.com, is committed to protecting your personal
              data in accordance with Malaysia&apos;s{" "}
              <strong>Personal Data Protection Act 2010 (PDPA)</strong>. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our platform.
            </p>

            <h2>2. Data We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li>Full name, identity card (NRIC) or passport number</li>
              <li>Date of birth, gender, nationality</li>
              <li>
                Contact details: email address, phone number, residential
                address
              </li>
              <li>
                Payment information: bank account details, card details
                (processed via secure payment gateway)
              </li>
              <li>
                Nomination details including full name, NRIC, relationship with
                insured
              </li>
              <li>
                Insurance-related information required for policy underwriting
              </li>
            </ul>
            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li>IP address, browser type, operating system</li>
              <li>Pages visited, time spent, clickstream data</li>
              <li>
                Cookies and similar tracking technologies (see Section 7)
              </li>
            </ul>

            <h2>3. Purpose of Data Collection</h2>
            <p>
              We collect and process your personal data for the following
              purposes:
            </p>
            <ul>
              <li>
                To process your insurance application and facilitate policy
                issuance with Allianz Malaysia
              </li>
              <li>To verify your identity and prevent fraud</li>
              <li>
                To communicate policy details, renewal reminders, and important
                notices
              </li>
              <li>
                To send marketing communications about insurance products (with
                your consent)
              </li>
              <li>To process payments via FPX or credit/debit card</li>
              <li>
                To improve our platform, services, and user experience through
                analytics
              </li>
              <li>
                To comply with legal and regulatory obligations under BNM and
                relevant Malaysian laws
              </li>
            </ul>

            <h2>4. Sharing of Personal Data</h2>
            <p>
              Your personal data may be shared with the following parties:
            </p>
            <ul>
              <li>
                <strong>
                  Allianz General Insurance Company (Malaysia) Berhad
                </strong>{" "}
                — for policy issuance and ongoing policy management
              </li>
              <li>
                <strong>Payment gateway providers</strong> — for secure
                processing of FPX and card transactions
              </li>
              <li>
                <strong>Regulatory bodies</strong> — Bank Negara Malaysia (BNM)
                or other authorities when legally required
              </li>
            </ul>
            <p>
              We do <strong>not</strong> sell your personal data to third
              parties.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to fulfil
              the purposes outlined in this policy, or as required by law. Once
              a policy is issued and the customer relationship is transferred to
              Allianz, your policy data is held and managed by Allianz in
              accordance with their own data retention policy. We retain
              agent-client relationship data for a minimum of{" "}
              <strong>7 years</strong> in compliance with Malaysian financial
              services regulations.
            </p>

            <h2>6. Your Rights Under PDPA</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Correct any inaccurate or incomplete data</li>
              <li>
                Withdraw consent for marketing communications at any time
              </li>
              <li>Inquire about how your data is being used</li>
            </ul>
            <p>
              To exercise your rights, please contact us at the details
              provided in Section 9.
            </p>

            <h2>7. Cookies Policy</h2>
            <p>
              Our platform uses cookies and similar technologies to:
            </p>
            <ul>
              <li>
                Maintain session state and remember your preferences
              </li>
              <li>
                Analyse traffic patterns and platform usage via analytics tools
              </li>
              <li>Support marketing and remarketing campaigns</li>
            </ul>
            <p>
              You may disable cookies through your browser settings. However,
              some features of the platform may not function correctly without
              cookies.
            </p>

            <h2>8. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to
              protect your personal data against unauthorised access, disclosure,
              alteration, or destruction. Payment transactions are encrypted
              using SSL/TLS. However, no method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              For any privacy-related inquiries, please contact:
            </p>
            <ul>
              <li>
                <strong>WF Wealth Management</strong>
              </li>
              <li>Website: asp.finnomalaysia.com</li>
              <li>SSM No.: 202101017850</li>
              <li>Mobile: +6011 5404 7463</li>
            </ul>

            <h2>10. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy at any time.
              Changes will be posted on this page with an updated effective date.
              Your continued use of the platform after any changes constitutes
              your acceptance of the revised policy.
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
      className="space-y-6 text-[#41484d] text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[#002356] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-[#002356] [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-[#006398] [&_a]:underline [&_a:hover]:text-[#002356] [&_strong]:text-[#002356] [&_strong]:font-semibold"
      style={{ fontFamily: "var(--font-manrope)" }}
    >
      {children}
    </div>
  );
}
