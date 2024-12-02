import { declareType } from "../declareType.ts"
import type { Type } from "../Type.ts"

export function transform<F, P extends keyof any, T>(
  name: string,
  From: Type<F, P>,
  f: (value: F) => T,
): Type<T, P> {
  return declareType({
    name: "transform",
    source: {
      factory: transform,
      args: [name, From, f],
    },
  })
}
