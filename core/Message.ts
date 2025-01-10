import type { DB } from "@std/media-types"

export type Message = {
  role: "system" | "user" | "assistant" | "reducer"
  created: Date
} & Content

export type Content =
  & { body: string }
  & ({
    mime: keyof DB
    alt: string
  } | { mime?: never })
