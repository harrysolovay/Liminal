import { type AnyType, Type } from "../../core/mod.ts"
import type { Expand } from "../../util/type_util.ts"

export function taggedUnion<
  K extends number | string,
  M extends Record<number | string, AnyType | null>,
>(
  tagKey: K,
  members: M,
): Type<
  {
    [V in keyof M]: Expand<({ [_ in K]: V } & (M[V] extends AnyType ? { value: M[V]["T"] } : {}))>
  }[keyof M],
  Extract<M[keyof M], AnyType>["P"]
> {
  return Type({
    factory: taggedUnion,
    args: [tagKey, members],
  })
}
