import "./intrinsics/mod.ts"

import type { PromiseOr } from "../util/mod.ts"
import type { Assertion, DescriptionArg, DescriptionParam, MetadataHandle } from "./Annotation.ts"

export * from "./intrinsics/mod.ts"
export * from "./meta/mod.ts"
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

export function assert<T>(
  description: string,
  f?: (value: T) => PromiseOr<void>,
): Assertion<T, []>
export function assert<T, A extends unknown[]>(
  description: (...args: A) => string,
  f?: (value: T, ...args: A) => PromiseOr<void>,
  ...args: A
): Assertion<T, A>
export function assert<T, A extends unknown[]>(
  description: (...args: A) => string,
  f?: (value: T, ...args: A) => PromiseOr<void>,
): (...args: A) => Assertion<T, A>
export function assert<T>(
  description: string | ((...args: unknown[]) => string),
  f?: (value: T, ...args: unknown[]) => PromiseOr<void>,
  ...args: unknown[]
): Assertion<T> | ((...args: unknown[]) => Assertion<T>) {
  if (typeof description === "string") {
    return {
      type: "Assertion",
      description,
      f,
    }
  }
  if (args.length) {
    return {
      type: "Assertion",
      description,
      f,
      args,
    }
  }
  return (...args) => ({
    type: "Assertion",
    description,
    f,
    args,
  })
}

export function metadata<V>(key: symbol): MetadataHandle<V> {
  return Object.assign(
    (value: V) => ({
      type: "Metadata",
      key,
      value,
    }),
    { key },
  ) as never
}
