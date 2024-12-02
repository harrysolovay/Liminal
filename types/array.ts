import { type AnyType, declareType, type Type } from "../core/mod.ts"

export function array<E extends AnyType>(Element: E): Type<Array<E["T"]>, E["P"]> {
  return declareType({
    name: "array",
    source: {
      factory: array,
      args: [Element],
    },
    visitValue: (value, visit) => {
      const visited = value.map((e, i) =>
        visit(
          e,
          Element,
          () => (value) => {
            visited[i] = value
          },
          {
            formatValuePath: (leading) => `${leading}[${i}]`,
            formatTypePath: (leading) => `${leading}[number]`,
          },
        )
      )
      return visited
    },
  })
}
