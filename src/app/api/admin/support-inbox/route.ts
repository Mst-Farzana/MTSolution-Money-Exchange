import { isCurrentUserOwner } from "@/lib/db/admin"

import { getDbPool } from "@/lib/db/pool"

export const runtime = "nodejs"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export async function GET(request: Request) {
  if (!(await isCurrentUserOwner())) {
    return Response.json({ error: "Owner authorization required." }, {
      status: 403,
    })
  }

  const conversationId = new URL(request.url).searchParams.get("conversationId")

  try {
    const pool = getDbPool()

    if (conversationId) {
      if (!UUID_PATTERN.test(conversationId)) {
        return Response.json({ error: "Invalid conversation ID." }, {
          status: 400,
        })
      }

      const conversation = await pool.query<{
        id: string

        status: "open" | "closed"

        created_at: Date

        updated_at: Date
      }>(
        `select id, status, created_at, updated_at
         from public.support_conversations where id = $1`,

        [conversationId],
      )

      if (!conversation.rows[0]) {
        return Response.json({ error: "Conversation not found." }, {
          status: 404,
        })
      }

      const messages = await pool.query<{
        id: string

        role: "user" | "assistant" | "admin"

        content: string

        created_at: Date
      }>(
        `select id, role, content, created_at
         from public.support_messages
         where conversation_id = $1
         order by created_at, id`,

        [conversationId],
      )

      return Response.json(
        {
          conversation: conversation.rows[0],

          messages: messages.rows,
        },
        {
          headers: { "Cache-Control": "no-store" },
        },
      )
    }

    const conversations = await pool.query<{
      id: string

      status: "open" | "closed"

      created_at: Date

      updated_at: Date

      message_count: number

      last_message: string | null

      last_role: string | null
    }>(
      `select c.id, c.status, c.created_at, c.updated_at,
              count(m.id)::int as message_count,
              (array_agg(m.content order by m.created_at desc, m.id desc))[1] as last_message,
              (array_agg(m.role order by m.created_at desc, m.id desc))[1] as last_role
       from public.support_conversations c
       left join public.support_messages m on m.conversation_id = c.id
       group by c.id
       order by c.updated_at desc
       limit 100`,
    )

    return Response.json({ conversations: conversations.rows }, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("Failed to load support inbox:", error)

    return Response.json({ error: "Unable to load support inbox." }, {
      status: 500,
    })
  }
}

export async function POST(request: Request) {
  if (!(await isCurrentUserOwner())) {
    return Response.json({ error: "Owner authorization required." }, {
      status: 403,
    })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON request." }, { status: 400 })
  }

  if (
    !isRecord(body) ||
    typeof body.conversationId !== "string" ||
    !UUID_PATTERN.test(body.conversationId)
  ) {
    return Response.json({ error: "Invalid conversation request." }, {
      status: 400,
    })
  }

  const conversationId = body.conversationId

  const action = body.action

  try {
    const pool = getDbPool()

    if (action === "close") {
      const result = await pool.query(
        `update public.support_conversations
         set status = 'closed', updated_at = now()
         where id = $1 and status = 'open'`,

        [conversationId],
      )

      if (result.rowCount !== 1) {
        return Response.json({ error: "Open conversation not found." }, {
          status: 404,
        })
      }

      return Response.json({ ok: true, status: "closed" })
    }

    if (
      action !== "reply" ||
      typeof body.message !== "string" ||
      !body.message.trim() ||
      body.message.trim().length > 4000
    ) {
      return Response.json(
        { error: "Reply must be between 1 and 4000 characters." },

        { status: 400 },
      )
    }

    const client = await pool.connect()

    try {
      await client.query("begin")

      const conversation = await client.query(
        `select id from public.support_conversations
         where id = $1 and status = 'open'
         for update`,

        [conversationId],
      )

      if (conversation.rowCount !== 1) {
        await client.query("rollback")

        return Response.json({ error: "Open conversation not found." }, {
          status: 404,
        })
      }

      await client.query(
        `insert into public.support_messages (conversation_id, role, content)
         values ($1, 'admin', $2)`,

        [conversationId, body.message.trim()],
      )

      await client.query(
        `update public.support_conversations set updated_at = now()
         where id = $1`,

        [conversationId],
      )

      await client.query("commit")

      return Response.json({ ok: true })
    } catch (error) {
      await client.query("rollback").catch((rollbackError: unknown) => {
        console.error("Failed to roll back inbox reply:", rollbackError)
      })

      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Failed to update support conversation:", error)

    return Response.json({ error: "Unable to update support conversation." }, {
      status: 500,
    })
  }
}
