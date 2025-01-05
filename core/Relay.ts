import type { PromiseOr } from "../util/mod.ts"
import type { Message } from "./Message.ts"

export interface Relay {
  type: "Relay"
  handler: Relayer
}

export type Relayer = (message: Message) => PromiseOr<void>

export function relay(handler: Relayer): Relay {
  return {
    type: "Relay",
    handler,
  }
}
