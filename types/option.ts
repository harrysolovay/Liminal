import { declare, type Type } from "../core/mod.ts"

export function option<X extends Type>(Some: X): Type<X["T"] | undefined, {}, X["P"]> {
  return declare({
    name: "option",
    source: {
      factory: option,
      args: { Some },
    },
    subschema: (visit) => ({
      discriminator: "type",
      anyOf: [{ type: "null" }, visit(Some)],
    }),
    output: (f) =>
      f<X["T"] | null>({
        visitor: (value, ctx) => {
          return value === null ? undefined : ctx.visit({
            value,
            type: Some,
            junctions: {
              type: "Some",
            },
          })
        },
      }),
  })
}
