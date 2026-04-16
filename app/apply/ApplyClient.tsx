"use client";

import { useState } from "react";
import plansData from "@/lib/plans.json";

// ── Types ─────────────────────────────────────────────────────────────────────

type AgeBand = "under50" | "51to80";
type OccCategory = "A" | "B";

interface ApplicantDetails {
  name: string;
  nric: string;
  dob: string;
  gender: "male" | "female" | "";
  email: string;
  address: string;
  occupation: string;
  isSmoker: boolean;
}

interface NomineeDetails {
  id: string;
  name: string;
  nric: string;
  relationship: string;
  nationality: string;
}

type ApplicantErrors = Partial<Record<keyof ApplicantDetails, string>>;
type NomineeErrors = Record<string, Record<string, string>>;

// ── Constants ─────────────────────────────────────────────────────────────────

const OCCUPATIONS_CAT_A = [
  "Accountant",
  "Architect",
  "Business Owner / Director",
  "Child / Dependent (below 18)",
  "Clerical Worker",
  "Consultant",
  "Doctor / Dentist",
  "Engineer",
  "Government Officer",
  "Housewife / Househusband",
  "IT Professional",
  "Lawyer / Legal Professional",
  "Manager / Senior Official",
  "Nurse / Allied Health Professional",
  "Pharmacist",
  "Retiree",
  "Sales Executive / Marketing",
  "Student",
  "Teacher / Educator",
  "Technician",
  "Unemployed",
  "Other (Category A)",
];

const OCCUPATIONS_CAT_B = [
  "Agricultural Worker",
  "Aircraft Tester",
  "Ambulance Personnel",
  "Craft / Trades Worker",
  "Diver",
  "Driver – Bus / Truck",
  "Driver – Taxi / Ride-hailing (e-hailing / p-hailing)",
  "Fisherman / Sea Fisherman",
  "Jockey",
  "Machine / Plant Operator",
  "Pilot / Aircraft Crew",
  "Professional Sportsperson",
  "Sawyer / Timber Logger",
  "Seaman",
  "Stevedore",
  "Woodworking Machinist",
  "Other (Category B)",
];

