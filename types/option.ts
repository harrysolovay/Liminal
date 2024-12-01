import { type AnyType, declareType, type Type } from "../core/mod.ts"

export function option<X extends AnyType>(Some: X): Type<X["T"] | null, X["P"]> {
  return declareType({
    name: "option",
    source: {
      factory: option,
      args: [Some],
    },
    visitValue: (value, visit) => value === null ? value : visit(value, Some),
  })
}
