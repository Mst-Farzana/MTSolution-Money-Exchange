import { randomBytes, randomUUID } from "node:crypto"

import { getDbPool } from "@/lib/db/pool"

import {
  checkSupportRateLimit,
  generateSupportReply,
  hashSupportValue,
  MAX_SUPPORT_MESSAGE_LENGTH,
} from "@/lib/support-chat"

export const runtime = "nodejs"

const MAX_REQUEST_BYTES = 8_000

const MESSAGES_PER_HOUR = 12

interface ChatRequest {
  action?: unknown

  conversationId?: unknown

  accessToken?: unknown

  message?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

async function readBody(request: Request): Promise<ChatRequest> {
  const contentLength = Number(request.headers.get("content-length") ?? 0)

  if (contentLength > MAX_REQUEST_BYTES) {
    throw new Error("Request is too large.")
  }

  if (!request.body) throw new Error("Invalid JSON request.")

  const reader = request.body.getReader()

  const chunks: Uint8Array[] = []

  let size = 0

  while (true) {
    const { done, value } = await reader.read()

    if (done) break

    size += value.byteLength

    if (size > MAX_REQUEST_BYTES) {
      await reader.cancel()

      throw new Error("Request is too large.")
    }

    chunks.push(value)
  }

  let body: unknown

  try {
    const bytes = new Uint8Array(size)

    let offset = 0

    for (const chunk of chunks) {
      bytes.set(chunk, offset)

      offset += chunk.byteLength
    }

    body = JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    throw new Error("Invalid JSON request.")
  }

  if (!isRecord(body)) throw new Error("Invalid request body.")

  return body
}

export async function POST(request: Request) {
  let body: ChatRequest

  try {
    body = await readBody(request)
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid request." },

      { status: 400 },
    )
  }

  const action = body.action ?? "send"

  const isHistoryRequest = action === "history"

  if (action !== "send" && !isHistoryRequest) {
    return Response.json({ error: "Unsupported support-chat action." }, {
      status: 400,
    })
  }

  const suppliedConversationId =
    typeof body.conversationId === "string" ? body.conversationId : undefined

  const suppliedAccessToken =
    typeof body.accessToken === "string" ? body.accessToken : undefined

  if (Boolean(suppliedConversationId) !== Boolean(suppliedAccessToken)) {
    return Response.json({ error: "Invalid conversation credentials." }, {
      status: 400,
    })
  }

