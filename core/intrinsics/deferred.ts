import { declareType } from "../declareType.ts"
import type { AnyType } from "../Type.ts"

export function deferred<X extends AnyType>(get: () => X): X {
  return declareType({
    type: "deferred",
    self() {
      return deferred
    },
    args: [get],
  }) as never
}
