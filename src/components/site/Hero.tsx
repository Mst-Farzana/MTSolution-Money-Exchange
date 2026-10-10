"use client"

import type { CSSProperties } from "react"
import { WhatsAppIcon } from "@/components/AppIcons"
import { DEF_PAYMENTS } from "@/lib/app-data"
import type { Rate, SiteSettings } from "@/lib/types"
import type { TKey } from "@/lib/app-data"

export function Hero({
  t,
  isDark,
  settings,
  rates,
}: {
  t: (k: TKey) => string
  isDark: boolean
  settings: SiteSettings
  rates: Rate[]
}) {
  const chartRates = rates
    .map((rate) => ({
      ...rate,
      numericRate: Number.parseFloat(rate.rate.replace(/,/g, "")),
    }))
    .filter((rate) => Number.isFinite(rate.numericRate) && rate.numericRate > 0)
    .slice(0, 6)
  const maxRate = Math.max(...chartRates.map((rate) => rate.numericRate), 1)

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pb-14 pt-32 grid-bg sm:pb-20 sm:pt-36"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 hidden h-[min(90vw,900px)] w-[min(90vw,900px)] -translate-y-1/2 text-[#1a7fff] opacity-[0.045] lg:block"
        viewBox="0 0 800 800"
        fill="none"
      >
        <circle
          cx="400"
          cy="400"
          r="330"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="400"
          cy="400"
          r="270"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="8 14"
        />
        <path
          d="M230 345c22-91 104-158 202-158 68 0 128 33 164 84"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="m568 217 31 65 66-27"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M570 455c-22 91-104 158-202 158-68 0-128-33-164-84"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="m232 583-31-65-66 27"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="400"
          cy="400"
          r="126"
          stroke="currentColor"
          strokeWidth="14"
        />
        <path
          d="M442 337c-12-16-31-25-54-25-31 0-54 18-54 43 0 27 23 38 57 47 35 9 59 22 59 51 0 29-25 49-60 49-27 0-50-11-65-31M400 283v234"
          stroke="currentColor"
          strokeWidth="17"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#1a7fff]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#00d46a]/6 rounded-full blur-3xl pointer-events-none" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {DEF_PAYMENTS.map((payment, index) => {
          const positions = [
            "left-[8%] top-[19%]",
            "left-[43%] top-[16%]",
            "left-[76%] top-[22%]",
            "left-[91%] top-[43%]",
            "left-[68%] top-[68%]",
            "left-[38%] top-[79%]",
            "left-[13%] top-[72%]",
            "left-[55%] top-[42%]",
            "left-[87%] top-[82%]",
            "left-[25%] top-[35%]",
            "left-[3%] top-[51%]",
            "left-[48%] top-[91%]",
          ]

          return (
            <span
              key={payment.id}
              className={`hero-float-icon absolute flex h-9 w-9 items-center justify-center rounded-xl border text-lg shadow-lg sm:h-11 sm:w-11 sm:text-xl ${
                positions[index % positions.length]
              } ${
                isDark
                  ? "border-white/10 bg-[#0d1630]/70"
                  : "border-blue-200/70 bg-white/75"
              }`}
              style={
                {
                  "--float-delay": `${index * -0.8}s`,
                  "--float-duration": `${7 + (index % 4) * 1.5}s`,
                  color: payment.color,
                } as CSSProperties
              }
            >
              {payment.emoji}
            </span>
          )
        })}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {}
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 border border-[#1a7fff]/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm"
              style={{
                background: isDark
                  ? "rgba(13,22,48,0.8)"
                  : "rgba(255,255,255,0.8)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d46a] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00d46a]" />
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-[#a0b4d6]" : "text-slate-600"
                }`}
              >
                {t("hero_badge")}
              </span>
            </div>

            <h1
              className={`text-[clamp(2rem,9vw,3rem)] font-black leading-tight mb-2 sm:text-5xl lg:text-6xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {t("hero_h1")}{" "}
              <span className="gradient-text">{t("hero_h1b")}</span>
            </h1>

            <p
              className={`text-lg leading-relaxed mb-3 mt-4 bengali ${
                isDark ? "text-[#a0b4d6]" : "text-slate-600"
              }`}
            >
              {t("hero_desc")}
            </p>
            <p
              className={`text-sm italic mb-8 ${
                isDark ? "text-[#6b82a8]" : "text-slate-500"
              }`}
            >
              {t("hero_sub")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href={`https://wa.me/${settings.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#1a7fff] hover:bg-[#0066dd] text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 glow-blue"
              >
                <WhatsAppIcon /> {t("cta_contact")}
              </a>
              <a
                href="#rates"
                className={`flex items-center justify-center gap-2 border font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 ${
                  isDark
                    ? "border-[#1a7fff]/40 hover:border-[#1a7fff] text-white hover:bg-[#0d1630]"
                    : "border-blue-200 hover:border-[#1a7fff] text-slate-700 hover:bg-blue-50"
                }`}
              >
                {t("cta_rates")}
              </a>
            </div>

            {}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { num: "42K+", label: t("stat_followers") },
                { num: "100%", label: t("stat_secure") },
                { num: "24/7", label: t("stat_support") },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-2xl border p-2.5 text-center backdrop-blur-sm transition-all hover:-translate-y-0.5 sm:p-4 ${
                    isDark
                      ? "bg-[#0d1630]/80 border-[#1a2550]"
                      : "bg-white/80 border-blue-100 shadow-sm"
                  }`}
                >
                  <div className="stat-number mb-1 text-xl text-[#1a7fff] sm:text-2xl">
                    {s.num}
                  </div>
                  <div
                    className={`text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${
                      isDark ? "text-[#6b82a8]" : "text-slate-500"
                    }`}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="relative mx-auto flex w-full max-w-lg flex-col items-center">
            <div className="relative flex h-64 w-full items-center justify-center sm:h-80 lg:h-[26rem]">
              <div
                className={`absolute inset-[8%] rounded-full blur-3xl ${
                  isDark ? "bg-[#1a7fff]/15" : "bg-[#1a7fff]/10"
                }`}
              />
              <svg
                role="img"
                aria-label="Illustration of international dollar and taka exchange"
                className="relative z-10 h-full w-full overflow-visible drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]"
                viewBox="0 0 560 440"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="exchange-note"
                    x1="125"
                    y1="98"
                    x2="390"
                    y2="328"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#1A7FFF" />
                    <stop offset="1" stopColor="#0753C7" />
                  </linearGradient>
                  <linearGradient
                    id="exchange-coin"
                    x1="343"
                    y1="72"
                    x2="451"
                    y2="183"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FFE58A" />
                    <stop offset="1" stopColor="#F2A900" />
                  </linearGradient>
                  <linearGradient
                    id="exchange-taka"
                    x1="92"
                    y1="276"
                    x2="204"
                    y2="388"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#59E6A0" />
                    <stop offset="1" stopColor="#00A96B" />
                  </linearGradient>
                </defs>

                <circle
                  cx="280"
                  cy="220"
                  r="183"
                  fill={isDark ? "#0D1630" : "#EAF2FF"}
                  fillOpacity=".76"
                />
                <circle
                  cx="280"
                  cy="220"
                  r="157"
                  stroke={isDark ? "#315B9C" : "#93B9F2"}
                  strokeOpacity=".38"
                  strokeWidth="2"
                  strokeDasharray="5 11"
                />

                <g className="hero-illustration-float">
                  <rect
                    x="122"
                    y="111"
                    width="276"
                    height="190"
                    rx="24"
                    transform="rotate(-9 122 111)"
                    fill={isDark ? "#081126" : "#C5D9F7"}
                  />
                  <rect
                    x="119"
                    y="91"
                    width="276"
                    height="190"
                    rx="24"
                    transform="rotate(-4 119 91)"
                    fill={isDark ? "#102247" : "#D8E6FC"}
                  />
                  <rect
                    x="118"
                    y="77"
                    width="276"
                    height="190"
                    rx="24"
                    fill="url(#exchange-note)"
                  />
                  <rect
                    x="134"
                    y="93"
                    width="244"
                    height="158"
                    rx="15"
                    stroke="white"
                    strokeOpacity=".35"
                    strokeWidth="2"
                  />
                  <circle
                    cx="256"
                    cy="172"
                    r="57"
                    fill="white"
                    fillOpacity=".12"
                    stroke="white"
                    strokeOpacity=".52"
                    strokeWidth="2"
                  />
                  <path
                    d="M274 145c-5-7-13-11-23-11-13 0-23 8-23 19 0 12 10 17 25 21 15 4 25 9 25 22 0 12-11 21-26 21-12 0-22-5-28-13m28-81v101"
                    stroke="white"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M151 119h36m-36 107h36m138-107h36m-36 107h36"
                    stroke="white"
                    strokeOpacity=".68"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M152 141h21m168 0h21m-210 65h21m168 0h21"
                    stroke="white"
                    strokeOpacity=".38"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>

                <g className="hero-coin-float">
                  <circle
                    cx="402"
                    cy="112"
                    r="58"
                    fill={isDark ? "#09152C" : "#D7E7FF"}
                  />
                  <circle cx="397" cy="105" r="53" fill="url(#exchange-coin)" />
                  <circle
                    cx="397"
                    cy="105"
                    r="42"
                    stroke="white"
                    strokeOpacity=".58"
                    strokeWidth="2"
                  />
                  <path
                    d="M414 82c-5-6-12-9-21-9-12 0-21 7-21 17 0 11 9 15 23 19 14 4 22 8 22 19 0 11-10 19-23 19-11 0-20-5-25-12m25-72v91"
                    stroke="#805300"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </g>

                <g className="hero-taka-float">
                  <circle
                    cx="150"
                    cy="326"
                    r="57"
                    fill={isDark ? "#09152C" : "#D7E7FF"}
                  />
                  <circle cx="145" cy="319" r="52" fill="url(#exchange-taka)" />
                  <circle
                    cx="145"
                    cy="319"
                    r="41"
                    stroke="white"
                    strokeOpacity=".62"
                    strokeWidth="2"
                  />
                  <text
                    x="145"
                    y="337"
                    textAnchor="middle"
                    fill="white"
                    fontFamily="sans-serif"
                    fontSize="49"
                    fontWeight="700"
                  >
                    ৳
                  </text>
                </g>

                <g
                  className="hero-arrows-float"
                  stroke={isDark ? "#91B9F3" : "#397DDB"}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M420 233c-9 41-44 72-88 76" />
                  <path d="m344 290-13 20 24 9" />
                  <path d="M126 244c9-40 44-71 87-76" />
                  <path d="m202 164 13-20-24-9" />
                </g>

                <g className="hero-sparkle-float" fill="#00D46A">
                  <path d="m465 209 7 18 18 7-18 7-7 18-7-18-18-7 18-7 7-18Z" />
                  <path
                    d="m253 28 5 12 12 5-12 5-5 12-5-12-12-5 12-5 5-12Z"
                    opacity=".7"
                  />
                  <circle cx="474" cy="319" r="6" opacity=".65" />
                  <circle cx="88" cy="177" r="5" opacity=".7" />
                </g>
              </svg>
            </div>

            <div
              className={`relative z-10 mt-2 w-full rounded-2xl border p-4 backdrop-blur-md sm:p-5 ${
                isDark
                  ? "border-[#1a2550] bg-[#0d1630]/90"
                  : "border-blue-100 bg-white/90 shadow-lg"
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2
                    className={`text-sm font-bold sm:text-base ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {t("rates_title")}
                  </h2>
                  <p
                    className={`mt-1 text-[10px] sm:text-xs ${
                      isDark ? "text-[#6b82a8]" : "text-slate-500"
                    }`}
                  >
                    {t("rates_sub")}
                  </p>
                </div>
                <a
                  href="#rates"
                  className="shrink-0 text-xs font-bold text-[#1a7fff] hover:text-[#00d46a]"
                >
                  {t("cta_rates")} →
                </a>
              </div>

              {chartRates.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {chartRates.map((rate) => (
                    <div
                      key={rate.id}
                      className="flex min-w-0 flex-col items-center gap-2 text-center"
                      title={`${rate.pair}: ৳${rate.rate}`}
                    >
                      <div
                        className={`flex h-20 w-full items-end justify-center rounded-lg p-1.5 ${
                          isDark ? "bg-[#080f22]" : "bg-blue-50"
                        }`}
                      >
                        <div
                          className="flex w-full min-w-0 flex-col items-center justify-end gap-1"
                          style={{
                            height: `${Math.max(
                              16,
                              (rate.numericRate / maxRate) * 100,
                            )}%`,
                          }}
                        >
                          <span className="max-w-full truncate text-[9px] font-bold text-[#1a7fff] sm:text-[10px]">
                            ৳{rate.rate}
                          </span>
                          <div className="min-h-1 w-full flex-1 rounded-t-md bg-gradient-to-t from-[#0753c7] to-[#1a7fff]" />
                        </div>
                      </div>
                      <span
                        className={`w-full truncate text-[9px] font-medium sm:text-[10px] ${
                          isDark ? "text-[#a0b4d6]" : "text-slate-600"
                        }`}
                      >
                        {rate.pair}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`py-5 text-center text-xs ${
                    isDark ? "text-[#6b82a8]" : "text-slate-500"
                  }`}
                >
                  {t("rates_sub")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
