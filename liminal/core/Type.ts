import type { Annotation, DescriptionTemplatePart, ReduceP } from "./Annotation.ts"
import type { JSONTypes } from "./JSONSchema.ts"
import type { Diagnostic } from "./utility/Diagnostic.ts"

export interface Type<K extends keyof JSONTypes, T, P extends symbol> {
  <A extends Array<DescriptionTemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<K, T, ReduceP<P, A>>

  <A extends Array<Annotation>>(...annotations: A): Type<K, T, ReduceP<P, A>>

  T: T
  P: P

  kind: K
  declaration: TypeDeclaration<T>
  annotations: Array<Annotation>

  signature(): string
  description(this: Type<K, T, never>): string
  metadata(): Record<symbol, unknown>
  toJSON(this: Type<K, T, never>): JSONTypes[K]
  assert: (value: unknown) => asserts value is T
  deserializeValue(raw: unknown, diagnostics?: Array<Diagnostic>): Promise<T>
}

export type TypeDeclaration<T> =
  & {
    assert?: (value: unknown) => asserts value is T
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

export type AnyType = Type<keyof JSONTypes, any, symbol>
