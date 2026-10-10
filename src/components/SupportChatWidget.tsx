"use client"

import { useEffect, useRef, useState } from "react"

interface ChatMessage {
  role: "user" | "assistant" | "admin"

  content: string

  created_at?: string
}

interface ChatSession {
  conversationId: string

  accessToken: string
}

interface ChatResponse {
  error?: string

  reply?: string

  conversationId?: string

  accessToken?: string

  messages?: ChatMessage[]

  messageSaved?: boolean
}

const STORAGE_KEY = "mt-support-session"

export function SupportChatWidget({
  isDark,

  language,
}: {
  isDark: boolean

  language: "bn" | "en"
}) {
  const [open, setOpen] = useState(false)

  const [message, setMessage] = useState("")

  const [messages, setMessages] = useState<ChatMessage[]>([])

  const [session, setSession] = useState<ChatSession | null>(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const [historyLoading, setHistoryLoading] = useState(false)

  const feedRef = useRef<HTMLDivElement>(null)

  const copy =
    language === "bn"
      ? {
          title: "AI সাপোর্ট",

          subtitle: "MT Solution · অনলাইন",

          greeting:
            "আসসালামু আলাইকুম! USD/USDT exchange বা আমাদের service নিয়ে কীভাবে সাহায্য করতে পারি?",

          placeholder: "আপনার প্রশ্ন লিখুন...",

          send: "পাঠান",

          loading: "উত্তর তৈরি হচ্ছে...",

          privacy:
            "AI ভুল করতে পারে। কথোপকথন সাপোর্টের জন্য সংরক্ষিত হয় এবং Google Gemini-তে প্রক্রিয়াকৃত হয়। লেনদেনের আগে WhatsApp-এ রেট নিশ্চিত করুন।",

          close: "চ্যাট বন্ধ করুন",

          open: "AI সাপোর্ট চ্যাট খুলুন",
        }
      : {
          title: "AI Support",

          subtitle: "MT Solution · Online",

          greeting:
            "Hello! How can I help with USD/USDT exchange or our services?",

          placeholder: "Type your question...",

          send: "Send",

          loading: "Preparing a reply...",

          privacy:
            "AI can make mistakes. Messages are stored for support and processed by Google Gemini. Confirm rates on WhatsApp before transacting.",

          close: "Close support chat",

          open: "Open AI support chat",
        }

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (!stored) return

    try {
      const value = JSON.parse(stored) as Partial<ChatSession>

      if (
        typeof value.conversationId !== "string" ||
        typeof value.accessToken !== "string"
      ) {
        window.localStorage.removeItem(STORAGE_KEY)

        return
      }

      const restoredSession = {
        conversationId: value.conversationId,

        accessToken: value.accessToken,
      }

      setSession(restoredSession)

      setHistoryLoading(true)

      fetch("/api/support/chat", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ action: "history", ...restoredSession }),

        cache: "no-store",
      })

        .then(async (response) => {
          const result = (await response.json()) as ChatResponse

          if (!response.ok)
            throw new Error(result.error || "Unable to load chat.")

          setMessages(result.messages ?? [])
        })

        .catch((loadError: unknown) => {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load chat history.",
          )
        })

        .finally(() => setHistoryLoading(false))
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    feedRef.current?.scrollTo({
      top: feedRef.current.scrollHeight,

      behavior: "smooth",
    })
  }, [messages, loading, open])

  useEffect(() => {
    if (!open || !session || loading) return

    const refreshHistory = async () => {
      try {
        const response = await fetch("/api/support/chat", {
          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ action: "history", ...session }),

          cache: "no-store",
        })

        const result = (await response.json()) as ChatResponse

        if (!response.ok) {
          throw new Error(result.error || "Unable to refresh chat.")
        }

        setMessages(result.messages ?? [])
      } catch (refreshError) {
        setError(
          refreshError instanceof Error
            ? refreshError.message
            : "Unable to refresh chat.",
        )
      }
    }

    const interval = window.setInterval(() => void refreshHistory(), 10_000)

    return () => window.clearInterval(interval)
  }, [loading, open, session])

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault()

    const content = message.trim()

    if (!content || loading) return

    setMessage("")

    setError("")

    setMessages((current) => [...current, { role: "user", content }])

    setLoading(true)

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          ...(session ?? {}),

          message: content,
        }),

        cache: "no-store",
      })

      const result = (await response.json()) as ChatResponse

      const accessToken = result.accessToken ?? session?.accessToken

      if (result.conversationId && accessToken) {
        const nextSession = {
          conversationId: result.conversationId,

          accessToken,
        }

        setSession(nextSession)

        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
        } catch {
          setError(
            language === "bn"
              ? "এই browser-এ chat history সংরক্ষণ করা যাবে না।"
              : "This browser cannot save the chat session for later.",
          )
        }
      }

      if (!response.ok) {
        throw new Error(
          result.messageSaved
            ? language === "bn"
              ? "আপনার বার্তাটি সংরক্ষিত হয়েছে, তবে AI উত্তর দিতে পারছে না। অনুগ্রহ করে WhatsApp-এ যোগাযোগ করুন।"
              : "Your message was saved, but AI could not reply. Please contact us on WhatsApp."
            : result.error || "Unable to send your message.",
        )
      }

      if (result.reply) {
        setMessages((current) => [
          ...current,

          { role: "assistant", content: result.reply! },
        ])
      }
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to send your message.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-[70] sm:bottom-24 sm:right-6">
      {open && (
        <section
          aria-label={copy.title}
          className={`mb-3 flex h-[min(70dvh,34rem)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border shadow-2xl ${
            isDark
              ? "border-[#1a3060] bg-[#0d1630] text-white"
              : "border-blue-100 bg-white text-slate-900"
          }`}
        >
          <header className="flex items-center justify-between gap-3 bg-[#0b65d8] px-4 py-3 text-white">
            <div>
              <h2 className="font-bold">{copy.title}</h2>
              <p className="text-xs text-blue-100">{copy.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={copy.close}
              className="rounded-lg p-2 text-xl leading-none hover:bg-white/15"
            >
              ×
            </button>
          </header>

          <div
            ref={feedRef}
            aria-live="polite"
            className={`min-h-0 flex-1 space-y-3 overflow-y-auto p-3 ${
              isDark ? "bg-[#080f22]" : "bg-slate-50"
            }`}
          >
            {historyLoading && (
              <p className="text-center text-xs text-slate-500">
                {copy.loading}
              </p>
            )}
            {messages.length === 0 && !historyLoading && (
              <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-[#14264a] px-3 py-2.5 text-sm text-white">
                {copy.greeting}
              </div>
            )}
            {messages.map((item, index) => {
              const fromCustomer = item.role === "user"

              return (
                <div
                  key={`${item.created_at ?? "new"}-${index}`}
                  className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2.5 text-sm ${
                    fromCustomer
                      ? "ml-auto rounded-tr-sm bg-[#1a7fff] text-white"
                      : isDark
                        ? "rounded-tl-sm bg-[#14264a] text-white"
                        : "rounded-tl-sm bg-white text-slate-800 shadow-sm"
                  }`}
                >
                  {item.content}
                  {item.role === "admin" && (
                    <span className="mt-1 block text-[10px] opacity-70">
                      {language === "bn"
                        ? "এমটি সলিউশন সাপোর্ট"
                        : "MT Solution Support"}
                    </span>
                  )}
                </div>
              )
            })}
            {loading && (
              <p className="text-xs text-slate-500">{copy.loading}</p>
            )}
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-500/10 p-2 text-xs text-red-400"
              >
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className={`border-t p-3 ${
              isDark ? "border-[#1a2550]" : "border-slate-200"
            }`}
          >
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={2000}
                placeholder={copy.placeholder}
                aria-label={copy.placeholder}
                className={`min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:border-[#1a7fff] ${
                  isDark
                    ? "border-[#1a3060] bg-[#080f22] text-white"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="rounded-xl bg-[#1a7fff] px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {copy.send}
              </button>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
              {copy.privacy}
            </p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? copy.close : copy.open}
        aria-expanded={open}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1a7fff] text-white shadow-xl transition-transform hover:scale-105"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <svg
            aria-hidden="true"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
          </svg>
        )}
      </button>
    </div>
  )
}
