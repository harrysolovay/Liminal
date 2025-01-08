import type { Content, Message } from "./Message.ts"

export interface Reducer {
  action: "Reducer"
  reduce: (messages: Array<Message>) => Content | Promise<Content>
}

export function Reducer(
  reduce: (messages: Array<Message>) => Content | Promise<Content>,
): Reducer {
  return {
    action: "Reducer",
    reduce,
  }
}
