import { unimplemented } from "../util/unimplemented.ts"
import { Effect, ReplaceVoid } from "./Effect.ts"
import { Value } from "./Value.ts"

export interface F<
  P extends Value = any,
  Y extends Value = any,
  R extends Value | void = any,
> {
  (value: Value.From<P>): Effect<Y, ReplaceVoid<R>>
}

export function f<Y extends Value, R extends Value | void>(
  _statements: () => Generator<Y, R>,
): F<never, Y, ReplaceVoid<R>> {
  unimplemented()
}
