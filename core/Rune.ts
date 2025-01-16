export interface Rune<K extends string = string, T = any> {
  T: T

  kind: K
  self: () => Rune | ((...args: any) => Rune)
  args?: Array<unknown>

  [Symbol.iterator](): Iterator<this, T>
}
