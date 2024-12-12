import type { AssertionContext } from "../AssertionContext.ts"
import { declare } from "../declare.ts"
import type { JSONTypeKind } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function transform<K extends JSONTypeKind, T, P extends symbol, R>(
  from: Type<K, T, P>,
  f: (value: T) => R,
  assert: (value: unknown, ctx: AssertionContext) => void,
): Type<K, R, P> {
  return declare(from.K, {
    factory: transform,
    args: [from, f],
    assert,
  })
}
