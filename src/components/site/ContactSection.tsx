"use client"

import { useState } from "react"
import { WhatsAppIcon } from "@/components/AppIcons"
import type { Rate, SiteSettings } from "@/lib/types"
import type { TKey } from "@/lib/app-data"

export function ContactSection({
  t,
  isDark,
  rates,
  settings,
}: {
  t: (k: TKey) => string
  isDark: boolean
  rates: Rate[]
  settings: SiteSettings
}) {
  const [name, setName] = useState("")
  const [msg, setMsg] = useState("")
  const [service, setService] = useState("")

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = encodeURIComponent(
      `সার্ভিস: ${service}\nনাম: ${name}\nবার্তা: ${msg}`,
    )
    window.open(
      `https://wa.me/${settings.phone.replace(/\D/g, "")}?text=${text}`,
      "_blank",
    )
  }

  const inp = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border focus:border-[#1a7fff] focus:ring-2 focus:ring-[#1a7fff]/15 ${
    isDark
      ? "bg-[#0a1028] border-[#1a3060] text-white placeholder-[#3a4a6b]"
      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
  }`

  return (
    <section
      id="contact"
      className={`py-16 sm:py-20 lg:py-24 ${
        isDark ? "bg-[#060b18]" : "bg-white"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-[#00d46a] text-xs font-bold uppercase tracking-widest">
            Contact
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-black mt-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {t("con_title")}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-[#6b82a8]" : "text-slate-500"
            }`}
          >
            {t("con_sub")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {}
          <div className="space-y-4">
            {[
              {
                icon: "📞",
                label: "Phone",
                value: settings.phone,
                href: `tel:${settings.phone}`,
              },
              {
                icon: "✉️",
                label: "Email",
                value: settings.email,
                href: `mailto:${settings.email}`,
              },
              {
                icon: "📍",
                label: "Address",
                value: settings.address,
                href: "",
              },
              { icon: "🕐", label: "Hours", value: settings.hours, href: "" },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex min-w-0 items-center gap-3 rounded-2xl border p-4 sm:gap-4 sm:p-5 ${
                  isDark
                    ? "bg-[#0d1630] border-[#1a2550]"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    isDark ? "bg-[#0a1028]" : "bg-slate-50"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${
                      isDark ? "text-[#6b82a8]" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="break-all text-sm font-semibold text-[#1a7fff] hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div
                      className={`break-words text-sm font-semibold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {}
          <div
            className={`rounded-2xl border p-4 sm:p-7 ${
              isDark
                ? "bg-[#0d1630] border-[#1a2550]"
                : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            <form onSubmit={send} className="space-y-4">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    isDark ? "text-[#6b82a8]" : "text-slate-500"
                  }`}
                >
                  {t("con_name")}
                </label>
                <input
                  className={inp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="আপনার নাম লিখুন"
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    isDark ? "text-[#6b82a8]" : "text-slate-500"
                  }`}
                >
                  {t("con_service")}
                </label>
                <select
                  className={inp}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                >
                  <option value="">-- সার্ভিস বেছে নিন --</option>
                  {rates.map((r) => (
                    <option key={r.id}>{r.pair}</option>
                  ))}
                  <option>Bank Transfer</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    isDark ? "text-[#6b82a8]" : "text-slate-500"
                  }`}
                >
                  {t("con_msg")}
                </label>
                <textarea
                  className={`${inp} h-28 resize-none`}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  required
                  placeholder="কত ডলার কিনতে/বেচতে চান?"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#00d46a] hover:bg-[#00b85a] text-[#060b18] font-black py-3.5 rounded-xl transition-all glow-green"
              >
                <WhatsAppIcon size={20} /> {t("con_send")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
