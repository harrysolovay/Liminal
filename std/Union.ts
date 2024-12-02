import { type AnyType, T, type Type } from "../mod.ts"

export function Union<M extends Array<AnyType>>(
  ...members: M
): Type<M[number]["T"], M[number]["P"]> {
  return T.transform(
    "UntagUnion",
    T.taggedUnion("type", Object.fromEntries(members.map((member, i) => [i, member]))),
    ({ value }) => value,
  )
}
