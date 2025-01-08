import { phantom } from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"

export const ConstKey: unique symbol = Symbol("ConstKey")

export { const_ as const }
function const_<T, const A extends T, E>(valueType: Type<T, E>, value: A): Type<A, E> {
  return phantom(valueType as Type<A, E>, { [ConstKey]: value })
}
Object.defineProperty(const_, "name", { value: "const" })
