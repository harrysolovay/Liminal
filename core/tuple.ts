import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import type { Expand } from "../util/type_util.ts"

export function tuple<E extends Array<Type>>(
  ...elements: E
): Type<Expand<NativeTuple<E>>, {}, E[number]["P"]> {
  const { length } = elements
  const required = Array.from({ length }, (_0, i) => i.toString())
  return declare<NativeTuple<E>>()({
    name: "tuple",
    source: {
      factory: tuple,
      args: { elements },
    },
    subschema: (visit) => ({
      type: "object",
      properties: Object.fromEntries(
        Array.from({ length }, (_0, i) => [i, visit(elements[i]!)]),
      ),
      required,
      additionalProperties: false,
    }),
    process: (value, visit) =>
      Array.from(
        { length },
        (_0, i) => visit(value[i]!, elements[i]!, i),
      ) as never,
  })
}

export type NativeTuple<E extends Array<Type>> = { [K in keyof E]: E[K]["T"] }
