"use client"

import type { Rate } from "@/lib/types"
import type { TKey } from "@/lib/app-data"

export function RatesSection({
  t,
  isDark,
  rates,
}: {
  t: (k: TKey) => string
  isDark: boolean
  rates: Rate[]
}) {
  return (
    <section
      id="rates"
      className={`relative py-16 sm:py-20 lg:py-24 ${
        isDark ? "bg-[#060b18]" : "bg-white"
      }`}
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12">
          <span className="text-[#00d46a] text-xs font-bold uppercase tracking-widest">
            Live Rates
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-black mt-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {t("rates_title")}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-[#6b82a8]" : "text-slate-500"
            }`}
          >
            {t("rates_sub")}
          </p>
        </div>

        <div
          className={`rounded-2xl border overflow-hidden ${
            isDark
              ? "bg-[#0d1630] border-[#1a2550]"
              : "bg-white border-slate-200 shadow-lg"
          }`}
          style={{
            boxShadow: isDark ? "0 0 40px rgba(26,127,255,0.08)" : undefined,
          }}
        >
          <div
            className={`flex flex-col items-start gap-2 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
              isDark
                ? "border-[#1a2550] bg-[#0a1028]"
                : "border-slate-100 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d46a] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00d46a]" />
              </span>
              <span
                className={`text-sm font-semibold ${
                  isDark ? "text-[#a0b4d6]" : "text-slate-600"
                }`}
              >
                Live Market Data
              </span>
            </div>
            <span
              className={`text-xs ${
                isDark ? "text-[#3a4a6b]" : "text-slate-400"
              }`}
            >
              প্রতি $১ USD = নিচের রেট
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px] text-sm">
              <thead>
                <tr
                  className={`border-b ${
                    isDark ? "border-[#1a2550]" : "border-slate-100"
                  }`}
                >
                  <th
                    className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide sm:px-6 ${
                      isDark ? "text-[#6b82a8]" : "text-slate-500"
                    }`}
                  >
                    {t("col_currency")}
                  </th>
                  <th
                    className={`px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide sm:px-6 ${
                      isDark ? "text-[#6b82a8]" : "text-slate-500"
                    }`}
                  >
                    {t("col_buy")}
                  </th>
                  <th
                    className={`px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide sm:px-6 ${
                      isDark ? "text-[#6b82a8]" : "text-slate-500"
                    }`}
                  >
                    {t("col_24h")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b transition-all hover:bg-[#1a7fff]/5 ${
                      isDark ? "border-[#1a2550]/60" : "border-slate-50"
                    } ${i === rates.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-3 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{r.logo}</span>
                        <span
                          className={`font-semibold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {r.pair}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right sm:px-6">
                      <span className="font-black text-[#1a7fff] text-base">
                        ৳{r.rate}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right sm:px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          r.change.startsWith("+")
                            ? "bg-emerald-500/12 text-emerald-400"
                            : "bg-red-500/12 text-red-400"
                        }`}
                      >
                        {r.change.startsWith("+") ? "▲" : "▼"} {r.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
