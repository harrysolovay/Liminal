import { assert } from "@std/assert"
import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function array<T, P extends symbol>(element: Type<T, P>): Type<Array<T>, P> {
  return declare({
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
