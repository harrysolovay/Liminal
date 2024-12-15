import "./intrinsics/mod.ts"

import type { PromiseOr } from "../util/mod.ts"
import type { Assertion, DescriptionArg, DescriptionParam, MetadataHandle } from "./Annotation.ts"

export * from "./intrinsics/mod.ts"
export * from "./utility/mod.ts"

export function _<K extends symbol, T = string>(
  key: K,
  serializer?: (value: T) => string,
): DescriptionParam<K, T> {
  return Object.assign(
    (value: T): DescriptionArg<K, T> => ({
      type: "DescriptionArg",
      key,
      value,
      serializer,
    }),
    {
      type: "DescriptionParam" as const,
      key,
    },
  )
}

export function assert<T, A extends unknown[]>(
  description: string | ((...args: A) => string),
  f?: (value: T, ...args: A) => PromiseOr<void>,
): (...args: A) => Assertion<T, A> {
  return (...args) => ({
    type: "Assertion",
    description,
    f,
    args,
  })
}

export function metadata<T = undefined>(key: symbol): MetadataHandle<T> {
  return Object.assign(
    (value: T) => ({
      type: "Metadata",
      key,
      value,
    }),
    { key },
  ) as never
}
