import type { Diagnostic } from "./Diagnostic.ts"
import type { JSONTypes } from "./JSONSchema.ts"

export * as Type from "./Type_statics.ts"

export interface Type<K extends keyof JSONTypes, T, P extends symbol> {
  T: T
  P: P
  type: K
  toJSON: () => JSONTypes[K]
  signature: () => string
  deserializeValue: (
    value: unknown,
    diagnostics: Array<Diagnostic>,
  ) => Promise<T>
}

export type AnyType<T = any> = Type<keyof JSONTypes, T, symbol>
