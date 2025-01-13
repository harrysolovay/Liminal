import type { Falsy } from "@std/assert"
import type { IterableLike } from "../util/IterableLike.ts"
import type { Last } from "../util/Last.ts"
import type { Model } from "./Model.ts"
import { Rune } from "./Rune.ts"

export interface Thread<T = any, E = any> extends Rune<"Thread", T> {
  E: E
  handlers: Array<(event: unknown) => unknown>
  handle<R>(f: (event: E) => R): Thread<T, Thread.E<R>>
}

export function Thread<A extends Array<unknown>>(
  ...actions: A
): Thread<
  Last<A> extends infer F ? F extends Rune<string, infer T> ? T
    : F extends IterableLike<any, infer T> ? T
    : undefined
    : never,
  Thread.E<A[number]>
> {
  return (function make(handlers: Array<(event: unknown) => unknown>) {
    return Rune(
      {
        kind: "Thread",
        self: () => Thread,
        args: actions,
        exec(_state) {
          return null!
        },
      },
      {
        ...{} as { E: never },
        handlers,
        handle(f: (event: any) => unknown) {
          return make([...handlers, f])
        },
      },
      [],
    )
  })([])
}

export declare namespace Thread {
  export type E<Y> = Exclude<Y, void | Falsy | Model | string> extends infer Z
    ? Z extends Rune ? Extract<Z, Thread>["E"]
    : Z extends IterableLike<infer Y2> ? E<Y2>
    : Z
    : never
}
