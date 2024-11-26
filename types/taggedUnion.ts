import { Ty } from "./Ty.ts"

export function taggedUnion<M extends Record<string, Ty | null>>(members: M): Ty<
  { [K in keyof M]: M[K] extends Ty ? { type: K; value: M[K]["T"] } : { type: K } }[keyof M],
  Exclude<M[keyof M], null>["P"],
  false
> {
  const entries = Object.entries(members)
  return Ty(
    (subschema) => ({
      discriminator: "type",
      anyOf: entries.map(([k, v]) => ({
        type: "object",
        properties: {
          type: {
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
    (v) => members[v.type]![""].transform(v),
  )
}
