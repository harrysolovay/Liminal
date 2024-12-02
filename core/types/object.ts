import { type AnyType, Type } from "../Type.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  return Type({
    name: "object",
    source: {
      factory: object,
      args: [fields],
    },
  })
}
