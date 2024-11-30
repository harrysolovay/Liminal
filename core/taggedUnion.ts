import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import type { Expand } from "../util/type_util.ts"

export function taggedUnion<
  K extends number | string,
  M extends Record<number | string, Type | null>,
>(
  tagKey: K,
  members: M,
): Type<
  {
    [V in keyof M]: Expand<({ [_ in K]: V } & (M[V] extends Type ? { value: M[V]["T"] } : {}))>
  }[keyof M],
  {},
  Extract<M[keyof M], Type>["P"]
> {
  const entries = Object.entries(members)
  return declare({
    name: "taggedUnion",
    source: {
      factory: taggedUnion,
      args: { tagKey, members },
    },
    subschema: (visit) => ({
      discriminator: tagKey,
      anyOf: entries.map(([k, v]) => ({
        type: "object",
        properties: {
          [tagKey]: {
            type: "string",
            const: k,
          },
          ...(v === null ? {} : { value: visit(v) }),
        },
        required: [tagKey, ...v === null ? [] : ["value"]],
        additionalProperties: false,
      })),
    }),
    output: (f) =>
      f<{ [V in keyof M]: ({ [_ in K]: V } & { value?: unknown }) }[keyof M]>({
        visitor: (value, visit, ctx) => {
          const tag = value[tagKey] as number | string
          const type = members[tag]!
          return ({
            [tagKey]: value[tagKey],
            ..."value" in value
              ? { value: visit(value.value, type, ctx.descend("value", tag)) }
              : {},
          }) as never
        },
      }),
  })
}
