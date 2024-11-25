import { phantoms } from "../util/phantoms.ts"
import type { Ref } from "./Ref.ts"
import type { RootTy } from "./RootTy.ts"

export function Ty<T, P extends string = never>(
  toSchema: ToSchema,
  descriptions: Array<Description> = [],
  applied: Applied = {},
): Ty<T, P> {
  return Object.assign(
    <P2 extends Array<string>>(template: TemplateStringsArray, ...placeheld: P2) =>
      Ty<T, P | P2[number]>(toSchema, [{ template, placeheld }, ...descriptions], applied),
    phantoms<{ T: T; P: P }>(),
    {
      "": {
        toSchema,
        descriptions,
        applied,
      },
      fill: <A extends Partial<Record<P, string | number>>>(values: A) => {
        return Ty<T, Exclude<P, keyof A>>(toSchema, descriptions, { ...applied, ...values })
      },
      isRoot(): this is RootTy {
        return false
      },
    },
  )
}

export interface Ty<T = any, P extends string = string> {
  <P2 extends Array<string>>(
    template: TemplateStringsArray,
    ...placeheld: P2
  ): Ty<T, P | P2[number]>
  T: T
  P: P
  "": {
    toSchema: ToSchema
    descriptions: Array<Description>
    applied: Applied
  }
  fill: <A extends Partial<Record<P, number | string>>>(values: A) => Ty<T, Exclude<P, keyof A>>
  isRoot(): this is RootTy
}

export type ToSchema = (description: string | undefined, ref: Ref) => Schema
export type Schema = Record<string, unknown>

export interface Description {
  template: TemplateStringsArray
  placeheld: Array<string>
}

export type Applied = Record<string, number | string>
