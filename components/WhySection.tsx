const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 3L17.5 10.5L26 11.5L20 17.5L21.5 26L14 22L6.5 26L8 17.5L2 11.5L10.5 10.5L14 3Z"
          stroke="#002356" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    chip: "Renewal Bonus",
    headline: "Fast-Tracked Growth",
    body: "Your Principal Sum Insured grows by up to 20% per year upon renewal — up to 100% maximum. Your protection scales with your life.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4C14 4 5 8 5 15C5 19.97 9.03 24 14 24C18.97 24 23 19.97 23 15C23 8 14 4 14 4Z"
          stroke="#002356" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 15l3 3 5-5" stroke="#002356" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    chip: "Comprehensive",
    headline: "19 Primary Benefits",
    body: "From medical expenses and hospital income to snatch theft, kidnap, and miscarriage — every corner of your life is covered.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4l2.5 5.5 6 .75-4.5 4.25 1.25 6L14 18l-5.25 2.5 1.25-6L5.5 10.25l6-.75L14 4z"
          stroke="#002356" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    chip: "High Coverage",
    headline: "Sum Insured up to RM 2,000,000",
    body: "Choose from 9 plans with Principal Sum Insured ranging from RM 50,000 up to RM 2,000,000 — giving you the protection level that truly matches your lifestyle.",
  },
];

export default function WhySection() {
  return (
    <section id="benefits" className="bg-[#f2f4f6] py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <span
            className="inline-block text-xs font-semibold tracking-[0.16em] uppercase text-[#006398] mb-4"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Why Allianz Shield Plus
          </span>
          <h2
            className="text-4xl lg:text-5xl font-bold text-[#002356] leading-tight"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Powered up cover,
            <br />
            built for real life.
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.chip}
              className="bg-white rounded-2xl p-8 shadow-ambient flex flex-col gap-5"
            >
              {/* Icon container — editorial offset */}
              <div className="w-14 h-14 rounded-xl bg-[#f2f4f6] flex items-center justify-center -mt-2">
                {f.icon}
              </div>

              {/* Chip */}
              <span
                className="self-start inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#65bafd] text-[#004971]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {f.chip}
              </span>

              {/* Copy */}
              <div>
                <h3
                  className="text-xl font-bold text-[#002356] mb-2"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {f.headline}
                </h3>
                <p
                  className="text-sm text-[#41484d] leading-relaxed"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
