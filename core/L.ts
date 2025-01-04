import type { DB } from "@std/media-types"
import type { Event } from "./Event.ts"
import type {
  Bubble,
  Message,
  MessageLike,
  Messages,
  OnMessage,
  OnMessageHandler,
  Reduce,
  Reducer,
} from "./Message.ts"
import type { Tool } from "./Tool.ts"
import type { Type } from "./Type.ts"

export * from "./intrinsics/mod.ts"
export * from "./utility/mod.ts"

export function* tool<T = never>(
  description: string,
  f: (arg: T) => unknown,
  param?: Type<T, never>,
): Generator<Tool, () => void> {
  return yield {
    type: "Tool",
    description,
    f,
    param,
  }
}

export function* reduce(reducer: Reducer): Generator<Reduce, Array<Message>> {
  return yield {
    type: "Reduce",
    reducer,
  }
}

export const clear = reduce(() => undefined)

export const messages: Generator<Messages, Array<MessageLike>> = (function*() {
  while (true) {
    return yield {
      type: "Messages",
    }
  }
})()

export function bubble(message: MessageLike): Bubble {
  return {
    type: "Bubble",
    message,
  }
}

export function event<E>(data: E): Event<E> {
  return {
    type: "Event",
    data,
  }
}

export function content(
  mime: keyof DB,
  body: string,
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

export function onMessage(handler: OnMessageHandler): OnMessage {
  return {
    type: "OnMessage",
    handler,
  }
}
