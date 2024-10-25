import { make, type Ty } from "./_base.ts"

export function object<F extends ObjectTyFields>(description: string | undefined, fields: F): ObjectTy<F> {
  return make((ctx) => ({
    type: "object",
    description,
    properties: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, ctx.ref(v)])),
    additionalProperties: false,
    required: Object.keys(fields),
  }))
}

export type ObjectTyFields = Record<string, Ty>

export type ObjectTy<F extends ObjectTyFields = any> = Ty<
  { [K in keyof F]: F[K] extends Ty ? InstanceType<F[K]> : F[K] }
>
