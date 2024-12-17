import { Param } from "./Param.ts"

export type Description = typeof Description
export const Description: unique symbol = Symbol()

export function DescriptionParam<K extends symbol, T = string>(
  key: K,
  serialize?: (value: T) => string,
): Param<typeof Description, K, T> {
  return Param(Description, key, serialize)
}
