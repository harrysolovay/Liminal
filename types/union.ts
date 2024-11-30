import { declare, type Type } from "../core/mod.ts"

export function union<M extends Array<Type>>(
  ...members: M
): Type<M[number]["T"], {}, M[number]["P"]> {
  return declare({
    name: "union",
    source: {
      factory: union,
      args: { members },
    },
    subschema: (visit) => ({
      discriminator: "type",
      anyOf: members.map((member, i) => ({
        type: "object",
        properties: {
          type: {
            type: "number",
            const: i,
          },
          value: visit(member),
        },
        required: ["type", "value"],
        additionalProperties: false,
      })),
    }),
    output: (f) =>
      f<{
        type: number
        value: unknown
      }>({
        visitor: (value, ctx) =>
          ctx.visit({
            value: value.value,
            type: members[value.type]!,
            junctions: {
              type: value.type,
            },
          }),
      }),
  })
}
