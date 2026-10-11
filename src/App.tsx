"use client"

import { useEffect, useState } from "react"
import SiteNavbar from "@/components/SiteNavbar"
import {
  FloatingWhatsApp as WhatsAppFloat,
  SiteFooter as Footer,
} from "@/components/SiteFooter"
import { AdminDashboard } from "@/components/admin/AdminDashboard"
import { AdminLoginModal } from "@/components/admin/AdminLoginModal"
import { SupportChatWidget } from "@/components/SupportChatWidget"
import { AboutSection } from "@/components/site/AboutSection"
import { ContactSection } from "@/components/site/ContactSection"
import { Features } from "@/components/site/Features"
import { Hero } from "@/components/site/Hero"
import { PaymentsSection } from "@/components/site/PaymentsSection"
import { RatesSection } from "@/components/site/RatesSection"
import { ServicesSection } from "@/components/site/ServicesSection"
import {
  DEF_PAYMENTS,
  DEF_RATES,
  DEF_SERVICES,
  DEF_SETTINGS,
  DEMO_CONTACT,
  TR,
  type TKey,
} from "@/lib/app-data"
import { createClient } from "@/lib/supabase/client"
import type {
  Lang,
  Payment,
  Rate,
  Service,
  SiteSettings,
  Theme,
} from "@/lib/types"

interface SortOrdered {
  sort_order: number
}

interface ServiceDataRow extends Omit<Service, "desc"> {
  description: string
  sort_order: number
}

interface SettingsDataRow extends SiteSettings {
  id: number
  updated_at: string
}

interface SiteDataResponse {
  rates: Array<Rate & SortOrdered>
  payments: Array<Payment & SortOrdered>
  services: ServiceDataRow[]
  settings: SettingsDataRow | null
}

interface ApiRequestOptions {
  method?: "GET" | "POST"
  body?: string
}

async function requestApi<T>(url: string, options: ApiRequestOptions = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json" },
  })
  const result = (await response.json()) as T & { error?: string }
  if (!response.ok) {
    throw new Error(result.error ?? `Request failed (${response.status}).`)
  }
  return result
}

