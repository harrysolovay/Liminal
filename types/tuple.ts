import { declare, type Type } from "../core/mod.ts"

export function tuple<E extends Array<Type>>(
  ...elements: E
): Type<{ [K in keyof E]: E[K]["T"] }, {}, E[number]["P"]> {
  const { length } = elements
  return declare({
    name: "tuple",
    source: {
      factory: tuple,
      args: { elements },
    },
    subschema: (visit) => ({
      type: "object",
      properties: Object.fromEntries(Array.from({ length }, (_0, i) => [i, visit(elements[i]!)])),
      required: Array.from({ length }, (_0, i) => i.toString()),
      additionalProperties: false,
    }),
    output: (f) =>
      f<{ [K in keyof E]: unknown }>({
        visitor: (value, ctx) =>
          Array.from({ length }, (_0, i) =>
            ctx.visit({
              value: value[i],
              type: elements[i]!,
              junctions: {
                value: i,
                type: "number",
              },
            })) as never,
      }),
  })
}
