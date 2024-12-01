import { type AnyType, declareType, type Type } from "../core/mod.ts"

export function array<E extends AnyType>(element: E): Type<Array<E["T"]>, E["P"]> {
  return declareType({
    name: "array",
    source: {
      factory: array,
      args: [element],
    },
    visitValue: (value, visit) => value.map((e, i) => visit(e, element, i)),
  })
}
