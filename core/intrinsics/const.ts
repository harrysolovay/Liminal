import { Rune } from "../Rune.ts"
import { consumeType } from "./_common.ts"

function const_<T, const V extends T, E>(
  rune: Rune<T, E>,
  value: V,
): Rune<V, never> {
  return Rune({
    kind: "const",
    self: () => const_,
    args: [rune, value],
    phantom: true,
    consume: consumeType,
  })
}
Object.defineProperty(const_, "name", { value: "const" })
export { const_ as const }
