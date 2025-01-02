import { Type } from "../Type.ts"

export function array<T, E>(element: Type<T, E>): Type<Array<T>, E> {
  return Type({
    type: "array",
    self() {
      return array
    },
    args: [element],
  })
}
