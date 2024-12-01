import { type AnyType, declareType, type Type } from "../core/mod.ts"
import type { Expand } from "../util/type_util.ts"

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
    visitValue: (variant, visit) => {
      const type = variant[tagKey] as number | string
      return {
        [tagKey]: type,
        ..."value" in variant
          ? {
            value: visit(
              variant.value,
              members[type]!,
              (leading) => `${leading}.value`,
              (leading) => `${leading}.value`,
            ),
          }
          : {},
      } as never
    },
  })
}
