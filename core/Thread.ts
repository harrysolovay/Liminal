import type { Falsy } from "@std/assert"
import type { IterableLike } from "../util/IterableLike.ts"
import type { Last } from "../util/Last.ts"
import type { Model } from "./Model.ts"
import { Rune } from "./Rune.ts"

export interface Thread<T = any, E = any> extends Rune<"Thread", T> {
  E: E
  handlers: Array<(event: unknown) => unknown>
  handle<R>(f: (event: E) => R): Thread<T, ExtractE<R>>
}

export function Thread<A extends Array<unknown>>(...actions: A): ThreadFrom<A> {
  return make([])

  function make(handlers: Array<(event: unknown) => unknown>): ThreadFrom<A> {
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
  }
}

type ThreadFrom<A extends Array<unknown>> = [
  Thread<
    Last<A> extends infer L ? L extends Rune<string, infer T> ? T
      : L extends IterableLike<any, infer T> ? T
      : undefined
      : undefined,
    ExtractE<A[number]>
  >,
][0]

export type ExtractE<Y> = Exclude<Y, Falsy | Model | string> extends infer Z
  ? Z extends Rune ? Extract<Z, Thread>["E"]
  : Z extends IterableLike<infer Y2> ? ExtractE<Y2>
  : Z
  : never
