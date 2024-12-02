import { declareType } from "../declareType.ts"
import type { AnyType, Type } from "../Type.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  return declareType({
    name: "object",
    source: {
      factory: object,
      args: [fields],
    },
  })
}

// formatValuePath: (leading) => `${leading}.${key}`,
// formatTypePath: (leading) => `${leading}.${key}`,
