import { assert, assertArrayIncludes } from "@std/assert"
import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return declare({
    factory: enum_,
    args: values.toSorted(),
    assert: (value) => {
      assert(typeof value === "string")
      assertArrayIncludes(values, [value])
    },
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })
