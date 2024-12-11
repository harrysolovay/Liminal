import { assert } from "../assert.ts"
import { declare } from "../declare.ts"
import type { AnyType, Type } from "../Type.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<"object", { [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  const keys = Object.keys(fields)
  keys.sort()
  return declare("object", {
    factory: object,
    args: [Object.fromEntries(keys.map((key) => [key, fields[key]]))],
    assert: (value) => {
      assert(typeof value === "object" && value !== null)
      for (const key of keys) {
        assert(key in (value as never))
      }
    },
  })
}
