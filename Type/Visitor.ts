import type { Expand } from "../util/mod.ts"
import type * as I from "./intrinsics/mod.ts"
import type { Type } from "./Type.ts"

type I = typeof I

export function Visitor<V, R>(arms: VisitorArms<V, R>): (value: V, type: Type) => R {
  const { hook } = arms
  if (hook) {
    return (value, type) => hook(next, value, type)
  }
  return next

  function next(value: V, type: Type): R {
    return (arms[type.kind as keyof I] ?? arms.fallback!)(
      value,
      type as never,
      ...(type.args ?? []) as Array<never>,
    )
  }
}

export type VisitorArms<V, R> = Expand<
  & { hook?: (next: (value: V, type: Type) => R, value: V, type: Type) => R }
  & (
    | ({ fallback?: never } & IntrinsicVisitorArms<V, R>)
    | (
      & {
        fallback: (value: V, type: Type, ...args: Array<unknown>) => R
      }
      & Partial<IntrinsicVisitorArms<V, R>>
    )
  )
>

export type IntrinsicVisitorArms<V, R> = {
  [K in keyof I]: (
    value: V,
    ...rest: I[K] extends Type ? [type: I[K]]
      : [type: ReturnType<I[K]>, ...args: Parameters<I[K]>]
  ) => R
}
