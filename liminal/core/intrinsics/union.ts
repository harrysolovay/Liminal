import { assert } from "@std/assert"
import { AssertionContext } from "../AssertionContext.ts"
import { declare } from "../declare.ts"
import type { AnyType, Type } from "../Type.ts"

export function union<M extends Array<AnyType>>(
  ...members: M
): Type<"union", M[number]["T"], M[number]["P"]> {
  return declare("union", {
    factory: union,
    args: members,
    assert: (value, ctx) => {
      const queue = [...members]
      let matched = false
      while (queue.length) {
        const current = queue.pop()!
        const exceptions: Array<unknown> = []
        new AssertionContext(exceptions, ctx.path).visit(current, value)
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
