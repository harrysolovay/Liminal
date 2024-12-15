import type { Falsy } from "@std/assert"
import type { Expand } from "../../util/mod.ts"
import type { MetadataHandle } from "../Annotation.ts"
import * as I from "../intrinsics/mod.ts"
import { metadata } from "../L.ts"
import type { AnyType, Type } from "../Type.ts"

export function TaggedUnion<
  K extends string,
  M extends Record<string, Falsy | AnyType>,
>(
  tagKey: K,
  members: M,
): Type<
  {
    [K2 in keyof M]: Expand<
      & { [_ in K]: K2 }
      & (M[K2] extends AnyType ? { value: M[K2]["T"] } : { value?: never })
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["P"]
> {
  return I.union(
    ...Object.keys(members).toSorted().map((tag) =>
      I.transform(
        I.object({
          [tag]: members[tag] ? members[tag] : I.null,
          [tagKey]: I.const(I.string, tag),
        }),
        ({ [tag]: value, ...rest }) => ({ ...rest, value }),
      ) as never
    ),
  )(TaggedUnionMetadata(tagKey))
}

type Ensure<K extends string, M extends Record<string, Falsy | AnyType>> = K extends
  keyof Extract<keyof M, AnyType>["T"] ? never
  : M

const TaggedUnionKey = Symbol()
export const TaggedUnionMetadata: MetadataHandle<string> = metadata<string>(TaggedUnionKey)
