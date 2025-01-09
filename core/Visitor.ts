import type { Expand } from "../util/Expand.ts"
import type * as I from "./intrinsics/mod.ts"
import type { Rune } from "./Rune.ts"

type I = typeof I

export type Visitor<S, R> = (state: S, rune: Rune) => R

export function Visitor<S, R>(arms: VisitorArms<S, R>): (state: S, rune: Rune) => R {
  const { hook } = arms
  if (hook) {
    return (state, rune) => hook(next, state, rune)
  }
  return next

  function next(state: S, rune: Rune): R {
    const { kind, args } = rune
    return (arms[kind as keyof I] ?? arms.fallback!)(
      state,
      rune as never,
      ...(args ?? []) as Array<never>,
    )
  }
}

export type VisitorArms<S, R> = Expand<
  & {
    hook?: (next: (state: S, rune: Rune) => R, state: S, rune: Rune) => R
  }
  & (
    | ({ fallback?: never } & IntrinsicVisitorArms<S, R>)
    | (
      & { fallback: (state: S, rune: Rune, ...args: Array<unknown>) => R }
      & Partial<IntrinsicVisitorArms<S, R>>
    )
  )
>

export type IntrinsicVisitorArms<S, R> = {
  [K in keyof I]: (
    state: S,
    ...rest: I[K] extends Rune ? [rune: I[K]]
      : [rune: ReturnType<I[K]>, ...args: Parameters<I[K]>]
  ) => R
}

export class RecursiveVisitorState {
  constructor(
    readonly root: Rune,
    readonly ids: Map<Rune, string>,
  ) {}

  id(rune: Rune): string {
    let id = this.ids.get(rune)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(rune, id)
    }
    return id
  }
}
