import type { Annotation, ReduceP } from "./Annotation.ts"
import type { DescriptionTemplatePart } from "./annotations/mod.ts"

export interface Type<T, P extends symbol = never> {
  <A extends Array<DescriptionTemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, ReduceP<P, A>>

  <A extends Array<Annotation<T>>>(...annotations: A): Type<T, ReduceP<P, A>>

  T: T
  P: P

  type: "Type"
  trace: string
  declaration: TypeDeclaration
  annotations: Array<Annotation>
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
> = [Type<T, P | X[number]["P"]>][0]

export const TypeKey: unique symbol = Symbol()
