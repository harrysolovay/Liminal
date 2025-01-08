import { Type } from "../Type.ts"

export function phantom<T>(type: Type<T>, metadata?: Record<keyof any, unknown>): Type<T, never> {
  return Type({
    kind: "phantom",
    self() {
      return phantom
    },
    args: [type, metadata],
  })
}
