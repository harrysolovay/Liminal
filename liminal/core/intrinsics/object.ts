import type { AnyType, Type } from "../Type.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<"object", { [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  throw 0
}
