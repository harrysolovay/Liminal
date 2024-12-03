import { Type } from "../../core/mod.ts"

export function transform<F, P extends keyof any, T>(
  name: string,
  From: Type<F, P>,
  f: (value: F) => T,
): Type<T, P> {
  return Type({
    factory: transform,
    args: [name, From, f],
  })
}
