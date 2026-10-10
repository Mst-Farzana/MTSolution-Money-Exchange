import { isCurrentUserOwner } from "@/lib/db/admin"

export const runtime = "nodejs"

export async function GET() {
  try {
    return Response.json({ isOwner: await isCurrentUserOwner() })
  } catch (error) {
    console.error("Failed to verify owner access:", error)

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify owner access.",
      },

      { status: 500 },
    )
  }
}
