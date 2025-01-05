import type { Falsy } from "@std/assert"
import type { DB } from "@std/media-types"

export type Message =
  & {
    role: Role
    body: string
    created: number
    metadata?: Record<string, string>
  }
  & ({
    mime: keyof DB
    alt: string
  } | {
    mime?: never
  })

export type Role = "system" | "user" | "assistant"

export type MessageLike = Falsy | string | Message | Array<MessageLike>

export function content(
  body: string,
  mime: keyof DB,
  alt: string,
  metadata?: Record<string, string>,
): Message {
  return {
    role: "user",
    body,
    created: Math.floor(new Date().getTime() / 1000),
    metadata,
    mime,
    alt,
  }
}
