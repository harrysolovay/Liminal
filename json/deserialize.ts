import { type Type, TypeVisitor } from "../core/mod.ts"
import { typeKey } from "../core/mod.ts"
import * as T from "./combinators/mod.ts"
import type { Diagnostic } from "./Diagnostic.ts"

export function deserializeValue<T>(
  type: Type<T, never>,
  value: unknown,
  diagnostics?: Array<Diagnostic>,
): T {
  return visitor.visit({}, type)({
    valuePath: "",
    diagnostics,
  }, value) as never
}

type ValueVisitorContext = {
  valuePath: string
  diagnostics?: Array<Diagnostic>
}

const visitor = new TypeVisitor<
  {},
  (
    valueCtx: ValueVisitorContext,
    value: any,
  ) => unknown
>()
  .middleware((next, e0, type, ...args) => {
    const { assertions } = type[typeKey].context
    const visitValue = next(e0, type, ...args)
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
                valuePath: ctx.valuePath,
                setValue: () => {},
              })
              return
            }
            throw e
          }
        })
      }
      return visitValue(ctx, value)
    }
  })
  .add(
    T.array,
    (e0, _1, Element) => (ctx, value: Array<unknown>): unknown =>
      value.map((e, i) =>
        visitor.visit(e0, Element)({
          ...ctx,
          valuePath: `${ctx.valuePath}[${i}]`,
        }, e)
      ),
  )
  .add(
    T.object,
    (e0, _1, fieldTypes) => (ctx, value): unknown => {
      return Object.fromEntries(
        Object.entries(value).map(([key, value]) => {
          return [
            key,
            visitor.visit(e0, fieldTypes[key]!)({
              ...ctx,
              valuePath: `${ctx.valuePath}.${key}`,
            }, value),
          ]
        }),
      )
    },
  )
  .add(
    T.option,
    (e0, _1, Some) => (ctx, value): unknown => {
      if (value === null) {
        return undefined
      }
      return visitor.visit(e0, Some)(ctx, value)
    },
  )
  .add(
    T.taggedUnion,
    (e0, _1, tagKey, members) => (ctx, value): unknown => {
      const discriminant = value[tagKey]
      return {
        [tagKey]: discriminant,
        ..."value" in value
          ? {
            value: visitor.visit(e0, members[discriminant]!)({
              ...ctx,
              valuePath: `${ctx.valuePath}.value`,
            }, value.value),
          }
          : {},
      }
    },
  )
  .add(
    T.transform,
    (e0, _0, _1, From, f) => (ctx, value): unknown => f(visitor.visit(e0, From)(ctx, value)),
  )
  .fallback(() => (_ctx, value) => value)
