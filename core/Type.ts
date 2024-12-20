import type { Annotation, Param, TemplatePart } from "./annotations/mod.ts"
import type { JSONType } from "./JSONSchema.ts"
import type { ReduceDependencies } from "./ReduceDependencies.ts"

export interface Type<T, D extends symbol = never> {
  <A extends Array<Annotation<T>>>(
    ...annotations: A | Array<Annotation<T>> & { length: never }
  ): Type<T, ReduceDependencies<D, A>>

  <A extends Array<TemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, ReduceDependencies<D, A>>

  T: T
  D: D

  [TypeKey]: true
  type: "Type"

  trace: string
  declaration: TypeDeclaration
  annotations: Array<Annotation>

  display: () => string
  extract: <K extends symbol, V>(param: Param<K, V>) => Array<V>
  description: () => string | undefined
  signature: () => string
  signatureHash: () => Promise<string>
  toJSON: () => JSONType
  deserialize: (jsonText: string) => T
  assert: (value: unknown) => Promise<void>
}

export type TypeDeclaration = {
  getAtom: () => PartialType
  factory?: never
  args?: never
} | {
  getAtom?: never
  factory: (...args: any) => PartialType
  args: Array<unknown>
}

export type PartialType<T = any> = Type<T, symbol>

export type DerivedType<
  T,
  X extends Array<PartialType>,
  P extends symbol = never,
> = [Type<T, P | X[number]["D"]>][0]

export const TypeKey: unique symbol = Symbol()
