import type { Derived } from "../Derived.ts"
import type { AnyType } from "../Type.ts"
import * as T from "../types/mod.ts"

export function Union<M extends Array<AnyType>>(
  ...members: M
): Derived<M[number]["T"], M> {
  return T.transform(
    "Union",
    T.taggedUnion("type", Object.fromEntries(members.map((member, i) => [i, member]))),
    ({ value }) => value,
  )
}
