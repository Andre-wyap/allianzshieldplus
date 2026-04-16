"use client";

import { useState } from "react";
import plansData from "@/lib/plans.json";

/* ─── Types ──────────────────────────────────────────────────── */
type AgeBand = "under50" | "51to80";
type OccCategory = "A" | "B";

interface Plan {
  id: number;
  name: string;
  availableForCategoryB: boolean;
  requiresUnderwriting: boolean;
  sumInsured: number;
  benefits: {
    medicalExpenses: number;
    alternativeMedicine: number;
    hospitalIncomePerDay: number;
    hospitalIncomeMaxDays: number;
    dentalCorrection: number;
    ambulanceFee: number;
    funeralExpenses: number;
    mobilityExpenses: number;
    repatriationExpenses: number;
    miscarriage: number;
    compassionateCare: number;
    snatachTheft: number;
    kidnap: { expenses: number; reward: number };
    bloodTransfusion: string;
    permanentImpotencyOrInfertility: string;
    bereavementAllowance: string;
    personalLiability: string;
    doubleIndemnity: string;
    renewalBonus: string;
  };
  weeklyBenefit: { categoryA: number | null; categoryB: number | null };
  premiums: {
    withoutWeeklyBenefit: {
      categoryA: { age50AndBelow: number; age51To80: number } | null;
      categoryB: { age50AndBelow: number; age51To80: number } | null;
    };
  };
}

/* ─── Helpers ─────────────────────────────────────────────────── */
function fmt(n: number) {
  return "RM " + n.toLocaleString("en-MY");
}

function getPremium(plan: Plan, age: AgeBand, occ: OccCategory): number | null {
  const key = occ === "A" ? "categoryA" : "categoryB";
  const tier = plan.premiums.withoutWeeklyBenefit[key];
  if (!tier) return null;
  return age === "under50" ? tier.age50AndBelow : tier.age51To80;
}

