import type { Expand } from "../util/mod.ts"
import * as I from "./intrinsics/mod.ts"
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
  & (
    | ({ fallback?: never } & IntrinsicArms<C, R>)
    | (
      & { fallback: (ctx: C, type: AnyType, ...args: unknown[]) => R }
      & Partial<IntrinsicArms<C, R>>
    )
  )
>

type IntrinsicArms<C, R> = {
  [K in keyof I]: (
    ctx: C,
    type: I[K] extends AnyType ? I[K] : ReturnType<I[K]>,
    ...args: I[K] extends AnyType ? [] : Parameters<I[K]>
  ) => R
}

export function TypeVisitor<C, R>(arms: TypeVisitorArms<C, R>): (ctx: C, type: AnyType) => R {
  if (arms.hook) {
    return (ctx, type) => arms.hook!(next, ctx, type)
  }
  return next

  function next(ctx: C, type: AnyType): R {
    const armKey: keyof I = (() => {
      switch (type.declaration.factory) {
        case I.transform: {
          return "transform"
        }
        case I.enum: {
          return "enum"
        }
        default: {
          return type.K
        }
      }
    })()
    const arm = arms[armKey] ?? arms.fallback
    return arm!(
      ctx,
      type as never,
      ...type.declaration.factory ? type.declaration.args as never : [],
    )
  }
}
