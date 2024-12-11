import type { AnyType } from "./Type.ts"

export function assert<T>(this: AnyType<T>, value: unknown): asserts value is T {
  throw 0
}
