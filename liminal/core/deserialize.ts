import type { Type } from "./Type.ts"

export function deserialize<T>(this: Type<T, never>, value: unknown): Promise<T> {
  return value as never
}
