import type { Type } from "../core/mod.ts"

export interface Tool<T = any> {
  description: string
  type: Type<T, never>
  f: (param: T) => unknown
}

export function Tool<T>(
  description: string,
  type: Type<T, never>,
  f: (param: T) => unknown,
): Tool<T> {
  return { description, type, f }
}
