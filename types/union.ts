import { Ty } from "./Ty.ts"

export function union<M extends Ty[]>(...members: M): Ty<M[number]["T"], M[number]["P"], false> {
  return Ty<M[number]["T"], M[number]["P"], false, {
    type: number
    value: M[number]["T"]
  }>(
    (subschema) => ({
      discriminator: "type",
      anyOf: members.map((member, i) => ({
        type: "object",
        properties: {
          type: {
            type: "number",
            const: i,
          },
          value: subschema(member),
        },
        required: ["type", "value"],
        additionalProperties: false,
      })),
    }),
    false,
    (v) => members[v.type]![""].transform(v.value),
  )
}

// TODO: get this working
export type EnsureAtLeast2Members<T, B = T> = T extends any ? ([B] extends [T] ? never : T)
  : never
