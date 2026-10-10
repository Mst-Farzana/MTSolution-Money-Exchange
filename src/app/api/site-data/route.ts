import { isCurrentUserOwner } from "@/lib/db/admin"

import { getDbPool } from "@/lib/db/pool"

import type { SiteSettings } from "@/lib/types"

import type { PoolClient } from "pg"

export const runtime = "nodejs"

type CollectionTable = "exchange_rates" | "payment_methods" | "services"

type CollectionRow = {
  kind: "rate"

  id: string

  pair: string

  rate: string

  change: string

  logo: string
} | {
  kind: "payment"

  id: string

  name: string

  emoji: string

  color: string
} | {
  kind: "service"

  id: string

  title: string

  bengali: string

  description: string

  steps: string

  accent: string
}

class InvalidRequestError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function requireString(row: Record<string, unknown>, field: string) {
  const value = row[field]

  if (typeof value !== "string") {
    throw new InvalidRequestError(`Invalid or missing "${field}" value.`)
  }

  return value
}

function getCollectionTable(value: unknown): CollectionTable {
  if (
    value === "exchange_rates" ||
    value === "payment_methods" ||
    value === "services"
  ) {
    return value
  }

  throw new InvalidRequestError("Unsupported collection.")
}

function getCollectionRows(
  table: CollectionTable,

  value: unknown,
): CollectionRow[] {
  if (!Array.isArray(value) || value.length > 500) {
    throw new InvalidRequestError(
      "Collection must be an array with at most 500 items.",
    )
  }

  const rows = value.map((item): CollectionRow => {
    if (!isRecord(item))
      throw new InvalidRequestError("Invalid collection item.")

    const id = requireString(item, "id")

    if (table === "exchange_rates") {
      return {
        kind: "rate",

        id,

        pair: requireString(item, "pair"),

        rate: requireString(item, "rate"),

        change: requireString(item, "change"),

        logo: requireString(item, "logo"),
      }
    }

    if (table === "payment_methods") {
      return {
        kind: "payment",

        id,

        name: requireString(item, "name"),

        emoji: requireString(item, "emoji"),

        color: requireString(item, "color"),
      }
    }

    return {
      kind: "service",

      id,

      title: requireString(item, "title"),

      bengali: requireString(item, "bengali"),

      description: requireString(item, "desc"),

      steps: requireString(item, "steps"),

      accent: requireString(item, "accent"),
    }
  })

  if (new Set(rows.map((row) => row.id)).size !== rows.length) {
    throw new InvalidRequestError("Collection item IDs must be unique.")
  }

  return rows
}

async function saveCollection(
  client: PoolClient,

  table: CollectionTable,

  rows: CollectionRow[],
) {
  for (const [sortOrder, row] of rows.entries()) {
    if (row.kind === "rate") {
      await client.query(
        `insert into public.exchange_rates
           (id, pair, rate, change, logo, sort_order)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (id) do update set
           pair = excluded.pair,
           rate = excluded.rate,
           change = excluded.change,
           logo = excluded.logo,
           sort_order = excluded.sort_order`,

        [row.id, row.pair, row.rate, row.change, row.logo, sortOrder],
      )
    } else if (row.kind === "payment") {
      await client.query(
        `insert into public.payment_methods
           (id, name, emoji, color, sort_order)
         values ($1, $2, $3, $4, $5)
         on conflict (id) do update set
           name = excluded.name,
           emoji = excluded.emoji,
           color = excluded.color,
           sort_order = excluded.sort_order`,

        [row.id, row.name, row.emoji, row.color, sortOrder],
      )
    } else {
      await client.query(
        `insert into public.services
           (id, title, bengali, description, steps, accent, sort_order)
         values ($1, $2, $3, $4, $5, $6, $7)
         on conflict (id) do update set
           title = excluded.title,
           bengali = excluded.bengali,
           description = excluded.description,
           steps = excluded.steps,
           accent = excluded.accent,
           sort_order = excluded.sort_order`,

        [
          row.id,

          row.title,

          row.bengali,

          row.description,

          row.steps,

          row.accent,

          sortOrder,
        ],
      )
    }
  }

  await client.query(
    `delete from public.${table} where id <> all($1::text[])`,

    [rows.map((row) => row.id)],
  )
}

async function saveSettings(value: unknown) {
  if (!isRecord(value)) throw new InvalidRequestError("Invalid site settings.")

  const language = requireString(value, "language")

  const theme = requireString(value, "theme")

  if (language !== "bn" && language !== "en") {
    throw new InvalidRequestError("Language must be 'bn' or 'en'.")
  }

  if (theme !== "dark" && theme !== "light") {
    throw new InvalidRequestError("Theme must be 'dark' or 'light'.")
  }

  const settings: SiteSettings = {
    phone: requireString(value, "phone"),

    email: requireString(value, "email"),

    address: requireString(value, "address"),

    hours: requireString(value, "hours"),

    language,

    theme,
  }

  await getDbPool().query(
    `insert into public.site_settings
       (id, phone, email, address, hours, language, theme, updated_at)
     values (1, $1, $2, $3, $4, $5, $6, now())
     on conflict (id) do update set
       phone = excluded.phone,
       email = excluded.email,
       address = excluded.address,
       hours = excluded.hours,
       language = excluded.language,
       theme = excluded.theme,
       updated_at = excluded.updated_at`,

    [
      settings.phone,

      settings.email,

      settings.address,

      settings.hours,

      settings.language,

      settings.theme,
    ],
  )
}

export async function GET() {
  try {
    const pool = getDbPool()

    const [rates, payments, services, settings] = await Promise.all([
      pool.query("select * from public.exchange_rates order by sort_order, id"),

      pool.query(
        "select * from public.payment_methods order by sort_order, id",
      ),

      pool.query("select * from public.services order by sort_order, id"),

      pool.query("select * from public.site_settings where id = 1"),
    ])

    return Response.json({
      rates: rates.rows,

      payments: payments.rows,

      services: services.rows,

      settings: settings.rows[0] ?? null,
    })
  } catch (error) {
    console.error("Failed to load public site data:", error)

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load site data from PostgreSQL.",
      },

      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isCurrentUserOwner())) {
      return Response.json({ error: "Owner authorization required." }, {
        status: 403,
      })
    }

    const body: unknown = await request.json()

    if (!isRecord(body)) throw new InvalidRequestError("Invalid request body.")

    if (body.kind === "settings") {
      await saveSettings(body.settings)

      return Response.json({ ok: true })
    }

    if (body.kind !== "collection") {
      throw new InvalidRequestError("Unsupported save request.")
    }

    const table = getCollectionTable(body.table)

    const rows = getCollectionRows(table, body.rows)

    const client = await getDbPool().connect()

    try {
      await client.query("begin")

      await saveCollection(client, table, rows)

      await client.query("commit")
    } catch (error) {
      await client.query("rollback")

      throw error
    } finally {
      client.release()
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Failed to save admin site data:", error)

    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to save site data.",
      },

      { status: error instanceof InvalidRequestError ? 400 : 500 },
    )
  }
}
