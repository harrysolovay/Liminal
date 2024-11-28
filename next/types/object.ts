import { assert } from "../../util/assert.ts"
import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

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
    subschema: (ref) => ({
      type: "object",
      properties: Object.fromEntries(keys.map((k) => [k, ref(fields[k]!)])),
      additionalProperties: false,
      required: keys,
    }),
    assert: (value, ctx) => {
      assert(typeof value === "object" && value !== null)
      keys.forEach((k) => ctx.subassert(fields[k]!, value, k))
    },
    transform: (value) =>
      Object.fromEntries(
        keys.map((k) => [k, fields[k]!.declaration.transform(value[k])]),
      ) as never,
    assertRefinementsValid: () => {},
    assertRefinements: {},
  })
}
