import { type AnyType, Type } from "../../core/mod.ts"

export function array<E extends AnyType>(Element: E): Type<Array<E["T"]>, E["P"]> {
  return Type({
    factory: array,
    args: [Element],
  })
}
