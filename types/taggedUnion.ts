import type { Expand } from "../util/type_util.ts"
import { Ty } from "./Ty.ts"

export function taggedUnion<K extends keyof any, M extends Record<string, Ty | null>>(
  tag: K,
  members: EnsureAtLeast2UnionMembers<M>,
): Ty<
  Expand<
    {
      [V in keyof M]: (
        & { [_ in K]: V }
        & (M[V] extends Ty ? { value: M[V]["T"] } : {})
      )
    }[keyof M]
  >,
  Exclude<M[keyof M], null>["P"],
  false
> {
  return Ty(
    (subschema) => ({
      discriminator: "type",
      anyOf: Object.entries(members).map(([k, v]) => ({
        type: "object",
        properties: {
          [tag]: {
            type: "string",
            const: k,
          },
          ...(v === null ? {} : {
            value: subschema(v),
          }),
        },
        required: ["type", ...v === null ? [] : ["value"]],
        additionalProperties: false,
      })),
    }),
    false,
    (v) => members[v[tag]]![""].transform(v),
  )
}

export type EnsureAtLeast2UnionMembers<
  V,
  T extends keyof V = keyof V,
  B = T,
> = T extends any ? ([B] extends [T] ? never : V)
  : never
