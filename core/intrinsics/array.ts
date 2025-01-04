import { declareType } from "../declareType.ts"
import type { Type } from "../Type.ts"

export function array<T, E>(element: Type<T, E>): Type<Array<T>, E> {
  return declareType({
    type: "array",
    self() {
      return array
    },
    args: [element],
  })
}
