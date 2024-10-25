import type { Ty } from "./_base.ts"
import type { ObjectTy } from "./object.ts"

export type ValidRootKey<M extends Record<string, Ty>> = keyof {
  [K in keyof M as (M[K] extends ObjectTy<any> ? K : never)]: never
}
