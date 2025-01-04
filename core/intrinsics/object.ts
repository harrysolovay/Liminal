import { declareType } from "../declareType.ts"
import type { AnyType, Type } from "../Type.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["E"]> {
  return declareType({
    type: "object",
    self() {
      return object
    },
    args: [Object.fromEntries(Object.keys(fields).toSorted().map((key) => [key, fields[key]]))],
  })
}
