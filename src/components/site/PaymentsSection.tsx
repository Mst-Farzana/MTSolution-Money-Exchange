"use client"

import type { Payment } from "@/lib/types"
import type { TKey } from "@/lib/app-data"

export function PaymentsSection({
  t,
  isDark,
  payments,
}: {
  t: (k: TKey) => string
  isDark: boolean
  payments: Payment[]
}) {
  return (
    <section
      className={`relative overflow-hidden py-14 sm:py-20 ${
        isDark ? "bg-[#070d1e]" : "bg-slate-50"
      }`}
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12">
          <h2
            className={`text-2xl sm:text-3xl font-black ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {t("pay_title")}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-[#6b82a8]" : "text-slate-500"
            }`}
          >
            {t("pay_sub")}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {payments.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border px-5 py-3.5 flex items-center gap-3 transition-all duration-200 hover:-translate-y-1 cursor-default ${
                isDark
                  ? "bg-[#0d1630] border-[#1a2550] hover:border-[#1a7fff]/40"
                  : "bg-white border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span
                className={`font-semibold text-sm ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                {m.name}
              </span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: m.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
