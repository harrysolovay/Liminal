import { phantom } from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"

export const ConstKey: unique symbol = Symbol()

export { const_ as const }
function const_<T, const A extends T>(valueType: Type<T>, value: A): Type<A> {
  return phantom(valueType as Type<A>, { [ConstKey]: value })
}
Object.defineProperty(const_, "name", { value: "const" })
