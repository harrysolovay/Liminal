import { type Type, TypeVisitor } from "../core/mod.ts"
import { T, typeKey } from "../core/mod.ts"
import type { ValueDiagnostic } from "./ValueDiagnostic.ts"

export function deserializeValue<T>(
  type: Type<T, never>,
  value: unknown,
  diagnostics?: Array<ValueDiagnostic>,
): T {
  return visitor.visit({}, type)({
    valuePath: "",
    diagnostics,
  }, value) as never
}

type ValueVisitorContext = {
  valuePath: string
  diagnostics?: Array<ValueDiagnostic>
}

const visitor = new TypeVisitor<
  {},
  (
    valueCtx: ValueVisitorContext,
    value: any,
  ) => unknown
>()
  .middleware((_0, type) => {
    const { assertions } = type[typeKey].context
    console.log(assertions)
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
  .fallback(() => (value) => value)
