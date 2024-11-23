import { Ty } from "../core/Ty.ts"

export type taggedUnion<M extends TaggedUnionMembers = TaggedUnionMembers> = ReturnType<
  typeof taggedUnion<M>
>

export function taggedUnion<M extends TaggedUnionMembers>(members: M): Ty<
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

export type TaggedUnionMembers = Record<string, Ty>
