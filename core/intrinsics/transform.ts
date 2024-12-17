import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function transform<T, P extends symbol, R>(
  from: Type<T, P>,
  f: (value: T) => R,
): Type<R, P> {
  return declare({
    factory: transform,
    args: [from, f],
    assert: (value, ctx) => {
      ctx.visit(from, value)
    },
  })
}
