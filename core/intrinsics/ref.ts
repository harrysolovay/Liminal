import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function ref<T, P extends symbol>(
  get: () => Type<T, P>,
): Type<T, P> {
  return declare({
    factory: ref,
    args: [get],
    assert: (value, ctx) => {
      ctx.visit(get(), value)
    },
  }) as never
}
