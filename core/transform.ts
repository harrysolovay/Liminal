import type { Type } from "../core/mod.ts"
import { declareType } from "./declareType.ts"

export function transform<F, P extends keyof any, T>(
  name: string,
  from: Type<F, P>,
  f: (value: F) => T,
): Type<T, P> {
  return declareType({
    name: "transform",
    source: {
      factory: transform,
      args: [name, from, f],
    },
    visitValue: (value, visit) => visit(value, from),
    transform: f,
  })
}
