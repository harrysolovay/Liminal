import { type Type, TypeVisitor } from "../core/mod.ts"
import { typeKey } from "../core/mod.ts"
import type { Diagnostic } from "./Diagnostic.ts"
import * as T from "./types.ts"

// TODO: how to manage refinement of root?
export function deserialize<T>(
  type: Type<T, never>,
  value: unknown,
  diagnosticsPending?: Array<Promise<Diagnostic | undefined>>,
): T {
  return visitor.visit({}, type)({
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

export type SetValue = (value: unknown) => void

const visitor = new TypeVisitor<
  {},
  (
    valueCtx: ValueVisitorContext,
    value: any,
  ) => unknown
>()
  .middleware((next, e0, type, ...args) => {
    const { assertions } = type[typeKey].context
    const visit = next(e0, type, ...args)
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
  .add(
    T.array,
    (e0, _1, Element) => (ctx, value: Array<unknown>): unknown => {
      const container = value.map((e, i): unknown =>
        visitor.visit(e0, Element)({
          ...ctx,
          path: `${ctx.path}[${i}]`,
          parent: ctx,
          set: (value) => {
            container[i] = value
          },
        }, e)
      )
      return container
    },
  )
  .add(
    T.object,
    (e0, _1, fieldTypes) => (ctx, value): unknown => {
      const container: Record<keyof any, unknown> = Object.fromEntries(
        Object.entries(value).map(([key, value]) => {
          return [
            key,
            visitor.visit(e0, fieldTypes[key]!)({
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
    },
  )
  .add(
    T.option,
    (e0, _1, Some) => (ctx, value): unknown => {
      if (value === null) {
        return undefined
      }
      return visitor.visit(e0, Some)({
        ...ctx,
        parent: ctx,
        set: ctx.parent.set,
      }, value)
    },
  )
  .add(
    T.taggedUnion,
    (e0, _1, tagKey, members) => (ctx, value): unknown => {
      const discriminant = value[tagKey]
      return {
        [tagKey]: discriminant,
        ..."value" in value
          ? (() => {
            const container = {
              value: visitor.visit(e0, members[discriminant]!)({
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
    },
  )
  .add(
    T.transform,
    (e0, _0, From, f) => (ctx, value): unknown =>
      f(
        visitor.visit(e0, From)({
          ...ctx,
          parent: ctx,
          set: ctx.set,
        }, value),
      ),
  )
  .add(
    T.deferred,
    (e0, _0, getType) => {
      const type = getType()
      return (ctx, value): unknown =>
        visitor.visit(e0, type)({
          ...ctx,
          parent: ctx,
          set: ctx.set,
        }, value)
    },
  )
  .fallback(() => (_ctx, value) => value)
