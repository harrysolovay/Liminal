import { declareType } from "../declareType.ts"
import type { AnyType, Derived } from "../Type.ts"

export function union<M extends Array<AnyType>>(...members: M): Derived<M[number]["T"], M> {
  return declareType({
    type: "union",
    self() {
      return union
    },
    args: members,
  })
}
