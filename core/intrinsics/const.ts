import { assertEquals } from "@std/assert"
import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export { const_ as const }
function const_<T, P extends symbol, const A extends T>(
  type: Type<T, P>,
  value: A,
): Type<A, P> {
  return declare({
    factory: const_,
    args: [type, value],
    assert: (value_) => {
      assertEquals(value_, value)
    },
  })
}
Object.defineProperty(const_, "name", { value: "const" })
