import type { AnyType } from "./Type.ts"

export type TypeMemo<T> = (type: AnyType) => T

export function TypeMemo<T>(f: (type: AnyType) => T): TypeMemo<T> {
  const cache = new WeakMap<AnyType, T>()
  return (type) => {
    if (cache.has(type)) {
      return cache.get(type)!
    }
    const value = f(type)
    cache.set(type, value)
    return value
  }
}
