import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

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
        visitor: (value, visit, ctx) =>
          Array.from({ length }, (_0, i) =>
            visit(value[i], elements[i]!, ctx.descend(i, "number"))) as never,
      }),
  })
}
