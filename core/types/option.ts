import { type AnyType, Type } from "../Type.ts"

export function option<X extends AnyType>(Some: X): Type<X["T"] | undefined, X["P"]> {
  return Type({
    name: "option",
    source: {
      factory: option,
      args: [Some],
    },
  })
}
