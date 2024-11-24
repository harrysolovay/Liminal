import { RootTy } from "./RootTy.ts"
import type { Ty } from "./Ty.ts"

export function object<F extends Record<string, Ty>>(
  fields: F,
): RootTy<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  return RootTy((description, ref) => ({
    type: "object",
    description,
    properties: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, ref(v)])),
    additionalProperties: false,
    required: Object.keys(fields),
  }))
}
