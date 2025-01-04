import type { Action } from "../Action.ts"
import { declareType } from "../declareType.ts"
import type { ExtractEvent } from "../Event.ts"
import type { Type } from "../Type.ts"

export function thread<Y extends Action, T = never, E = never>(
  f: () => Generator<Y, NoInfer<T> | void, never> | AsyncGenerator<Y, NoInfer<T> | void, never>,
  output?: Type<T, E>,
): Type<T, E | ExtractEvent<Y>> {
  return declareType({
    type: "thread",
    self() {
      return thread
    },
    args: [f, output],
  })
}
