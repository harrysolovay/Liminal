import { assert } from "@std/assert"
import { declare } from "../declare.ts"
import type { JSONTypeKind } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function array<T, P extends symbol>(
  element: Type<JSONTypeKind, T, P>,
): Type<"array", Array<T>, P> {
  return declare("array", {
    factory: array,
    args: [element],
    assert: (value) => {
      assert(Array.isArray(value))
    },
  })
}
