import { type AnyType, type Derived, Type } from "../Type.ts"

export function union<M extends Array<AnyType>>(...members: M): Derived<M[number]["T"], M> {
  return Type({
    type: "union",
    self() {
      return union
    },
    args: members,
  })
}
