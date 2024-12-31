import type { Falsy } from "@std/assert"
import type { AnyType } from "../core/mod.ts"
import type { Provider } from "./Adapter.ts"

export interface Thread<P extends Provider> {
  parentHash: string
  hash: string
  messages: Array<MessageLike<P>>
  append: (...texts: Array<MessageLike<P>>) => Thread<P>
  history: Record<string, Thread<P>>
  ancestor(n: number): Thread<P>
  range(to: Thread<P>): ThreadRange<P>
}

export type MessageLike<P extends Provider = Provider> =
  | Falsy
  | number
  | string
  | P["I" | "O"]
  | AnyType

export interface ThreadRange<P extends Provider> {
  summary(): Promise<string>
}
