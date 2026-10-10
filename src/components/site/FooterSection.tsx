"use client"

import BrandMark from "@/components/BrandMark"
import type { SiteSettings } from "@/lib/types"
import type { TKey } from "@/lib/app-data"

export function FooterSection({
  t,
  isDark,
  settings,
}: {
  t: (k: TKey) => string
  isDark: boolean
  settings: SiteSettings
}) {
  const links: [TKey, string][] = [
    ["nav_home", "#home"],
    ["nav_services", "#services"],
    ["nav_rates", "#rates"],
    ["nav_about", "#about"],
    ["nav_contact", "#contact"],
  ]

  return (
    <footer
      className={`border-t ${
        isDark
          ? "bg-[#060b18] border-[#1a2550]"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BrandMark size={38} />
              <div>
                <div className="text-white font-black text-lg font-['Exo_2']">
                  MT Solution
                </div>
                <div className="text-[#00d46a] text-xs tracking-widest uppercase font-semibold">
                  Money Exchange
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed bengali">
              {t("ft_desc")}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">{t("ft_quick")}</h4>
            <div className="space-y-2">
              {links.map(([k, href]) => (
                <a
                  key={k}
                  href={href}
                  className="block text-slate-400 hover:text-[#1a7fff] text-sm transition-colors"
                >
                  {t(k)}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">{t("ft_contact")}</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div>📞 {settings.phone}</div>
              <div>✉️ {settings.email}</div>
              <div>📍 {settings.address}</div>
              <div>🕐 {settings.hours}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-sm">{t("ft_copy")}</p>
          <p className="text-slate-600 text-sm">{t("ft_trust")}</p>
        </div>
      </div>
    </footer>
  )
}