const RELATIONSHIPS = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Grandparent",
  "Grandchild",
  "Parent-in-Law",
  "Sibling-in-Law",
  "Relative",
  "Friend / Associate",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseNRIC(nric: string): {
  valid: boolean;
  error?: string;
  dob?: string;
  gender?: "male" | "female";
} {
  const clean = nric.replace(/-/g, "").replace(/\s/g, "");
  if (clean.length === 0) return { valid: false, error: "NRIC is required" };
  if (!/^\d+$/.test(clean))
    return { valid: false, error: "NRIC must contain digits only" };
  if (clean.length !== 12)
    return { valid: false, error: "NRIC must be 12 digits" };

  const yy = parseInt(clean.slice(0, 2));
  const mm = parseInt(clean.slice(2, 4));
  const dd = parseInt(clean.slice(4, 6));

  if (mm < 1 || mm > 12)
    return { valid: false, error: "Invalid month in NRIC" };
  if (dd < 1 || dd > 31) return { valid: false, error: "Invalid day in NRIC" };

  const currentYY = new Date().getFullYear() % 100;
  const year = yy <= currentYY ? 2000 + yy : 1900 + yy;
  const dob = `${year}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  const gender: "male" | "female" =
    parseInt(clean[11]) % 2 === 1 ? "male" : "female";

  return { valid: true, dob, gender };
}

function formatDOBDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function getPlanById(id: number) {
  return plansData.plans.find((p) => p.id === id) ?? null;
}

function getPremium(
  planId: number,
  age: AgeBand,
  occ: OccCategory
): number | null {
  const plan = getPlanById(planId);
  if (!plan) return null;
  const key = occ === "A" ? "categoryA" : "categoryB";
  const tier = plan.premiums.withoutWeeklyBenefit[key];
  if (!tier) return null;
  return age === "under50" ? tier.age50AndBelow : tier.age51To80;
}

function calcTotal(base: number) {
  const tax = Math.round(base * 0.08 * 100) / 100;
  const stamp = 10;
  return { base, tax, stamp, total: base + tax + stamp };
}

function fmt(n: number) {
  return (
    "RM " +
    n.toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// ── Shared UI primitives ──────────────────────────────────────────────────────

const inputBase =
  "w-full px-4 py-3 rounded-xl border text-[#191c1e] text-sm bg-white placeholder-[#9aa0a6] focus:outline-none transition-colors";
const inputNormal = `${inputBase} border-[#c3c6d3] focus:border-[#006398] focus:ring-2 focus:ring-[#006398]/10`;
const inputErr = `${inputBase} border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10`;

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      className="block text-sm font-semibold text-[#41484d] mb-1.5"
      style={{ fontFamily: "var(--font-manrope)" }}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      className="mt-1.5 text-xs text-red-500"
      style={{ fontFamily: "var(--font-manrope)" }}
    >
      {msg}
    </p>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-ambient mb-6">
      <h3
        className="text-base font-bold text-[#002356] mb-6 pb-4 border-b border-[#f2f4f6]"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = ["Applicant Details", "Nominees", "Review & Confirm"];
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-[#006398] text-white"
                    : active
                    ? "bg-[#002356] text-white"
                    : "bg-[#eceef0] text-[#9aa0a6]"
                }`}
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7l3.5 3.5 5.5-5.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  n
                )}
              </div>
              <span
                className={`text-sm font-semibold hidden sm:block transition-colors ${
                  active
                    ? "text-[#002356]"
                    : done
                    ? "text-[#006398]"
                    : "text-[#9aa0a6]"
                }`}
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-3 transition-colors ${
                  done ? "bg-[#006398]" : "bg-[#eceef0]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Order Summary sidebar ─────────────────────────────────────────────────────

function OrderSummary({
  planId,
  age,
  occ,
  voucherInput,
  voucherApplied,
  voucherError,
  onVoucherInputChange,
  onApplyVoucher,
  onRemoveVoucher,
}: {
  planId: number;
  age: AgeBand;
  occ: OccCategory;
  voucherInput: string;
  voucherApplied: boolean;
  voucherError: string | null;
  onVoucherInputChange: (v: string) => void;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
}) {
  const plan = getPlanById(planId);
  const premium = plan ? getPremium(planId, age, occ) : null;
  const calc = premium !== null ? calcTotal(premium) : null;

  if (!plan) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-ambient">
        <p
          className="text-sm text-[#41484d]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Plan not found.{" "}
          <a href="/#plans" className="text-[#006398] underline">
            Go back to plans
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-ambient overflow-hidden sticky top-24">
      {/* Hero strip */}
      <div className="hero-gradient p-6">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-3"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {plan.name}
        </span>
        <div
          className="text-2xl font-bold text-white leading-tight"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          RM {plan.sumInsured.toLocaleString("en-MY")}
        </div>
        <div
          className="text-xs text-white/70 mt-1"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Principal Sum Insured
        </div>
      </div>

      {/* Plan details */}
      <div className="p-5 border-b border-[#f2f4f6] space-y-2.5">
        {[
          {
            label: "Age Group",
            value: age === "under50" ? "Below 50" : "51 – 65",
          },
          { label: "Occupation", value: `Category ${occ}` },
          {
            label: "Medical Expenses",
            value: `RM ${plan.benefits.medicalExpenses.toLocaleString("en-MY")}`,
          },
          {
            label: "Hospital Income / Day",
            value: `RM ${plan.benefits.hospitalIncomePerDay.toLocaleString("en-MY")}`,
          },
          { label: "Renewal Bonus", value: "Up to 100%" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span
              className="text-xs text-[#41484d]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {row.label}
            </span>
            <span
              className="text-xs font-semibold text-[#002356]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Premium breakdown */}
      {calc && (
        <div className="p-5">
          <p
            className="text-xs font-semibold text-[#41484d] tracking-widest uppercase mb-3"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Premium Breakdown
          </p>
          <div className="space-y-2 mb-4">
            {[
              { label: "Annual Premium", value: fmt(calc.base) },
              { label: "Service Tax (8%)", value: fmt(calc.tax) },
              { label: "Stamp Duty", value: fmt(calc.stamp) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span
                  className="text-xs text-[#41484d]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {row.label}
                </span>
                <span
                  className="text-xs font-medium text-[#002356]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Voucher applied badge */}
          {voucherApplied && (
            <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  className="text-xs font-semibold text-green-700"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Voucher ANDREW
                </span>
              </div>
              <button
                type="button"
                onClick={onRemoveVoucher}
                className="text-xs text-green-600 hover:text-red-500 transition-colors"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Remove
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-[#f2f4f6] flex items-center justify-between">
            <span
              className="text-sm font-bold text-[#002356]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Total Payable
            </span>
            <div className="text-right">
              {voucherApplied && (
                <div
                  className="text-xs text-[#9aa0a6] line-through"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {fmt(calc.total)}
                </div>
              )}
              <span
                className={`text-xl font-bold ${voucherApplied ? "text-green-600" : "text-[#002356]"}`}
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {voucherApplied ? "RM 1.00" : fmt(calc.total)}
              </span>
            </div>
          </div>
          <p
            className="mt-2 text-xs text-[#41484d]/60 text-center"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Per year
          </p>
        </div>
      )}

      {/* Voucher input */}
      <div className="px-5 pb-5">
        <div className="border-t border-[#f2f4f6] pt-5">
          {!voucherApplied ? (
            <>
              <p
                className="text-xs font-semibold text-[#41484d] tracking-widest uppercase mb-2"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Voucher Code
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => onVoucherInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onApplyVoucher()}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#c3c6d3] text-sm text-[#191c1e] bg-white placeholder-[#9aa0a6] focus:outline-none focus:border-[#006398] focus:ring-2 focus:ring-[#006398]/10 transition-colors"
                  style={{ fontFamily: "var(--font-manrope)" }}
                />
                <button
                  type="button"
                  onClick={onApplyVoucher}
                  className="px-4 py-2 rounded-xl bg-[#002356] text-white text-xs font-semibold hover:bg-[#003a6e] transition-colors shrink-0"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Apply
                </button>
              </div>
              {voucherError && (
                <p
                  className="mt-1.5 text-xs text-red-500"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {voucherError}
                </p>
              )}
            </>
          ) : (
            <p
              className="text-xs text-green-600 text-center"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Special discount applied!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Applicant Details ─────────────────────────────────────────────────

function ApplicantStep({
  data,
  errors,
  onChange,
  occCategory,
}: {
  data: ApplicantDetails;
  errors: ApplicantErrors;
  onChange: (updates: Partial<ApplicantDetails>) => void;
  occCategory: OccCategory;
}) {
  function handleNRICChange(val: string) {
    const result = parseNRIC(val);
    onChange({
      nric: val,
      ...(result.valid ? { dob: result.dob!, gender: result.gender! } : {}),
    });
  }

  return (
    <div>
      <Section title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <Label required>Full Name (as per NRIC)</Label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Ahmad bin Abdullah"
              className={errors.name ? inputErr : inputNormal}
              style={{ fontFamily: "var(--font-manrope)" }}
            />
            <FieldError msg={errors.name} />
          </div>

          {/* NRIC */}
          <div>
            <Label required>NRIC Number</Label>
            <input
              type="text"
              value={data.nric}
              onChange={(e) => handleNRICChange(e.target.value)}
              placeholder="e.g. 900101-10-1234"
              maxLength={14}
              className={errors.nric ? inputErr : inputNormal}
              style={{ fontFamily: "var(--font-manrope)" }}
            />
            <FieldError msg={errors.nric} />
            {!errors.nric && data.nric.length > 0 && !data.dob && (
              <p
                className="mt-1.5 text-xs text-[#9aa0a6]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Enter 12 digits to auto-fill date of birth and gender
              </p>
            )}
          </div>

          {/* Date of Birth — auto-filled */}
          <div>
            <Label>Date of Birth</Label>
            <div
              className={`${inputBase} flex items-center justify-between ${
                data.dob
                  ? "border-[#006398]/40 bg-[#006398]/4 text-[#002356]"
                  : "border-[#eceef0] bg-[#f7f9fb] text-[#9aa0a6]"
              } cursor-not-allowed`}
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              <span>
                {data.dob ? formatDOBDisplay(data.dob) : "Auto-filled from NRIC"}
              </span>
              {data.dob && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7l3.5 3.5 6.5-6.5"
                    stroke="#006398"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Gender — auto-filled */}
          <div className="sm:col-span-2">
            <Label>Gender</Label>
            {data.gender ? (
              <div className="flex gap-3">
                {(["male", "female"] as const).map((g) => (
                  <div
                    key={g}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium cursor-not-allowed ${
                      data.gender === g
                        ? "border-[#006398]/40 bg-[#006398]/4 text-[#002356]"
                        : "border-[#eceef0] bg-[#f7f9fb] text-[#9aa0a6]"
                    }`}
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {data.gender === g && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M1.5 6l3 3 6-6"
                          stroke="#006398"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {g === "male" ? "Male" : "Female"}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`${inputBase} border-[#eceef0] bg-[#f7f9fb] text-[#9aa0a6] cursor-not-allowed`}
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Auto-filled from NRIC
              </div>
            )}
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <Label required>Email Address</Label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="e.g. ahmad@email.com"
              className={errors.email ? inputErr : inputNormal}
              style={{ fontFamily: "var(--font-manrope)" }}
            />
            <FieldError msg={errors.email} />
          </div>
        </div>
      </Section>

      <Section title="Address & Occupation">
        <div className="grid grid-cols-1 gap-5">
          {/* Address */}
          <div>
            <Label required>Home Address</Label>
            <textarea
              value={data.address}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="No. 12, Jalan Harmoni 3, Taman Harmoni, 47500 Subang Jaya, Selangor"
              rows={3}
              className={`${errors.address ? inputErr : inputNormal} resize-none`}
              style={{ fontFamily: "var(--font-manrope)" }}
            />
            <FieldError msg={errors.address} />
          </div>

          {/* Occupation */}
          <div>
            <Label required>Occupation</Label>
            <select
              value={data.occupation}
              onChange={(e) => onChange({ occupation: e.target.value })}
              className={`${errors.occupation ? inputErr : inputNormal} cursor-pointer`}
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              <option value="">Select your occupation</option>
              {occCategory === "B" ? (
                <>
                  <optgroup label="Category A — Non-manual / Office">
                    {OCCUPATIONS_CAT_A.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Category B — Skilled / Manual">
                    {OCCUPATIONS_CAT_B.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </optgroup>
                </>
              ) : (
                OCCUPATIONS_CAT_A.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))
              )}
            </select>
            <FieldError msg={errors.occupation} />
          </div>

          {/* Smoker toggle */}
          <div>
            <Label required>Are you a smoker?</Label>
            <div className="flex gap-3">
              {([false, true] as const).map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => onChange({ isSmoker: val })}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                    data.isSmoker === val
                      ? "border-[#002356] bg-[#002356] text-white"
                      : "border-[#eceef0] bg-white text-[#41484d] hover:border-[#c3c6d3]"
                  }`}
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {val ? "Yes, I smoke" : "No, non-smoker"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ── Step 2: Nominees ──────────────────────────────────────────────────────────

function NomineesStep({
  nominees,
  errors,
  onAdd,
  onRemove,
  onChange,
}: {
  nominees: NomineeDetails[];
  errors: NomineeErrors;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, updates: Partial<NomineeDetails>) => void;
}) {
  return (
    <div>
      {/* Info banner */}
      <div className="bg-[#006398]/6 border border-[#006398]/20 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="mt-0.5 shrink-0"
        >
          <circle cx="8" cy="8" r="7" stroke="#006398" strokeWidth="1.4" />
          <path
            d="M8 7v5M8 5V4"
            stroke="#006398"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <p
          className="text-xs text-[#006398] leading-relaxed"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Nominees are optional. You can add up to 2 nominees who will receive
          the policy benefit. Nominees can be added or updated after policy
          issuance.
        </p>
      </div>

      {nominees.length === 0 && (
        <div className="bg-white rounded-2xl p-10 shadow-ambient mb-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#f2f4f6] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5a4 4 0 100 8 4 4 0 000-8zM4 21c0-4.42 3.58-8 8-8s8 3.58 8 8"
                stroke="#41484d"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p
            className="text-sm font-semibold text-[#41484d] mb-1"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            No nominees added
          </p>
          <p
            className="text-xs text-[#9aa0a6]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Click the button below to add a nominee
          </p>
        </div>
      )}

      {nominees.map((nominee, idx) => (
        <div key={nominee.id} className="bg-white rounded-2xl p-8 shadow-ambient mb-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f2f4f6]">
            <h3
              className="text-base font-bold text-[#002356]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Nominee {idx + 1}
            </h3>
            <button
              type="button"
              onClick={() => onRemove(nominee.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-500 transition-colors"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1.5 1.5l9 9M10.5 1.5l-9 9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="sm:col-span-2">
              <Label required>Full Name (as per NRIC)</Label>
              <input
                type="text"
                value={nominee.name}
                onChange={(e) => onChange(nominee.id, { name: e.target.value })}
                placeholder="e.g. Siti binti Abdullah"
                className={errors[nominee.id]?.name ? inputErr : inputNormal}
                style={{ fontFamily: "var(--font-manrope)" }}
              />
              <FieldError msg={errors[nominee.id]?.name} />
            </div>

            {/* NRIC */}
            <div>
              <Label required>NRIC Number</Label>
              <input
                type="text"
                value={nominee.nric}
                onChange={(e) => onChange(nominee.id, { nric: e.target.value })}
                placeholder="e.g. 950615-05-5678"
                maxLength={14}
                className={errors[nominee.id]?.nric ? inputErr : inputNormal}
                style={{ fontFamily: "var(--font-manrope)" }}
              />
              <FieldError msg={errors[nominee.id]?.nric} />
            </div>

            {/* Relationship */}
            <div>
              <Label required>Relationship to Applicant</Label>
              <select
                value={nominee.relationship}
                onChange={(e) =>
                  onChange(nominee.id, { relationship: e.target.value })
                }
                className={`${
                  errors[nominee.id]?.relationship ? inputErr : inputNormal
                } cursor-pointer`}
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                <option value="">Select relationship</option>
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <FieldError msg={errors[nominee.id]?.relationship} />
            </div>

            {/* Nationality */}
            <div className="sm:col-span-2">
              <Label required>Nationality</Label>
              <input
                type="text"
                value={nominee.nationality}
                onChange={(e) =>
                  onChange(nominee.id, { nationality: e.target.value })
                }
                placeholder="e.g. Malaysian"
                className={
                  errors[nominee.id]?.nationality ? inputErr : inputNormal
                }
                style={{ fontFamily: "var(--font-manrope)" }}
              />
              <FieldError msg={errors[nominee.id]?.nationality} />
            </div>
          </div>
        </div>
      ))}

      {nominees.length < 2 && (
        <button
          type="button"
          onClick={onAdd}
          className="w-full py-5 rounded-2xl border-2 border-dashed border-[#c3c6d3] text-sm font-semibold text-[#41484d] hover:border-[#006398] hover:text-[#006398] hover:bg-[#006398]/4 transition-colors flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Add {nominees.length === 0 ? "a" : "another"} nominee
        </button>
      )}

      {nominees.length > 0 && (
        <p
          className="mt-4 text-xs text-[#41484d] text-center"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {nominees.length} of 2 nominees added
        </p>
      )}
    </div>
  );
}

// ── Step 3: Review & Confirm ──────────────────────────────────────────────────

function ReviewStep({
  applicant,
  nominees,
  planId,
  age,
  occ,
  pdpaConsent,
  onPdpaChange,
}: {
  applicant: ApplicantDetails;
  nominees: NomineeDetails[];
  planId: number;
  age: AgeBand;
  occ: OccCategory;
  pdpaConsent: boolean;
  onPdpaChange: (v: boolean) => void;
}) {
  const plan = getPlanById(planId);
  const premium = plan ? getPremium(planId, age, occ) : null;
  const calc = premium !== null ? calcTotal(premium) : null;

  function Row({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#f7f9fb] last:border-0">
        <span
          className="text-xs text-[#41484d] shrink-0 w-44"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {label}
        </span>
        <span
          className="text-xs font-semibold text-[#002356] text-right"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {value || "—"}
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Selected Plan */}
      <Section title="Selected Plan">
        {plan && calc ? (
          <div>
            <Row label="Plan" value={plan.name} />
            <Row
              label="Principal Sum Insured"
              value={`RM ${plan.sumInsured.toLocaleString("en-MY")}`}
            />
            <Row
              label="Age Group"
              value={age === "under50" ? "Below 50" : "51 – 65"}
            />
            <Row label="Occupation Category" value={`Category ${occ}`} />
            <Row label="Annual Premium" value={fmt(calc.base)} />
            <Row label="Service Tax (8%)" value={fmt(calc.tax)} />
            <Row label="Stamp Duty" value={fmt(calc.stamp)} />
            <div className="flex items-center justify-between pt-4 mt-2">
              <span
                className="text-sm font-bold text-[#002356]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Total Payable
              </span>
              <span
                className="text-2xl font-bold text-[#002356]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {fmt(calc.total)}
              </span>
            </div>
          </div>
        ) : (
          <p
            className="text-sm text-[#41484d]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Plan not found.
          </p>
        )}
      </Section>

      {/* Applicant */}
      <Section title="Applicant Details">
        <Row label="Full Name" value={applicant.name} />
        <Row label="NRIC" value={applicant.nric} />
        <Row
          label="Date of Birth"
          value={applicant.dob ? formatDOBDisplay(applicant.dob) : ""}
        />
        <Row
          label="Gender"
          value={
            applicant.gender
              ? applicant.gender === "male"
                ? "Male"
                : "Female"
              : ""
          }
        />
        <Row label="Email" value={applicant.email} />
        <Row label="Home Address" value={applicant.address} />
        <Row label="Occupation" value={applicant.occupation} />
        <Row label="Smoker" value={applicant.isSmoker ? "Yes" : "No"} />
      </Section>

      {/* Nominees */}
      {nominees.length > 0 ? (
        nominees.map((n, i) => (
          <Section key={n.id} title={`Nominee ${i + 1}`}>
            <Row label="Full Name" value={n.name} />
            <Row label="NRIC" value={n.nric} />
            <Row label="Relationship" value={n.relationship} />
            <Row label="Nationality" value={n.nationality} />
          </Section>
        ))
      ) : (
        <Section title="Nominees">
          <p
            className="text-sm text-[#41484d] text-center py-2"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            No nominees added
          </p>
        </Section>
      )}

      {/* PDPA Consent */}
      <div className="bg-[#f7f9fb] rounded-2xl p-5 border border-[#eceef0]">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={pdpaConsent}
              onChange={(e) => onPdpaChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                pdpaConsent
                  ? "bg-[#002356] border-[#002356]"
                  : "bg-white border-[#c3c6d3] group-hover:border-[#006398]"
              }`}
            >
              {pdpaConsent && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1.5 5l2.5 2.5 4.5-4.5"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
          <p
            className="text-xs text-[#41484d] leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            I confirm that all information provided is accurate and complete. I
            consent to Allianz General Insurance Company (Malaysia) Berhad and
            WF Wealth Management Sdn Bhd processing my personal data for the
            purpose of this insurance application, in accordance with the{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#006398] underline hover:text-[#002356]"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#006398] underline hover:text-[#002356]"
              onClick={(e) => e.stopPropagation()}
            >
              Terms & Conditions
            </a>
            . Payment will be processed securely via Billplz.
          </p>
        </label>
      </div>
    </div>
  );
}

