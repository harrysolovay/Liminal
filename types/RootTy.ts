import { phantoms } from "../util/phantoms.ts"
import { Ref } from "./Ref.ts"
import type { Applied, Description, Schema, ToSchema, Ty } from "./Ty.ts"

export function RootTy<T, P extends string = never>(
  toSchema: ToSchema,
  descriptions: Array<Description> = [],
  applied: Applied = {},
): RootTy<T, P> {
  return Object.assign(
    <P2 extends Array<string>>(template: TemplateStringsArray, ...placeheld: P2) =>
      RootTy<T, P | P2[number]>(toSchema, [{ template, placeheld }, ...descriptions], applied),
    phantoms<{ T: T; P: P }>(),
    {
      toSchema,
      descriptions,
      applied,
      apply: <A extends Partial<Record<P, string | number>>>(values: A) => {
        return RootTy<T, Exclude<P, keyof A>>(toSchema, descriptions, { ...applied, ...values })
      },
      schema(this: RootTy<T, never>) {
        return Ref({})(this)
      },
      isRoot(): this is RootTy {
        return true
      },
    },
  )
}

export interface RootTy<T = any, P extends string = string> extends Ty<T, P> {
  <P2 extends Array<string>>(
    template: TemplateStringsArray,
    ...placeheld: P2
  ): RootTy<T, P | P2[number]>
  apply: <A extends Partial<Record<P, number | string>>>(
    values: A,
  ) => RootTy<T, Exclude<P, keyof A>>
  schema(this: RootTy<T, never>): Schema
}