  if (
    suppliedConversationId &&
    suppliedAccessToken &&
    (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      suppliedConversationId,
    ) ||
      suppliedAccessToken.length < 32 ||
      suppliedAccessToken.length > 128)
  ) {
    return Response.json({ error: "Invalid conversation credentials." }, {
      status: 400,
    })
  }

  if (isHistoryRequest) {
    if (!suppliedConversationId || !suppliedAccessToken) {
      return Response.json({ error: "Conversation not found." }, {
        status: 404,
      })
    }

    try {
      const pool = getDbPool()

      const conversation = await pool.query<{
        id: string

        status: "open" | "closed"
      }>(
        `select id, status from public.support_conversations
         where id = $1 and access_token_hash = $2`,

        [
          suppliedConversationId,

          hashSupportValue(suppliedAccessToken),
        ],
      )

      if (!conversation.rows[0]) {
        return Response.json({ error: "Conversation not found." }, {
          status: 404,
        })
      }

      const messages = await pool.query<{
        role: "user" | "assistant" | "admin"

        content: string

        created_at: Date
      }>(
        `select role, content, created_at
         from public.support_messages
         where conversation_id = $1
         order by created_at desc, id desc
         limit 100`,

        [suppliedConversationId],
      )

      return Response.json(
        {
          conversationId: suppliedConversationId,

          status: conversation.rows[0].status,

          messages: messages.rows.reverse(),
        },
        {
          headers: { "Cache-Control": "no-store" },
        },
      )
    } catch (error) {
      console.error("Failed to load support conversation:", error)

      return Response.json({ error: "Unable to load support conversation." }, {
        status: 500,
      })
    }
  }

  if (
    typeof body.message !== "string" ||
    !body.message.trim() ||
    body.message.trim().length > MAX_SUPPORT_MESSAGE_LENGTH
  ) {
    return Response.json(
      {
        error: `Message must be between 1 and ${MAX_SUPPORT_MESSAGE_LENGTH} characters.`,
      },

      { status: 400 },
    )
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "AI support is not configured." }, {
      status: 503,
    })
  }

  const message = body.message.trim()

  const forwardedIps = request.headers.get("x-forwarded-for")?.split(",")

  const forwardedIp = forwardedIps?.at(-1)?.trim()

  const remoteIp = request.headers.get("x-real-ip")?.trim() || forwardedIp

  if (!remoteIp) {
    return Response.json(
      { error: "Support chat is temporarily unavailable." },

      { status: 503 },
    )
  }

  const pool = getDbPool()

  let conversationId = suppliedConversationId

  let accessToken = suppliedAccessToken

  let createdConversation = false

  let limit: Awaited<ReturnType<typeof checkSupportRateLimit>>

  try {
    limit = await checkSupportRateLimit(hashSupportValue(remoteIp))
  } catch (error) {
    console.error("Failed to check support-chat rate limit:", error)

    return Response.json(
      { error: "Support chat is temporarily unavailable." },

      { status: 503 },
    )
  }

  if (limit.request_count > MESSAGES_PER_HOUR) {
    const windowStart = new Date(limit.window_started_at).getTime()

    const retryAfter = Math.max(
      1,

      Math.ceil((windowStart + 60 * 60 * 1000 - Date.now()) / 1000),
    )

    return Response.json(
      { error: "Too many messages. Please try again later." },

      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    )
  }

  const client = await pool.connect()

  try {
    await client.query("begin")

    if (!conversationId) {
      conversationId = randomUUID()

      accessToken = randomBytes(32).toString("base64url")

      await client.query(
        `insert into public.support_conversations (id, access_token_hash)
         values ($1, $2)`,

        [conversationId, hashSupportValue(accessToken)],
      )

      createdConversation = true
    } else {
      if (!accessToken) {
        await client.query("rollback")
        return Response.json({ error: "Invalid conversation credentials." }, {
          status: 400,
        })
      }

      const result = await client.query(
        `select id from public.support_conversations
         where id = $1 and access_token_hash = $2
         for update`,

        [conversationId, hashSupportValue(accessToken)],
      )

      if (result.rowCount !== 1) {
        await client.query("rollback")

        return Response.json({ error: "Conversation not found." }, {
          status: 404,
        })
      }
    }

    await client.query(
      `insert into public.support_messages (conversation_id, role, content)
       values ($1, 'user', $2)`,

      [conversationId, message],
    )

    await client.query(
      `update public.support_conversations
       set status = 'open', updated_at = now()
       where id = $1`,

      [conversationId],
    )

    const history = await client.query<{
      role: "user" | "assistant" | "admin"

      content: string
    }>(
      `select role, content
       from public.support_messages
       where conversation_id = $1
       order by created_at desc, id desc
       limit 16`,

      [conversationId],
    )

    await client.query("commit")

    let reply: string

    try {
      reply = await generateSupportReply(history.rows.reverse())
    } catch (error) {
      console.error("AI support response failed:", error)

      const errorMessage =
        error instanceof Error
          ? error.message
          : "The AI support service is temporarily unavailable."

      return Response.json(
        {
          error: errorMessage,

          conversationId,

          ...(createdConversation ? { accessToken } : {}),

          messageSaved: true,
        },

        { status: 503, headers: { "Cache-Control": "no-store" } },
      )
    }

    await pool.query(
      `insert into public.support_messages (conversation_id, role, content)
       values ($1, 'assistant', $2)`,

      [conversationId, reply],
    )

    await pool.query(
      `update public.support_conversations
       set updated_at = now()
       where id = $1`,

      [conversationId],
    )

    return Response.json(
      {
        conversationId,

        ...(createdConversation ? { accessToken } : {}),

        reply,
      },

      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    await client.query("rollback").catch((rollbackError: unknown) => {
      console.error("Failed to roll back support message:", rollbackError)
    })

    console.error("Failed to process support message:", error)

    return Response.json(
      { error: "Unable to send your message. Please try again." },

      { status: 500 },
    )
  } finally {
    client.release()
  }
}
