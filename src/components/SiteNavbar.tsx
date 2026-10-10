"use client"

import { useEffect, useState } from "react"

import type { Lang, Rate, Theme } from "../lib/types"

import BrandMark from "./BrandMark"

type Translation = (key: string) => string

interface SiteNavbarProps {
  rates: Rate[]

  lang: Lang

  theme: Theme

  adminLoggedIn: boolean

  t: Translation

  onToggleLang: () => void

  onToggleTheme: () => void

  onAdminClick: () => void

  onDashboardClick: () => void
}

interface TickerProps {
  rates: Rate[]
  isDark: boolean
}

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === "dark" ? (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
    </svg>
  )
}

function Ticker({ rates, isDark }: TickerProps) {
  return (
    <div
      className={`overflow-hidden py-2 border-b ${
        isDark ? "bg-[#0a1028] border-[#1a2550]" : "bg-blue-50 border-blue-100"
      }`}
    >
      <div className="ticker-track flex gap-12 whitespace-nowrap">
        {[...rates, ...rates].map((rate, index) => (
          <span
            key={`${rate.id}-${index}`}
            className="inline-flex items-center gap-2 text-sm"
          >
            <span className="text-lg">{rate.logo}</span>
            <span
              className={`font-medium ${
                isDark ? "text-[#6b82a8]" : "text-slate-500"
              }`}
            >
              {rate.pair}
            </span>
            <span
              className={`font-black ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              ৳{rate.rate}
            </span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                rate.change.startsWith("+")
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {rate.change}
            </span>
            <span
              className={`ml-4 ${isDark ? "text-[#1a2550]" : "text-blue-100"}`}
            >
              |
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SiteNavbar({
  rates,

  lang,

  theme,

  adminLoggedIn,

  t,

  onToggleLang,

  onToggleTheme,

  onAdminClick,

  onDashboardClick,
}: SiteNavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  const [menuOpen, setMenuOpen] = useState(false)

  const isDark = theme === "dark"

  const links: [string, string][] = [
    ["nav_home", "#home"],

    ["nav_services", "#services"],

    ["nav_rates", "#rates"],

    ["nav_about", "#about"],

    ["nav_contact", "#contact"],
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navBg = isDark
    ? scrolled
      ? "bg-[#060b18]/95 backdrop-blur-md border-b border-[#1a2550]/60"
      : "bg-transparent"
    : scrolled
      ? "bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm"
      : "bg-transparent"

  const controlStyle = isDark
    ? "border-[#1a3060] text-[#a0b4d6] hover:border-[#1a7fff]/50 hover:text-white bg-[#0d1630]/60"
    : "border-blue-100 text-slate-600 hover:border-[#1a7fff]/40 hover:text-[#1a7fff] bg-white/60"

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <Ticker rates={rates} isDark={isDark} />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3.5">
        <a
          href="#home"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
        >
          <BrandMark size={34} />
          <div>
            <div
              className={`font-['Exo_2'] text-base font-black leading-none sm:text-lg ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              MT Solution
            </div>
            <div className="hidden text-[10px] font-semibold uppercase tracking-widest text-[#00d46a] sm:block">
              Money Exchange
            </div>
          </div>
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map(([key, href]) => (
            <a
              key={key}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-[#1a7fff] ${
                isDark ? "text-[#a0b4d6]" : "text-slate-600"
              }`}
            >
              {t(key)}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={onToggleLang}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all ${controlStyle}`}
          >
            <GlobeIcon />
            {lang === "bn" ? "EN" : "বাং"}
          </button>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className={`rounded-lg border p-2 transition-all ${controlStyle}`}
          >
            <ThemeIcon theme={theme} />
          </button>
          <button
            onClick={adminLoggedIn ? onDashboardClick : onAdminClick}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${controlStyle}`}
          >
            <ShieldIcon />
            {adminLoggedIn ? t("admin_panel") : t("admin")}
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
          <button
            onClick={onToggleLang}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-bold ${controlStyle}`}
          >
            <GlobeIcon />
            {lang === "bn" ? "EN" : "বাং"}
          </button>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className={`rounded-lg border p-2 ${controlStyle}`}
          >
            <ThemeIcon theme={theme} />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className={`rounded-lg p-2 ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18 18 6M6 6l12 12"
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

      {menuOpen && (
        <div
          id="mobile-navigation"
          className={`space-y-3 border-t px-4 py-4 lg:hidden ${
            isDark
              ? "bg-[#0a1028] border-[#1a2550]"
              : "bg-white border-blue-100 shadow-lg"
          }`}
        >
          {links.map(([key, href]) => (
            <a
              key={key}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 text-sm font-medium hover:text-[#1a7fff] ${
                isDark ? "text-[#a0b4d6]" : "text-slate-600"
              }`}
            >
              {t(key)}
            </a>
          ))}
          <hr className={isDark ? "border-[#1a2550]" : "border-blue-50"} />
          <button
            onClick={() => {
              ;(adminLoggedIn ? onDashboardClick : onAdminClick)()
              setMenuOpen(false)
            }}
            className={`flex items-center gap-2 text-sm font-medium hover:text-[#1a7fff] ${
              isDark ? "text-[#6b82a8]" : "text-slate-500"
            }`}
          >
            <ShieldIcon />
            {adminLoggedIn ? t("admin_panel") : t("admin")}
          </button>
        </div>
      )}
    </nav>
  )
}
