import type { Falsy } from "@std/assert"
import type { Expand } from "../../../util/mod.ts"
import * as I from "../intrinsics/mod.ts"
import type { AnyType, Type } from "../Type.ts"

export function TaggedUnion<M extends Record<string, AnyType | Falsy>>(
  members: M,
): Type<
  "union",
  {
    [K in keyof M]: Expand<
      & { type: K }
      & (M[K] extends AnyType ? { value: M[K]["T"] } : { value?: undefined })
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["P"]
> {
  const tags = Object.keys(members)
  tags.sort()
  return I.union(
    ...tags.map((tag) =>
      I.object({
        type: I.const(I.string, tag),
        ...members[tag] ? { value: members[tag]! } : {},
      } as never)
    ),
  )
}
