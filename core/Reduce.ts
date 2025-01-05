import type { PromiseOr } from "../util/mod.ts"
import type { Message, MessageLike } from "./Message.ts"

export interface Reduce {
  type: "Reduce"
  reducer: Reducer
}

export type Reducer = (messages: Array<Message>) => PromiseOr<MessageLike>

export function Reduce(reducer: Reducer): Reduce {
  return {
    type: "Reduce",
    reducer,
  }
}
