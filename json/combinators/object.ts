import { type AnyType, Type } from "../../core/mod.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  return Type({
    factory: object,
    args: [fields],
  })
}
