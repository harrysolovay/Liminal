import type { Action } from "../Action.ts"
import type { ExtractEvent } from "../Event.ts"
import type { Type } from "../Type.ts"
import { declare } from "../Type/mod.ts"

export function thread<Y extends Action, T = never, E = never>(
  f: () =>
    | Iterator<Y, NoInfer<T> | void, void>
    | AsyncIterator<Y, NoInfer<T> | void, void>,
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
