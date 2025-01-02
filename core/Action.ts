import type { PromiseOr } from "../util/mod.ts"
import type { event, model, reduce, tool } from "./actions.ts"
import type { AnyType } from "./Type.ts"

export type Action =
  | Model
  | Tool
  | MessageLike
  | Complete
  | Event
  | Reduce

export type MessageLike = number | string | Message | Array<MessageLike>

export interface Message {
  type?: AnyType
  value: unknown
  time: Date
  metadata?: unknown
}

export interface Complete {
  type: "Complete"
  value: AnyType
}

export type Adapter = (messages: Array<Message>, type?: AnyType) => Promise<Message>

export type Reducer = (messages: Array<Message>) => PromiseOr<MessageLike>
