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
      const match = union.match(members, value)
      assert(match !== undefined)
      ctx.visit(match, value)
    },
  })
}

export namespace union {
  export function match<M extends Array<AnyType>>(
    members: M,
    value: unknown,
  ): M[number] | undefined {
    const queue = [...members]
    while (queue.length) {
      const current = queue.pop()!
      const exceptions: Array<Diagnostic> = []
      new AssertionContext("", exceptions).visit(current, value)
      if (exceptions.length) {
        continue
      }
      return current
    }
  }
}
