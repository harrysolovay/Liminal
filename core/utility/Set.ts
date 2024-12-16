import * as I from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"

export { Set_ as Set }
function Set_<T extends number | string, P extends symbol>(element: Type<T, P>): Type<Set<T>, P> {
  return I.transform(I.array(element), (value) => new Set(value))
}
Object.defineProperty(Set_, "name", { value: "Set" })
