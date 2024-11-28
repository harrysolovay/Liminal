import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import type { Expand } from "../util/type_util.ts"

// TODO: allow numbers as tags + tag keys?
export function taggedUnion<
  K extends string,
  M extends Expand<TaggedUnionMembers>,
>(
  tagKey: K,
  members: M,
): Type<Expand<NativeTaggedUnion<K, M>>, {}, Extract<M[keyof M], Type>["P"]> {
  const entries = Object.entries(members)
  return declare<NativeTaggedUnion<K, M>>()({
    name: "taggedUnion",
    source: {
      factory: taggedUnion,
      args: { members },
    },
    subschema: (ref) => ({
      discriminator: tagKey,
      anyOf: entries.map(([k, v]) => ({
        type: "object",
        properties: {
          [tagKey]: {
            type: "string",
            const: k,
          },
          ...(v === null ? {} : { value: ref(v) }),
        },
        required: [tagKey, ...v === null ? [] : ["value"]],
        additionalProperties: false,
      })),
    }),
    transform: (value, visit) => {
      const tag = value[tagKey]
      const type = members[tag]!
      return ({
        [tagKey]: value[tagKey],
        ..."value" in value ? { value: visit(value.value, type, tag as string) } : {},
      }) as never
    },
    assertRefinementsValid: () => {},
    assertRefinements: {},
  })
}

export type TaggedUnionMembers = Record<string, Type | null>

export type NativeTaggedUnion<K extends string, M extends TaggedUnionMembers> = {
  [V in keyof M]: (
    & { [_ in K]: V }
    & (M[V] extends Type ? { value: M[V]["T"] } : {})
  )
}[keyof M]
