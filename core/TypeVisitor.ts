import type { Expand } from "../util/mod.ts"
import { IntrinsicName, type Intrinsics } from "./intrinsics_util.ts"
import type { PartialType } from "./Type.ts"

export type TypeVisitorArms<C, R> = Expand<
  & {
    hook?: (
      next: (ctx: C, type: PartialType) => R,
      ctx: C,
      type: PartialType,
    ) => R
  }
  & (
    | ({ fallback?: never } & TypeVisitorIntrinsicArms<C, R>)
    | (
      & { fallback: (ctx: C, type: PartialType, ...args: Array<unknown>) => R }
      & Partial<TypeVisitorIntrinsicArms<C, R>>
    )
  )
>

export type TypeVisitorIntrinsicArms<C, R> = {
  [K in IntrinsicName]: (
    ctx: C,
    ...rest: Intrinsics[K] extends PartialType ? [type: Intrinsics[K]]
      : [type: ReturnType<Intrinsics[K]>, ...args: Parameters<Intrinsics[K]>]
  ) => R
}

export function TypeVisitor<C, R>(arms: TypeVisitorArms<C, R>): (ctx: C, type: PartialType) => R {
  const { hook } = arms
  if (hook) {
    return (ctx, type) => hook(next, ctx, type)
  }
  return next

  function next(ctx: C, type: PartialType): R {
    return (arms[IntrinsicName(type)] ?? arms.fallback!)(
      ctx,
      type as never,
      ...type.declaration.factory ? type.declaration.args as never : [],
    )
  }
}
