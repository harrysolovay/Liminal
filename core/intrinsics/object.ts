import { assert, assertEquals } from "@std/assert"
import type { AnyType, Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  const keys = Object.keys(fields).toSorted()
  return declare({
    factory: object,
    args: [Object.fromEntries(keys.map((key) => [key, fields[key]]))],
    assert: (value, ctx) => {
      assert(typeof value === "object" && value !== null)
      assertEquals(keys, Object.keys(value).toSorted())
      keys.forEach((key) => {
        ctx.visit(fields[key]!, value[key as never], key)
      })
    },
  })
}
