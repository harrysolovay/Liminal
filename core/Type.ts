import type { Annotation } from "./annotations/Annotation.ts"
import type { Param, TemplatePart } from "./annotations/mod.ts"
import type { ReduceDependencies } from "./ReduceDependencies.ts"

export interface Type<T, D extends symbol = never> {
  <A extends Array<TemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, ReduceDependencies<D, A>>

  <A extends Array<Annotation<T>>>(...annotations: A): Type<T, ReduceDependencies<D, A>>

  T: T
  D: D

  [TypeKey]: true
  type: "Type"
  trace: string
  declaration: TypeDeclaration
  annotations: Array<Annotation>

  extract: <K extends symbol, V>(param: Param<K, V>) => Array<V>
}

export type TypeDeclaration = {
  getAtom: () => PartialType
  factory?: never
  args?: never
} | {
  getAtom?: never
  factory: (...args: any) => PartialType
  args: unknown[]
}

export type PartialType<T = any> = Type<T, symbol>

export type DerivedType<
  T,
  X extends Array<PartialType>,
  P extends symbol = never,
> = [Type<T, P | X[number]["D"]>][0]

export const TypeKey: unique symbol = Symbol()
