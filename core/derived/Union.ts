import type { AnyType, Type } from "../Type.ts"
import { taggedUnion, transform } from "../types.ts"

export function Union<M extends Array<AnyType>>(
  ...members: M
): Type<M[number]["T"], M[number]["P"]> {
  return transform(
    taggedUnion("type", Object.fromEntries(members.map((member, i) => [i, member]))),
    ({ value }) => value,
  )
}
