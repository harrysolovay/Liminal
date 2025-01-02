import type { Action } from "../Action.ts"
import { type ExtractEvent, Type } from "../Type.ts"

export function thread<Y extends Action, T = never, E = never>(
  f: () => Generator<Y, T | void, never> | AsyncGenerator<Y, T | void, never>,
  output?: Type<T, E>,
): Type<T, E | ExtractEvent<Y>> {
  return Type({
    type: "thread",
    self() {
      return thread
    },
    args: [f, output],
  })
}
