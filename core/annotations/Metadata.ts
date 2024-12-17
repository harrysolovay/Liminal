import type { Type } from "../Type.ts"

export interface Metadata<V = any> {
  type: "Metadata"
  key: symbol
  value: V
}

export interface MetadataHandle<V> {
  (value: V): Metadata<V>
  key: symbol
}

export function Metadata<V>(key: symbol): MetadataHandle<V> {
  return Object.assign(
    (value: V) => ({
      type: "Metadata",
      key,
      value,
    }),
    { key },
  ) as never
}

export function reduceMetadata<V>(type: Type<unknown>, handle: MetadataHandle<V>): Array<V> {
  return type.annotations.reduce<Array<V>>((acc, cur) => [
    ...acc,
    ...typeof cur === "object" && cur?.type === "Metadata" && cur.key === handle.key
      ? [cur.value]
      : [],
  ], [])
}
