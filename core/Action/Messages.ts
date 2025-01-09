import type { Message } from "./Message.ts"

export interface Messages {
  action: "Messages"
}

export function* Messages(): Generator<Messages, Array<Message>> {
  return yield {
    action: "Messages",
  }
}
