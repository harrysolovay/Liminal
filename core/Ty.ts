import type { Ref } from "./Ref.ts"
import { phantoms } from "../util/phantoms.ts"

export function Ty<T, P extends string = never>(
  toSchema: ToSchema,
  descriptions: Array<Description> = [],
  applied: Applied = {},
): Ty<T, P> {
  return Object.assign(
    <P2 extends Array<string>>(template: TemplateStringsArray, ...placeheld: P2) =>
      Ty<T, P | P2[number]>(toSchema, [{ template, placeheld }, ...descriptions], applied),
    phantoms<{ [Ty.T]: T; [Ty.P]: P }>(),
    {
      toSchema,
      descriptions,
      applied,
      apply: <A extends Partial<Record<P, string | number>>>(values: A) => {
        return Ty<T, Exclude<P, keyof A>>(toSchema, descriptions, { ...applied, ...values })
      },
    },
  )
}

export interface Ty<T = any, P extends string = string> {
  <P2 extends Array<string>>(
    template: TemplateStringsArray,
    ...placeheld: P2
  ): Ty<T, P | P2[number]>
  [Ty.T]: T
  [Ty.P]: P
  toSchema: ToSchema
  descriptions: Array<Description>
  applied: Applied
  apply: <A extends Partial<Record<P, number | string>>>(values: A) => Ty<T, Exclude<P, keyof A>>
}

export namespace Ty {
  export type T = typeof T
  export declare const T: unique symbol
  export type P = typeof P
  export declare const P: unique symbol
}

export type ToSchema = (description: string | undefined, ref: Ref) => Schema
export type Schema = Record<string, unknown>

export interface Description {
  template: TemplateStringsArray
  placeheld: Array<string>
}

export type Applied = Record<string, number | string>
