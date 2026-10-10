"use client"

import type { TKey } from "@/lib/app-data"

export interface FeaturesProps {
  t: (key: TKey) => string
  isDark: boolean
}

export function Features({ t, isDark }: FeaturesProps) {
  const features = [
    { icon: "🛡️", title: t("f1_t"), desc: t("f1_d"), color: "#1a7fff" },
    { icon: "📈", title: t("f2_t"), desc: t("f2_d"), color: "#00d46a" },
    { icon: "⚡", title: t("f3_t"), desc: t("f3_d"), color: "#f59e0b" },
    { icon: "💬", title: t("f4_t"), desc: t("f4_d"), color: "#a78bfa" },
  ]

  return (
    <section
      className={`py-14 sm:py-20 ${isDark ? "bg-[#070d1e]" : "bg-slate-50"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-14">
          <span className="text-[#1a7fff] text-xs font-bold uppercase tracking-widest">
            Why Us
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-black mt-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {t("why_title")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 group ${
                isDark
                  ? "bg-[#0d1630] border-[#1a2550] hover:border-[#1a7fff]/30"
                  : "bg-white border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md"
              }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
                style={{ background: f.color + "15" }}
              >
                {f.icon}
              </div>
              <h3
                className={`font-bold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
                style={{ color: f.color }}
              >
                {f.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-[#6b82a8]" : "text-slate-500"
                }`}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
