import { type Type, typeKey, TypeVisitor } from "../core/mod.ts"
import type { Diagnostic } from "./Diagnostic.ts"
import * as T from "./types/mod.ts"

export function deserialize<T>(
  type: Type<T, never>,
  value: unknown,
  diagnosticsPending?: Array<Promise<Diagnostic | undefined>>,
): T {
  return visitor.visit(undefined!, type)({
    path: "",
    parent: undefined!,
    set: () => {},
    diagnosticsPending,
  }, value) as never
}

type ValueVisitorContext = {
  path: string
  diagnosticsPending?: Array<Promise<Diagnostic | undefined>>
  parent: ValueVisitorContext
  set: (value: unknown) => void
}

export type ValueVisitor = (
  valueCtx: ValueVisitorContext,
  value: any,
) => unknown

const visitor = new TypeVisitor<never, ValueVisitor>()
  .middleware((next, _1, type, ...args) => {
    const { assertions } = type[typeKey].ctx
    const visit = next(undefined!, type, ...args)
    return (ctx, value) => {
      const { diagnosticsPending } = ctx
      if (diagnosticsPending && assertions) {
        for (const { assertion, args, trace } of assertions) {
          diagnosticsPending.push((async () => {
            try {
              await assertion(value, args)
            } catch (e: unknown) {
              if (e instanceof Error) {
                return {
                  error: e,
                  trace,
                  type,
                  typePath: "",
                  value,
                  valuePath: ctx.path,
                  setValue: ctx.set,
                }
              }
            }
          })())
        }
      }
      return visit(ctx, value)
    }
  })
  .add(T.array, (_0, _1, Element) => (ctx, value: Array<unknown>): unknown => {
    const container = value.map((e, i): unknown =>
      visitor.visit(undefined!, Element)({
        ...ctx,
        path: `${ctx.path}[${i}]`,
        parent: ctx,
        set: (value) => {
          container[i] = value
        },
      }, e)
    )
    return container
  })
  .add(T.object, (_0, _1, fieldTypes) => (ctx, value): unknown => {
    const container: Record<keyof any, unknown> = Object.fromEntries(
      Object.entries(value).map(([key, value]) => {
        return [
          key,
          visitor.visit(undefined!, fieldTypes[key]!)({
            ...ctx,
            path: `${ctx.path}.${key}`,
            parent: ctx,
            set: (value) => {
              container[key] = value
            },
          }, value),
        ]
      }),
    )
    return container
  })
  .add(T.option, (_0, _1, Some) => (ctx, value): unknown => {
    if (value === null) {
      return undefined
    }
    return visitor.visit(undefined!, Some)({
      ...ctx,
      parent: ctx,
      set: ctx.parent.set,
    }, value)
  })
  .add(T.taggedUnion, (_0, _1, tagKey, members) => (ctx, value): unknown => {
    const discriminant = value[tagKey]
    return {
      [tagKey]: discriminant,
      ..."value" in value
        ? (() => {
          const container = {
            value: visitor.visit(undefined!, members[discriminant]!)({
              ...ctx,
              path: `${ctx.path}.value`,
              parent: ctx,
              set: (value) => {
                container.value = value
              },
            }, value.value),
          }
          return container
        })()
        : {},
    }
  })
  .add(T.transform, (_0, _1, _2, From, f) => (ctx, value): unknown =>
    f(
      visitor.visit(undefined!, From)({
        ...ctx,
        parent: ctx,
        set: ctx.set,
      }, value),
    ))
  .add(T.deferred, (_0, _1, getType) => {
    const type = getType()
    return (ctx, value): unknown =>
      visitor.visit(undefined!, type)({
        ...ctx,
        parent: ctx,
        set: ctx.set,
      }, value)
  })
  .fallback(() => (_ctx, value) => value)
