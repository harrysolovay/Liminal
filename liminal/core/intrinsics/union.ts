import { declare } from "../declare.ts"
import type { AnyType, Type } from "../Type.ts"

export function union<M extends Array<AnyType>>(
  ...members: M
): Type<"union", M[number]["T"], M[number]["P"]> {
  return declare("union", {
    factory: union,
    args: members,
  })
}
