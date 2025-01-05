import type { AnyType, Type } from "../Type.ts"
import { declare } from "../Type/mod.ts"

export function union<M extends Array<AnyType>>(
  ...members: M
): Type<M[number]["T"], M[number]["E"]> {
  return declare({
    type: "union",
    self() {
      return union
    },
    args: members,
  })
}
