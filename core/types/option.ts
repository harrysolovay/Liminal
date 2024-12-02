import { declareType } from "../declareType.ts"
import type { AnyType, Type } from "../Type.ts"

export function option<X extends AnyType>(Some: X): Type<X["T"] | undefined, X["P"]> {
  return declareType({
    name: "option",
    source: {
      factory: option,
      args: [Some],
    },
  })
}

// formatValuePath: (leading) => `${leading}.value`,
// formatTypePath: (leading) => `${leading}.value`,
