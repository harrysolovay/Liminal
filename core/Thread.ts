import type { Falsy } from "@std/assert"
import type { IterableLike } from "../util/IterableLike.ts"
import type { Last } from "../util/Last.ts"
import type { Model } from "./Model.ts"
import { Rune } from "./Rune.ts"

export interface Thread<T = any, E = any> extends Rune<"Thread", T> {
  E: E
}

export function Thread<A extends Array<unknown>>(...actions: A): Thread<
  Last<A> extends infer L ? L extends Rune<string, infer T> ? T
    : L extends IterableLike<any, infer T> ? T
    : undefined
    : undefined,
  ExtractE<A[number]>
> {
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
    },
    [],
  )
}

export type ExtractE<Y> = Exclude<Y, Falsy | Model | string> extends infer Z
  ? Z extends Rune ? Z extends Thread ? Z["E"]
    : never
  : Z extends IterableLike<infer Y2> ? ExtractE<Y2>
  : Z
  : never
