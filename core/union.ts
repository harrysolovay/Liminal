import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

export function union<M extends Array<Type>>(
  ...members: M
): Type<M[number]["T"], {}, M[number]["P"]> {
  return declare<{
    type: number
    value: M[number]["T"]
  }>()({
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
    process: (value, visit) => visit(value.value, members[value.type]!, value.type),
  })
}
