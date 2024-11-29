import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import type { Expand } from "../util/type_util.ts"

export function object<F extends Record<string, Type>>(
  fields: F,
): Type<Expand<NativeObject<F>>, {}, F[keyof F]["P"]> {
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
      f<NativeObject<F>>({
        visitor: (value, visit, path) =>
          Object.fromEntries(
            keys.map((k) => [k, visit(value[k], fields[k]!, path.type(k).value(k))]),
          ) as never,
      }),
  })
}

export type NativeObject<F extends Record<string, Type>> = { [K in keyof F]: F[K]["T"] }
