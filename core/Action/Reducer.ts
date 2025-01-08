import type { Content, Message } from "./Message.ts"

export interface Reducer {
  action: "Reducer"
  reduce: Reduce
}

export type Reduce = (messages: Array<Message>) => Content | Promise<Content>
