import type { Annotation, DescriptionTemplatePart, ReduceP } from "./Annotation.ts"
import type { AssertionContext } from "./AssertionContext.ts"
import type { DescriptionContext } from "./description.ts"
import type { Diagnostic } from "./Diagnostic.ts"
import type { JSONTypeKind, JSONTypes } from "./JSONSchema.ts"

export interface Type<K extends JSONTypeKind, T, P extends symbol> {
  <A extends Array<DescriptionTemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<K, T, ReduceP<P, A>>

  <A extends Array<Annotation>>(...annotations: A): Type<K, T, ReduceP<P, A>>

  T: T
  P: P

  type: "Type"
  jsonType: K
  trace: string
  declaration: TypeDeclaration
  annotations: Array<Annotation>

  signature(): string
  description(this: Type<K, T, never>, ctx: DescriptionContext): string
  metadata(): Record<symbol, unknown>
  toJSON(): JSONTypes[K]
  assert(value: unknown): Promise<void>
  deserialize(raw: unknown, diagnostics?: Array<Diagnostic>): Promise<T>
}

export type TypeDeclaration =
  & {
    assert: (value: unknown, assertionContext: AssertionContext) => void
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
