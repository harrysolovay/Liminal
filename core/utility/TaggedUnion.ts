import type { Falsy } from "@std/assert"
import type { Expand } from "../../util/mod.ts"
import * as I from "../intrinsics/mod.ts"
import { metadata } from "../L.ts"
import type { AnyType, Type } from "../Type.ts"
import { Tagged } from "./Tagged.ts"

export function TaggedUnion<
  K extends string,
  M extends Record<string, AnyType | Falsy>,
>(
  tagKey: K,
  members: M,
): Type<
  {
    [K2 in keyof M]: Expand<
      & { [_ in K]: K2 }
      & (M[K2] extends AnyType ? { value: M[K2]["T"] } : { value?: undefined })
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["P"]
> {
  return I.union(
    ...Object.keys(members).toSorted().map((tag) =>
      Tagged(tagKey, tag, (members[tag] ? { value: members[tag]! } : {}) as never)
    ),
  )(TaggedUnionMetadata(tagKey))
}

const TaggedUnionKey = Symbol()
export const TaggedUnionMetadata = metadata<string>(TaggedUnionKey)
