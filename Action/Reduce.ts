import type { PromiseOr } from "../util/mod.ts"
import type { Message, MessageLike } from "./Message.ts"

export interface Reducer {
  type: "Reducer"
  reduce: Reduce
}

export type Reduce = (messages: Array<Message>) => PromiseOr<MessageLike>

export function Reducer(reduce: Reduce): Reducer {
  return {
    type: "Reducer",
    reduce,
  }
}
