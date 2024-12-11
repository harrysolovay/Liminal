import type { Expand, U2I } from "../../util/mod.ts"
import * as I from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"
import { Tuple } from "./Tuple.ts"

export function Intersection<M extends Array<Type<"object", any, symbol>>>(
  ...members: M
): Type<"object", Expand<U2I<M[number]["T"]>>, M[number]["P"]> {
  return I.transform(
    Tuple(...members),
    ([e0, ...eRest]) => eRest.reduce((acc, cur) => ({ ...acc, ...cur }), e0),
  )
}
