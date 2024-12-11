import { object, transform } from "../intrinsics/mod.ts"
import type { AnyType, Type } from "../Type.ts"

export function Tuple<M extends Array<AnyType>>(
  ...members: M
): Type<"object", { [I in keyof M]: M[I]["T"] }, M[number]["P"]> {
  return transform(
    object(Object.fromEntries(members.map((type, i) => [i, type]))),
    (value) => Object.values(value) as never,
  )
}
