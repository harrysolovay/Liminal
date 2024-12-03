import { type AnyType, Type } from "../../core/mod.ts"

export function option<X extends AnyType>(Some: X): Type<X["T"] | undefined, X["P"]> {
  return Type({
    factory: option,
    args: [Some],
  })
}
