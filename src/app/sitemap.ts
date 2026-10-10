import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL.origin,

      changeFrequency: "weekly",

      priority: 1,
    },
  ]
}
