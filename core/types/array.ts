import { type AnyType, Type } from "../Type.ts"

export function array<E extends AnyType>(element: E): Type<Array<E["T"]>, E["P"]> {
  return Type({
    kind: "array",
    factory: array,
    args: [element],
    argsLookup: { element },
  })
}
