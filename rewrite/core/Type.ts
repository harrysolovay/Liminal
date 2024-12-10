import type { JSONTypes } from "./JSON/mod.ts"

export interface Type<K extends keyof JSONTypes, T, P extends symbol> {
  type: K
  T: T
  P: P
  toJSON: () => JSONTypes[K]
}

export type AnyType<T = any> = Type<keyof JSONTypes, T, symbol>
