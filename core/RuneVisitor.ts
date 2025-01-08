import type { Expand } from "../util/Expand.ts"
import type * as I from "./intrinsics/mod.ts"
import type { Rune } from "./Rune.ts"

type I = typeof I

export function Visitor<V, R>(arms: VisitorArms<V, R>): (value: V, rune: Rune) => R {
  const { hook } = arms
  if (hook) {
    return (value, rune) => hook(next, value, rune)
  }
  return next

  function next(value: V, rune: Rune): R {
    const { kind, args } = rune
    return (arms[kind as keyof I] ?? arms.fallback!)(
      value,
      rune as never,
      ...(args ?? []) as Array<never>,
    )
  }
}

export type VisitorArms<V, R> = Expand<
  & {
    hook?: (next: (value: V, rune: Rune) => R, value: V, rune: Rune) => R
  }
  & (
    | ({ fallback?: never } & IntrinsicVisitorArms<V, R>)
    | (
      & { fallback: (value: V, rune: Rune, ...args: Array<unknown>) => R }
      & Partial<IntrinsicVisitorArms<V, R>>
    )
  )
>

export type IntrinsicVisitorArms<V, R> = {
  [K in keyof I]: (
    value: V,
    ...rest: I[K] extends Rune ? [rune: I[K]]
      : [rune: ReturnType<I[K]>, ...args: Parameters<I[K]>]
  ) => R
}

export class Path {
  constructor(readonly inner: string) {}

  next = (junction?: number | string): Path =>
    new Path(junction ? `${this.inner}.${junction}` : this.inner)
}
