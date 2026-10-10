"use client"

import { useState } from "react"
import BrandMark from "@/components/BrandMark"
import { uid, type TKey } from "@/lib/app-data"
import { SupportInbox } from "@/components/admin/SupportInbox"
import type {
  Lang,
  Payment,
  Rate,
  Service,
  SiteSettings,
  Theme,
} from "@/lib/types"

export type DashTab = "rates" | "payments" | "services" | "support" | "settings"

export interface DashboardProps {
  t: (k: TKey) => string
  isDark: boolean
  rates: Rate[]
  setRates: (r: Rate[]) => void
  payments: Payment[]
  setPayments: (p: Payment[]) => void
  services: Service[]
  setServices: (s: Service[]) => void
  settings: SiteSettings
  saveSettings: (s: SiteSettings) => Promise<void>
  onClose: () => void
  onLogout: () => void
}

export function AdminDashboard({
  t,
  isDark,
  rates,
  setRates,
  payments,
  setPayments,
  services,
  setServices,
  settings,
  saveSettings,
  onClose,
  onLogout,
}: DashboardProps) {
  const [tab, setTab] = useState<DashTab>("rates")
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState<Record<string, string>>({})
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [settingsError, setSettingsError] = useState("")
  const [localSettings, setLocalSettings] = useState(settings)

  const bg = isDark ? "bg-[#060b18]" : "bg-slate-50"
  const card = isDark
    ? "bg-[#0d1630] border-[#1a2550]"
    : "bg-white border-slate-200"
  const txt = isDark ? "text-white" : "text-slate-900"
  const sub = isDark ? "text-[#6b82a8]" : "text-slate-500"
  const inp = `px-3 py-2 rounded-lg text-sm outline-none transition-all border focus:border-[#1a7fff] ${
    isDark
      ? "bg-[#0a1028] border-[#1a3060] text-white placeholder-[#3a4a6b]"
      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
  }`
  const tabs: [DashTab, TKey][] = [
    ["rates", "tab_rates"],
    ["payments", "tab_payments"],
    ["services", "tab_services"],
    ["support", "tab_support"],
    ["settings", "tab_settings"],
  ]

  const startEdit = (id: string, obj: Record<string, string>) => {
    setEditId(id)
    setForm(obj)
    setAdding(false)
  }
  const cancelEdit = () => {
    setEditId(null)
    setForm({})
    setAdding(false)
    setNewForm({})
  }
  const saveRate = () => {
    setRates(
      rates.map((r) =>
        r.id === editId ? { ...r, ...form as Partial<Rate> } : r,
      ),
    )
    cancelEdit()
  }
  const deleteRate = (id: string) => {
    if (confirm("Delete?")) setRates(rates.filter((r) => r.id !== id))
  }
  const addRate = () => {
    if (!newForm.pair || !newForm.rate) return
    setRates([
      ...rates,
      {
        id: uid(),
        pair: newForm.pair || "",
        rate: newForm.rate || "",
        change: newForm.change || "+0.00%",
        logo: newForm.logo || "💱",
      },
    ])
    cancelEdit()
  }
  const savePayment = () => {
    setPayments(
      payments.map((p) =>
        p.id === editId ? { ...p, ...form as Partial<Payment> } : p,
      ),
    )
    cancelEdit()
  }
  const deletePayment = (id: string) => {
    if (confirm("Delete?")) setPayments(payments.filter((p) => p.id !== id))
  }
  const addPayment = () => {
    if (!newForm.name) return
    setPayments([
      ...payments,
      {
        id: uid(),
        name: newForm.name || "",
        emoji: newForm.emoji || "💱",
        color: newForm.color || "#1a7fff",
      },
    ])
    cancelEdit()
  }
  const saveService = () => {
    setServices(
      services.map((s) =>
        s.id === editId ? { ...s, ...form as Partial<Service> } : s,
      ),
    )
    cancelEdit()
  }
  const deleteService = (id: string) => {
    if (confirm("Delete?")) setServices(services.filter((s) => s.id !== id))
  }
  const addService = () => {
    if (!newForm.title) return
    setServices([
      ...services,
      {
        id: uid(),
        title: newForm.title || "",
        bengali: newForm.bengali || "",
        desc: newForm.desc || "",
        steps: newForm.steps || "",
        accent: newForm.accent || "#1a7fff",
      },
    ])
    cancelEdit()
  }

  const saveSettingsHandler = async () => {
    setSettingsError("")
    try {
      await saveSettings(localSettings)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 2500)
    } catch (error) {
      setSettingsError(
        error instanceof Error ? error.message : "Unable to save settings.",
      )
    }
  }

  return (
    <div className={`fixed inset-0 z-[90] flex min-h-0 flex-col ${bg}`}>
      {}
      <div
        className={`flex shrink-0 items-center justify-between gap-2 border-b px-3 py-3 sm:px-6 sm:py-4 ${
          isDark ? "bg-[#0d1630] border-[#1a2550]" : "bg-white border-slate-200"
        } shadow-sm`}
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <BrandMark size={30} />
          <div className="min-w-0">
            <h1
              className={`truncate font-black text-base font-['Exo_2'] sm:text-lg ${txt}`}
            >
              {t("admin_panel")}
            </h1>
            <p className={`hidden text-xs sm:block ${sub}`}>
              MT Solution Control Panel
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-2 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/10 sm:px-3 sm:text-sm"
          >
            {t("logout_btn")}
          </button>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "text-[#6b82a8] hover:text-white hover:bg-white/10"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {}
      <div
        className={`flex shrink-0 gap-1 overflow-x-auto border-b px-3 py-2 sm:px-6 sm:py-3 ${
          isDark
            ? "bg-[#0a1028] border-[#1a2550]"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setTab(key)
              cancelEdit()
            }}
            className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
              tab === key
                ? "bg-[#1a7fff] text-white shadow-sm"
                : isDark
                  ? "text-[#6b82a8] hover:text-white hover:bg-white/5"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white"
            }`}
          >
            {t(label)}
          </button>
        ))}
      </div>

      {}
      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
        {}
        {tab === "rates" && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className={`font-bold text-lg ${txt}`}>{t("tab_rates")}</h2>
              <button
                onClick={() => {
                  setAdding(true)
                  setEditId(null)
                  setNewForm({ logo: "💱", change: "+0.00%" })
                }}
                className="shrink-0 rounded-lg bg-[#1a7fff] px-3 py-2 text-xs font-bold text-white transition-all hover:bg-[#0066dd] sm:px-4 sm:text-sm"
              >
                {t("add_new")}
              </button>
            </div>

            {adding && (
              <div className={`p-4 rounded-xl border ${card} space-y-3`}>
                <h3 className={`font-semibold text-sm ${txt}`}>
                  {t("add_new")}
                </h3>
                <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-4">
                  <input
                    className={inp}
                    placeholder={t("col_logo")}
                    value={newForm.logo || ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, logo: e.target.value })
                    }
                  />
                  <input
                    className={inp}
                    placeholder={t("col_pair")}
                    value={newForm.pair || ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, pair: e.target.value })
                    }
                  />
                  <input
                    className={inp}
                    placeholder={t("col_rate")}
                    value={newForm.rate || ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, rate: e.target.value })
                    }
                  />
                  <input
                    className={inp}
                    placeholder={t("col_change")}
                    value={newForm.change || ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, change: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addRate}
                    className="bg-[#00d46a] hover:bg-[#00b85a] text-[#060b18] text-sm font-bold px-4 py-2 rounded-lg transition-all"
                  >
                    {t("save_btn")}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-[#a0b4d6]"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {t("cancel_btn")}
                  </button>
                </div>
              </div>
            )}

            <div className={`rounded-xl border overflow-hidden ${card}`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr
                      className={
                        isDark
                          ? "bg-[#0a1028] border-b border-[#1a2550]"
                          : "bg-slate-50 border-b border-slate-200"
                      }
                    >
                      {[
                        t("col_logo"),
                        t("col_pair"),
                        t("col_rate"),
                        t("col_change"),
                        t("col_action"),
                      ].map((h) => (
                        <th
                          key={h}
                          className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide ${sub}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((r, i) => (
                      <tr
                        key={r.id}
                        className={`border-b transition-colors ${
                          isDark
                            ? "border-[#1a2550]/60 hover:bg-white/2"
                            : "border-slate-100 hover:bg-slate-50"
                        } ${i === rates.length - 1 ? "border-0" : ""}`}
                      >
                        {editId === r.id ? (
                          <>
                            <td className="px-4 py-3">
                              <input
                                className={`${inp} w-16`}
                                value={form.logo || ""}
                                onChange={(e) =>
                                  setForm({ ...form, logo: e.target.value })
                                }
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                className={`${inp} w-36`}
                                value={form.pair || ""}
                                onChange={(e) =>
                                  setForm({ ...form, pair: e.target.value })
                                }
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                className={`${inp} w-24`}
                                value={form.rate || ""}
                                onChange={(e) =>
                                  setForm({ ...form, rate: e.target.value })
                                }
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                className={`${inp} w-24`}
                                value={form.change || ""}
                                onChange={(e) =>
                                  setForm({ ...form, change: e.target.value })
                                }
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                <button
                                  onClick={saveRate}
                                  className="bg-[#00d46a] text-[#060b18] text-xs font-bold px-3 py-1.5 rounded-lg"
                                >
                                  {t("save_btn")}
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                                    isDark
                                      ? "bg-white/10 text-[#a0b4d6]"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {t("cancel_btn")}
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-xl">{r.logo}</td>
                            <td className={`px-4 py-3 font-semibold ${txt}`}>
                              {r.pair}
                            </td>
                            <td className="px-4 py-3 text-[#1a7fff] font-black">
                              ৳{r.rate}
                            </td>
                            <td
                              className={`px-4 py-3 text-xs font-semibold ${
                                r.change.startsWith("+")
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {r.change}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() =>
                                    startEdit(r.id, {
                                      logo: r.logo,
                                      pair: r.pair,
                                      rate: r.rate,
                                      change: r.change,
                                    })
                                  }
                                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1a7fff]/10 text-[#1a7fff] hover:bg-[#1a7fff]/20 transition-all"
                                >
                                  {t("edit_btn")}
                                </button>
                                <button
                                  onClick={() => deleteRate(r.id)}
                                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                >
                                  {t("del_btn")}
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {}
        {tab === "payments" && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-lg ${txt}`}>
                {t("tab_payments")}
              </h2>
              <button
                onClick={() => {
                  setAdding(true)
                  setEditId(null)
                  setNewForm({ color: "#1a7fff", emoji: "💱" })
                }}
                className="bg-[#1a7fff] hover:bg-[#0066dd] text-white text-sm font-bold px-4 py-2 rounded-lg transition-all"
              >
                {t("add_new")}
              </button>
            </div>

            {adding && (
              <div className={`p-4 rounded-xl border ${card} space-y-3`}>
                <div className="grid grid-cols-1 gap-3 min-[500px]:grid-cols-3">
                  <input
                    className={inp}
                    placeholder={t("col_emoji")}
                    value={newForm.emoji || ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, emoji: e.target.value })
                    }
                  />
                  <input
                    className={inp}
                    placeholder={t("col_name")}
                    value={newForm.name || ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, name: e.target.value })
                    }
                  />
                  <input
                    className={inp}
                    placeholder={t("col_color")}
                    value={newForm.color || ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, color: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addPayment}
                    className="bg-[#00d46a] hover:bg-[#00b85a] text-[#060b18] text-sm font-bold px-4 py-2 rounded-lg"
                  >
                    {t("save_btn")}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                      isDark
                        ? "bg-white/5 text-[#a0b4d6]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {t("cancel_btn")}
                  </button>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-xl border p-4 flex items-center justify-between gap-3 ${card}`}
                >
                  {editId === p.id ? (
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 gap-2 min-[500px]:grid-cols-3">
                        <input
                          className={`${inp} w-full`}
                          value={form.emoji || ""}
                          onChange={(e) =>
                            setForm({ ...form, emoji: e.target.value })
                          }
                          placeholder="Emoji"
                        />
                        <input
                          className={`${inp} w-full`}
                          value={form.name || ""}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="Name"
                        />
                        <input
                          className={`${inp} w-full`}
                          value={form.color || ""}
                          onChange={(e) =>
                            setForm({ ...form, color: e.target.value })
                          }
                          placeholder="#hex"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={savePayment}
                          className="bg-[#00d46a] text-[#060b18] text-xs font-bold px-3 py-1.5 rounded-lg"
                        >
                          {t("save_btn")}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                            isDark
                              ? "bg-white/10 text-[#a0b4d6]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {t("cancel_btn")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.emoji}</span>
                        <div>
                          <div className={`font-semibold text-sm ${txt}`}>
                            {p.name}
                          </div>
                          <div className="text-xs" style={{ color: p.color }}>
                            {p.color}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() =>
                            startEdit(p.id, {
                              emoji: p.emoji,
                              name: p.name,
                              color: p.color,
                            })
                          }
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#1a7fff]/10 text-[#1a7fff] hover:bg-[#1a7fff]/20"
                        >
                          {t("edit_btn")}
                        </button>
                        <button
                          onClick={() => deletePayment(p.id)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          {t("del_btn")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        {tab === "services" && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-lg ${txt}`}>
                {t("tab_services")}
              </h2>
              <button
                onClick={() => {
                  setAdding(true)
                  setEditId(null)
                  setNewForm({ accent: "#1a7fff" })
                }}
                className="bg-[#1a7fff] hover:bg-[#0066dd] text-white text-sm font-bold px-4 py-2 rounded-lg transition-all"
              >
                {t("add_new")}
              </button>
            </div>

            {adding && (
              <div className={`p-4 rounded-xl border ${card} space-y-3`}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    className={inp}
                    placeholder={t("col_title")}
                    value={newForm.title || ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, title: e.target.value })
                    }
                  />
                  <input
                    className={inp}
                    placeholder={t("col_bengali")}
                    value={newForm.bengali || ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, bengali: e.target.value })
                    }
                  />
                </div>
                <textarea
                  className={`${inp} w-full h-20 resize-none`}
                  placeholder={t("col_desc")}
                  value={newForm.desc || ""}
                  onChange={(e) =>
                    setNewForm({ ...newForm, desc: e.target.value })
                  }
                />
                <input
                  className={`${inp} w-full`}
                  placeholder={t("col_steps")}
                  value={newForm.steps || ""}
                  onChange={(e) =>
                    setNewForm({ ...newForm, steps: e.target.value })
                  }
                />
                <input
                  className={`${inp} w-40`}
                  placeholder={t("col_accent")}
                  value={newForm.accent || ""}
                  onChange={(e) =>
                    setNewForm({ ...newForm, accent: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={addService}
                    className="bg-[#00d46a] hover:bg-[#00b85a] text-[#060b18] text-sm font-bold px-4 py-2 rounded-lg"
                  >
                    {t("save_btn")}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                      isDark
                        ? "bg-white/5 text-[#a0b4d6]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {t("cancel_btn")}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {services.map((s) => (
                <div key={s.id} className={`rounded-xl border p-5 ${card}`}>
                  {editId === s.id ? (
                    <div className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          className={`${inp} w-full`}
                          value={form.title || ""}
                          onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                          }
                          placeholder={t("col_title")}
                        />
                        <input
                          className={`${inp} w-full`}
                          value={form.bengali || ""}
                          onChange={(e) =>
                            setForm({ ...form, bengali: e.target.value })
                          }
                          placeholder={t("col_bengali")}
                        />
                      </div>
                      <textarea
                        className={`${inp} w-full h-20 resize-none`}
                        value={form.desc || ""}
                        onChange={(e) =>
                          setForm({ ...form, desc: e.target.value })
                        }
                      />
                      <input
                        className={`${inp} w-full`}
                        value={form.steps || ""}
                        onChange={(e) =>
                          setForm({ ...form, steps: e.target.value })
                        }
                        placeholder={t("col_steps")}
                      />
                      <input
                        className={`${inp} w-40`}
                        value={form.accent || ""}
                        onChange={(e) =>
                          setForm({ ...form, accent: e.target.value })
                        }
                        placeholder={t("col_accent")}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveService}
                          className="bg-[#00d46a] text-[#060b18] text-sm font-bold px-4 py-2 rounded-lg"
                        >
                          {t("save_btn")}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                            isDark
                              ? "bg-white/10 text-[#a0b4d6]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {t("cancel_btn")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: s.accent }}
                          />
                          <h3 className={`font-black ${txt}`}>{s.title}</h3>
                          <span
                            className="text-sm bengali"
                            style={{ color: s.accent }}
                          >
                            {s.bengali}
                          </span>
                        </div>
                        <p className={`text-sm ${sub} mb-2`}>{s.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.steps.split("|").map((step, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full border"
                              style={{
                                borderColor: s.accent + "40",
                                color: s.accent,
                              }}
                            >
                              {i + 1}. {step.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() =>
                            startEdit(s.id, {
                              title: s.title,
                              bengali: s.bengali,
                              desc: s.desc,
                              steps: s.steps,
                              accent: s.accent,
                            })
                          }
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1a7fff]/10 text-[#1a7fff] hover:bg-[#1a7fff]/20"
                        >
                          {t("edit_btn")}
                        </button>
                        <button
                          onClick={() => deleteService(s.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          {t("del_btn")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        {tab === "settings" && (
          <div className="max-w-xl mx-auto">
            <h2 className={`font-bold text-lg mb-5 ${txt}`}>
              {t("tab_settings")}
            </h2>
            <div className={`rounded-xl border p-6 space-y-4 ${card}`}>
              {([
                ["set_phone", "phone", "tel"],
                ["set_email", "email", "email"],
                ["set_address", "address", "text"],
                ["set_hours", "hours", "text"],
              ] as [TKey, keyof SiteSettings, string][]).map(
                ([labelKey, field, type]) => (
                  <div key={field}>
                    <label
                      className={`block text-xs font-semibold mb-1.5 ${sub}`}
                    >
                      {t(labelKey)}
                    </label>
                    <input
                      type={type}
                      className={`${inp} w-full`}
                      value={localSettings[field]}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ),
              )}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${sub}`}>
                  {t("set_language")}
                </label>
                <select
                  className={`${inp} w-full`}
                  value={localSettings.language}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      language: e.target.value as Lang,
                    })
                  }
                >
                  <option value="bn">বাংলা</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${sub}`}>
                  {t("set_theme")}
                </label>
                <select
                  className={`${inp} w-full`}
                  value={localSettings.theme}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      theme: e.target.value as Theme,
                    })
                  }
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <button
                onClick={saveSettingsHandler}
                className="w-full bg-[#1a7fff] hover:bg-[#0066dd] text-white font-bold py-3 rounded-xl transition-all mt-2"
              >
                {t("save_settings")}
              </button>
              {settingsSaved && (
                <div className="text-center text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-2">
                  {t("settings_saved")}
                </div>
              )}
              {settingsError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/20 bg-red-500/10 py-2 text-center text-sm text-red-400"
                >
                  {settingsError}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "support" && <SupportInbox t={t} isDark={isDark} />}
      </div>
    </div>
  )
}
