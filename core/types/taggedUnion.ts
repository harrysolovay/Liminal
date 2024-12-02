import type { Expand } from "../../util/type_util.ts"
import { declareType } from "../declareType.ts"
import type { AnyType, Type } from "../Type.ts"

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
  return declareType({
    name: "taggedUnion",
    source: {
      factory: taggedUnion,
      args: [tagKey, members],
    },
  })
}

// formatValuePath: (leading) => `${leading}.value`,
// formatTypePath: (leading) => `${leading}.value`,
