import { DEF_PAYMENTS, DEF_SERVICES, DEF_SETTINGS } from "@/lib/app-data"

import { SITE_URL } from "@/lib/seo"

export function GET() {
  const services = DEF_SERVICES.map(
    (service) =>
      `- ${service.title}: ${service.desc} Contact the business to confirm current rates and availability.`,
  ).join("\n")

  const paymentMethods = DEF_PAYMENTS.map((payment) => payment.name).join(", ")

  const content = `# MT Solution

> MT Solution provides USD and USDT exchange services in Chittagong, Bangladesh, with customer support available 24/7.

## Official website

- ${SITE_URL.origin}/

## Services

${services}

## Payment methods shown on the website

${paymentMethods}

## Contact

- Phone / WhatsApp: ${DEF_SETTINGS.phone}
- Email: ${DEF_SETTINGS.email}
- Service area: Chittagong, Bangladesh
- Support hours: ${DEF_SETTINGS.hours}

Rates and service availability can change. Contact MT Solution directly to confirm the current details before making a transaction.
`

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",

      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
