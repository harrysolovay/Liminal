import { assert, assertArrayIncludes } from "@std/assert"
import { declare } from "../declare.ts"
import type { Type } from "../Type.ts"

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<"string", V[number], never> {
  return declare("string", {
    factory: enum_,
    args: values,
    assert: (value) => {
      assert(typeof value === "string")
      assertArrayIncludes(values, [value])
    },
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })
