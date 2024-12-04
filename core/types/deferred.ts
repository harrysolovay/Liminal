import { Type } from "../Type.ts"

export function deferred<T, P extends keyof any>(
  getType: () => Type<T, P>,
): Type<T, P> {
  return Type({
    name: "deferred",
    factory: deferred,
    args: [getType],
    argsLookup: { getType },
  })
}
