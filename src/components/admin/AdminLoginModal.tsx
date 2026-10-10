"use client"

import { useState } from "react"
import { ShieldIcon } from "@/components/AppIcons"
import type { TKey } from "@/lib/app-data"

export function AdminLoginModal({
  t,
  isDark,
  onClose,
  onLogin,
  onRegister,
}: {
  t: (k: TKey) => string
  isDark: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (
    email: string,
    password: string,
  ) => Promise<{
    userId: string
    confirmationRequired: boolean
  }>
}) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [err, setErr] = useState("")
  const [success, setSuccess] = useState("")
  const [newUserId, setNewUserId] = useState("")
  const [loading, setLoading] = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr("")
    setSuccess("")
    try {
      if (mode === "register") {
        if (pass !== confirmPass) {
          throw new Error(t("password_mismatch"))
        }
        const result = await onRegister(email, pass)
        setNewUserId(result.userId)
        setSuccess(
          `${t("register_success")}${
            result.confirmationRequired
              ? " Check your email to confirm the account."
              : ""
          }`,
        )
      } else {
        await onLogin(email, pass)
      }
    } catch (error) {
      setErr(
        error instanceof Error
          ? error.message
          : "Unable to complete the request.",
      )
    } finally {
      setLoading(false)
    }
  }

  const inp = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border focus:border-[#1a7fff] focus:ring-2 focus:ring-[#1a7fff]/20 ${
    isDark
      ? "bg-[#0a1028] border-[#1a3060] text-white placeholder-[#3a4a6b]"
      : "bg-white border-blue-200 text-slate-900 placeholder-slate-400"
  }`

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative max-h-[calc(100dvh-1.5rem)] w-full max-w-sm overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-8 ${
          isDark ? "bg-[#0d1630] border-[#1a3060]" : "bg-white border-blue-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div className="text-center mb-5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1a7fff]/10 flex items-center justify-center border border-[#1a7fff]/20">
            <ShieldIcon />
          </div>
          <h2
            className={`text-xl font-black font-['Exo_2'] ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {t("admin_login_title")}
          </h2>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-[#6b82a8]" : "text-slate-500"
            }`}
          >
            MT Solution Admin Portal
          </p>
        </div>

        <div
          className={`mb-5 grid grid-cols-2 rounded-xl p-1 ${
            isDark ? "bg-[#0a1028]" : "bg-slate-100"
          }`}
        >
          {(["login", "register"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item)
                setErr("")
                setSuccess("")
                setNewUserId("")
              }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                mode === item
                  ? "bg-[#1a7fff] text-white"
                  : isDark
                    ? "text-[#a0b4d6]"
                    : "text-slate-600"
              }`}
            >
              {t(item === "login" ? "login_tab" : "register_tab")}
            </button>
          ))}
        </div>
        {mode === "register" && (
          <p
            className={`mb-4 rounded-lg border p-3 text-xs leading-relaxed ${
              isDark
                ? "border-amber-400/20 bg-amber-400/5 text-amber-200"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {t("register_admin_only")}
          </p>
        )}
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isDark ? "text-[#6b82a8]" : "text-slate-500"
              }`}
            >
              {t("username")}
            </label>
            <input
              className={inp}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErr("")
              }}
              placeholder="admin@example.com"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isDark ? "text-[#6b82a8]" : "text-slate-500"
              }`}
            >
              {t("password")}
            </label>
            <input
              className={inp}
              type="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value)
                setErr("")
              }}
              placeholder="••••••••"
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              minLength={8}
              required
            />
          </div>
          {mode === "register" && (
            <div>
              <label
                className={`block text-xs font-semibold mb-1.5 ${
                  isDark ? "text-[#6b82a8]" : "text-slate-500"
                }`}
              >
                {t("confirm_password")}
              </label>
              <input
                className={inp}
                type="password"
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value)
                  setErr("")
                }}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          )}
          {err && (
            <div className="flex items-center gap-2 whitespace-pre-wrap break-all text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <span>⚠</span> {err}
            </div>
          )}
          {success && (
            <div
              role="status"
              className="space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400"
            >
              <p>{success}</p>
              {newUserId && (
                <>
                  <p>{t("owner_setup_title")}</p>
                  <code className="block break-all rounded bg-black/20 p-2 text-xs text-emerald-200">
                    {t("owner_setup_sql").replace("USER_UUID", newUserId)}
                  </code>
                </>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a7fff] hover:bg-[#0066dd] text-white font-bold py-3 rounded-xl transition-all duration-200 disabled:opacity-60 mt-2"
          >
            {loading
              ? "..."
              : t(mode === "login" ? "login_btn" : "register_btn")}
          </button>
        </form>

        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
            isDark
              ? "text-[#6b82a8] hover:text-white hover:bg-white/10"
              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          }`}
        >
          <svg
            width="16"
            height="16"
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
  )
}
