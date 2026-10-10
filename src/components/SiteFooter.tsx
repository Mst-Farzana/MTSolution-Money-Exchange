import type { SiteSettings } from "../lib/types"

import BrandMark from "./BrandMark"

type Translation = (key: string) => string

export function SiteFooter({
  t,

  isDark,

  settings,
}: {
  t: Translation

  isDark: boolean

  settings: SiteSettings
}) {
  const links: [string, string][] = [
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
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-10 grid gap-10 sm:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <BrandMark />
              <div>
                <div className="font-['Exo_2'] text-lg font-black text-white">
                  MT Solution
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#00d46a]">
                  Money Exchange
                </div>
              </div>
            </div>
            <p className="bengali text-sm leading-relaxed text-slate-400">
              {t("ft_desc")}
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-white">{t("ft_quick")}</h4>
            <div className="space-y-2">
              {links.map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  className="block text-sm text-slate-400 transition-colors hover:text-[#1a7fff]"
                >
                  {t(key)}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-white">{t("ft_contact")}</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div>📞 {settings.phone}</div>
              <div>✉️ {settings.email}</div>
              <div>📍 {settings.address}</div>
              <div>🕐 {settings.hours}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 sm:flex-row">
          <p className="text-sm text-slate-600">{t("ft_copy")}</p>
          <p className="text-sm text-slate-600">{t("ft_trust")}</p>
        </div>
      </div>
    </footer>
  )
}

export function FloatingWhatsApp({ phone }: { phone: string }) {
  return (
    <a
      href={`https://wa.me/${phone.replace(/\D/g, "")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#00d46a] shadow-2xl transition-all duration-200 hover:scale-110 hover:bg-[#00b85a]"
      style={{ boxShadow: "0 4px 20px rgba(0,212,106,0.5)" }}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#00d46a] opacity-30" />
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.8 11.8 0 0 0 12.11 0C5.56 0 .23 5.32.23 11.87c0 2.09.55 4.14 1.59 5.95L.13 24l6.34-1.66a11.9 11.9 0 0 0 5.64 1.44h.01c6.55 0 11.88-5.33 11.88-11.88a11.8 11.8 0 0 0-3.48-8.42ZM12.12 21.77a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.76.99 1-3.67-.24-.38a9.85 9.85 0 1 1 8.4 4.65Zm5.4-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.16-.17.2-.34.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.03-.51-.07-.15-.66-1.6-.91-2.2-.24-.58-.49-.5-.66-.51h-.56c-.2 0-.51.07-.78.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.21 3.05c.15.2 2.08 3.18 5.04 4.45.7.3 1.25.48 1.68.62.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34Z" />
      </svg>
    </a>
  )
}
