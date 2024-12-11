import type { Annotation } from "./Annotation.ts"
import type { Diagnostic } from "./Diagnostic.ts"
import type { JSONTypes } from "./JSONSchema.ts"

export * as Type from "./Type_statics.ts"

export interface Type<K extends keyof JSONTypes, T, P extends symbol> {
  T: T
  P: P

  type: K
  declaration: TypeDeclaration
  annotations: Array<Annotation>

  toJSON: () => JSONTypes[K]
  signature: () => string
  assert: (value: unknown) => asserts value is T
  deserializeValue: (value: unknown, diagnostics?: Array<Diagnostic>) => Promise<T>
}

export type AnyType<T = any> = Type<keyof JSONTypes, T, symbol>

export type TypeDeclaration = {
  getAtom: () => AnyType
  factory?: never
  args?: never
} | {
  getAtom?: never
  factory: (...args: any) => AnyType
  args: unknown[]
}
