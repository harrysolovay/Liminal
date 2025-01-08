import type { Rune } from "../Rune.ts"
import { Type } from "../Type.ts"

export function object<F extends Record<string, Rune>>(
  fields: F,
): Rune<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["E"]> {
  return Type("object", () => object, [fields])
}