/* ─── Occupation Modal ────────────────────────────────────────── */
function OccupationModal({ onClose }: { onClose: () => void }) {
  const { notes } = plansData;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#002356]/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-ambient-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <h3
            className="text-xl font-bold text-[#002356]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Occupation Categories
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#41484d] hover:bg-[#f2f4f6] transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Category A */}
          <div className="bg-[#f2f4f6] rounded-xl p-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#002356] text-white mb-3"
              style={{ fontFamily: "var(--font-manrope)" }}>
              Category A
            </span>
            <p
              className="text-xs text-[#41484d] mb-3 leading-relaxed"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {notes.categoryADescription}
            </p>
            <ul className="space-y-1.5">
              {notes.categoryAExamples.map((ex) => (
                <li
                  key={ex}
                  className="flex items-start gap-2 text-xs text-[#41484d]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#006398] flex-shrink-0" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>

          {/* Category B */}
          <div className="bg-[#f2f4f6] rounded-xl p-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#006398] text-white mb-3"
              style={{ fontFamily: "var(--font-manrope)" }}>
              Category B
            </span>
            <p
              className="text-xs text-[#41484d] mb-3 leading-relaxed"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {notes.categoryBDescription}
            </p>
            <ul className="space-y-1.5">
              {notes.categoryBExamples.map((ex) => (
                <li
                  key={ex}
                  className="flex items-start gap-2 text-xs text-[#41484d]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#006398] flex-shrink-0" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className="mt-5 text-xs text-[#41484d] bg-[#f7f9fb] rounded-xl p-4"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          <strong>Plans 6–9</strong> are only available under Category A.
          Category B is limited to Plans 1–5.
        </p>
      </div>
    </div>
  );
}

/* ─── Plan Card ───────────────────────────────────────────────── */
function PlanCard({
  plan,
  age,
  occ,
  expanded,
  onToggle,
}: {
  plan: Plan;
  age: AgeBand;
  occ: OccCategory;
  expanded: boolean;
  onToggle: () => void;
}) {
  const premium = getPremium(plan, age, occ);
  const { benefits } = plan;

  const allBenefits = [
    { label: "Medical Expenses", value: fmt(benefits.medicalExpenses) },
    { label: "Alternative Medicine", value: fmt(benefits.alternativeMedicine) },
    {
      label: "Hospital Income",
      value: `${fmt(benefits.hospitalIncomePerDay)}/day (max ${benefits.hospitalIncomeMaxDays} days)`,
    },
    { label: "Dental Correction & Cosmetic Surgery", value: fmt(benefits.dentalCorrection) },
    { label: "Ambulance Fee", value: fmt(benefits.ambulanceFee) },
    { label: "Funeral Expenses", value: fmt(benefits.funeralExpenses) },
    { label: "Mobility Expenses", value: fmt(benefits.mobilityExpenses) },
    { label: "Repatriation Expenses", value: fmt(benefits.repatriationExpenses) },
    { label: "Miscarriage (due to accident)", value: fmt(benefits.miscarriage) },
    { label: "Compassionate Care", value: fmt(benefits.compassionateCare) },
    { label: "Snatch Theft / Attempted", value: fmt(benefits.snatachTheft) },
    {
      label: "Kidnap",
      value: `${fmt(benefits.kidnap.expenses)} expenses + ${fmt(benefits.kidnap.reward)} reward`,
    },
    { label: "Blood Transfusion", value: benefits.bloodTransfusion },
    { label: "Permanent Impotency or Infertility", value: benefits.permanentImpotencyOrInfertility },
    { label: "Bereavement Allowance", value: benefits.bereavementAllowance },
    { label: "Personal Liability", value: benefits.personalLiability },
    { label: "Double Indemnity", value: benefits.doubleIndemnity },
    { label: "Renewal Bonus", value: benefits.renewalBonus },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-ambient flex flex-col overflow-hidden">
      {/* Card header */}
      <div className="p-6 pb-0">
        {/* Chip */}
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#65bafd] text-[#004971] mb-4"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {plan.name}
        </span>

        {/* Sum insured */}
        <div
          className="text-3xl font-bold text-[#002356] leading-tight"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {fmt(plan.sumInsured)}
        </div>
        <div
          className="text-xs text-[#41484d] mt-1 mb-5"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Principal Sum Insured
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-[#f7f9fb] rounded-xl p-3">
            <div
              className="text-[11px] text-[#41484d] mb-1"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Medical
            </div>
            <div
              className="text-sm font-semibold text-[#002356]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {fmt(benefits.medicalExpenses)}
            </div>
          </div>
          <div className="bg-[#f7f9fb] rounded-xl p-3">
            <div
              className="text-[11px] text-[#41484d] mb-1"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Hospital/Day
            </div>
            <div
              className="text-sm font-semibold text-[#002356]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {fmt(benefits.hospitalIncomePerDay)}
            </div>
          </div>
          <div className="bg-[#f7f9fb] rounded-xl p-3">
            <div
              className="text-[11px] text-[#41484d] mb-1"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Renewal Bonus
            </div>
            <div
              className="text-sm font-semibold text-[#002356]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Up to 100%
            </div>
          </div>
        </div>
      </div>

      {/* Price section */}
      <div className="px-6 py-4 bg-[#f7f9fb]">
        <div className="flex items-end justify-between">
          <div>
            <div
              className="text-2xl font-bold text-[#002356]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {premium !== null ? `RM ${premium.toLocaleString("en-MY")}` : "N/A"}
            </div>
            <div
              className="text-xs text-[#41484d]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {premium !== null ? "per year (excl. taxes)" : "Not available for this category"}
            </div>
          </div>
          {premium !== null && (
            <div
              className="text-xs text-[#41484d] text-right"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              <span className="text-[#006398] font-medium">
                ≈ RM {Math.round(premium / 12).toLocaleString("en-MY")}
              </span>
              /month
            </div>
          )}
        </div>
      </div>

      {/* Expandable benefits */}
      <div className={`plan-benefits ${expanded ? "open" : ""}`}>
        <div>
          <div className="px-6 py-5">
            <div
              className="text-xs font-semibold text-[#41484d] tracking-widest uppercase mb-4"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Full Benefits
            </div>
            <div className="space-y-2.5">
              {allBenefits.map((b) => (
                <div key={b.label} className="flex items-start justify-between gap-4">
                  <span
                    className="text-xs text-[#41484d] flex-shrink-0 max-w-[48%]"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {b.label}
                  </span>
                  <span
                    className="text-xs font-medium text-[#002356] text-right"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {b.value}
                  </span>
                </div>
              ))}
            </div>

            {/* PDF buttons */}
            <div className="mt-6 pt-5 bg-[#f2f4f6] rounded-xl p-4">
              <div
                className="text-xs font-semibold text-[#41484d] tracking-widest uppercase mb-3"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Documents
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Brochure", href: "/pdfs/brochure.pdf" },
                  { label: "Policy Wording", href: "/pdfs/policy-wording.pdf" },
                  { label: "Product Disclosure", href: "/pdfs/product-disclosure-sheet.pdf" },
                ].map((doc) => (
                  <a
                    key={doc.label}
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#002356] text-xs font-medium shadow-ambient hover:bg-[#f0f4ff] transition-colors"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 1h5.5L10 3.5V11H2V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M7 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                    {doc.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card actions */}
      <div className="p-6 pt-4 mt-auto flex flex-col gap-3">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-[#002356] bg-[#f2f4f6] hover:bg-[#e6e9eb] transition-colors"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {expanded ? "Hide Benefits" : "View Plan"}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {premium !== null && (
          <a
            href={`/apply?plan=${plan.id}&age=${age}&occ=${occ}`}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#002356] text-white text-sm font-semibold hover:bg-[#003a6e] transition-colors"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Get This Plan
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Segmented Toggle ────────────────────────────────────────── */
function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  formatLabel,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  formatLabel?: (v: T) => string;
}) {
  return (
    <div className="inline-flex items-center bg-[#eceef0] rounded-full p-1 gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            value === opt
              ? "bg-[#002356] text-white shadow-ambient-md"
              : "text-[#41484d] hover:text-[#002356]"
          }`}
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {formatLabel ? formatLabel(opt) : opt}
        </button>
      ))}
    </div>
  );
}

/* ─── Main PlanSection ────────────────────────────────────────── */
export default function PlanSection() {
  const [age, setAge] = useState<AgeBand>("under50");
  const [occ, setOcc] = useState<OccCategory>("A");
  const [showOccModal, setShowOccModal] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);

  const visiblePlans = (plansData.plans as Plan[]).filter((p) =>
    occ === "B" ? p.availableForCategoryB : true
  );

  return (
    <>
      {showOccModal && <OccupationModal onClose={() => setShowOccModal(false)} />}

      <section id="plans" className="bg-[#f7f9fb] py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="mb-12">
            <span
              className="inline-block text-xs font-semibold tracking-[0.16em] uppercase text-[#006398] mb-4"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Plans &amp; Pricing
            </span>
            <h2
              className="text-4xl lg:text-5xl font-bold text-[#002356] mb-3"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Find your perfect plan.
            </h2>
            <p
              className="text-base text-[#41484d] max-w-xl"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Select your age group and occupation category — prices update
              instantly.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-6 mb-12">
            {/* Age toggle */}
            <div className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold text-[#41484d] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Age Group
              </span>
              <SegmentedToggle
                options={["under50", "51to80"] as AgeBand[]}
                value={age}
                onChange={setAge}
                formatLabel={(v) => (v === "under50" ? "Below 50" : "51 – 65")}
              />
            </div>

            {/* Occupation toggle */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold text-[#41484d] uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Occupation
                </span>
                <button
                  onClick={() => setShowOccModal(true)}
                  className="w-5 h-5 rounded-full bg-[#eceef0] flex items-center justify-center text-[#41484d] hover:bg-[#e0e3e5] transition-colors"
                  aria-label="What are the occupation categories?"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 4.5v3M5 3V2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="5" cy="5" r="4.25" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </button>
              </div>
              <SegmentedToggle
                options={["A", "B"] as OccCategory[]}
                value={occ}
                onChange={setOcc}
                formatLabel={(v) => `Category ${v}`}
              />
            </div>

            {/* Note */}
            {age === "51to80" && (
              <p
                className="text-xs text-[#41484d] bg-[#eceef0] rounded-xl px-4 py-2 max-w-xs self-end"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Last entry age 65. Policy renewable up to age 80.
              </p>
            )}
          </div>

          {/* Expand all toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setAllExpanded((v) => !v)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-[#002356] bg-white border border-[#e0e6f0] hover:bg-[#f0f4ff] transition-colors shadow-ambient"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                className={`transition-transform duration-300 ${allExpanded ? "rotate-180" : ""}`}>
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {allExpanded ? "Collapse All" : "Expand All Plans"}
            </button>
          </div>

          {/* Plan horizontal scroll */}
          <div className="flex overflow-x-auto gap-6 pb-4 -mx-6 px-6 lg:-mx-10 lg:px-10 snap-x snap-mandatory scrollbar-thin">
            {visiblePlans.map((plan) => (
              <div key={plan.id} className="flex-shrink-0 w-80 snap-start">
                <PlanCard
                  plan={plan as Plan}
                  age={age}
                  occ={occ}
                  expanded={allExpanded}
                  onToggle={() => setAllExpanded((v) => !v)}
                />
              </div>
            ))}
          </div>

          {/* Category B note */}
          {occ === "B" && (
            <p
              className="mt-8 text-sm text-[#41484d] text-center"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Plans 6–9 require Category A classification. For higher coverage,
              please speak to your agent.
            </p>
          )}

          {/* Tax note */}
          <p
            className="mt-6 text-xs text-[#41484d] text-center"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            All premiums are subject to 8% Service Tax + RM10 Stamp Duty.
          </p>
        </div>
      </section>
    </>
  );
}
