import { Type } from "../Type.ts"

export function phantom<T>(type: Type<T>, metadata?: unknown): Type<T> {
  return Type({
    kind: "phantom",
    self() {
      return phantom
    },
    args: [type, metadata],
  })
}
