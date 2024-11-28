import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import type { Expand } from "../util/type_util.ts"

export function object<F extends Record<string, Type>>(
  fields: F,
): Type<Expand<NativeObject<F>>, {}, F[keyof F]["P"]> {
  const keys = Object.keys(fields)
  return declare<NativeObject<F>>()({
    name: "object",
    source: {
      factory: object,
      args: { fields },
    },
    subschema: (ref) => ({
      type: "object",
      properties: Object.fromEntries(keys.map((k) => [k, ref(fields[k]!)])),
      additionalProperties: false,
      required: keys,
    }),
    transform: (value, visit) =>
      Object.fromEntries(keys.map((k) => [k, visit(value[k]!, fields[k]!, k)])) as never,
    assertRefinementsValid: () => {},
    assertRefinements: {},
  })
}

export type NativeObject<F extends Record<string, Type>> = { [K in keyof F]: F[K]["T"] }