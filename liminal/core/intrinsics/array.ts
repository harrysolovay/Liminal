import { assert } from "@std/assert"
import { declare } from "../declare.ts"
import type { JSONTypeName } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function array<T, P extends symbol>(
  element: Type<JSONTypeName, T, P>,
): Type<"array", Array<T>, P> {
  return declare("array", {
    factory: array,
    args: [element],
    assert: (value, ctx) => {
      assert(Array.isArray(value))
      value.forEach((value, i) => {
        ctx.visit(element, value, i)
      })
    },
  })
}
