import { type Type, TypeVisitor } from "../core/mod.ts"
import { typeKey } from "../core/mod.ts"
import * as T from "./combinators/mod.ts"
import type { Diagnostic } from "./Diagnostic.ts"

// TODO: how to manage refinement of root?
export function deserializeValue<T>(
  type: Type<T, never>,
  value: unknown,
  diagnostics?: Array<Diagnostic>,
): T {
  return visitor.visit({}, type)({
    path: "",
    parent: undefined!,
    set: () => {},
    diagnostics,
  }, value) as never
}

type ValueVisitorContext = {
  path: string
  diagnostics?: Array<Diagnostic>
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
      const { diagnostics } = ctx
      if (diagnostics) {
        assertions.forEach(({ assertion, args, trace }) => {
          try {
            assertion(value, ...args)
            return value
          } catch (e: unknown) {
            if (e instanceof Error) {
              diagnostics.push({
                error: e,
                trace,
                type,
                typePath: "",
                value,
                valuePath: ctx.path,
                setValue: ctx.set,
              })
              return
            }
            throw e
          }
        })
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
    (e0, _0, _1, From, f) => (ctx, value): unknown =>
      f(
        visitor.visit(e0, From)({
          ...ctx,
          parent: ctx,
          set: ctx.set,
        }, value),
      ),
  )
  .fallback(() => (_ctx, value) => value)
