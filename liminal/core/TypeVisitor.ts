import type { Expand } from "../util/mod.ts"
import type * as I from "./intrinsics/mod.ts"
import type { AnyType } from "./Type.ts"

type I = typeof I

export type TypeVisitorArms<C, R> = Expand<
  & {
    hook?: (
      next: (ctx: C, type: AnyType) => R,
      ctx: C,
      type: AnyType,
    ) => R
  }
  & {
    [K in keyof I]: (
      ctx: C,
      type: I[K] extends AnyType ? I[K] : ReturnType<I[K]>,
      ...args: I[K] extends AnyType ? [] : Parameters<I[K]>
    ) => R
  }
>

export function TypeVisitor<C, R>(arms: TypeVisitorArms<C, R>): (ctx: C, type: AnyType) => R {
  if (arms.hook) {
    return (ctx, type) => arms.hook!(next, ctx, type)
  }
  return next

  function next(ctx: C, type: AnyType): R {
    return arms[type.kind](
      ctx,
      type as never,
      ...type.declaration.factory ? type.declaration.args as never : [],
    )
  }
}
