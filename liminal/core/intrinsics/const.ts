import type { JSONTypeName } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export { const_ as const }
function const_<K extends JSONTypeName, T, P extends symbol, const A extends T>(
  type: Type<K, T, P>,
  value: A,
): Type<K, A, P> {
  throw 0
}
Object.defineProperty(const_, "name", { value: "const" })
