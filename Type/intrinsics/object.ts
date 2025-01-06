import { Type } from "../Type.ts"

export function object<F extends Record<string, Type>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }> {
  return Type({
    kind: "object",
    self() {
      return object
    },
    args: [fields],
  })
}
