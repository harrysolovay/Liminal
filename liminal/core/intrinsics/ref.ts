import { declare } from "../declare.ts"
import type { JSONTypeKind } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function ref<K extends JSONTypeKind, T, P extends symbol>(
  get: () => Type<K, T, P>,
): Type<K, T, P> {
  return declare("ref", {
    factory: ref,
    args: [get],
    assert: (value, ctx) => {
      ctx.visit(get(), value)
    },
  }) as never
}
