import { declare, type Type } from "../core/mod.ts"

export function object<F extends Record<string, Type>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, {}, F[keyof F]["P"]> {
  const keys = Object.keys(fields)
  return declare({
    name: "object",
    source: {
      factory: object,
      args: { fields },
    },
    subschema: (visit) => ({
      type: "object",
      properties: Object.fromEntries(keys.map((k) => [k, visit(fields[k]!)])),
      additionalProperties: false,
      required: keys,
    }),
    output: (f) =>
      f<{ [K in keyof F]: unknown }>({
        visitor: (value, ctx) =>
          Object.fromEntries(
            keys.map((k) => [
              k,
              ctx.visit({
                value: value[k],
                type: fields[k]!,
                junctions: {
                  type: k,
                  value: k,
                },
              }),
            ]),
          ) as never,
      }),
  })
}
