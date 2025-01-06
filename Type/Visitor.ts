import type { Expand } from "../../util/mod.ts"
import type * as I from "./intrinsics/mod.ts"
import type { Type } from "./Type.ts"

type I = typeof I

export type Visitor<V, R> = (value: V, type: Type) => R

export function Visitor<V, R>(arms: NoInfer<VisitorArms<V, R>>): Visitor<V, R> {
  const { hook } = arms
  if (hook) {
    return (value, type) => hook(next, value, type)
  }
  return next

  function next(value: V, type: Type): R {
    return (arms[type.type as keyof I] ?? arms.fallback!)(
      value,
      type as never,
      ...(type.args ?? []) as Array<never>,
    )
  }
}

export type VisitorArms<V, R> = Expand<
  & { hook?: (next: Visitor<V, R>, value: V, type: Type) => R }
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
