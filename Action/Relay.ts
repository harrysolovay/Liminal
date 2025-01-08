import type { PromiseOr } from "../util/mod.ts"
import type { Message } from "./Message.ts"

export interface Relay {
  type: "Relay"
  handler: Relayer
}

export type Relayer = (message: Message) => PromiseOr<void>

export function* Relay(handler: Relayer): Generator<Relay, () => void> {
  return yield {
    type: "Relay",
    handler,
  }
}
