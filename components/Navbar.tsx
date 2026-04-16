"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when scrolled
  useEffect(() => {
    if (scrolled) setMenuOpen(false);
  }, [scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-ambient-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span
              className={`text-2xl font-bold transition-colors duration-300 ${
                scrolled ? "text-[#002356]" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              FINNO
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[10px] font-medium transition-colors duration-300 ${
                  scrolled ? "text-[#006398]" : "text-[#80a4f4]"
                }`}
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Authorised Allianz General Agent
              </span>
              <span
                className={`text-[10px] transition-colors duration-300 ${
                  scrolled ? "text-[#006398]" : "text-[#80a4f4]"
                }`}
              >
                ·
              </span>
              <span
                className={`text-[10px] font-medium transition-colors duration-300 ${
                  scrolled ? "text-[#006398]" : "text-[#80a4f4]"
                }`}
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Allianz Shield Plus
              </span>
            </div>
          </div>
        </div>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {["Benefits", "Plans", "How It Works"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className={`text-sm font-medium transition-colors duration-200 hover:opacity-80 ${
                scrolled ? "text-[#41484d]" : "text-white/80"
              }`}
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA — desktop */}
        <a
          href="#plans"
          className={`hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            scrolled
              ? "bg-[#002356] text-white hover:bg-[#003a6e]"
              : "bg-white/15 text-white border border-white/25 hover:bg-white/25"
          }`}
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Get a Quote
        </a>

        {/* Hamburger — mobile */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled ? "bg-[#002356]" : "bg-white"
            } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled ? "bg-[#002356]" : "bg-white"
            } ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled ? "bg-[#002356]" : "bg-white"
            } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } ${scrolled ? "bg-white border-t border-[#eceef0]" : "bg-[#002356]/95 backdrop-blur-md"}`}
      >
        <nav className="flex flex-col px-6 py-4 gap-1">
          {["Benefits", "Plans", "How It Works"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              className={`py-3 text-sm font-medium border-b transition-colors duration-200 ${
                scrolled
                  ? "text-[#41484d] border-[#eceef0] hover:text-[#002356]"
                  : "text-white/90 border-white/10 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {item}
            </a>
          ))}
          <a
            href="#plans"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#002356] text-white text-sm font-semibold hover:bg-[#003a6e] transition-colors"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Get a Quote
          </a>
        </nav>
      </div>
    </header>
  );
}
