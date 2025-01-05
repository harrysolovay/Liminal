import type { Action } from "../Action.ts"
import type { ExtractEvent } from "../Event.ts"
import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function thread<Y extends Action, T = never, E = never>(
  f: () =>
    | Iterable<Y, NoInfer<T> | void, void>
    | AsyncIterable<Y, NoInfer<T> | void, void>,
  output?: Type<T, E>,
): Type<T, E | ExtractEvent<Y>> {
  return declare({
    type: "thread",
    self() {
      return thread
    },
    args: [f, output],
  })
}