// ── Main: ApplyClient ─────────────────────────────────────────────────────────

export default function ApplyClient({
  planId,
  ageBand,
  occCategory,
}: {
  planId: number;
  ageBand: AgeBand;
  occCategory: OccCategory;
}) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pdpaConsent, setPdpaConsent] = useState(false);

  const [voucherInput, setVoucherInput] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  function handleApplyVoucher() {
    if (voucherInput.trim().toLowerCase() === "andrew") {
      setVoucherApplied(true);
      setVoucherError(null);
    } else {
      setVoucherError("Invalid voucher code.");
    }
  }

  function handleRemoveVoucher() {
    setVoucherApplied(false);
    setVoucherInput("");
    setVoucherError(null);
  }

  const [applicant, setApplicant] = useState<ApplicantDetails>({
    name: "",
    nric: "",
    dob: "",
    gender: "",
    email: "",
    address: "",
    occupation: "",
    isSmoker: false,
  });
  const [applicantErrors, setApplicantErrors] = useState<ApplicantErrors>({});

  const [nominees, setNominees] = useState<NomineeDetails[]>([]);
  const [nomineeErrors, setNomineeErrors] = useState<NomineeErrors>({});

  // ── Validation ──

  function validateApplicant(): boolean {
    const errs: ApplicantErrors = {};

    if (!applicant.name.trim()) errs.name = "Full name is required";

    const nricResult = parseNRIC(applicant.nric);
    if (!nricResult.valid) errs.nric = nricResult.error ?? "Invalid NRIC";

    if (!applicant.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.email)) {
      errs.email = "Enter a valid email address";
    }

    if (!applicant.address.trim()) errs.address = "Home address is required";
    if (!applicant.occupation) errs.occupation = "Please select your occupation";

    setApplicantErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateNominees(): boolean {
    const errs: NomineeErrors = {};

    nominees.forEach((n) => {
      const nErrs: Record<string, string> = {};
      if (!n.name.trim()) nErrs.name = "Name is required";

      const nricResult = parseNRIC(n.nric);
      if (!nricResult.valid) nErrs.nric = nricResult.error ?? "Invalid NRIC";

      if (!n.relationship) nErrs.relationship = "Please select a relationship";
      if (!n.nationality.trim()) nErrs.nationality = "Nationality is required";

      if (Object.keys(nErrs).length > 0) errs[n.id] = nErrs;
    });

    setNomineeErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Navigation ──

  function handleNext() {
    if (step === 1 && validateApplicant()) setStep(2);
    if (step === 2 && validateNominees()) setStep(3);
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  // ── Nominees ──

  function addNominee() {
    if (nominees.length >= 2) return;
    setNominees((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        nric: "",
        relationship: "",
        nationality: "Malaysian",
      },
    ]);
  }

  function removeNominee(id: string) {
    setNominees((prev) => prev.filter((n) => n.id !== id));
    setNomineeErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateNominee(id: string, updates: Partial<NomineeDetails>) {
    setNominees((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  }

  // ── Submit ──

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, ageBand, occCategory, applicant, nominees, voucherCode: voucherApplied ? "andrew" : "" }),
      });

      const data = await res.json();

      if (!res.ok || !data.paymentUrl) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Redirect to Billplz payment page
      window.location.href = data.paymentUrl;
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  // ── Render ──

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Header */}
      <header className="bg-white border-b border-[#eceef0] shadow-ambient-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <a
            href="/#plans"
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
            Back to Plans
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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#002356] mb-1"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Apply for Coverage
          </h1>
          <p
            className="text-sm text-[#41484d]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Fill in your details below to complete your application.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Form column */}
          <div className="flex-1 min-w-0">
            <StepIndicator current={step} />

            {step === 1 && (
              <ApplicantStep
                data={applicant}
                errors={applicantErrors}
                onChange={(u) => setApplicant((prev) => ({ ...prev, ...u }))}
                occCategory={occCategory}
              />
            )}
            {step === 2 && (
              <NomineesStep
                nominees={nominees}
                errors={nomineeErrors}
                onAdd={addNominee}
                onRemove={removeNominee}
                onChange={updateNominee}
              />
            )}
            {step === 3 && (
              <ReviewStep
                applicant={applicant}
                nominees={nominees}
                planId={planId}
                age={ageBand}
                occ={occCategory}
                pdpaConsent={pdpaConsent}
                onPdpaChange={setPdpaConsent}
              />
            )}

            {/* Submit error banner */}
            {submitError && (
              <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="mt-0.5 shrink-0"
                >
                  <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.4" />
                  <path
                    d="M8 5v4M8 11v.5"
                    stroke="#dc2626"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <p
                  className="text-xs text-red-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {submitError}
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#c3c6d3] text-sm font-semibold text-[#41484d] hover:border-[#002356] hover:text-[#002356] transition-colors"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M9 3L4 7l5 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#002356] text-white text-sm font-bold hover:bg-[#003a6e] transition-colors"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Continue
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M5 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !pdpaConsent}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#002356] text-white text-sm font-bold hover:bg-[#003a6e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <circle
                          cx="7"
                          cy="7"
                          r="5.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeDasharray="20 14"
                          strokeLinecap="round"
                        />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2 7h10M8 3l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <OrderSummary
              planId={planId}
              age={ageBand}
              occ={occCategory}
              voucherInput={voucherInput}
              voucherApplied={voucherApplied}
              voucherError={voucherError}
              onVoucherInputChange={setVoucherInput}
              onApplyVoucher={handleApplyVoucher}
              onRemoveVoucher={handleRemoveVoucher}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
