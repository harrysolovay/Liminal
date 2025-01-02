import type { Action } from "./Action.ts"
import type { Type } from "./Type.ts"

export function run<T, Y extends Action = never>(
  _f: Type<T, never> | (() => Iterable<Y, T> | AsyncIterable<Y, T>),
): Promise<T> {
  throw 0
}
