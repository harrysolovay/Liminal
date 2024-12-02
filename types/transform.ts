import { declareType, type Type } from "../core/mod.ts"

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
    visitValue: (value, visit) => visit(value, From, (setParent) => setParent) as never,
    transform: f,
  })
}
