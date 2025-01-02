import { type AnyType, Type } from "../Type.ts"

export function deferred<X extends AnyType>(get: () => X): X {
  return Type({
    type: "deferred",
    self() {
      return deferred
    },
    args: [get],
  }) as never
}
