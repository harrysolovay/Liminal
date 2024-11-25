import { type Schema, Ty } from "./Ty.ts"

export function taggedUnion<M extends Record<string, Ty>>(members: M): Ty<
  {
    [K in keyof M]: {
      type: K
      value: M[K]["T"]
    }
  }[keyof M],
  M[keyof M]["P"],
  false
> {
  const entries = Object.entries(members)
  return Ty(
    (subschema) =>
      entries.length === 1
        ? variant(entries[0]![0], subschema(entries[0]![1]))
        : {
          discriminator: "type",
          anyOf: entries.map(([k, v]) => variant(k, subschema(v))),
        },
    false,
    (v) => members[v.type]![""].transform(v),
  )
}

function variant(type: string, value: Schema) {
  return {
    type: "object",
    properties: {
      type: {
        type: "string",
        const: type,
      },
      value,
    },
    required: ["type", "value"],
    additionalProperties: false,
  }
}
