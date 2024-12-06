import { type AnyType, Type } from "../Type.ts"

export function object<F extends Record<number | string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  return Type({
    kind: "object",
    factory: object,
    args: [fields],
    argsLookup: { fields },
  })
}
