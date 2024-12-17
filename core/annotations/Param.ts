import type { PartialType } from "../Type.ts"

export interface Param<B extends symbol = symbol, K extends symbol = symbol, T = any> {
  (arg: T): Arg<B, K>
  type: "Param"
  brand: B
  key: K
  from: (type: PartialType) => Array<T>
}

export interface Arg<B extends symbol = symbol, K extends symbol = symbol> {
  type: "Arg"
  brand: B
  key: K
  value: unknown
}

export function Param<B extends symbol, K extends symbol, T, U = T>(
  brand: B,
  key: K,
  f?: (value: T) => U,
): Param<B, K, T> {
  return Object.assign(
    (value: T): Arg<B, K> => ({
      type: "Arg",
      brand,
      key,
      value: f?.(value) ?? value,
    }),
    {
      type: "Param" as const,
      brand,
      key,
      from: () => {
        throw 0
      },
    },
  )
}
