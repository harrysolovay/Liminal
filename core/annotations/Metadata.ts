import { Param } from "./Param.ts"

export type Metadata = typeof Metadata
export const Metadata: unique symbol = Symbol()

export function MetadataParam<K extends symbol>(key: K): <T>() => Param<typeof Metadata, K, T> {
  return () => Param(Metadata, key)
}
