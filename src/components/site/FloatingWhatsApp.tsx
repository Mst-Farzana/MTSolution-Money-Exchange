"use client"

import { WhatsAppIcon } from "@/components/AppIcons"

export function FloatingWhatsApp({ phone }: { phone: string }) {
  return (
    <a
      href={`https://wa.me/${phone.replace(/\D/g, "")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#00d46a] hover:bg-[#00b85a] rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110"
      style={{ boxShadow: "0 4px 20px rgba(0,212,106,0.5)" }}
    >
      <span className="absolute inset-0 rounded-full animate-ping bg-[#00d46a] opacity-30" />
      <WhatsAppIcon size={26} />
    </a>
  )
}
