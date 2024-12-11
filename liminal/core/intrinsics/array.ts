import { assert } from "@std/assert"
import { declare } from "../declare.ts"
import type { JSONTypeName } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function array<T, P extends symbol>(
  type: Type<JSONTypeName, T, P>,
): Type<"array", Array<T>, P> {
  return declare("array", {
    factory: array,
    args: [type],
    assert: (value) => {
      assert(Array.isArray(value))
    },
  })
}
