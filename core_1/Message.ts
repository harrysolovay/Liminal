import type { DB } from "@std/media-types"

export type Message = {
  role: Role
  created: Date
} & Content

export type Role = "system" | "user" | "assistant" | "reducer"

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
