import * as I from "../intrinsics.ts"
import type { Type } from "../Type.ts"

export { Set_ as Set }
function Set_<T extends number | string, E, P extends symbol>(
  element: Type<T, E, P>,
): Type<Set<T>, E, P> {
  return I.f("Set", I.array(element), (value) => new Set(value))
}
Object.defineProperty(Set_, "name", { value: "Set" })
