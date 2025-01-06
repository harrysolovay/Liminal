import type { Falsy } from "@std/assert"
import type { DB } from "@std/media-types"

export type Message =
  & {
    role: Role
    body: string
    created: number
  }
  & ({
    mime: keyof DB
    alt: string
  } | {
    mime?: never
  })

export type Role = "system" | "user" | "assistant"

export type MessageLike = Falsy | string | Message | Array<MessageLike>

export function normalizeMessageLike(messageLike: MessageLike): Array<Message> {
  if (messageLike) {
    return Array.isArray(messageLike)
      ? messageLike.reduce<Array<Message>>(
        (acc, cur) => cur ? [...acc, ...normalizeMessageLike(cur)!] : acc,
        [],
      )
      : [
        typeof messageLike === "string"
          ? {
            role: "user",
            body: messageLike,
            created: Math.floor(new Date().getTime() / 1000),
          }
          : messageLike,
      ]
  }
  return []
}

export function content(
  body: string,
  mime: keyof DB,
  alt: string,
): Message {
  return {
    role: "user",
    body,
    created: Math.floor(new Date().getTime() / 1000),
    mime,
    alt,
  }
}
