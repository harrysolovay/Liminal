import { Ty } from "./Ty.ts"

export function taggedUnion<M extends Record<string, Ty>>(members: M): Ty<
  {
    [K in keyof M]: {
      type: K
      value: M[K][Ty.T]
    }
  }[keyof M],
  M[keyof M][Ty.P]
> {
  return Ty((description, ref) => ({
    description,
    discriminator: "type",
    anyOf: Object.entries(members).map(([k, v]) => ({
      type: "object",
      properties: {
        type: {
          type: "string",
          const: k,
        },
        value: ref(v),
      },
      required: ["type", "value"],
      additionalProperties: false,
    })),
  }))
}
