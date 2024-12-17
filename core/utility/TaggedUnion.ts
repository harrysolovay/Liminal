import type { Falsy } from "@std/assert"
import type { Expand } from "../../util/mod.ts"
import * as I from "../intrinsics.ts"
import type { PartialType, Type } from "../Type.ts"

export function TaggedUnion<M extends Record<string, Falsy | PartialType>>(members: M): Type<
  {
    [K in keyof M]: Expand<
      & { type: K }
      & (M[K] extends PartialType ? { value: M[K]["T"] } : { value?: never })
    >
  }[keyof M],
  Extract<M[keyof M], PartialType>["P"]
> {
  return I.union(
    ...Object.keys(members).toSorted().map((tag) =>
      I.object({
        type: I.const(I.string, tag),
        value: members[tag] ? members[tag] : I.null,
      } as never)
    ),
  )
}
