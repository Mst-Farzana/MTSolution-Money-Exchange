"use client"

import type { Rate } from "@/lib/types"
import type { TKey } from "@/lib/app-data"

export interface TickerProps {
  rates: Rate[]
  isDark: boolean
}

export function Ticker({ rates, isDark }: TickerProps) {
  const items = [...rates, ...rates]
  return (
    <div
      className={`overflow-hidden py-2 border-b ${
        isDark ? "bg-[#0a1028] border-[#1a2550]" : "bg-blue-50 border-blue-100"
      }`}
    >
      <div className="flex gap-12 ticker-track whitespace-nowrap">
        {items.map((r, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-sm">
            <span className="text-lg">{r.logo}</span>
            <span
              className={`font-medium ${
                isDark ? "text-[#6b82a8]" : "text-slate-500"
              }`}
            >
              {r.pair}
            </span>
            <span
              className={`font-black ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              ৳{r.rate}
            </span>
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                r.change.startsWith("+")
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {r.change}
            </span>
            <span
              className={`ml-4 ${isDark ? "text-[#1a2550]" : "text-blue-100"}`}
            >
              |
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
