import { type AnyType, declareType, type Type } from "../core/mod.ts"

export function array<E extends AnyType>(Element: E): Type<Array<E["T"]>, E["P"]> {
  return declareType({
    name: "array",
    source: {
      factory: array,
      args: [Element],
    },
    visitValue: (value, visit) =>
      value.map((e, i) =>
        visit(
          e,
          Element,
          (leading) => `${leading}[${i}]`,
          (leading) => `${leading}[number]`,
        )
      ),
  })
}
