import type { Annotation, DescriptionTemplatePart, ReduceP } from "./Annotation.ts"
import type { AssertionContext } from "./AssertionContext.ts"
import type { JSONType, JSONTypeName } from "./JSONSchema.ts"

export * as Type from "./Type_statics.ts"

export interface Type<T, P extends symbol> {
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

  description(): undefined | string
  signature(): string
  signatureHash(): Promise<string>
  metadata(): Record<symbol, unknown>
  toJSON(): JSONType
  assert(value: unknown): Promise<void>
  deserialize: (jsonText: string) => T
}

export type TypeDeclaration =
  & {
    assert: (value: unknown, assertionContext: AssertionContext) => void
    jsonType: JSONTypeName
  }
  & ({
    getAtom: () => AnyType
    factory?: never
    args?: never
  } | {
    getAtom?: never
    factory: (...args: any) => AnyType
    args: unknown[]
  })

export type AnyType<T = any> = Type<T, symbol>

export type DerivedType<
  T,
  X extends Array<AnyType>,
  P extends symbol = never,
> = [Type<T, P | X[number]["P"]>][0]

export const TypeKey: unique symbol = Symbol()

export function isType(value: unknown): value is AnyType {
  return typeof value === "function" && TypeKey in value
}
