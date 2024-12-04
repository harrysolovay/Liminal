import type { Derived } from "../Derived.ts"
import type { AnyType } from "../Type.ts"
import { taggedUnion, transform } from "../types.ts"

export function Union<M extends Array<AnyType>>(
  ...members: M
): Derived<M[number]["T"], M> {
  return transform(
    "Union",
    taggedUnion("type", Object.fromEntries(members.map((member, i) => [i, member]))),
    ({ value }) => value,
  )
}
