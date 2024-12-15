import type { Annotation, DescriptionTemplatePart, MetadataHandle, ReduceP } from "./Annotation.ts"
import type { AssertionContext } from "./AssertionContext.ts"
import type { JSONType, JSONTypeName } from "./JSONSchema.ts"

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
  metadata<T>(handle: MetadataHandle<T>): Array<T>
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

export function isType<T>(
  value: unknown,
  ...intrinsics: Array<AnyType<T> | ((...args: any) => AnyType<T>)>
): value is AnyType<T> {
  if (typeof value === "function" && TypeKey in value) {
    if (intrinsics.length) {
      const { declaration } = value as never as AnyType
      for (const intrinsic of intrinsics) {
        const matched = isType(intrinsic)
          ? declaration.getAtom?.() === intrinsic
          : declaration.factory === intrinsic
        if (matched) {
          return true
        }
      }
    } else {
      return true
    }
  }
  return false
}
