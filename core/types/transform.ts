import { Type } from "../Type.ts"

export function transform<F, P extends keyof any, T>(
  name: string,
  from: Type<F, P>,
  f: (value: F) => T,
): Type<T, P> {
  return Type({
    kind: "transform",
    factory: transform,
    args: [name, from, f],
    argsLookup: { name, from, f },
  })
}
