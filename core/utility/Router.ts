import * as I from "../intrinsics/mod.ts"
import type { AnyType, Type } from "../Type.ts"

export function Router<R extends Record<string, AnyType>>(
  routes: R,
): Type<R[keyof R]["T"], R[keyof R]["E"]> {
  return I.thread(function*() {
    const key = yield* I.enum(...Object.keys(routes) as Array<Extract<keyof R, string>>)
    return yield* routes[key]!
  }, I.union(...Object.values(routes)))`Match the appropriate route.`
}
