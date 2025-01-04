import type { Falsy } from "@std/assert"
import type { DB } from "@std/media-types"
import type { PromiseOr } from "../util/mod.ts"

export type Message =
  & {
    role: "user" | "assistant" | "system"
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

export type MessageLike = Falsy | number | string | Blob | Message | Array<MessageLike>

export interface Reduce {
  type: "Reduce"
  reducer: Reducer
}

export type Reducer = (messages: Array<Message>) => PromiseOr<MessageLike>

export interface Messages {
  type: "Messages"
}

export interface Bubble {
  type: "Bubble"
  message: MessageLike
}

export interface OnMessage {
  type: "OnMessage"
  handler: OnMessageHandler
}

export type OnMessageHandler = (message: Message) => PromiseOr<void>
