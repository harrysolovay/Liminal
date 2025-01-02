import type { AnyType, Type } from "../Type.ts"
import * as I from "../types/mod.ts"

export function Router<R extends Record<string, AnyType>>(
  routes: R,
): Type<R[keyof R]["T"], R[keyof R]["E"]> {
  return I.thread(function*() {
    const key = yield* I.enum(...Object.keys(routes) as Array<Extract<keyof R, string>>)
    return yield* routes[key]!
  }, I.union(...Object.values(routes)))`Match the appropriate route.`
}
