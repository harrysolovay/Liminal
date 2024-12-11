import { transform } from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"
import { Tuple } from "./Tuple.ts"

export function Intersection<M extends Array<Type<"object", any, symbol>>>(
  ...members: M
): Type<"object", M[number]["T"], M[number]["P"]> {
  return transform(
    Tuple(...members),
    ([e0, ...eRest]) => eRest.reduce((acc, cur) => ({ ...acc, ...cur }), e0),
  )
}
