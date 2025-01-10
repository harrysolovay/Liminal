import { Rune } from "../Rune.ts"
import type { Type } from "../Type/Type.ts"

export function object<F extends Record<string, Type>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }> {
  return Rune({
    kind: "Type",
    self: () => object,
    args: [fields],
  })
}
