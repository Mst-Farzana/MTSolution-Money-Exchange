export type Lang = "bn" | "en"

export type Theme = "dark" | "light"

export interface Rate {
  id: string

  pair: string

  rate: string

  change: string

  logo: string
}

export interface Payment {
  id: string

  name: string

  emoji: string

  color: string
}

export interface Service {
  id: string

  title: string

  bengali: string

  desc: string

  steps: string

  accent: string
}

export interface SiteSettings {
  phone: string

  email: string

  address: string

  hours: string

  language: Lang

  theme: Theme
}
