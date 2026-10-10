"use client"

import { useCallback, useEffect, useState } from "react"

import type { TKey } from "@/lib/app-data"

interface Conversation {
  id: string

  status: "open" | "closed"

  created_at: string

  updated_at: string

  message_count: number

  last_message: string | null

  last_role: "user" | "assistant" | "admin" | null
}

interface SupportMessage {
  id: string

  role: "user" | "assistant" | "admin"

  content: string

  created_at: string
}

interface ConversationDetail {
  conversation: Pick<Conversation, "id" | "status" | "created_at" | "updated_at">

  messages: SupportMessage[]
}

interface InboxResponse {
  error?: string

  conversations?: Conversation[]
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",

    timeStyle: "short",
  }).format(new Date(value))

export function SupportInbox({
  t,

  isDark,
}: {
  t: (key: TKey) => string

  isDark: boolean
}) {
  const [conversations, setConversations] = useState<Conversation[]>([])

  const [selectedId, setSelectedId] = useState("")

  const [detail, setDetail] = useState<ConversationDetail | null>(null)

  const [reply, setReply] = useState("")

  const [loadingList, setLoadingList] = useState(true)

  const [loadingDetail, setLoadingDetail] = useState(false)

  const [sending, setSending] = useState(false)

  const [error, setError] = useState("")

  const txt = isDark ? "text-white" : "text-slate-900"

  const sub = isDark ? "text-[#6b82a8]" : "text-slate-500"

  const surface = isDark
    ? "border-[#1a2550] bg-[#0d1630]"
    : "border-slate-200 bg-white"

  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/support-inbox", {
        cache: "no-store",
      })

      const result = (await response.json()) as InboxResponse

      if (!response.ok) throw new Error(result.error || "Unable to load inbox.")

      setConversations(result.conversations ?? [])

      setError("")
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load inbox.",
      )
    } finally {
      setLoadingList(false)
    }
  }, [])

  const loadDetail = useCallback(async (conversationId: string) => {
    setLoadingDetail(true)

    try {
      const response = await fetch(
        `/api/admin/support-inbox?conversationId=${encodeURIComponent(conversationId)}`,

        { cache: "no-store" },
      )

      const result = (await response.json()) as ConversationDetail & {
        error?: string
      }

      if (!response.ok)
        throw new Error(result.error || "Unable to load conversation.")

      setDetail(result)

      setError("")
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load conversation.",
      )
    } finally {
      setLoadingDetail(false)
    }
  }, [])

  useEffect(() => {
    void loadConversations()

    const interval = window.setInterval(() => void loadConversations(), 30_000)

    return () => window.clearInterval(interval)
  }, [loadConversations])

  useEffect(() => {
    if (selectedId) {
      setDetail(null)
      void loadDetail(selectedId)
    } else {
      setDetail(null)
    }
  }, [loadDetail, selectedId])

  const sendReply = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!selectedId || !reply.trim() || sending) return

    setSending(true)

    setError("")

    try {
      const response = await fetch("/api/admin/support-inbox", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          action: "reply",

          conversationId: selectedId,

          message: reply.trim(),
        }),
      })

      const result = (await response.json()) as { error?: string }

      if (!response.ok) throw new Error(result.error || "Unable to send reply.")

      setReply("")

      await Promise.all([loadDetail(selectedId), loadConversations()])
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to send reply.",
      )
    } finally {
      setSending(false)
    }
  }

  const closeConversation = async () => {
    if (!selectedId || sending) return

    setSending(true)

    setError("")

    try {
      const response = await fetch("/api/admin/support-inbox", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ action: "close", conversationId: selectedId }),
      })

      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(result.error || "Unable to close conversation.")
      }

      await Promise.all([loadDetail(selectedId), loadConversations()])
    } catch (closeError) {
      setError(
        closeError instanceof Error
          ? closeError.message
          : "Unable to close conversation.",
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="mx-auto flex h-full max-w-6xl min-h-[28rem] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>{t("tab_support")}</h2>
          <p className={`mt-1 text-xs ${sub}`}>
            {conversations.filter((item) => item.status === "open").length}{" "}
            {t("support_open_count")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadConversations()}
          disabled={loadingList}
          className="rounded-lg border border-[#1a7fff]/30 px-3 py-2 text-xs font-semibold text-[#1a7fff] disabled:opacity-50"
        >
          {loadingList ? "..." : t("support_refresh")}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.5fr)]">
        <div
          className={`max-h-72 overflow-y-auto rounded-xl border lg:max-h-none ${surface}`}
        >
          {loadingList && conversations.length === 0 ? (
            <p className={`p-4 text-sm ${sub}`}>{t("support_loading_inbox")}</p>
          ) : conversations.length === 0 ? (
            <p className={`p-4 text-sm ${sub}`}>{t("support_empty")}</p>
          ) : (
            conversations.map((conversation) => (
              <button
                type="button"
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
                className={`w-full border-b p-3 text-left transition-colors last:border-0 ${
                  isDark ? "border-[#1a2550]" : "border-slate-100"
                } ${
                  selectedId === conversation.id
                    ? "bg-[#1a7fff]/10"
                    : isDark
                      ? "hover:bg-white/5"
                      : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`truncate text-xs font-semibold ${txt}`}>
                    {conversation.id.slice(0, 8)}…
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                      conversation.status === "open"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {conversation.status}
                  </span>
                </div>
                <p className={`mt-1 line-clamp-2 text-xs ${sub}`}>
                  {conversation.last_message || t("support_no_messages")}
                </p>
                <div className={`mt-2 flex justify-between text-[10px] ${sub}`}>
                  <span>{conversation.message_count} messages</span>
                  <span>{formatDate(conversation.updated_at)}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div
          className={`flex min-h-[24rem] flex-col rounded-xl border ${surface}`}
        >
          {!selectedId ? (
            <div className={`m-auto p-6 text-center text-sm ${sub}`}>
              {t("support_select")}
            </div>
          ) : loadingDetail && !detail ? (
            <p className={`m-auto p-6 text-sm ${sub}`}>
              {t("support_loading_conversation")}
            </p>
          ) : detail ? (
            <>
              <header
                className={`flex items-center justify-between gap-3 border-b p-3 ${
                  isDark ? "border-[#1a2550]" : "border-slate-200"
                }`}
              >
                <div className="min-w-0">
                  <h3 className={`truncate text-sm font-semibold ${txt}`}>
                    {t("support_conversation")}{" "}
                    {detail.conversation.id.slice(0, 8)}…
                  </h3>
                  <p className={`mt-1 text-[10px] ${sub}`}>
                    {t("support_started")}{" "}
                    {formatDate(detail.conversation.created_at)}
                  </p>
                </div>
                {detail.conversation.status === "open" && (
                  <button
                    type="button"
                    onClick={() => void closeConversation()}
                    disabled={sending}
                    className="shrink-0 rounded-lg border border-emerald-500/30 px-2.5 py-2 text-xs font-semibold text-emerald-500 disabled:opacity-50"
                  >
                    {t("support_resolve")}
                  </button>
                )}
              </header>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
                {detail.messages.map((item) => (
                  <div
                    key={item.id}
                    className={`max-w-[88%] whitespace-pre-wrap break-words rounded-xl p-3 text-sm ${
                      item.role === "user"
                        ? isDark
                          ? "bg-[#080f22] text-white"
                          : "bg-slate-100 text-slate-900"
                        : item.role === "admin"
                          ? "ml-auto bg-[#1a7fff] text-white"
                          : "ml-auto bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    <span className="mb-1 block text-[10px] font-semibold uppercase opacity-70">
                      {item.role === "admin"
                        ? t("support_human")
                        : item.role === "assistant"
                          ? t("support_ai")
                          : t("support_customer")}
                    </span>
                    {item.content}
                    <span className="mt-2 block text-right text-[10px] opacity-60">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                ))}
              </div>

              {detail.conversation.status === "open" && (
                <form
                  onSubmit={sendReply}
                  className={`flex gap-2 border-t p-3 ${
                    isDark ? "border-[#1a2550]" : "border-slate-200"
                  }`}
                >
                  <textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    maxLength={4000}
                    rows={2}
                    required
                    aria-label="Reply to customer"
                    placeholder={t("support_reply_placeholder")}
                    className={`min-w-0 flex-1 resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#1a7fff] ${
                      isDark
                        ? "border-[#1a3060] bg-[#080f22] text-white"
                        : "border-slate-200 bg-white text-slate-900"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="self-end rounded-lg bg-[#1a7fff] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    {sending ? "..." : t("support_reply")}
                  </button>
                </form>
              )}
            </>
          ) : (
            <p className={`m-auto p-6 text-sm ${sub}`}>
              Unable to load this conversation.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
