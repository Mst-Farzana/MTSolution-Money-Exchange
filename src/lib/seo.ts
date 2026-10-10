import { DEF_PAYMENTS, DEF_SERVICES, DEF_SETTINGS } from "@/lib/app-data"

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
)

export const BUSINESS_SCHEMA = {
  "@context": "https://schema.org",

  "@type": "FinancialService",

  "@id": `${SITE_URL.origin}/#business`,

  name: "MT Solution",

  url: SITE_URL.origin,

  description:
    "USD and USDT exchange services in Chittagong, Bangladesh, with 24/7 customer support.",

  image: `${SITE_URL.origin}/logo.svg`,

  logo: `${SITE_URL.origin}/logo.svg`,

  telephone: DEF_SETTINGS.phone,

  email: DEF_SETTINGS.email,

  address: {
    "@type": "PostalAddress",

    addressLocality: "Chittagong",

    addressCountry: "BD",
  },

  areaServed: [
    { "@type": "City", name: "Chittagong" },

    { "@type": "Country", name: "Bangladesh" },
  ],

  availableLanguage: ["Bengali", "English"],

  openingHours: "Mo-Su 00:00-23:59",

  contactPoint: {
    "@type": "ContactPoint",

    telephone: DEF_SETTINGS.phone,

    email: DEF_SETTINGS.email,

    contactType: "customer service",

    availableLanguage: ["Bengali", "English"],
  },

  hasOfferCatalog: {
    "@type": "OfferCatalog",

    name: "Currency exchange services",

    itemListElement: DEF_SERVICES.map((service, index) => ({
      "@type": "Offer",

      position: index + 1,

      itemOffered: {
        "@type": "Service",

        name: service.title,

        description: service.desc,
      },
    })),
  },

  paymentAccepted: DEF_PAYMENTS.map((payment) => payment.name).join(", "),
} as const

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}
