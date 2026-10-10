"use client"

import { WhatsAppIcon } from "@/components/AppIcons"
import type { TKey } from "@/lib/app-data"

export function AboutSection({
  t,
  isDark,
}: {
  t: (k: TKey) => string
  isDark: boolean
}) {
  const stats = [
    { num: "4+", label: "Years Active" },
    { num: "42K+", label: "Followers" },
    { num: "100%", label: "Honest Service" },
    { num: "24/7", label: "Available" },
  ]

  return (
    <section
      id="about"
      className={`py-16 sm:py-20 lg:py-24 ${
        isDark ? "bg-[#070d1e]" : "bg-slate-50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-widest text-[#1a7fff]`}
            >
              {t("abt_label")}
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-black mt-2 mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {t("abt_title")}
            </h2>
            <p
              className={`text-sm mb-6 ${
                isDark ? "text-[#6b82a8]" : "text-slate-500"
              }`}
            >
              {t("abt_sub")}
            </p>
            <div className="space-y-4">
              <p
                className={`leading-relaxed bengali ${
                  isDark ? "text-[#a0b4d6]" : "text-slate-600"
                }`}
              >
                {t("abt_d1")}
              </p>
              <p
                className={`leading-relaxed bengali ${
                  isDark ? "text-[#a0b4d6]" : "text-slate-600"
                }`}
              >
                {t("abt_d2")}
              </p>
            </div>
            <a
              href="https://wa.me/8801975836717"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-8 bg-[#1a7fff] hover:bg-[#0066dd] text-white font-bold px-6 py-3 rounded-xl transition-all glow-blue"
            >
              <WhatsAppIcon /> {t("cta_contact")}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className={`rounded-2xl border p-6 text-center transition-all hover:-translate-y-1 ${
                  isDark
                    ? "bg-[#0d1630] border-[#1a2550]"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="stat-number text-4xl text-[#1a7fff] mb-2">
                  {s.num}
                </div>
                <div
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isDark ? "text-[#6b82a8]" : "text-slate-500"
                  }`}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
