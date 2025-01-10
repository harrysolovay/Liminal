import type { Last } from "../../util/Last.ts"
import type { Action } from "../Action.ts"
import type { ExtractE } from "../ExtractE.ts"
import type { Flow } from "../Flow.ts"
import { Rune } from "../Rune.ts"
import type { Thread } from "../Thread/mod.ts"

export function thread<A extends Array<Action | Flow>>(
  ...actions: A
): Thread<
  Last<A> extends infer L ? L extends Rune<string, infer T> ? T
    : L extends Iterable<any, infer R> | AsyncIterable<any, infer R> ? Awaited<R>
    : undefined
    : undefined,
  ExtractE<A[number]>
> {
  return Rune({
    kind: "Thread",
    self: () => thread,
    args: actions,
  })
}
