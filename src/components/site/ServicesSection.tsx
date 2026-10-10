"use client"

import type { Service } from "@/lib/types"
import type { TKey } from "@/lib/app-data"

export function ServicesSection({
  t,
  isDark,
  services,
}: {
  t: (k: TKey) => string
  isDark: boolean
  services: Service[]
}) {
  return (
    <section
      id="services"
      className={`py-16 sm:py-20 lg:py-24 ${
        isDark ? "bg-[#060b18]" : "bg-white"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-[#1a7fff] text-xs font-bold uppercase tracking-widest">
            {t("srv_label")}
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-black mt-2 bengali ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {t("srv_title")}
          </h2>
        </div>
        <div
          className={`grid gap-6 ${
            services.length === 1 ? "max-w-xl mx-auto" : "lg:grid-cols-2"
          }`}
        >
          {services.map((s) => (
            <div
              key={s.id}
              className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 sm:p-8 ${
                isDark
                  ? "bg-[#0d1630] border-[#1a2550]"
                  : "bg-white border-slate-200 shadow-sm hover:shadow-lg"
              }`}
              style={{ borderColor: undefined }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = s.accent + "50")
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h3
                    className={`break-words font-black text-xl sm:text-2xl ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="bengali text-sm font-semibold"
                    style={{ color: s.accent }}
                  >
                    {s.bengali}
                  </p>
                </div>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl sm:h-12 sm:w-12 sm:text-2xl"
                  style={{ background: s.accent + "15" }}
                >
                  💱
                </div>
              </div>
              <p
                className={`leading-relaxed mb-6 text-sm ${
                  isDark ? "text-[#a0b4d6]" : "text-slate-600"
                }`}
              >
                {s.desc}
              </p>
              <div className="space-y-2.5">
                {s.steps.split("|").map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-[#060b18] flex-shrink-0"
                      style={{ background: s.accent }}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        isDark ? "text-[#a0b4d6]" : "text-slate-600"
                      }`}
                    >
                      {step.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
