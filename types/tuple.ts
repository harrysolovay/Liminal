import { type AnyType, declareType, type Type } from "../core/mod.ts"

export function tuple<E extends Array<AnyType>>(...elements: E): Type<
  { [K in keyof E]: E[K]["T"] },
  E[number]["P"]
> {
  return declareType({
    name: "tuple",
    source: {
      factory: tuple,
      args: elements,
    },
    visitValue: (value, ctx) => {
      value.forEach((value, i) =>
        ctx.visit(value, elements[i]!, {
          type: "number",
          value: i,
        })
      )
    },
  })
}
