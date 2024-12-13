import type { Falsy } from "@std/assert"
import type { Expand } from "../../../util/mod.ts"
import * as I from "../intrinsics/mod.ts"
import type { AnyType, Type } from "../Type.ts"
import { Tagged } from "./Tagged.ts"

export function TaggedUnion<M extends Record<string, AnyType | Falsy>>(
  members: M,
): Type<
  {
    [K in keyof M]: Expand<
      & { type: K }
      & (M[K] extends AnyType ? { value: M[K]["T"] } : { value?: undefined })
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["P"]
> {
  return I.union(
    ...Object.keys(members).toSorted().map((tag) =>
      Tagged("type", tag, members[tag] ? { value: members[tag]! } : undefined) as never
    ),
  )
}
