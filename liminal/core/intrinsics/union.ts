import type { AnyType, Type } from "../Type.ts"

export function union<M extends Array<AnyType>>(
  ...members: M
): Type<"union", M[number]["T"], M[number]["P"]> {
  throw 0
}
