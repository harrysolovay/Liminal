import type { Message } from "./Message.ts"

export interface Relayer {
  action: "Relayer"
  relay: (message: Message) => void | Promise<void>
}

export function* Relayer(
  relay: (message: Message) => void | Promise<void>,
): Generator<Relayer, () => void> {
  return yield {
    action: "Relayer",
    relay,
  }
}
