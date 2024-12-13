import { assert } from "@std/assert"
import { AssertionContext, type Diagnostic } from "../AssertionContext.ts"
import { declare } from "../declare.ts"
import type { AnyType, Type } from "../Type.ts"

export function union<M extends Array<AnyType>>(
  ...members: M
): Type<M[number]["T"], M[number]["P"]> {
  return declare({
    jsonType: "union",
    factory: union,
    args: members,
    assert: (value, ctx) => {
      const queue = [...members]
      let matched = false
      while (queue.length) {
        const current = queue.pop()!
        const exceptions: Array<Diagnostic> = []
        new AssertionContext(ctx.path, exceptions).visit(current, value)
        if (exceptions.length) {
          continue
        }
        matched = true
        break
      }
      assert(matched, `No union member matched.`)
    },
  })
}
