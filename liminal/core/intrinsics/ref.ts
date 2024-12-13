import { declare } from "../declare.ts"
import type { Type } from "../Type.ts"

export function ref<T, P extends symbol>(
  get: () => Type<T, P>,
): Type<T, P> {
  return declare({
    jsonType: "ref",
    factory: ref,
    args: [get],
    assert: (value, ctx) => {
      ctx.visit(get(), value)
    },
  }) as never
}
