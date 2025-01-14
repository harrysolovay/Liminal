import type { E } from "./E.ts"
import type { MessageLike } from "./Message.ts"
import type { Thread } from "./Thread.ts"
import type { Type } from "./Type.ts"

export type Action = MessageLike | Thread | Type | E

export type ExtractE<Y extends Action> =
  & (Extract<Y, E> extends infer F extends E ? {
      [K in F["key"]]: Extract<F, E<K>>["value"]
    }
    : never)
  & Extract<Y, Thread> extends Thread<any, infer E> ? E : never
