import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import type { Expand } from "../util/type_util.ts"

// TODO: allow numbers as tags + tag keys?
export function taggedUnion<
  K extends string,
  M extends Expand<Record<string, Type | null>>,
>(
  tagKey: K,
  members: M,
): Type<
  { [V in keyof M]: ({ [_ in K]: V } & (M[V] extends Type ? { value: M[V]["T"] } : {})) }[keyof M],
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
        visitor: (value, visit, path) => {
          const tag = value[tagKey]
          const type = members[tag]!
          return ({
            [tagKey]: value[tagKey],
            // TODO: fix typing of `tag`.
            ..."value" in value
              ? {
                value: visit(
                  value.value,
                  type,
                  path.value("value").type(tag as string),
                ),
              }
              : {},
          }) as never
        },
      }),
  })
}
