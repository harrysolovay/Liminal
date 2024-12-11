import type { Falsy } from "@std/assert"
import type { Expand } from "../../../util/mod.ts"
import { const as const_, object, string, union } from "../intrinsics/mod.ts"
import type { AnyType, Type } from "../Type.ts"

export function TaggedUnion<M extends Record<string, AnyType | Falsy>>(
  members: M,
): Type<
  "union",
  {
    [K in keyof M]: Expand<
      & { type: K }
      & (M[K] extends AnyType ? { value: M[K]["T"] } : {})
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["P"]
> {
  const tags = Object.keys(members)
  tags.sort()
  return union(
    ...tags.map((tag) =>
      object({
        type: const_(string, tag),
        ...members[tag] ? { value: members[tag]! } : {},
      } as never)
    ),
  )
}
