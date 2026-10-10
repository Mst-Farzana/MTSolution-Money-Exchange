import type { Metadata } from "next"
import { BUSINESS_SCHEMA, serializeJsonLd, SITE_URL } from "@/lib/seo"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: "MT Solution | USD & USDT Exchange in Bangladesh",
    template: "%s | MT Solution",
  },
  description:
    "Exchange USD and USDT in Bangladesh with MT Solution. Contact our Chittagong-based team for exchange services and 24/7 support.",
  applicationName: "MT Solution",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MT Solution | USD & USDT Exchange in Bangladesh",
    description:
      "USD and USDT exchange services in Chittagong, Bangladesh, with 24/7 customer support.",
    url: "/",
    siteName: "MT Solution",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "MT Solution | USD & USDT Exchange in Bangladesh",
    description:
      "Exchange USD and USDT in Bangladesh with MT Solution. 24/7 customer support.",
  },
  category: "finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "500x500" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(BUSINESS_SCHEMA),
          }}
        />
      </body>
    </html>
  )
}
