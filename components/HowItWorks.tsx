const steps = [
  {
    number: "01",
    headline: "Choose Your Plan",
    body: "Browse our 9 plans and pick the coverage level that fits your needs and budget. Filter by age group and occupation category to see your exact premium.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="20" height="22" rx="3" stroke="#002356" strokeWidth="1.8" />
        <path d="M9 9h10M9 14h10M9 19h6" stroke="#002356" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "02",
    headline: "Make Payment",
    body: "Complete your application and pay securely online. Your details are submitted directly to us — no paperwork, no queues.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="7" width="22" height="15" rx="3" stroke="#002356" strokeWidth="1.8" />
        <path d="M3 12h22" stroke="#002356" strokeWidth="1.8" />
        <path d="M8 17h4" stroke="#002356" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "03",
    headline: "Policy Issued in 1 Business Day",
    body: "Once payment is confirmed, we will issue your Allianz Shield Plus policy within 1 business day. Coverage starts immediately upon policy issuance.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="10" stroke="#002356" strokeWidth="1.8" />
        <path d="M14 9v5l3 3" stroke="#002356" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <span
            className="inline-block text-xs font-semibold tracking-[0.16em] uppercase text-[#006398] mb-4"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            How It Works
          </span>
          <h2
            className="text-4xl lg:text-5xl font-bold text-[#002356] leading-tight"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Coverage in 3 simple steps.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-10 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px bg-[#e0e6f0]"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-col gap-5 relative">
              {/* Step number badge */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#f2f4f6] flex items-center justify-center flex-shrink-0 relative z-10">
                  {step.icon}
                </div>
                <span
                  className="text-4xl font-bold text-[#e0e6f0]"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                  aria-hidden="true"
                >
                  {step.number}
                </span>
              </div>

              {/* Arrow connector — mobile */}
              {i < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-2" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3v14M6 13l4 4 4-4" stroke="#c5d0e0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              <div>
                <h3
                  className="text-xl font-bold text-[#002356] mb-2"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {step.headline}
                </h3>
                <p
                  className="text-sm text-[#41484d] leading-relaxed"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-wrap gap-4 items-center">
          <a
            href="#plans"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#002356] text-white text-sm font-bold hover:bg-[#003a6e] transition-colors duration-200"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            View Plans &amp; Pricing
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <span
            className="text-sm text-[#41484d]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Questions? Reach out to us anytime.
          </span>
        </div>
      </div>
    </section>
  );
}
