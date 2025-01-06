import { Type } from "../Type.ts"

export function union<M extends Array<Type>>(...members: M): Type<M[number]["T"]> {
  return Type({
    kind: "union",
    self() {
      return union
    },
    args: members,
  })
}
