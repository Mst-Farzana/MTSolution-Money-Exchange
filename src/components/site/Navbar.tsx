"use client"

import { useEffect, useState } from "react"
import BrandMark from "@/components/BrandMark"
import { GlobeIcon, MoonIcon, ShieldIcon, SunIcon } from "@/components/AppIcons"
import { Ticker } from "@/components/site/Ticker"
import type { Lang, Rate, Theme } from "@/lib/types"
import type { TKey } from "@/lib/app-data"

export interface NavbarProps {
  rates: Rate[]
  lang: Lang
  theme: Theme
  adminLoggedIn: boolean
  t: (k: TKey) => string
  onToggleLang: () => void
  onToggleTheme: () => void
  onAdminClick: () => void
  onDashboardClick: () => void
}

export function Navbar({
  rates,
  lang,
  theme,
  adminLoggedIn,
  t,
  onToggleLang,
  onToggleTheme,
  onAdminClick,
  onDashboardClick,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isDark = theme === "dark"

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  const links: [TKey, string][] = [
    ["nav_home", "#home"],
    ["nav_services", "#services"],
    ["nav_rates", "#rates"],
    ["nav_about", "#about"],
    ["nav_contact", "#contact"],
  ]

  const navBg = isDark
    ? scrolled
      ? "bg-[#060b18]/95 backdrop-blur-md border-b border-[#1a2550]/60"
      : "bg-transparent"
    : scrolled
      ? "bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm"
      : "bg-transparent"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <Ticker rates={rates} isDark={isDark} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {}
        <a href="#home" className="flex items-center gap-3 flex-shrink-0">
          <BrandMark size={40} />
          <div>
            <div
              className={`font-black text-lg leading-none font-['Exo_2'] ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              MT Solution
            </div>
            <div className="text-[#00d46a] text-[10px] tracking-widest uppercase font-semibold">
              Money Exchange
            </div>
          </div>
        </a>

        {}
        <div className="hidden lg:flex items-center gap-6">
          {links.map(([k, href]) => (
            <a
              key={k}
              href={href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-[#1a7fff] ${
                isDark ? "text-[#a0b4d6]" : "text-slate-600"
              }`}
            >
              {t(k)}
            </a>
          ))}
        </div>

        {}
        <div className="hidden lg:flex items-center gap-2">
          {}
          <button
            onClick={onToggleLang}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
              isDark
                ? "border-[#1a3060] text-[#a0b4d6] hover:border-[#1a7fff]/50 hover:text-white bg-[#0d1630]/60"
                : "border-blue-100 text-slate-600 hover:border-[#1a7fff]/40 hover:text-[#1a7fff] bg-white/60"
            }`}
          >
            <GlobeIcon />
            {lang === "bn" ? "EN" : "বাং"}
          </button>

          {}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg transition-all border ${
              isDark
                ? "border-[#1a3060] text-[#a0b4d6] hover:border-[#1a7fff]/50 hover:text-white bg-[#0d1630]/60"
                : "border-blue-100 text-slate-600 hover:border-[#1a7fff]/40 hover:text-[#1a7fff] bg-white/60"
            }`}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {}
          <button
            onClick={adminLoggedIn ? onDashboardClick : onAdminClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isDark
                ? "border-[#1a3060] text-[#6b82a8] hover:border-[#1a7fff]/50 hover:text-[#1a7fff] bg-[#0d1630]/60"
                : "border-blue-100 text-slate-500 hover:border-[#1a7fff]/40 hover:text-[#1a7fff] bg-white/60"
            }`}
          >
            <ShieldIcon />
            {adminLoggedIn ? t("admin_panel") : t("admin")}
          </button>
        </div>

        {}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isDark
                ? "border-[#1a3060] text-[#a0b4d6] bg-[#0d1630]/60"
                : "border-blue-100 text-slate-600 bg-white/60"
            }`}
          >
            <GlobeIcon />
            {lang === "bn" ? "EN" : "বাং"}
          </button>
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-all ${
              isDark
                ? "border-[#1a3060] text-[#a0b4d6] bg-[#0d1630]/60"
                : "border-blue-100 text-slate-600 bg-white/60"
            }`}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-lg ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {}
      {menuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-4 space-y-3 ${
            isDark
              ? "bg-[#0a1028] border-[#1a2550]"
              : "bg-white border-blue-100 shadow-lg"
          }`}
        >
          {links.map(([k, href]) => (
            <a
              key={k}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors hover:text-[#1a7fff] ${
                isDark ? "text-[#a0b4d6]" : "text-slate-600"
              }`}
            >
              {t(k)}
            </a>
          ))}
          <hr className={isDark ? "border-[#1a2550]" : "border-blue-50"} />
          <button
            onClick={() => {
              onAdminClick()
              setMenuOpen(false)
            }}
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#1a7fff] ${
              isDark ? "text-[#6b82a8]" : "text-slate-500"
            }`}
          >
            <ShieldIcon /> {adminLoggedIn ? t("admin_panel") : t("admin")}
          </button>
        </div>
      )}
    </nav>
  )
}
