import { phantoms } from "../util/phantoms.ts"
import type { Ref } from "./Ref.ts"
import type { RootTy } from "./RootTy.ts"

export function Ty<T, P extends keyof any = never>(
  toSchema: ToSchema,
  context: Array<Context> = [],
  applied: Applied = {},
): Ty<T, P> {
  return Object.assign(
    <P2 extends Array<keyof any>>(template: TemplateStringsArray, ...placeheld: P2) =>
      Ty<T, P | P2[number]>(toSchema, [{ template, placeheld }, ...context], applied),
    phantoms<{ T: T; P: P }>(),
    {
      "": { toSchema, context, applied },
      fill: <A extends Partial<Record<P, string | number>>>(values: A) => {
        return Ty<T, Exclude<P, keyof A>>(toSchema, context, { ...applied, ...values })
      },
      isRoot(): this is RootTy {
        return false
      },
    },
  )
}

export interface Ty<T = any, P extends keyof any = keyof any> {
  <P2 extends Array<keyof any>>(
    template: TemplateStringsArray,
    ...placeheld: P2
  ): Ty<T, P | P2[number]>
  T: T
  P: P
  "": {
    toSchema: ToSchema
    context: Array<Context>
    applied: Applied
  }
  fill: <A extends Partial<Record<P, number | string>>>(values: A) => Ty<T, Exclude<P, keyof A>>
  isRoot(): this is RootTy
}

export type ToSchema = (ref: Ref) => Schema
export type Schema = Record<string, unknown>

export interface Context {
  template: TemplateStringsArray
  placeheld: Array<keyof any>
}

export type Applied = Record<keyof any, number | string>
