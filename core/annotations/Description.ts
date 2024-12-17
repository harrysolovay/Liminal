import { Param } from "./Param.ts"

export type Description = typeof Description
export const Description: unique symbol = Symbol()

export function DescriptionParam<K extends symbol>(key: K): Param<typeof Description, K, string> {
  return Param(Description, key)
}
