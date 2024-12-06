import { Type } from "../Type.ts"

export function deferred<T, P extends keyof any>(
  getType: () => Type<T, P>,
): Type<T, P> {
  return Type({
    kind: "deferred",
    factory: deferred,
    args: [getType],
    argsLookup: { getType },
  })
}
