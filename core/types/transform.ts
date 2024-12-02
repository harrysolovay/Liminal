import { Type } from "../Type.ts"

export function transform<F, P extends keyof any, T>(
  name: string,
  From: Type<F, P>,
  f: (value: F) => T,
): Type<T, P> {
  return Type({
    name: "transform",
    source: {
      factory: transform,
      args: [name, From, f],
    },
  })
}
