import { assertEquals } from "@std/assert"
import { declare } from "../declare.ts"
import type { Type } from "../Type.ts"

export { const_ as const }
function const_<T, P extends symbol, const A extends T>(
  type: Type<T, P>,
  value: A,
): Type<A, P> {
  return declare(type.jsonTypeName, {
    factory: const_,
    args: [type, value],
    assert: (value_) => {
      assertEquals(value_, value)
    },
  })
}
Object.defineProperty(const_, "name", { value: "const" })
