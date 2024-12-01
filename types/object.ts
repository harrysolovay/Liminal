import { type AnyType, declareType, type Type } from "../core/mod.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  const entries = Object.entries(fields)
  return declareType({
    name: "object",
    source: {
      factory: object,
      args: [fields],
    },
    visitValue: (value, ctx) => {
      entries.forEach(([key, type]) =>
        ctx.visit(value, type, {
          type: key,
          value: key,
        })
      )
    },
  })
}
