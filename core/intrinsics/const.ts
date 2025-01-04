import { declareType } from "../declareType.ts"
import type { Type } from "../Type.ts"

export { const_ as const }
function const_<T, E, const A extends T>(
  type: Type<T, E>,
  value: A,
): Type<A, E> {
  return declareType({
    type: "const",
    self() {
      return const_
    },
    args: [type, value],
  })
}
Object.defineProperty(const_, "name", { value: "const" })
