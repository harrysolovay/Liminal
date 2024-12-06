import type { Expand } from "../../util/mod.ts"
import { type AnyType, Type } from "../Type.ts"

export function taggedUnion<
  K extends number | string,
  M extends Record<number | string, AnyType | undefined>,
>(
  tagKey: K,
  members: M,
): Type<
  {
    [V in keyof M]: Expand<
      (
        & { [_ in K]: V }
        & (M[V] extends AnyType ? { value: M[V]["T"] } : {})
      )
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["P"]
> {
  return Type({
    kind: "taggedUnion",
    factory: taggedUnion,
    args: [tagKey, members],
    argsLookup: { tagKey, members },
  })
}
