import type { AnyType, Type } from "../Type.ts"
import { declare } from "../Type/mod.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["E"]> {
  return declare({
    type: "object",
    self() {
      return object
    },
    args: [fields],
  })
}
