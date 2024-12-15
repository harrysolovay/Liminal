import { declare } from "../declare.ts"
import type { Type } from "../Type.ts"

export function transform<T, P extends symbol, R>(
  from: Type<T, P>,
  f: (value: T) => R,
): Type<R, P> {
  return declare({
    jsonType: from.declaration.jsonType,
    factory: transform,
    args: [from, f],
    assert: (value, ctx) => {
      ctx.visit(from, value)
    },
  })
}