export default function App() {
  const [lang, setLang] = useState<Lang>(DEF_SETTINGS.language)
  const [theme, setTheme] = useState<Theme>(DEF_SETTINGS.theme)
  const [rates, setRates] = useState<Rate[]>(DEF_RATES)
  const [payments, setPayments] = useState<Payment[]>(DEF_PAYMENTS)
  const [services, setServices] = useState<Service[]>(DEF_SERVICES)
  const [settings, setSettings] = useState<SiteSettings>(DEF_SETTINGS)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [systemError, setSystemError] = useState("")
  const [siteDataLoaded, setSiteDataLoaded] = useState(false)

  const isDark = theme === "dark"
  const publicSettings: SiteSettings = {
    ...settings,
    ...DEMO_CONTACT,
  }

  const t = (key: string): string =>
    (TR[lang] as Record<string, string>)[key] ?? key

  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark)
    document.documentElement.lang = lang
  }, [isDark, lang])

  useEffect(() => {
    let active = true
    let supabase: ReturnType<typeof createClient>
    try {
      supabase = createClient()
    } catch (error) {
      setSystemError(
        error instanceof Error ? error.message : "Supabase is not configured.",
      )
      return () => {
        active = false
      }
    }

    async function loadSiteData() {
      const result = await requestApi<SiteDataResponse>("/api/site-data")
      if (!active) return

      setRates(result.rates.map(({ sort_order: _sortOrder, ...rate }) => rate))
      setPayments(
        result.payments.map(
          ({ sort_order: _sortOrder, ...payment }) => payment,
        ),
      )
      setServices(
        result.services.map(
          ({ description, sort_order: _sortOrder, ...service }) => ({
            ...service,
            desc: description,
          }),
        ),
      )
      if (result.settings) {
        const loadedSettings: SiteSettings = {
          phone: result.settings.phone,
          email: result.settings.email,
          address: result.settings.address,
          hours: result.settings.hours,
          language: result.settings.language,
          theme: result.settings.theme,
        }
        setSettings(loadedSettings)
        setLang(loadedSettings.language)
        setTheme(loadedSettings.theme)
      }
      setSiteDataLoaded(true)
    }

    loadSiteData().catch((error) => {
      if (active) {
        setSystemError(
          error instanceof Error
            ? error.message
            : "Unable to load site data from Supabase.",
        )
      }
    })

    async function syncAdminStatus(userId: string | undefined) {
      if (!userId) {
        setAdminLoggedIn(false)
        return
      }
      const result = await requestApi<{ isOwner: boolean }>("/api/admin-status")
      setAdminLoggedIn(result.isOwner)
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error
        return syncAdminStatus(data.session?.user.id)
      })
      .catch((error) => {
        if (active)
          setSystemError(
            error instanceof Error
              ? error.message
              : "Unable to verify admin session.",
          )
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncAdminStatus(session?.user.id).catch((error) => {
        if (active)
          setSystemError(
            error instanceof Error
              ? error.message
              : "Unable to verify admin session.",
          )
      })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const persistCollection = async (
    table: "exchange_rates" | "payment_methods" | "services",
    next: Rate[] | Payment[] | Service[],
  ) => {
    await requestApi("/api/site-data", {
      method: "POST",
      body: JSON.stringify({ kind: "collection", table, rows: next }),
    })
    if (table === "exchange_rates") setRates(next as Rate[])
    if (table === "payment_methods") setPayments(next as Payment[])
    if (table === "services") setServices(next as Service[])
  }

  const handleLogin = async (email: string, password: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw new Error(error.message)

    let isOwner: boolean
    try {
      const result = await requestApi<{ isOwner: boolean }>("/api/admin-status")
      isOwner = result.isOwner
    } catch (error) {
      const { error: signOutError } = await supabase.auth.signOut()
      throw new Error(
        error instanceof Error
          ? signOutError
            ? `${error.message} Sign-out also failed: ${signOutError.message}`
            : error.message
          : "Unable to verify owner access.",
      )
    }
    if (!isOwner) {
      const { error: signOutError } = await supabase.auth.signOut()
      const ownerSetupSql = `insert into public.admin_users (user_id)\nvalues ('${data.user.id}');`
      throw new Error(
        `Sign-in succeeded, but this account is not approved as the site owner yet.\n\nRun this once in the Supabase SQL Editor while the owner slot is empty, then log in again:\n${ownerSetupSql}${
          signOutError
            ? `\n\nSign-out also failed: ${signOutError.message}`
            : ""
        }`,
      )
    }

    setAdminLoggedIn(true)
    setShowLogin(false)
    setShowDashboard(true)
  }

  const handleRegister = async (email: string, password: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) throw new Error(error.message)
    if (!data.user) {
      throw new Error(
        "Supabase did not return the new account. Please try again.",
      )
    }

    if (data.session) {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        throw new Error(
          `Account created, but sign-out failed: ${signOutError.message}`,
        )
      }
    }

    return {
      userId: data.user.id,
      confirmationRequired: !data.session,
    }
  }

  const handleLogout = async () => {
    const { error } = await createClient().auth.signOut()
    if (error) {
      setSystemError(error.message)
      return
    }
    setAdminLoggedIn(false)
    setShowDashboard(false)
  }

  const handleAdminClick = () => {
    if (!siteDataLoaded) {
      setSystemError(
        "Wait until Supabase finishes loading before opening the admin dashboard.",
      )
      return
    }
    if (adminLoggedIn) setShowDashboard(true)
    else setShowLogin(true)
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {systemError && (
        <div
          role="alert"
          className="fixed left-1/2 top-2 z-[120] flex w-[min(94vw,48rem)] -translate-x-1/2 items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-950 px-4 py-3 text-sm text-red-200 shadow-xl"
        >
          <span>{systemError}</span>
          <button
            onClick={() => setSystemError("")}
            aria-label="Dismiss error"
            className="text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}
      <SiteNavbar
        rates={rates}
        lang={lang}
        theme={theme}
        adminLoggedIn={adminLoggedIn}
        t={t}
        onToggleLang={() => setLang((l) => (l === "bn" ? "en" : "bn"))}
        onToggleTheme={() =>
          setTheme((th) => (th === "dark" ? "light" : "dark"))
        }
        onAdminClick={handleAdminClick}
        onDashboardClick={() => setShowDashboard(true)}
      />
      <Hero t={t} isDark={isDark} settings={publicSettings} rates={rates} />
      <Features t={t} isDark={isDark} />
      <RatesSection t={t} isDark={isDark} rates={rates} />
      <PaymentsSection t={t} isDark={isDark} payments={payments} />
      <ServicesSection t={t} isDark={isDark} services={services} />
      <AboutSection t={t} isDark={isDark} />
      <ContactSection
        t={t}
        isDark={isDark}
        rates={rates}
        settings={publicSettings}
      />
      <Footer t={t} isDark={isDark} settings={publicSettings} />
      <SupportChatWidget isDark={isDark} language={lang} />
      <WhatsAppFloat phone={publicSettings.phone} />

      {showLogin && (
        <AdminLoginModal
          t={t}
          isDark={isDark}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
      {showDashboard && adminLoggedIn && (
        <AdminDashboard
          t={t}
          isDark={isDark}
          rates={rates}
          setRates={(r) => {
            void persistCollection("exchange_rates", r).catch((error) =>
              setSystemError(
                error instanceof Error
                  ? error.message
                  : "Unable to save exchange rates.",
              ),
            )
          }}
          payments={payments}
          setPayments={(p) => {
            void persistCollection("payment_methods", p).catch((error) =>
              setSystemError(
                error instanceof Error
                  ? error.message
                  : "Unable to save payment methods.",
              ),
            )
          }}
          services={services}
          setServices={(s) => {
            void persistCollection("services", s).catch((error) =>
              setSystemError(
                error instanceof Error
                  ? error.message
                  : "Unable to save services.",
              ),
            )
          }}
          settings={settings}
          saveSettings={async (next) => {
            await requestApi("/api/site-data", {
              method: "POST",
              body: JSON.stringify({ kind: "settings", settings: next }),
            })
            setSettings(next)
            setLang(next.language)
            setTheme(next.theme)
          }}
          onClose={() => setShowDashboard(false)}
          onLogout={() => {
            void handleLogout()
          }}
        />
      )}
    </div>
  )
}
