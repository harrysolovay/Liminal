import type { AnyType, Type } from "../core/mod.ts"
import { taggedUnion } from "../types/taggedUnion.ts"
import { transform } from "../types/transform.ts"

export function Union<M extends Array<AnyType>>(
  ...members: M
): Type<M[number]["T"], M[number]["P"]> {
  return transform(
    "UntagUnion",
    taggedUnion("type", Object.fromEntries(members.map((member, i) => [i, member]))),
    ({ value }) => value,
  )
}
