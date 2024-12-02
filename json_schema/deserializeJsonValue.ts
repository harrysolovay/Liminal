import { type Type, TypeVisitor } from "../core/mod.ts"
import * as T from "../core/types/mod.ts"

export function deserializeJsonValue<T>(
  type: Type<T, never>,
  value: unknown,
): T {
  return visitor.visit({}, type)(value) as T
}

const visitor = new TypeVisitor<{}, (value: any) => unknown>()
  .add(
    T.array,
    (ctx, _1, Element) => (value: Array<unknown>): unknown => {
      const visited = value.map((e, i) => visitor.visit(ctx, Element)(e))
      return visited
    },
  )
  .add(
    T.object,
    (ctx, _1, fieldTypes) => (value): unknown => {
      return Object.fromEntries(
        Object.entries(value).map(([key, value]) => {
          return [
            key,
            visitor.visit(ctx, fieldTypes[key]!)(value),
          ]
        }),
      )
    },
  )
  .add(
    T.option,
    (ctx, _1, Some) => (value): unknown => {
      if (value === null) {
        return undefined
      }
      return visitor.visit(ctx, Some)(value)
    },
  )
  .add(T.taggedUnion, (ctx, _0, tagKey, members) => (value): unknown => {
    const discriminant = value[tagKey]
    return {
      [tagKey]: discriminant,
      ..."value" in value
        ? { value: visitor.visit(ctx, members[discriminant]!)(value.value) }
        : {},
    }
  })
  .fallback(() => (value: unknown) => value)
