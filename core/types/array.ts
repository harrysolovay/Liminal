import { type AnyType, Type } from "../Type.ts"

export function array<E extends AnyType>(Element: E): Type<Array<E["T"]>, E["P"]> {
  return Type({
    name: "array",
    source: {
      factory: array,
      args: [Element],
    },
  })
}
