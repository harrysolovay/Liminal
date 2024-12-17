import type { PartialType } from "../Type.ts"

export interface Param<B extends symbol = symbol, K extends symbol = symbol, T = any> {
  (arg: T): Arg<B, K>
  type: "Param"
  brand: B
  key: K
  unwrap: (type: PartialType) => Array<T>
}

export interface Arg<B extends symbol = symbol, K extends symbol = symbol> {
  type: "Arg"
  brand: B
  key: K
  value: unknown
}

export function Param<B extends symbol, K extends symbol, T>(
  brand: B,
  key: K,
): Param<B, K, T> {
  return Object.assign(
    (value: T): Arg<B, K> => ({
      type: "Arg",
      brand,
      key,
      value,
    }),
    {
      type: "Param" as const,
      brand,
      key,
      unwrap: () => {
        throw 0
      },
    },
  )
}

export type ReduceParam<D extends symbol, A extends Array<unknown>> = A extends
  [infer Part0, ...infer PartRest] ? ReduceParam<
    Part0 extends Param<infer K> ? D | K : Part0 extends Arg<infer K> ? Exclude<D, K> : D,
    PartRest
  >
  : D
