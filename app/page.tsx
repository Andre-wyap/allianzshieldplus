import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import PlanSection from "@/components/PlanSection";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhySection />
        <PlanSection />
        <HowItWorks />
      </main>

      {/* Footer */}
      <footer className="bg-[#002356] py-12 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div
                className="text-2xl font-bold text-white mb-1"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Allianz Shield Plus
              </div>
              <div
                className="text-xs text-[#80a4f4]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Distributed by WF Wealth Management Sdn Bhd
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Brochure", href: "/pdfs/brochure.pdf" },
                { label: "Policy Wording", href: "/pdfs/policy-wording.pdf" },
                {
                  label: "Product Disclosure Sheet",
                  href: "/pdfs/product-disclosure-sheet.pdf",
                },
              ].map((doc) => (
                <a
                  key={doc.label}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 transition-colors"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {doc.label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <a
                href="/privacy"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Privacy Policy
              </a>
              <span className="text-white/20 text-xs">·</span>
              <a
                href="/terms"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Terms & Conditions
              </a>
              <span className="text-white/20 text-xs">·</span>
              <a
                href="/refund"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Refund Policy
              </a>
            </div>
            <p
              className="text-xs text-white/40 whitespace-nowrap"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Valid from 1 March 2025
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
