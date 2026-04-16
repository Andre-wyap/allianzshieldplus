export default function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden pt-16 min-h-[90vh] flex items-center">
      {/* Decorative orbs */}
      <div
        className="absolute top-[-120px] right-[-80px] w-[520px] h-[520px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #65bafd 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-80px] left-[-60px] w-[380px] h-[380px] rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, #80a4f4 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 w-full">
        <div className="max-w-3xl">
          {/* Distributor badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="w-5 h-px bg-[#80a4f4]" />
            <span
              className="text-xs font-semibold tracking-[0.18em] uppercase text-[#80a4f4]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Distributed by WF Wealth Management Sdn Bhd
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            High Coverage,
            <br />
            <span className="text-[#80a4f4]">Low Premium.</span>
          </h1>

          <p
            className="text-lg text-white/70 max-w-xl leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Allianz Shield Plus gives you and your family comprehensive
            personal accident coverage with 19 primary benefits — so you can
            enjoy every moment with complete peace of mind.
          </p>

          {/* Key highlights */}
          <div className="flex flex-wrap gap-3 mb-12">
            {[
              "Renewable up to age 80",
              "24/7 Worldwide Coverage",
              "19 Primary Benefits",
              "Fast-tracked Renewal Bonus",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/90 border border-white/15"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#plans"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#002356] text-sm font-bold hover:bg-[#f0f4ff] transition-colors duration-200"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              View Plans &amp; Pricing
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="/pdfs/brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-transparent text-white text-sm font-semibold border border-white/30 hover:bg-white/10 transition-colors duration-200"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Download Brochure
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl">
          {[
            { value: "19", label: "Primary Benefits" },
            { value: "RM 2M", label: "Max Sum Insured" },
            { value: "80", label: "Renewable Up To Age" },
            { value: "9", label: "Plans Available" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                className="text-3xl font-bold text-white mb-1"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs text-white/50 font-medium"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
