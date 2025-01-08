import type { Rune } from "../Rune.ts"
import { Type } from "../Type.ts"

function const_<T, const V extends T, E>(
  rune: Rune<T, E>,
  value: V,
): Rune<V, never> {
  return Type("const", () => const_, [rune, value])
}
Object.defineProperty(const_, "name", { value: "const" })
export { const_ as const }
