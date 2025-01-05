import type { Expand } from "../util/mod.ts"
import type * as I from "./intrinsics/mod.ts"
import type { AnyType } from "./Type.ts"

type I = typeof I

export type VisitorArms<V, R> = Expand<
  & {
    hook?: (
      next: (value: V, type: AnyType) => R,
      value: V,
      type: AnyType,
    ) => R
  }
  & (
    | ({ fallback?: never } & IntrinsicVisitorArms<V, R>)
    | (
      & { fallback: (value: V, type: AnyType, ...args: Array<unknown>) => R }
      & Partial<IntrinsicVisitorArms<V, R>>
    )
  )
>

export type IntrinsicVisitorArms<V, R> = {
  [K in keyof I]: (
    value: V,
    ...rest: I[K] extends AnyType ? [type: I[K]]
      : [type: ReturnType<I[K]>, ...args: Parameters<I[K]>]
  ) => R
}

export function Visitor<V, R>(arms: VisitorArms<V, R>): (value: V, type: AnyType) => R {
  const { hook } = arms
  if (hook) {
    return (value, type) => hook(next, value, type)
  }
  return next

  function next(value: V, type: AnyType): R {
    return (arms[type.type as keyof I] ?? arms.fallback!)(
      value,
      type as never,
      ...(type.args ?? []) as Array<never>,
    )
  }
}
