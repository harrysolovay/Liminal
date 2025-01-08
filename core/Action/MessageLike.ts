import type { Falsy } from "@std/assert"
import type { Action } from "./Action.ts"
import type { Message } from "./Message.ts"

export type MessageLike = Falsy | string | Message | Array<MessageLike>

export function isMessageLike(action: Action): action is MessageLike {
  return (!action || typeof action === "string" || Array.isArray(action) || !("action" in action))
}

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
            created: new Date(),
          }
          : messageLike,
      ]
  }
  return []
}
