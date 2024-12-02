import { declareType } from "../declareType.ts"
import type { AnyType, Type } from "../Type.ts"

export function array<E extends AnyType>(Element: E): Type<Array<E["T"]>, E["P"]> {
  return declareType({
    name: "array",
    source: {
      factory: array,
      args: [Element],
    },
  })
}

// formatValuePath: (leading) => `${leading}[${i}]`,
// formatTypePath: (leading) => `${leading}[number]`,
