import type { DB } from "@std/media-types"

export type Message = Content & {
  role: Role
  created: Date
}

export type Content =
  & {
    body: string
  }
  & ({
    mime: keyof DB
    alt: string
  } | {
    mime?: never
  })

export type Role = "system" | "user" | "assistant" | "reducer"

export function Content(
  body: string,
  mime: keyof DB,
  alt: string,
): Message {
  return {
    role: "user",
    created: new Date(),
    body,
    mime,
    alt,
  }
}