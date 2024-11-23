import { RootTy } from "./RootTy.ts"
import type { Ty } from "./Ty.ts"

export type struct<F extends StructFields = StructFields> = ReturnType<typeof struct<F>>

export function struct<F extends StructFields>(fields: F): RootTy<
  { [K in keyof F]: F[K][Ty.T] },
  F[keyof F][Ty.P]
> {
  return RootTy((description, ref) => ({
    type: "object",
    description,
    properties: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, ref(v)])),
    additionalProperties: false,
    required: Object.keys(fields),
  }))
}

export type StructFields = Record<string, Ty>
