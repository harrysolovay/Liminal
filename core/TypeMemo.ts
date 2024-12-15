import type { AnyType } from "./Type.ts"

export class TypeMemo<T> {
  #cache = new WeakMap<AnyType, T>()
  constructor(private f: (type: AnyType) => T) {}

  getOrInit = (type: AnyType) => {
    if (this.#cache.has(type)) {
      return this.#cache.get(type)!
    }
    const value = this.f(type)
    this.#cache.set(type, value)
    return value
  }
}
