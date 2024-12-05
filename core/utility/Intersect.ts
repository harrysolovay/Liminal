import type { U2I } from "../../util/mod.ts"
import type { Derived } from "../Derived.ts"
import type { AnyType } from "../Type.ts"
import * as T from "../types/mod.ts"
import { Tuple } from "./Tuple.ts"

export function Intersect<M extends Array<AnyType<Record<keyof any, unknown>>>>(
  ...members: M
): Derived<U2I<M[number]>, M> {
  return T.transform(
    "Intersect",
    Tuple(...members),
    ([first, ...rest]) => rest.reduce((acc, cur) => ({ ...acc, ...cur }), first),
  ) as never
}
