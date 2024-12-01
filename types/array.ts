import { type AnyType, declareType, type Type } from "../core/mod.ts"

export function array<E extends AnyType>(element: E): Type<Array<E["T"]>, E["P"]> {
  return declareType({
    name: "array",
    source: {
      factory: array,
      args: [element],
    },
    visitValue: (value, ctx) =>
      value.forEach((e, i) =>
        ctx.visit(e, element, {
          value: i,
          type: "number",
        })
      ),
  })
}
